import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './components/auth/AuthPage';
import { Dashboard } from './components/Dashboard';
import { Sidebar } from './components/Sidebar';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { Header } from './components/shared/Header';
import { GuardsView } from './components/GuardsView';
import { LocationsView } from './components/LocationsView';
import { AttendanceView } from './components/AttendanceView';
import { ClientsView } from './components/ClientsView';
import { FinancialsView } from './components/FinancialsView';
import { ReportsView } from './components/ReportsView';
import { View } from './types/index';
import './index.css';

const MainApp: React.FC = () => {
    const { user, guard, loading, error, clearError } = useAuth();
    const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 mb-2">Loading...</p>
                    <p className="text-sm text-gray-500">Connecting to authentication service...</p>
                </div>
            </div>
        );
    }

    // Show error state if there's an authentication error
    if (error && !user && !guard) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="text-red-500 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Connection Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <div className="space-y-2">
                        <button 
                            onClick={() => {
                                clearError();
                                window.location.reload();
                            }}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
                        >
                            Try Again
                        </button>
                        <button 
                            onClick={() => clearError()}
                            className="w-full bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
                        >
                            Continue Without Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!user || !guard) {
        return <AuthPage />;
    }

    const renderView = () => {
        switch (currentView) {
            case View.DASHBOARD:
                return <Dashboard />;
            case View.GUARDS:
                return <GuardsView />;
            case View.LOCATIONS:
                return <LocationsView />;
            case View.ATTENDANCE:
                return <AttendanceView />;
            case View.CLIENTS:
                return <ClientsView />;
            case View.FINANCIALS:
                return <FinancialsView />;
            case View.REPORTS:
                return <ReportsView />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar currentView={currentView} setView={setCurrentView} />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                    <ErrorBoundary>
                        {renderView()}
                    </ErrorBoundary>
                </main>
            </div>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <MainApp />
            </AuthProvider>
        </ErrorBoundary>
    );
};

export default App;