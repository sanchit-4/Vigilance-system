import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

export const Header: React.FC = () => {
    const { user, guard, signOut } = useAuth();

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Vigilance Guard Management
                    </h1>
                    <p className="text-sm text-gray-600">
                        Security management made simple
                    </p>
                </div>
                
                <div className="flex items-center space-x-4">
                    {guard && (
                        <div className="flex items-center space-x-2">
                            <User className="w-5 h-5 text-gray-600" />
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-800">{guard.name}</p>
                                <p className="text-xs text-gray-600 capitalize">{guard.role}</p>
                            </div>
                        </div>
                    )}
                    
                    <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        </header>
    );
};