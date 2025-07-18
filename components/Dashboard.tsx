import React from 'react';
import { Users, MapPin, Clock, DollarSign, Shield, CheckCircle } from 'lucide-react';

export const Dashboard: React.FC = () => {
    const stats = [
        { name: 'Total Guards', value: '24', icon: Users, color: 'bg-blue-500' },
        { name: 'Active Locations', value: '8', icon: MapPin, color: 'bg-green-500' },
        { name: 'On Duty', value: '18', icon: Clock, color: 'bg-yellow-500' },
        { name: 'Monthly Revenue', value: '$45,600', icon: DollarSign, color: 'bg-purple-500' },
    ];

    const recentActivity = [
        { id: 1, guard: 'John Smith', action: 'Checked in', location: 'Downtown Mall', time: '2 hours ago' },
        { id: 2, guard: 'Maria Garcia', action: 'Completed shift', location: 'Corporate HQ', time: '3 hours ago' },
        { id: 3, guard: 'David Johnson', action: 'Reported incident', location: 'Tech Campus', time: '4 hours ago' },
        { id: 4, guard: 'Sarah Wilson', action: 'Checked out', location: 'Downtown Mall', time: '5 hours ago' },
    ];

    const alerts = [
        { id: 1, type: 'warning', message: 'Guard late check-in at Downtown Mall', time: '15 min ago' },
        { id: 2, type: 'success', message: 'All guards verified at Corporate HQ', time: '1 hour ago' },
        { id: 3, type: 'info', message: 'New client onboarded successfully', time: '2 hours ago' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Welcome to your security management overview</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className={`${stat.color} p-3 rounded-lg`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-500">{stat.name}</h3>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                        <Users className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                        {activity.guard} {activity.action}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {activity.location} • {activity.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Alerts */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Alerts</h2>
                    <div className="space-y-3">
                        {alerts.map((alert) => (
                            <div key={alert.id} className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    {alert.type === 'warning' && (
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                                    )}
                                    {alert.type === 'success' && (
                                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                    )}
                                    {alert.type === 'info' && (
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-900">{alert.message}</p>
                                    <p className="text-xs text-gray-500">{alert.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* System Status */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-gray-600">GPS Tracking Active</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-gray-600">Communication Online</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-gray-600">Database Connected</span>
                    </div>
                </div>
            </div>
        </div>
    );
};