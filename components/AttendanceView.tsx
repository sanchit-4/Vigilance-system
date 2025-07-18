import React from 'react';
import { Clock, CheckCircle, XCircle, MapPin, User } from 'lucide-react';

export const AttendanceView: React.FC = () => {
    const attendanceRecords = [
        { id: 1, guard: 'John Smith', location: 'Downtown Mall', checkIn: '08:00 AM', status: 'Approved', verification: 'Verified' },
        { id: 2, guard: 'Maria Garcia', location: 'Corporate HQ', checkIn: '07:45 AM', status: 'Approved', verification: 'Verified' },
        { id: 3, guard: 'David Johnson', location: 'Tech Campus', checkIn: '09:15 AM', status: 'Pending', verification: 'Pending' },
        { id: 4, guard: 'Sarah Wilson', location: 'Downtown Mall', checkIn: '08:30 AM', status: 'Approved', verification: 'Verified' },
        { id: 5, guard: 'Mike Brown', location: 'Corporate HQ', checkIn: '10:00 AM', status: 'Rejected', verification: 'Outside Geofence' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getVerificationColor = (verification: string) => {
        switch (verification) {
            case 'Verified': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Outside Geofence': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
                    <p className="text-gray-600">Track guard attendance and verify check-ins</p>
                </div>
                <div className="flex space-x-2">
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve All</span>
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>Export Report</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="bg-blue-500 p-3 rounded-lg">
                            <Clock className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Total Check-ins</h3>
                            <p className="text-2xl font-bold text-gray-900">{attendanceRecords.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="bg-green-500 p-3 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Approved</h3>
                            <p className="text-2xl font-bold text-gray-900">{attendanceRecords.filter(r => r.status === 'Approved').length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="bg-yellow-500 p-3 rounded-lg">
                            <Clock className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Pending</h3>
                            <p className="text-2xl font-bold text-gray-900">{attendanceRecords.filter(r => r.status === 'Pending').length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="bg-red-500 p-3 rounded-lg">
                            <XCircle className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
                            <p className="text-2xl font-bold text-gray-900">{attendanceRecords.filter(r => r.status === 'Rejected').length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Attendance Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Today's Attendance</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guard</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {attendanceRecords.map((record) => (
                                <tr key={record.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                                <User className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{record.guard}</div>
                                                <div className="text-sm text-gray-500">ID: {record.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-900">
                                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                            {record.location}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-900">
                                            <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                            {record.checkIn}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(record.status)}`}>
                                            {record.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getVerificationColor(record.verification)}`}>
                                            {record.verification}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            {record.status === 'Pending' && (
                                                <>
                                                    <button className="text-green-600 hover:text-green-900">
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                    <button className="text-red-600 hover:text-red-900">
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
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