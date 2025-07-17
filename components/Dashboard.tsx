import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Database } from '../types/supabase';
import { User, MapPin, CheckCircle, AlertTriangle, Briefcase, Clock } from 'lucide-react';
import { Spinner } from './shared/Spinner';

type AttendanceRecord = Database['public']['Tables']['attendance']['Row'] & {
    guards: { name: string | null } | null;
    locations: { site_name: string | null } | null;
};

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string; loading: boolean }> = ({ title, value, icon, color, loading }) => (
    <div className="bg-surface p-6 rounded-lg shadow-md flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div className="ml-4">
            <p className="text-sm font-medium text-text-secondary">{title}</p>
            {loading ? <div className="h-8 w-12 bg-gray-200 rounded animate-pulse mt-1"></div> : <p className="text-2xl font-bold text-text-primary">{value}</p>}
        </div>
    </div>
);

export const Dashboard: React.FC = () => {
    const { guard, isSupervisor } = useAuth();
    const [stats, setStats] = useState({ clients: 0, guards: 0, locations: 0, pendingAttendance: 0 });
    const [recentActivity, setRecentActivity] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let clients = { count: 0 };
                let guards = { count: 0 };
                let locations = { count: 0 };
                let pending = { count: 0 };
                let activity: AttendanceRecord[] = [];

                if (isSupervisor()) {
                    const [clientsRes, guardsRes, locationsRes, pendingRes, activityRes] = await Promise.all([
                        supabase.from('clients').select('id', { count: 'exact', head: true }),
                        supabase.from('guards').select('id', { count: 'exact', head: true }).eq('is_active', true),
                        supabase.from('locations').select('id', { count: 'exact', head: true }),
                        supabase.from('attendance').select('id', { count: 'exact', head: true }).eq('status', 'Pending Approval'),
                        supabase.from('attendance').select('*, guards(name), locations(site_name)').order('check_in_time', { ascending: false }).limit(5)
                    ]);
                    
                    clients = clientsRes.data as any;
                    guards = guardsRes.data as any;
                    locations = locationsRes.data as any;
                    pending = pendingRes.data as any;
                    activity = activityRes.data as AttendanceRecord[];
                } else {
                    // For guards, only show their own recent activity
                    const { data: activityRes } = await supabase
                        .from('attendance')
                        .select('*, guards(name), locations(site_name)')
                        .eq('guard_id', guard?.id)
                        .order('check_in_time', { ascending: false })
                        .limit(5);
                    
                    activity = activityRes as AttendanceRecord[];
                }


                setStats({
                    clients: clients.count || 0,
                    guards: guards.count || 0,
                    locations: locations.count || 0,
                    pendingAttendance: pending.count || 0,
                });
                setRecentActivity(activity);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [guard, isSupervisor]);

    const getStatusChip = (status: "Pending Approval" | "Approved" | "Rejected") => {
        switch (status) {
            case "Approved": return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Approved</span>;
            case "Rejected": return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Rejected</span>;
            case "Pending Approval":
            default:
                return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
                <div className="text-sm text-gray-500">
                    Welcome, {guard?.name}!
                </div>
            </div>
            
            {isSupervisor && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Clients" value={stats.clients} icon={<Briefcase size={24} className="text-white"/>} color="bg-blue-500" loading={loading} />
                <StatCard title="Active Guards" value={stats.guards} icon={<User size={24} className="text-white"/>} color="bg-green-500" loading={loading} />
                <StatCard title="Managed Locations" value={stats.locations} icon={<MapPin size={24} className="text-white"/>} color="bg-indigo-500" loading={loading} />
                <StatCard title="Pending Approvals" value={stats.pendingAttendance} icon={<Clock size={24} className="text-white"/>} color="bg-yellow-500" loading={loading} />
            </div>
            )}

            <div className="bg-surface p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-text-primary mb-4">
                    {isSupervisor ? 'Recent Activity' : 'My Recent Activity'}
                </h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Guard</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Verification</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                           {loading ? (
                                <tr><td colSpan={5} className="text-center py-10"><Spinner /></td></tr>
                           ) : recentActivity.length > 0 ? (
                                recentActivity.map(record => (
                                    <tr key={record.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.guards?.name || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.locations?.site_name || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(record.check_in_time).toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {record.is_within_geofence ? (
                                                <span className="flex items-center text-green-600"><CheckCircle size={16} className="mr-1"/> Verified</span>
                                            ) : (
                                                <span className="flex items-center text-red-600"><AlertTriangle size={16} className="mr-1"/> Out of Range</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusChip(record.status)}</td>
                                    </tr>
                                ))
                           ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-gray-500">No recent activity.</td>
                                </tr>
                           )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
