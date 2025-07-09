import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Database } from '../types/supabase';
import { Modal } from './shared/Modal';
import { Button } from './shared/Button';
import { Input } from './shared/Input';
import { Label } from './shared/Label';
import { Spinner } from './shared/Spinner';
import { Plus, Edit, Trash2 } from 'lucide-react';

type Client = Database['public']['Tables']['clients']['Row'];
type ClientInsert = Database['public']['Tables']['clients']['Insert'];

const ClientForm: React.FC<{
    client?: Client | null;
    onSave: (clientData: ClientInsert | Client) => void;
    onClose: () => void;
}> = ({ client, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: client?.name || '',
        address: client?.address || '',
        phone_1: client?.phone_1 || '',
        phone_2: client?.phone_2 || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (client) {
            onSave({ ...client, ...formData });
        } else {
            onSave(formData as ClientInsert);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">Client Name</Label>
                <Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" type="text" value={formData.address || ''} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="phone_1">Phone 1</Label>
                    <Input id="phone_1" name="phone_1" type="text" value={formData.phone_1 || ''} onChange={handleChange} />
                </div>
                <div>
                    <Label htmlFor="phone_2">Phone 2</Label>
                    <Input id="phone_2" name="phone_2" type="text" value={formData.phone_2 || ''} onChange={handleChange} />
                </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                <Button type="submit">{client ? 'Save Changes' : 'Add Client'}</Button>
            </div>
        </form>
    );
};

export const ClientsView: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);

    const fetchClients = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase.from('clients').select('*').order('name');
        if (error) {
            console.error('Error fetching clients:', error);
        } else {
            setClients(data);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchClients();
    }, [fetchClients]);

    const handleSave = async (clientData: ClientInsert | Client) => {
        let error;
        if ('id' in clientData) {
            const { id, created_at, ...updateData } = clientData;
            ({ error } = await supabase.from('clients').update(updateData).eq('id', clientData.id));
        } else {
            ({ error } = await supabase.from('clients').insert(clientData));
        }

        if (error) {
            alert(`Error: ${error.message}`);
        } else {
            setIsModalOpen(false);
            setEditingClient(null);
            fetchClients();
        }
    };

    const handleDelete = async (clientId: number) => {
        if (window.confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
            const { error } = await supabase.from('clients').delete().eq('id', clientId);
            if (error) {
                alert(`Error: ${error.message}`);
            } else {
                fetchClients();
            }
        }
    };

    const handleEdit = (client: Client) => {
        setEditingClient(client);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingClient(null);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-text-primary">Manage Clients</h1>
                <Button onClick={handleAddNew}>
                    <Plus size={18} className="mr-2"/>
                    Add New Client
                </Button>
            </div>

            <div className="bg-surface rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Address</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan={4} className="text-center py-10"><Spinner/></td></tr>
                        ) : clients.length === 0 ? (
                            <tr><td colSpan={4} className="text-center py-10 text-gray-500">No clients found.</td></tr>
                        ) : (
                            clients.map(client => (
                                <tr key={client.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.address}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.phone_1}{client.phone_2 ? `, ${client.phone_2}`: ''}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                        <button onClick={() => handleEdit(client)} className="text-primary hover:text-primary-hover">
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(client.id)} className="text-danger hover:text-red-700">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <Modal title={editingClient ? 'Edit Client' : 'Add New Client'} onClose={() => setIsModalOpen(false)}>
                    <ClientForm client={editingClient} onSave={handleSave} onClose={() => setIsModalOpen(false)} />
                </Modal>
            )}
        </div>
    );
};