import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { AuthPage } from './components/auth/AuthPage';
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
import './index.css';

const MainApp: React.FC = () => {
    const { user, guard, loading } = useAuth();
    const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);

    // Show loading spinner while authentication is being resolved
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading application...</p>
                </div>
            </div>
        );
    }

    // Show auth page if user is not authenticated
    if (!user || !guard) {
        return <AuthPage />;
    }

    const renderView = () => {
        switch (currentView) {
            case View.DASHBOARD:
                return <Dashboard />;
            case View.CLIENTS:
                return <ClientsView />;
            case View.GUARDS:
                return <GuardsView />;
            case View.LOCATIONS:
                return <LocationsView />;
            case View.ATTENDANCE:
                return <AttendanceView />;
            case View.FINANCIALS:
                return <FinancialsView />;
            case View.REPORTS:
                return <ReportsView />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="flex h-screen bg-background">
            <div className="w-64 flex-shrink-0">
                <Sidebar currentView={currentView} setView={setCurrentView} />
            </div>
            
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
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