import React from 'react';
import { MapPin, Plus, Edit, Trash2, Building, Shield } from 'lucide-react';

export const LocationsView: React.FC = () => {
    const locations = [
        { id: 1, name: 'Downtown Mall', client: 'ABC Security Solutions', address: '100 Shopping Center Dr', guards: 3, status: 'Active' as const },
        { id: 2, name: 'Corporate Headquarters', client: 'XYZ Corporation', address: '200 Executive Plaza', guards: 2, status: 'Active' as const },
        { id: 3, name: 'Tech Campus Building A', client: 'Tech Park Management', address: '300 Innovation Way', guards: 1, status: 'Active' as const },
        { id: 4, name: 'Warehouse Complex', client: 'ABC Security Solutions', address: '400 Industrial Blvd', guards: 0, status: 'Inactive' as const },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-800';
            case 'Inactive': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Locations Management</h1>
                    <p className="text-gray-600">Manage security locations and site assignments</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Add Location</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="bg-blue-500 p-3 rounded-lg">
                            <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Total Locations</h3>
                            <p className="text-2xl font-bold text-gray-900">{locations.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="bg-green-500 p-3 rounded-lg">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Active Sites</h3>
                            <p className="text-2xl font-bold text-gray-900">{locations.filter(l => l.status === 'Active').length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="bg-yellow-500 p-3 rounded-lg">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Guards Assigned</h3>
                            <p className="text-2xl font-bold text-gray-900">{locations.reduce((sum, l) => sum + l.guards, 0)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="bg-purple-500 p-3 rounded-lg">
                            <Building className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Coverage Rate</h3>
                            <p className="text-2xl font-bold text-gray-900">85%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Locations Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">All Locations</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guards</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {locations.map((location) => (
                                <tr key={location.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                                <MapPin className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{location.name}</div>
                                                <div className="text-sm text-gray-500">ID: {location.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-900">
                                            <Building className="w-4 h-4 mr-2 text-gray-400" />
                                            {location.client}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-900">{location.address}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-900">{location.guards} guards</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(location.status)}`}>
                                            {location.status}
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