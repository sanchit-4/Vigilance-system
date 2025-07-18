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
import { View } from './types';

const MainApp: React.FC = () => {
    const { user, guard, loading } = useAuth();
    const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
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