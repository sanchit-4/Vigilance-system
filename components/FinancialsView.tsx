import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Database } from '../types/supabase';
import { Button } from './shared/Button';
import { Select } from './shared/Select';
import { Input } from './shared/Input';
import { Spinner } from './shared/Spinner';
import { Plus, ArchiveRestore, AlertCircle, Check } from 'lucide-react';

type Tab = 'inventory' | 'advances';
type Guard = Database['public']['Tables']['guards']['Row'];
type InventoryItem = Database['public']['Tables']['inventory_items']['Row'];
type AssignedItem = Database['public']['Tables']['assigned_inventory']['Row'];
type SalaryAdvance = Database['public']['Tables']['salary_advances']['Row'];
type AssignedItemWithDetails = AssignedItem & { inventory_items: { item_name: string } | null };

const InventoryManager: React.FC = () => {
    const [guards, setGuards] = useState<Guard[]>([]);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [assignedItems, setAssignedItems] = useState<AssignedItemWithDetails[]>([]);
    const [selectedGuardId, setSelectedGuardId] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const guardsPromise = supabase.from('guards').select('*').eq('is_active', true);
        const inventoryPromise = supabase.from('inventory_items').select('*');
        const [guardsRes, inventoryRes] = await Promise.all([guardsPromise, inventoryPromise]);
        if(guardsRes.data) setGuards(guardsRes.data);
        if(inventoryRes.data) setInventory(inventoryRes.data);
        setLoading(false);
    }, []);

    const fetchAssignedItems = useCallback(async () => {
        if (!selectedGuardId) {
            setAssignedItems([]);
            return;
        };
        const { data, error } = await supabase
            .from('assigned_inventory')
            .select('*, inventory_items(item_name)')
            .eq('guard_id', selectedGuardId);
        if (error) console.error(error);
        else setAssignedItems(data as AssignedItemWithDetails[]);
    }, [selectedGuardId]);

    useEffect(() => { fetchData(); }, [fetchData]);
    useEffect(() => { fetchAssignedItems(); }, [fetchAssignedItems]);

    const handleAssign = async (itemId: number) => {
        if (!selectedGuardId) return;
        const { error } = await supabase.from('assigned_inventory').insert({
            guard_id: Number(selectedGuardId),
            item_id: itemId,
            assigned_date: new Date().toISOString(),
            status: 'Issued'
        });
        if (error) alert(error.message);
        else fetchAssignedItems();
    };

    const updateStatus = async (assignmentId: number, status: AssignedItem['status']) => {
        const { error } = await supabase.from('assigned_inventory').update({ status }).eq('id', assignmentId);
        if (error) alert(error.message);
        else fetchAssignedItems();
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Select Guard</label>
                <Select value={selectedGuardId} onChange={e => setSelectedGuardId(e.target.value)} className="mt-1 w-full md:w-1/2">
                    <option value="">-- Select a Guard --</option>
                    {guards.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </Select>
            </div>
            
            {loading ? <Spinner /> : selectedGuardId && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-semibold text-text-primary">Available Inventory</h3>
                        <ul className="mt-2 space-y-2 max-h-96 overflow-y-auto pr-2">
                        {inventory.map(item => (
                            <li key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                                <span>{item.item_name} (${item.value})</span>
                                <Button size="sm" onClick={() => handleAssign(item.id)}>Assign</Button>
                            </li>
                        ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-text-primary">Assigned to {guards.find(g=>g.id === Number(selectedGuardId))?.name}</h3>
                        <ul className="mt-2 space-y-2 max-h-96 overflow-y-auto pr-2">
                        {assignedItems.length > 0 ? assignedItems.map(assigned => (
                            <li key={assigned.id} className="bg-white p-3 rounded-md border">
                                <p className="font-semibold">{assigned.inventory_items?.item_name}</p>
                                <p className="text-sm text-gray-500">Assigned: {new Date(assigned.assigned_date).toLocaleDateString()}</p>
                                <p className="text-sm">Status: <span className="font-medium">{assigned.status}</span></p>
                                {assigned.status === 'Issued' && (
                                    <div className="flex space-x-2 mt-2">
                                        <Button size="sm" variant="danger" onClick={() => updateStatus(assigned.id, 'Lost')}><AlertCircle size={14} className="mr-1"/> Lost</Button>
                                        <Button size="sm" variant="warning" onClick={() => updateStatus(assigned.id, 'Damaged')}><AlertCircle size={14} className="mr-1"/> Damaged</Button>
                                        <Button size="sm" variant="secondary" onClick={() => updateStatus(assigned.id, 'Returned')}><ArchiveRestore size={14} className="mr-1"/> Return</Button>
                                    </div>
                                )}
                            </li>
                        )) : <p className="text-gray-500 mt-2">No items assigned.</p>}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

const AdvanceManager: React.FC = () => {
    const [guards, setGuards] = useState<Guard[]>([]);
    const [advances, setAdvances] = useState<(SalaryAdvance & { guards: { name: string } | null })[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedGuardId, setSelectedGuardId] = useState('');
    const [amount, setAmount] = useState(0);
    const [recoveryAmount, setRecoveryAmount] = useState(0);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const guardsPromise = supabase.from('guards').select('*').eq('is_active', true);
        const advancesPromise = supabase.from('salary_advances').select('*, guards(name)').order('advance_date', { ascending: false });
        const [guardsRes, advancesRes] = await Promise.all([guardsPromise, advancesPromise]);
        if(guardsRes.data) setGuards(guardsRes.data);
        if(advancesRes.data) setAdvances(advancesRes.data as any);
        setLoading(false);
    }, []);

    useEffect(() => { fetchData() }, [fetchData]);

    const handleLogAdvance = async () => {
        if(!selectedGuardId || amount <= 0 || recoveryAmount <= 0) {
            alert("Please select a guard and enter a valid amount and recovery amount.");
            return;
        }
        const { error } = await supabase.from('salary_advances').insert({
            guard_id: Number(selectedGuardId),
            amount: amount,
            recovery_amount_per_period: recoveryAmount,
            advance_date: new Date().toISOString(),
            is_fully_recovered: false
        });
        if (error) alert(error.message);
        else {
            setAmount(0);
            setRecoveryAmount(0);
            fetchData();
        }
    };

    const toggleRecovered = async (advance: SalaryAdvance) => {
        const { error } = await supabase.from('salary_advances').update({ is_fully_recovered: !advance.is_fully_recovered }).eq('id', advance.id);
        if (error) alert(error.message);
        else fetchData();
    }
    
    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Log New Advance</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Select Guard</label>
                         <Select value={selectedGuardId} onChange={e => setSelectedGuardId(e.target.value)} className="mt-1 w-full">
                            <option value="">-- Select a Guard --</option>
                            {guards.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                        </Select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Amount</label>
                        <Input type="number" value={amount} onChange={e=>setAmount(Number(e.target.value))} />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Recovery/Period</label>
                        <Input type="number" value={recoveryAmount} onChange={e=>setRecoveryAmount(Number(e.target.value))} />
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <Button onClick={handleLogAdvance} disabled={!selectedGuardId || amount <= 0 || recoveryAmount <= 0}>
                        <Plus size={16} className="mr-2"/> Log Advance
                    </Button>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Advance History</h3>
                <div className="overflow-x-auto bg-surface rounded-lg shadow-md">
                     <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Guard</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Recovery/Period</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? <tr><td colSpan={5} className="text-center py-10"><Spinner/></td></tr> : advances.map(adv => (
                            <tr key={adv.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{adv.guards?.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${adv.amount.toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${adv.recovery_amount_per_period.toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(adv.advance_date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button onClick={() => toggleRecovered(adv)} className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${adv.is_fully_recovered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {adv.is_fully_recovered ? <><Check size={12} className="mr-1"/>Repaid</> : 'Pending'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export const FinancialsView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('inventory');
    
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-text-primary">Financial Management</h1>
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('inventory')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'inventory' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Inventory
                    </button>
                    <button onClick={() => setActiveTab('advances')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'advances' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Salary Advances
                    </button>
                </nav>
            </div>
            <div className="bg-surface p-6 rounded-lg shadow-md">
                {activeTab === 'inventory' && <InventoryManager />}
                {activeTab === 'advances' && <AdvanceManager />}
            </div>
        </div>
    );
};
