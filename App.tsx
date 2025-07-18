import React, { useState, useCallback } from 'react';
import { AuthProvider, useAuth } from './contexts';
import { 
    AuthPage, 
    ProtectedRoute, 
    Header, 
    Sidebar,
    Dashboard,
    GuardsView,
    LocationsView,
    AttendanceView,
    FinancialsView,
    ReportsView,
    ClientsView,
    ErrorBoundary
} from './components';
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
                    <svg className="animate-spin h-12 w-12 text-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-600">Initializing Vigilance...</p>
                </div>
            </div>
        );
    }

    if (!user) {
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
        <ErrorBoundary>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </ErrorBoundary>
    );
};

export default App;
