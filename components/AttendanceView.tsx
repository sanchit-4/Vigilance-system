import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Database } from '../types/supabase';
import { useGeolocation, calculateDistance } from '../hooks/useGeolocation';
import { Button } from './shared/Button';
import { Select } from './shared/Select';
import { Spinner } from './shared/Spinner';
import { Loader, CheckCircle, AlertTriangle, MapPin, User, RefreshCw } from 'lucide-react';

type Guard = Database['public']['Tables']['guards']['Row'];
type Location = Database['public']['Tables']['locations']['Row'];
type AttendanceWithDetails = Database['public']['Tables']['attendance']['Row'] & {
    guards: { name: string } | null;
    locations: { site_name: string } | null;
};

export const AttendanceView: React.FC = () => {
    const [guards, setGuards] = useState<Guard[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [allAttendance, setAllAttendance] = useState<AttendanceWithDetails[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [selectedGuardId, setSelectedGuardId] = useState('');
    const [selectedLocationId, setSelectedLocationId] = useState('');
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
    const { data: geoData, loading: geoLoading, error: geoError, refresh: refreshGeo } = useGeolocation();
    
    const fetchData = useCallback(async () => {
        setLoadingData(true);
        const guardsPromise = supabase.from('guards').select('*').eq('is_active', true).order('name');
        const locationsPromise = supabase.from('locations').select('*').order('site_name');
        const attendancePromise = supabase.from('attendance').select('*, guards(name), locations(site_name)').order('check_in_time', { ascending: false }).limit(100);

        const [guardsRes, locationsRes, attendanceRes] = await Promise.all([guardsPromise, locationsPromise, attendancePromise]);

        if(guardsRes.data) setGuards(guardsRes.data);
        if(locationsRes.data) setLocations(locationsRes.data);
        if(attendanceRes.data) setAllAttendance(attendanceRes.data as AttendanceWithDetails[]);

        setLoadingData(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleCheckIn = async () => {
        setStatusMessage(null);
        if (!selectedGuardId || !selectedLocationId) {
            setStatusMessage({ type: 'error', text: 'Please select a guard and location.' });
            return;
        }
        if (geoError || !geoData) {
            setStatusMessage({ type: 'error', text: `GPS Error: ${geoError?.message || 'Could not get location.'}` });
            return;
        }
        const location = locations.find(l => l.id === Number(selectedLocationId));
        if (!location) return;

        const distance = calculateDistance(geoData.coords.latitude, geoData.coords.longitude, location.latitude, location.longitude);
        const isVerified = distance <= location.geofence_radius_meters;

        const { error } = await supabase.from('attendance').insert({
            guard_id: Number(selectedGuardId),
            location_id: Number(selectedLocationId),
            is_within_geofence: isVerified,
            status: 'Pending Approval',
            check_in_time: new Date().toISOString(),
        });

        if (error) {
            setStatusMessage({ type: 'error', text: `Failed to save check-in: ${error.message}` });
        } else {
            setStatusMessage({ type: 'success', text: `Check-in recorded! You are ${distance.toFixed(0)}m from site. Pending supervisor approval.` });
            fetchData(); // Refresh attendance list
        }
    };

    const handleApproval = async (attendanceId: number, newStatus: 'Approved' | 'Rejected') => {
        const { error } = await supabase
            .from('attendance')
            .update({ status: newStatus, confirmation_timestamp: new Date().toISOString() })
            .eq('id', attendanceId);
        
        if (error) {
            alert(`Error updating status: ${error.message}`);
        } else {
            fetchData();
        }
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="w-full bg-surface p-8 rounded-xl shadow-lg space-y-6">
                        <h1 className="text-3xl font-bold text-center text-text-primary">Guard Check-in</h1>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="guard" className="flex items-center text-sm font-medium text-gray-700 mb-1"><User size={16} className="mr-2"/>Select Guard</label>
                                <Select id="guard" value={selectedGuardId} onChange={e => {setSelectedGuardId(e.target.value); setStatusMessage(null)}}>
                                    <option value="">-- Select your name --</option>
                                    {guards.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                </Select>
                            </div>
                            <div>
                                <label htmlFor="location" className="flex items-center text-sm font-medium text-gray-700 mb-1"><MapPin size={16} className="mr-2"/>Select Location</label>
                                <Select id="location" value={selectedLocationId} onChange={e => {setSelectedLocationId(e.target.value); setStatusMessage(null)}} disabled={!selectedGuardId}>
                                    <option value="">-- Select your location --</option>
                                    {locations.map(l => <option key={l.id} value={l.id}>{l.site_name}</option>)}
                                </Select>
                            </div>
                        </div>

                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                            <h3 className="font-semibold mb-2">GPS Status</h3>
                            {geoLoading && <div className="flex items-center text-yellow-600"><Loader size={16} className="animate-spin mr-2"/> Acquiring signal...</div>}
                            {geoError && <div className="flex items-center text-red-600"><AlertTriangle size={16} className="mr-2"/> {geoError.message}</div>}
                            {geoData && <div className="flex items-center text-green-600"><CheckCircle size={16} className="mr-2"/> GPS lock acquired.</div>}
                            <button onClick={refreshGeo} className="text-xs text-blue-600 hover:underline mt-2 flex items-center"><RefreshCw size={12} className="mr-1"/> Refresh GPS</button>
                        </div>
                        
                        {statusMessage && (
                            <div className={`p-4 rounded-md text-center text-sm font-medium ${
                                statusMessage.type === 'success' ? 'bg-green-100 text-green-800' :
                                statusMessage.type === 'error' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                            }`}>
                                {statusMessage.text}
                            </div>
                        )}
                        
                        <Button onClick={handleCheckIn} disabled={geoLoading || !selectedGuardId || !selectedLocationId} className="w-full">
                            {geoLoading ? <Loader size={18} className="animate-spin mr-2" /> : <CheckCircle size={18} className="mr-2" />}
                            Check In
                        </Button>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-surface p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold text-text-primary mb-4">Attendance Log & Approval</h2>
                    <div className="overflow-x-auto max-h-[70vh]">
                        <table className="min-w-full divide-y divide-gray-200">
                             <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Guard</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Location</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Time</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loadingData ? (
                                    <tr><td colSpan={5} className="text-center py-10"><Spinner/></td></tr>
                                ) : allAttendance.length === 0 ? (
                                    <tr><td colSpan={5} className="text-center py-10 text-gray-500">No attendance records found.</td></tr>
                                ) : allAttendance.map(rec => (
                                    <tr key={rec.id}>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm">{rec.guards?.name}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm">{rec.locations?.site_name}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm">{new Date(rec.check_in_time).toLocaleString()}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                rec.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                rec.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {rec.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                                            {rec.status === 'Pending Approval' && (
                                                <div className="flex space-x-2">
                                                    <Button size="sm" onClick={() => handleApproval(rec.id, 'Approved')}>Approve</Button>
                                                    <Button size="sm" variant="danger" onClick={() => handleApproval(rec.id, 'Rejected')}>Reject</Button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
