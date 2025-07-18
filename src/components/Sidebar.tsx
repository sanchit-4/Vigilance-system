import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Users, MapPin, Clock, DollarSign, FileText, ShieldCheck, LogOut } from 'lucide-react';

interface SidebarProps {
    currentView: string;
    setView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
    const { guard, signOut } = useAuth();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'guards', label: 'Guards', icon: Users },
        { id: 'locations', label: 'Locations', icon: MapPin },
        { id: 'attendance', label: 'Attendance', icon: Clock },
        { id: 'financials', label: 'Financials', icon: DollarSign },
        { id: 'reports', label: 'Reports', icon: FileText },
    ];

    return (
        <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
            <div className="flex items-center mb-8">
                <ShieldCheck size={32} className="text-blue-400 mr-3" />
                <h1 className="text-xl font-bold">Vigilance</h1>
            </div>
            
            <nav className="space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setView(item.id)}
                            className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                                currentView === item.id
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                        >
                            <Icon size={20} className="mr-3" />
                            {item.label}
                        </button>
                    );
                })}
            </nav>
            
            <div className="mt-8 pt-4 border-t border-gray-700">
                <div className="text-sm text-gray-400 mb-2">
                    {guard?.name} ({guard?.role})
                </div>
                <button
                    onClick={signOut}
                    className="w-full flex items-center px-4 py-3 text-left rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                    <LogOut size={20} className="mr-3" />
                    Sign Out
                </button>
            </div>
        </div>
    );
};