import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ShieldCheck } from 'lucide-react';

export const Dashboard: React.FC = () => {
    const { guard } = useAuth();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <div className="text-sm text-gray-500">
                    Welcome, {guard?.name}!
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <ShieldCheck size={32} className="text-blue-500 mr-4" />
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Guards</p>
                            <p className="text-2xl font-bold text-gray-800">12</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <ShieldCheck size={32} className="text-green-500 mr-4" />
                        <div>
                            <p className="text-sm font-medium text-gray-600">Active Today</p>
                            <p className="text-2xl font-bold text-gray-800">8</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <ShieldCheck size={32} className="text-yellow-500 mr-4" />
                        <div>
                            <p className="text-sm font-medium text-gray-600">Locations</p>
                            <p className="text-2xl font-bold text-gray-800">5</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <ShieldCheck size={32} className="text-purple-500 mr-4" />
                        <div>
                            <p className="text-sm font-medium text-gray-600">Clients</p>
                            <p className="text-2xl font-bold text-gray-800">3</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <ShieldCheck size={20} className="text-green-500 mr-3" />
                        <div>
                            <p className="font-medium">Guard check-in approved</p>
                            <p className="text-sm text-gray-600">John Smith - Downtown Mall - 2 hours ago</p>
                        </div>
                    </div>
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <ShieldCheck size={20} className="text-blue-500 mr-3" />
                        <div>
                            <p className="font-medium">New guard registered</p>
                            <p className="text-sm text-gray-600">Sarah Johnson - 4 hours ago</p>
                        </div>
                    </div>
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <ShieldCheck size={20} className="text-yellow-500 mr-3" />
                        <div>
                            <p className="font-medium">Location added</p>
                            <p className="text-sm text-gray-600">Tech Park Building A - 6 hours ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};