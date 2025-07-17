import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Database } from '../types/supabase';
import { Modal } from './shared/Modal';
import { Button } from './shared/Button';
import { Input } from './shared/Input';
import { Label } from './shared/Label';
import { Select } from './shared/Select';
import { Spinner } from './shared/Spinner';
import { Plus, Edit } from 'lucide-react';

type Location = Database['public']['Tables']['locations']['Row'];
type Client = Database['public']['Tables']['clients']['Row'];
type LocationWithClient = Location & { clients: { name: string } | null };
type LocationInsert = Database['public']['Tables']['locations']['Insert'];

const LocationForm: React.FC<{
    location?: Location | null;
    clients: Client[];
    onSave: (location: LocationInsert | Location) => void;
    onClose: () => void;
}> = ({ location, clients, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        site_name: location?.site_name || '',
        address: location?.address || '',
        latitude: location?.latitude || 0,
        longitude: location?.longitude || 0,
        geofence_radius_meters: location?.geofence_radius_meters || 100,
        client_id: location?.client_id || (clients.length > 0 ? clients[0].id : ''),
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSave = {
            ...formData,
            latitude: Number(formData.latitude),
            longitude: Number(formData.longitude),
            geofence_radius_meters: Number(formData.geofence_radius_meters),
            client_id: Number(formData.client_id)
        };
        if (location) {
            onSave({ ...location, ...dataToSave });
        } else {
            onSave(dataToSave as LocationInsert);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="client_id">Client</Label>
                <Select id="client_id" name="client_id" value={formData.client_id} onChange={handleChange} required>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>
            </div>
            <div>
                <Label htmlFor="site_name">Site Name</Label>
                <Input id="site_name" name="site_name" type="text" value={formData.site_name} onChange={handleChange} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input id="latitude" name="latitude" type="number" step="any" value={formData.latitude} onChange={handleChange} required />
                </div>
                <div>
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input id="longitude" name="longitude" type="number" step="any" value={formData.longitude} onChange={handleChange} required />
                </div>
            </div>
             <div>
                <Label htmlFor="geofence_radius_meters">Geofence Radius (meters)</Label>
                <Input id="geofence_radius_meters" name="geofence_radius_meters" type="number" value={formData.geofence_radius_meters} onChange={handleChange} required />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                <Button type="submit">{location ? 'Save Changes' : 'Add Location'}</Button>
            </div>
        </form>
    );
};

export const LocationsView: React.FC = () => {
    const [locations, setLocations] = useState<LocationWithClient[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLocation, setEditingLocation] = useState<Location | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        // Optimize queries - select only needed fields
        const locationsPromise = supabase.from('locations').select('id, site_name, client_id, latitude, longitude, geofence_radius_meters, created_at, clients!inner(name)').order('site_name');
        const clientsPromise = supabase.from('clients').select('id, name').order('name');
        
        const [locationsRes, clientsRes] = await Promise.all([locationsPromise, clientsPromise]);

        if (locationsRes.error) console.error('Error fetching locations:', locationsRes.error);
        else setLocations(locationsRes.data as LocationWithClient[]);

        if (clientsRes.error) console.error('Error fetching clients:', clientsRes.error);
        else setClients(clientsRes.data);

        setLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSave = async (locationData: LocationInsert | Location) => {
        let error;
        if ('id' in locationData) {
            const { id, created_at, ...updateData } = locationData;
            ({ error } = await supabase.from('locations').update(updateData).eq('id', locationData.id));
        } else {
            ({ error } = await supabase.from('locations').insert(locationData));
        }

        if (error) {
            alert(`Error: ${error.message}`);
        } else {
            setIsModalOpen(false);
            setEditingLocation(null);
            fetchData();
        }
    };

    const handleEdit = (location: Location) => {
        setEditingLocation(location);
        setIsModalOpen(true);
    };
    
    const handleAddNew = () => {
        if (clients.length === 0) {
            alert('Please add a client first before adding a location.');
            return;
        }
        setEditingLocation(null);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-text-primary">Manage Locations</h1>
                <Button onClick={handleAddNew}>
                    <Plus size={18} className="mr-2"/>
                    Add New Location
                </Button>
            </div>
            
            <div className="bg-surface rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Site Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Client</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Coordinates (Lat, Lon)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Geofence</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan={5} className="text-center py-10"><Spinner/></td></tr>
                        ) : locations.length === 0 ? (
                            <tr><td colSpan={5} className="text-center py-10 text-gray-500">No locations found.</td></tr>
                        ) : (
                            locations.map(location => (
                            <tr key={location.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{location.site_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{location.clients?.name || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{location.geofence_radius_meters}m</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleEdit(location)} className="text-primary hover:text-primary-hover">
                                        <Edit size={18} />
                                    </button>
                                </td>
                            </tr>
                        )))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <Modal title={editingLocation ? 'Edit Location' : 'Add New Location'} onClose={() => setIsModalOpen(false)}>
                    <LocationForm location={editingLocation} clients={clients} onSave={handleSave} onClose={() => setIsModalOpen(false)} />
                </Modal>
            )}
        </div>
    );
};