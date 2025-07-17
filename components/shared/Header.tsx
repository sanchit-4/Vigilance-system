import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from './Button';
import { ShieldCheck, LogOut, User } from 'lucide-react';

export const Header: React.FC = () => {
    const { user, guard, signOut } = useAuth();

    const handleSignOut = async () => {
        await signOut();
    };

    const getRoleBadge = (role: string) => {
        const colors = {
            admin: 'bg-red-100 text-red-800',
            supervisor: 'bg-blue-100 text-blue-800',
            guard: 'bg-green-100 text-green-800'
        };
        return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex justify-between items-center px-6 py-4">
                <div className="flex items-center">
                    <ShieldCheck size={24} className="text-primary mr-3" />
                    <h1 className="text-xl font-bold text-gray-800">Vigilance</h1>
                </div>
                
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                        <User size={20} className="text-gray-600" />
                        <div className="text-sm">
                            <p className="font-medium text-gray-800">{guard?.name || 'Unknown User'}</p>
                            <p className="text-gray-500">{user?.email}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(guard?.role || 'guard')}`}>
                            {guard?.role?.charAt(0).toUpperCase() + guard?.role?.slice(1) || 'Guard'}
                        </span>
                    </div>
                    
                    <Button
                        onClick={handleSignOut}
                        variant="secondary"
                        size="sm"
                        className="flex items-center"
                    >
                        <LogOut size={16} className="mr-2" />
                        Sign Out
                    </Button>
                </div>
            </div>
        </header>
    );
};