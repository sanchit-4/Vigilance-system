import React from 'react';
import { Users, Plus, Edit, Trash2, Phone } from 'lucide-react';

export const GuardsView: React.FC = () => {
    const guards = [
        { id: 1, name: 'John Smith', contact: '+1-555-1001', salary: 3000, category: 'Guard' as const, status: 'Active' as const, verification: 'Verified' as const },
        { id: 2, name: 'Maria Garcia', contact: '+1-555-1002', salary: 3200, category: 'Supervisor' as const, status: 'Active' as const, verification: 'Verified' as const },
        { id: 3, name: 'David Johnson', contact: '+1-555-1003', salary: 2900, category: 'Guard' as const, status: 'Active' as const, verification: 'Pending' as const },
        { id: 4, name: 'Sarah Wilson', contact: '+1-555-1004', salary: 3100, category: 'Lady Guard' as const, status: 'Active' as const, verification: 'Verified' as const },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-800';
            case 'Inactive': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getVerificationColor = (verification: string) => {
        switch (verification) {
            case 'Verified': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Guards Management</h1>
                    <p className="text-gray-600">Manage security guard profiles and assignments</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Add Guard</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="bg-blue-500 p-3 rounded-lg">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Total Guards</h3>
                            <p className="text-2xl font-bold text-gray-900">{guards.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="bg-green-500 p-3 rounded-lg">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Active Guards</h3>
                            <p className="text-2xl font-bold text-gray-900">{guards.filter(g => g.status === 'Active').length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="bg-yellow-500 p-3 rounded-lg">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Verification Pending</h3>
                            <p className="text-2xl font-bold text-gray-900">{guards.filter(g => g.verification === 'Pending').length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="bg-purple-500 p-3 rounded-lg">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Avg. Salary</h3>
                            <p className="text-2xl font-bold text-gray-900">${Math.round(guards.reduce((sum, g) => sum + g.salary, 0) / guards.length)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Guards Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">All Guards</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guard</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {guards.map((guard) => (
                                <tr key={guard.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                                <Users className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{guard.name}</div>
                                                <div className="text-sm text-gray-500">ID: {guard.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-900">
                                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                            {guard.contact}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-900">{guard.category}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium text-gray-900">${guard.salary}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(guard.status)}`}>
                                            {guard.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getVerificationColor(guard.verification)}`}>
                                            {guard.verification}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button className="text-blue-600 hover:text-blue-900">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="text-red-600 hover:text-red-900">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
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