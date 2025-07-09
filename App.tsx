import React, { useState, useCallback } from 'react';
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

const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const renderView = useCallback(() => {
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
                <header className="flex justify-between items-center p-4 bg-surface shadow-md md:hidden">
                    <h1 className="text-xl font-bold text-primary">Vigilance</h1>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-600">
                        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
                    {renderView()}
                </main>
            </div>
        </div>
    );
};

export default App;
