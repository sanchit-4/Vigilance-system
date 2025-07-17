import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Spinner } from './Spinner';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRoles?: string[];
    fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
    children, 
    requiredRoles, 
    fallback 
}) => {
    const { user, guard, loading, hasRole } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <Spinner size={48} />
            </div>
        );
    }

    if (!user || !guard) {
        return null; // AuthPage will be shown by App component
    }

    if (requiredRoles && !hasRole(requiredRoles)) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
                    <p className="text-gray-600">You don't have permission to access this page.</p>
                    {fallback}
                </div>
            </div>
        );
    }

    return <>{children}</>;
};