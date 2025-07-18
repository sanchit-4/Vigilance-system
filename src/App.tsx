import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './components/auth/AuthPage';
import { Dashboard } from './components/Dashboard';
import { Sidebar } from './components/Sidebar';

const MainApp: React.FC = () => {
    const { user, guard, loading } = useAuth();
    const [currentView, setCurrentView] = useState('dashboard');

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
            case 'dashboard':
                return <Dashboard />;
            case 'guards':
                return <div className="p-6"><h1 className="text-2xl font-bold">Guards Management</h1></div>;
            case 'locations':
                return <div className="p-6"><h1 className="text-2xl font-bold">Locations</h1></div>;
            case 'attendance':
                return <div className="p-6"><h1 className="text-2xl font-bold">Attendance</h1></div>;
            case 'financials':
                return <div className="p-6"><h1 className="text-2xl font-bold">Financials</h1></div>;
            case 'reports':
                return <div className="p-6"><h1 className="text-2xl font-bold">Reports</h1></div>;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar currentView={currentView} setView={setCurrentView} />
            <main className="flex-1 overflow-y-auto">
                {renderView()}
            </main>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <MainApp />
        </AuthProvider>
    );
};

export default App;