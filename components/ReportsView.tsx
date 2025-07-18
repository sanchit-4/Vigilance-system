import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Database } from '../types/supabase';
import { Spinner } from './shared/Spinner';

type ReportTab = 'attendance' | 'salary';
type Guard = Database['public']['Tables']['guards']['Row'];
type Location = Database['public']['Tables']['locations']['Row'];
type AttendanceRecord = Database['public']['Tables']['attendance']['Row'];
type SalaryAdvance = Database['public']['Tables']['salary_advances']['Row'];
type AssignedInventory = Database['public']['Tables']['assigned_inventory']['Row'] & {
    inventory_items: { item_name: string, value: number } | null
};

const AttendanceReport: React.FC = () => {
    const [guards, setGuards] = useState<Guard[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [attendance, setAttendance] = useState<(AttendanceRecord & { guards: {name: string} | null, locations: {site_name: string} | null})[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ guardId: '', startDate: '', endDate: '' });
    const [showExportDialog, setShowExportDialog] = useState(false);

    const fetchDropdownData = useCallback(async () => {
        const { data: guardsData } = await supabase.from('guards').select('id, name').order('name');
        const { data: locationsData } = await supabase.from('locations').select('id, site_name').order('site_name');
        if (guardsData) setGuards(guardsData);
        if (locationsData) setLocations(locationsData);
    }, []);

    const fetchReportData = useCallback(async () => {
        setLoading(true);
        // Optimize query - select only needed fields and limit results
        let query = supabase.from('attendance').select('id, guard_id, location_id, check_in_time, status, is_within_geofence, guards!inner(name), locations!inner(site_name)').order('check_in_time', { ascending: false }).limit(100);
        if (filters.guardId) query = query.eq('guard_id', filters.guardId);
        if (filters.startDate) query = query.gte('check_in_time', filters.startDate);
        if (filters.endDate) {
            const date = new Date(filters.endDate);
            date.setHours(23, 59, 59, 999);
            query = query.lte('check_in_time', date.toISOString());
        }

        const { data, error } = await query;
        if (error) console.error(error);
        else setAttendance(data as any);
        setLoading(false);
    }, [filters]);

    const handleExportPDF = () => {
        console.log('Exporting attendance data to PDF...');
        setShowExportDialog(false);
    };

    const handleExportExcel = () => {
        console.log('Exporting attendance data to Excel...');
        setShowExportDialog(false);
    };

    useEffect(() => { fetchDropdownData() }, [fetchDropdownData]);
    useEffect(() => { fetchReportData() }, [fetchReportData]);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="p-4 bg-gray-50 rounded-lg border grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Guard</label>
                        <select value={filters.guardId} onChange={e => setFilters(f => ({...f, guardId: e.target.value}))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary">
                            <option value="">All Guards</option>
                            {guards.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Start Date</label>
                        <input type="date" value={filters.startDate} onChange={e => setFilters(f => ({...f, startDate: e.target.value}))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">End Date</label>
                        <input type="date" value={filters.endDate} onChange={e => setFilters(f => ({...f, endDate: e.target.value}))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"/>
                    </div>
                </div>
                
                <button 
                    onClick={() => setShowExportDialog(true)}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Export
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Guard</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Date & Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Geofence</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? <tr><td colSpan={5} className="text-center py-10"><Spinner/></td></tr>
                        : attendance.length === 0 ? <tr><td colSpan={5} className="text-center py-10 text-gray-500">No records match criteria.</td></tr>
                        : attendance.map(rec => (
                            <tr key={rec.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{rec.guards?.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{rec.locations?.site_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(rec.check_in_time).toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{rec.is_within_geofence ? 'Verified' : 'Out of Range'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{rec.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showExportDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80 max-w-md">
                        <h3 className="text-lg font-medium mb-4 text-gray-900">Export Options</h3>
                        <div className="space-y-3">
                            <button 
                                onClick={handleExportPDF}
                                className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                Export as PDF
                            </button>
                            <button 
                                onClick={handleExportExcel}
                                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Export as Excel
                            </button>
                            <button 
                                onClick={() => setShowExportDialog(false)}
                                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const SalaryStatement: React.FC<{guard: Guard}> = ({ guard }) => {
    const [advances, setAdvances] = useState<SalaryAdvance[]>([]);
    const [deductions, setDeductions] = useState<AssignedInventory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFinancials = async () => {
            setLoading(true);
            const advPromise = supabase.from('salary_advances').select('*').eq('guard_id', guard.id).eq('is_fully_recovered', false);
            const dedPromise = supabase.from('assigned_inventory').select('*, inventory_items(item_name, value)').eq('guard_id', guard.id).in('status', ['Lost', 'Damaged']);
            const [advRes, dedRes] = await Promise.all([advPromise, dedPromise]);
            if (advRes.data) setAdvances(advRes.data);
            if (dedRes.data) setDeductions(dedRes.data as AssignedInventory[]);
            setLoading(false);
        }
        fetchFinancials();
    }, [guard.id]);

    const totalAdvances = advances.reduce((sum, a) => sum + a.amount, 0);
    const totalDeductions = deductions.reduce((sum, d) => sum + (d.inventory_items?.value || 0), 0);
    const netPayable = guard.base_salary - totalDeductions - totalAdvances;

    return (
        <div className="border rounded-lg p-6 space-y-4 bg-white">
            {loading ? <div className="h-48 flex justify-center items-center"><Spinner /></div> : <>
                <h3 className="text-xl font-bold text-primary">{guard.name}</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <span className="font-medium text-gray-600">Base Salary:</span><span className="text-right">${guard.base_salary.toLocaleString()}</span>
                </div>
                <hr />
                <h4 className="font-semibold text-gray-700">Deductions (Lost/Damaged Items)</h4>
                {deductions.length > 0 ? (
                    deductions.map(d => (
                        <div key={d.id} className="grid grid-cols-2 gap-x-4 text-sm">
                            <span className="text-gray-600">{d.inventory_items?.item_name}</span>
                            <span className="text-right text-red-600">-${d.inventory_items?.value.toLocaleString()}</span>
                        </div>
                    ))
                ) : <p className="text-sm text-gray-500">None</p>}
                <h4 className="font-semibold text-gray-700">Pending Advances</h4>
                {advances.length > 0 ? (
                    advances.map(a => (
                        <div key={a.id} className="grid grid-cols-2 gap-x-4 text-sm">
                            <span className="text-gray-600">Cash Advance ({new Date(a.advance_date).toLocaleDateString()})</span>
                            <span className="text-right text-red-600">-${a.amount.toLocaleString()}</span>
                        </div>
                    ))
                ) : <p className="text-sm text-gray-500">None</p>}
                <hr />
                <div className="grid grid-cols-2 gap-x-4 font-bold text-lg">
                    <span className="text-gray-800">Net Payable:</span>
                    <span className="text-right text-green-600">${netPayable.toLocaleString()}</span>
                </div>
            </>}
        </div>
    );
};

const SalaryReport: React.FC = () => {
    const [guards, setGuards] = useState<Guard[]>([]);
    const [loading, setLoading] = useState(true);
    const [showExportDialog, setShowExportDialog] = useState(false);

    useEffect(() => {
        const fetchGuards = async () => {
            setLoading(true);
            const { data, error } = await supabase.from('guards').select('*').eq('is_active', true);
            if (error) console.error("Error fetching guards:", error);
            if (data) setGuards(data);
            setLoading(false);
        }
        fetchGuards();
    }, []);

    const handleExportPDF = () => {
        console.log('Exporting salary data to PDF...');
        setShowExportDialog(false);
    };

    const handleExportExcel = () => {
        console.log('Exporting salary data to Excel...');
        setShowExportDialog(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                    Generated salary statements for all active guards ({guards.length}). 
                    This is a monthly simulation based on current data.
                </p>
                <button 
                    onClick={() => setShowExportDialog(true)}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Export
                </button>
            </div>
            
            {loading ? (
                <div className="flex justify-center py-10"><Spinner /></div>
            ) : guards.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No active guards found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {guards.map(guard => <SalaryStatement key={guard.id} guard={guard} />)}
                </div>
            )}

            {showExportDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80 max-w-md">
                        <h3 className="text-lg font-medium mb-4 text-gray-900">Export Options</h3>
                        <div className="space-y-3">
                            <button 
                                onClick={handleExportPDF}
                                className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                Export as PDF
                            </button>
                            <button 
                                onClick={handleExportExcel}
                                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Export as Excel
                            </button>
                            <button 
                                onClick={() => setShowExportDialog(false)}
                                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export const ReportsView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ReportTab>('salary');

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-text-primary">Reports</h1>
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button 
                        onClick={() => setActiveTab('salary')} 
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'salary' 
                                ? 'border-primary text-primary' 
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Salary Statements
                    </button>
                    <button 
                        onClick={() => setActiveTab('attendance')} 
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'attendance' 
                                ? 'border-primary text-primary' 
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Attendance Log
                    </button>
                </nav>
            </div>
            <div>
                {activeTab === 'attendance' && <AttendanceReport />}
                {activeTab === 'salary' && <SalaryReport />}
            </div>
        </div>
    );
};
