import React from 'react';
import { useAuth } from '../contexts/AuthContext';
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
    disabled?: boolean;
}> = ({ icon, text, isActive, onClick }) => (
    <li
        className={`flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
            isActive 
                ? 'bg-sidebar-active text-white' 
                : disabled 
                    ? 'text-gray-500 cursor-not-allowed' 
                    : 'hover:bg-sidebar-hover hover:text-white cursor-pointer'
        }`}
        onClick={disabled ? undefined : onClick}
        aria-current={isActive ? 'page' : undefined}
    >
        {icon}
        <span className="ml-4 font-medium">{text}</span>
    </li>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
    const { hasRole } = useAuth();

    const navItems = [
        { id: View.DASHBOARD, text: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { id: View.CLIENTS, text: 'Clients', icon: <Briefcase size={20} />, requiredRoles: ['admin', 'supervisor'] },
        { id: View.GUARDS, text: 'Guards', icon: <User size={20} />, requiredRoles: ['admin', 'supervisor'] },
        { id: View.LOCATIONS, text: 'Locations', icon: <MapPin size={20} />, requiredRoles: ['admin', 'supervisor'] },
        { id: View.ATTENDANCE, text: 'Attendance', icon: <CheckSquare size={20} /> },
        { id: View.FINANCIALS, text: 'Financials', icon: <DollarSign size={20} />, requiredRoles: ['admin', 'supervisor'] },
        { id: View.REPORTS, text: 'Reports', icon: <BarChart3 size={20} />, requiredRoles: ['admin', 'supervisor'] },
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
                        const disabled = item.requiredRoles && !hasRole(item.requiredRoles);
                        <NavItem
                            key={item.id}
                            icon={item.icon}
                            text={item.text}
                            isActive={currentView === item.id}
                                disabled={disabled}
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
