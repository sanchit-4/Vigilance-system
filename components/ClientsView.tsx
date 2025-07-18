import React from 'react';
import { Building, Plus, Edit, Trash2, Phone, MapPin } from 'lucide-react';

export const ClientsView: React.FC = () => {
    const clients = [
        { id: 1, name: 'ABC Security Solutions', address: '123 Business St, Downtown', phone: '+1-555-0101', locations: 2 as const },
        { id: 2, name: 'XYZ Corporation', address: '456 Corporate Ave, Midtown', phone: '+1-555-0102', locations: 3 as const },
        { id: 3, name: 'Tech Park Management', address: '789 Innovation Blvd, Tech District', phone: '+1-555-0103', locations: 1 as const },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Clients Management</h1>
                    <p className="text-gray-600">Manage client accounts and contracts</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Add Client</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="bg-blue-500 p-3 rounded-lg">
                            <Building className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Total Clients</h3>
                            <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="bg-green-500 p-3 rounded-lg">
                            <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Total Locations</h3>
                            <p className="text-2xl font-bold text-gray-900">{clients.reduce((sum, c) => sum + c.locations, 0)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="bg-purple-500 p-3 rounded-lg">
                            <Building className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Active Contracts</h3>
                            <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Clients Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">All Clients</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Locations</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {clients.map((client) => (
                                <tr key={client.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                                <Building className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{client.name}</div>
                                                <div className="text-sm text-gray-500">ID: {client.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-900">
                                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                            {client.address}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-900">
                                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                            {client.phone}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-900">{client.locations} locations</span>
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