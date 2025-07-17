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

type Guard = Database['public']['Tables']['guards']['Row'];
type GuardInsert = Database['public']['Tables']['guards']['Insert'];

const GuardForm: React.FC<{
    guard?: Guard | null;
    onSave: (guardData: GuardInsert | Guard) => void;
    onClose: () => void;
}> = ({ guard, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: guard?.name || '',
        contact_info: guard?.contact_info || '',
        base_salary: guard?.base_salary || 3000,
        address: guard?.address || '',
        date_of_birth: guard?.date_of_birth ? guard.date_of_birth.split('T')[0] : '',
        date_of_joining: guard?.date_of_joining ? guard.date_of_joining.split('T')[0] : new Date().toISOString().split('T')[0],
        police_verification_status: guard?.police_verification_status || 'Pending',
        category: guard?.category || 'Guard',
        is_active: guard?.is_active ?? true,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        setFormData(prev => ({ ...prev, [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSave = {
            ...formData,
            base_salary: Number(formData.base_salary),
        };

        if (guard) {
            onSave({ ...guard, ...dataToSave });
        } else {
            onSave(dataToSave as GuardInsert);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                    <Label htmlFor="contact_info">Contact Info</Label>
                    <Input id="contact_info" name="contact_info" type="text" value={formData.contact_info || ''} onChange={handleChange} />
                </div>
                 <div>
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input id="date_of_birth" name="date_of_birth" type="date" value={formData.date_of_birth || ''} onChange={handleChange} />
                </div>
                <div>
                    <Label htmlFor="date_of_joining">Date of Joining</Label>
                    <Input id="date_of_joining" name="date_of_joining" type="date" value={formData.date_of_joining} onChange={handleChange} required />
                </div>
                 <div>
                    <Label htmlFor="category">Category</Label>
                    <Select id="category" name="category" value={formData.category} onChange={handleChange}>
                        <option>Guard</option>
                        <option>Gunman</option>
                        <option>Supervisor</option>
                        <option>Security Officer</option>
                        <option>Lady Guard</option>
                    </Select>
                </div>
                 <div>
                    <Label htmlFor="police_verification_status">Police Verification</Label>
                    <Select id="police_verification_status" name="police_verification_status" value={formData.police_verification_status} onChange={handleChange}>
                        <option>Pending</option>
                        <option>Verified</option>
                        <option>Rejected</option>
                    </Select>
                </div>
                 <div>
                    <Label htmlFor="base_salary">Base Salary</Label>
                    <Input id="base_salary" name="base_salary" type="number" value={formData.base_salary} onChange={handleChange} required />
                </div>
                <div className="flex items-center pt-6">
                     <input id="is_active" name="is_active" type="checkbox" checked={formData.is_active} onChange={handleChange} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"/>
                     <Label htmlFor="is_active" className="ml-2">Is Active</Label>
                </div>
            </div>
             <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" type="text" value={formData.address || ''} onChange={handleChange} />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                <Button type="submit">{guard ? 'Save Changes' : 'Add Guard'}</Button>
            </div>
        </form>
    );
};

export const GuardsView: React.FC = () => {
    const [guards, setGuards] = useState<Guard[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGuard, setEditingGuard] = useState<Guard | null>(null);

    const fetchGuards = useCallback(async () => {
        setLoading(true);
        // Select only needed fields for performance
        const { data, error } = await supabase.from('guards').select('id, name, category, contact_info, base_salary, is_active, created_at').order('name');
        if (error) {
            console.error('Error fetching guards:', error);
        } else {
            setGuards(data);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchGuards();
    }, [fetchGuards]);

    const handleSave = async (guardData: GuardInsert | Guard) => {
        let error;
        if ('id' in guardData) {
            const { id, created_at, ...updateData } = guardData;
            ({ error } = await supabase.from('guards').update(updateData).eq('id', guardData.id));
        } else {
            ({ error } = await supabase.from('guards').insert(guardData));
        }

        if (error) {
            alert(`Error: ${error.message}`);
        } else {
            setIsModalOpen(false);
            setEditingGuard(null);
            fetchGuards();
        }
    };

    const handleEdit = (guard: Guard) => {
        setEditingGuard(guard);
        setIsModalOpen(true);
    };
    
    const handleAddNew = () => {
        setEditingGuard(null);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-text-primary">Manage Guards</h1>
                <Button onClick={handleAddNew}>
                    <Plus size={18} className="mr-2"/>
                    Add New Guard
                </Button>
            </div>
            
            <div className="bg-surface rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Salary</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan={6} className="text-center py-10"><Spinner/></td></tr>
                        ) : guards.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-10 text-gray-500">No guards found.</td></tr>
                        ) : (
                            guards.map(guard => (
                            <tr key={guard.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{guard.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{guard.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{guard.contact_info}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${guard.base_salary.toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${guard.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {guard.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleEdit(guard)} className="text-primary hover:text-primary-hover">
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
                <Modal title={editingGuard ? 'Edit Guard' : 'Add New Guard'} onClose={() => setIsModalOpen(false)}>
                    <GuardForm guard={editingGuard} onSave={handleSave} onClose={() => setIsModalOpen(false)} />
                </Modal>
            )}
        </div>
    );
};