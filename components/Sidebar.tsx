import React from 'react';
import { 
    Home, 
    Users, 
    MapPin, 
    Clock, 
    Building, 
    DollarSign, 
    BarChart3,
    Shield
} from 'lucide-react';
import { View } from '../types';

interface SidebarProps {
    currentView: View;
    setView: (view: View) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
    const menuItems = [
        { view: View.DASHBOARD, icon: Home, label: 'Dashboard' },
        { view: View.GUARDS, icon: Users, label: 'Guards' },
        { view: View.CLIENTS, icon: Building, label: 'Clients' },
        { view: View.LOCATIONS, icon: MapPin, label: 'Locations' },
        { view: View.ATTENDANCE, icon: Clock, label: 'Attendance' },
        { view: View.FINANCIALS, icon: DollarSign, label: 'Financials' },
        { view: View.REPORTS, icon: BarChart3, label: 'Reports' },
    ];

    return (
        <div className="bg-gray-900 text-white w-64 min-h-screen flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                    <Shield className="w-8 h-8 text-blue-400" />
                    <div>
                        <h1 className="text-xl font-bold">Vigilance</h1>
                        <p className="text-xs text-gray-400">Guard Management</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => (
                    <button
                        key={item.view}
                        onClick={() => setView(item.view)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                            currentView === item.view
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-700">
                <p className="text-xs text-gray-400 text-center">
                    v1.0.0 - Vigilance System
                </p>
            </div>
        </div>
    );
};