import React from 'react';
import { BarChart3, FileText, Download, Calendar, TrendingUp, Users, MapPin } from 'lucide-react';

export const ReportsView: React.FC = () => {
    const reports = [
        { id: 1, name: 'Monthly Attendance Report', type: 'Attendance', date: '2024-01-31', format: 'PDF' },
        { id: 2, name: 'Financial Summary Q1', type: 'Financial', date: '2024-01-31', format: 'Excel' },
        { id: 3, name: 'Guard Performance Report', type: 'Performance', date: '2024-01-30', format: 'PDF' },
        { id: 4, name: 'Location Coverage Analysis', type: 'Coverage', date: '2024-01-29', format: 'PDF' },
    ];

    const metrics = [
        { name: 'Total Guards', value: 24, change: '+2', trend: 'up' },
        { name: 'Active Locations', value: 8, change: '+1', trend: 'up' },
        { name: 'Attendance Rate', value: '94.5%', change: '+1.2%', trend: 'up' },
        { name: 'Revenue Growth', value: '15.3%', change: '+3.1%', trend: 'up' },
    ];

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Attendance': return 'bg-blue-100 text-blue-800';
            case 'Financial': return 'bg-green-100 text-green-800';
            case 'Performance': return 'bg-purple-100 text-purple-800';
            case 'Coverage': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
                    <p className="text-gray-600">Generate and view comprehensive reports</p>
                </div>
                <div className="flex space-x-2">
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span>Generate Report</span>
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                        <BarChart3 className="w-4 h-4" />
                        <span>View Dashboard</span>
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {metrics.map((metric) => (
                    <div key={metric.name} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">{metric.name}</h3>
                                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                            </div>
                            <div className={`flex items-center space-x-1 ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                <TrendingUp className="w-4 h-4" />
                                <span className="text-sm font-medium">{metric.change}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center mb-4">
                        <Users className="w-8 h-8 text-blue-500 mr-3" />
                        <h3 className="text-lg font-semibold text-gray-900">Attendance Report</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Generate detailed attendance reports for any date range</p>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                        Generate Report
                    </button>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center mb-4">
                        <BarChart3 className="w-8 h-8 text-green-500 mr-3" />
                        <h3 className="text-lg font-semibold text-gray-900">Financial Summary</h3>
                    </div>
                    <p className="text-gray-600 mb-4">View revenue, expenses, and profit analysis</p>
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                        View Financials
                    </button>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center mb-4">
                        <MapPin className="w-8 h-8 text-purple-500 mr-3" />
                        <h3 className="text-lg font-semibold text-gray-900">Location Coverage</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Analyze guard coverage across all locations</p>
                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
                        View Coverage
                    </button>
                </div>
            </div>

            {/* Recent Reports */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Generated</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Format</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {reports.map((report) => (
                                <tr key={report.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <FileText className="w-5 h-5 text-gray-400 mr-3" />
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{report.name}</div>
                                                <div className="text-sm text-gray-500">ID: {report.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(report.type)}`}>
                                            {report.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-900">
                                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                            {report.date}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-900">{report.format}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button className="text-blue-600 hover:text-blue-900 flex items-center">
                                            <Download className="w-4 h-4 mr-1" />
                                            Download
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