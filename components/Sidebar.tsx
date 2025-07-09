import React from 'react';
import { View } from '../types';
import { LayoutDashboard, User, MapPin, CheckSquare, DollarSign, BarChart3, ShieldCheck, Briefcase } from 'lucide-react';

interface SidebarProps {
    currentView: View;
    setView: (view: View) => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    text: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, text, isActive, onClick }) => (
    <li
        className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors duration-200 ${
            isActive ? 'bg-sidebar-active text-white' : 'hover:bg-sidebar-hover hover:text-white'
        }`}
        onClick={onClick}
        aria-current={isActive ? 'page' : undefined}
    >
        {icon}
        <span className="ml-4 font-medium">{text}</span>
    </li>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
    const navItems = [
        { id: View.DASHBOARD, text: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { id: View.CLIENTS, text: 'Clients', icon: <Briefcase size={20} /> },
        { id: View.GUARDS, text: 'Guards', icon: <User size={20} /> },
        { id: View.LOCATIONS, text: 'Locations', icon: <MapPin size={20} /> },
        { id: View.ATTENDANCE, text: 'Attendance', icon: <CheckSquare size={20} /> },
        { id: View.FINANCIALS, text: 'Financials', icon: <DollarSign size={20} /> },
        { id: View.REPORTS, text: 'Reports', icon: <BarChart3 size={20} /> },
    ];

    return (
        <div className="flex flex-col h-full bg-sidebar text-sidebar-text">
            <div className="flex items-center justify-center p-6 border-b border-sidebar-hover">
                <ShieldCheck size={32} className="text-accent" />
                <h1 className="ml-3 text-2xl font-bold text-white">Vigilance</h1>
            </div>
            <nav className="flex-1 p-4">
                <ul>
                    {navItems.map((item) => (
                        <NavItem
                            key={item.id}
                            icon={item.icon}
                            text={item.text}
                            isActive={currentView === item.id}
                            onClick={() => setView(item.id)}
                        />
                    ))}
                </ul>
            </nav>
            <div className="p-4 border-t border-sidebar-hover text-center text-xs text-gray-500">
                &copy; 2024 Vigilance Systems
            </div>
        </div>
    );
};
