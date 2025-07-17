import React, { useState, useCallback } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './components/auth/AuthPage';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import { Header } from './components/shared/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { GuardsView } from './components/GuardsView';
import { LocationsView } from './components/LocationsView';
import { AttendanceView } from './components/AttendanceView';
import { FinancialsView } from './components/FinancialsView';
import { ReportsView } from './components/ReportsView';
import { ClientsView } from './components/ClientsView';
import { View } from './types';
import { Menu, X } from 'lucide-react';

const AppContent: React.FC = () => {
    const { user, guard, loading } = useAuth();
    const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user || !guard) {
        return <AuthPage />;
    }

    const renderView = useCallback(() => {
        switch (currentView) {
            case View.DASHBOARD:
                return <Dashboard />;
            case View.CLIENTS:
                return (
                    <ProtectedRoute requiredRoles={['admin', 'supervisor']}>
                        <ClientsView />
                    </ProtectedRoute>
                );
            case View.GUARDS:
                return (
                    <ProtectedRoute requiredRoles={['admin', 'supervisor']}>
                        <GuardsView />
                    </ProtectedRoute>
                );
            case View.LOCATIONS:
                return (
                    <ProtectedRoute requiredRoles={['admin', 'supervisor']}>
                        <LocationsView />
                    </ProtectedRoute>
                );
            case View.ATTENDANCE:
                return <AttendanceView />;
            case View.FINANCIALS:
                return (
                    <ProtectedRoute requiredRoles={['admin', 'supervisor']}>
                        <FinancialsView />
                    </ProtectedRoute>
                );
            case View.REPORTS:
                return (
                    <ProtectedRoute requiredRoles={['admin', 'supervisor']}>
                        <ReportsView />
                    </ProtectedRoute>
                );
            default:
                return <Dashboard />;
        }
    }, [currentView]);

    const handleSetView = (view: View) => {
        setCurrentView(view);
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-sidebar text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}>
                <Sidebar currentView={currentView} setView={handleSetView} />
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="hidden md:block">
                    <Header />
                </div>
                <div className="md:hidden">
                    <header className="flex justify-between items-center p-4 bg-surface shadow-md">
                        <h1 className="text-xl font-bold text-primary">Vigilance</h1>
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-600">
                            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </header>
                </div>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
                    {renderView()}
                </main>
            </div>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;
