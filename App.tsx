import React, { useState } from 'react';
import { ShieldCheck, User, MapPin, CheckSquare, DollarSign, BarChart3, Briefcase, Menu, X } from 'lucide-react';

// Simple components to test loading
const Dashboard = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome to Vigilance</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-500">
            <User size={24} className="text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Guards</p>
            <p className="text-2xl font-bold text-gray-800">12</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-500">
            <MapPin size={24} className="text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Locations</p>
            <p className="text-2xl font-bold text-gray-800">8</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-indigo-500">
            <CheckSquare size={24} className="text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Attendance</p>
            <p className="text-2xl font-bold text-gray-800">95%</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-500">
            <DollarSign size={24} className="text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Revenue</p>
            <p className="text-2xl font-bold text-gray-800">$45K</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ComingSoon = ({ title }: { title: string }) => (
  <div className="p-6 text-center">
    <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
    <p className="text-gray-600">This feature is coming soon...</p>
  </div>
);

type View = 'dashboard' | 'guards' | 'locations' | 'attendance' | 'financials' | 'reports' | 'clients';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard' as View, label: 'Dashboard', icon: BarChart3 },
    { id: 'clients' as View, label: 'Clients', icon: Briefcase },
    { id: 'guards' as View, label: 'Guards', icon: User },
    { id: 'locations' as View, label: 'Locations', icon: MapPin },
    { id: 'attendance' as View, label: 'Attendance', icon: CheckSquare },
    { id: 'financials' as View, label: 'Financials', icon: DollarSign },
    { id: 'reports' as View, label: 'Reports', icon: BarChart3 },
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'guards':
        return <ComingSoon title="Guards Management" />;
      case 'locations':
        return <ComingSoon title="Locations Management" />;
      case 'attendance':
        return <ComingSoon title="Attendance Tracking" />;
      case 'financials':
        return <ComingSoon title="Financial Management" />;
      case 'reports':
        return <ComingSoon title="Reports & Analytics" />;
      case 'clients':
        return <ComingSoon title="Client Management" />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}>
        <div className="flex items-center justify-center p-6 border-b border-gray-800">
          <ShieldCheck size={32} className="text-blue-400" />
          <h1 className="ml-3 text-2xl font-bold">Vigilance</h1>
        </div>
        
        <nav className="mt-6">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-800 transition-colors ${
                  currentView === item.id ? 'bg-blue-600' : ''
                }`}
              >
                <Icon size={20} className="mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex justify-between items-center px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden text-gray-600 hover:text-gray-900"
              >
                <Menu size={24} />
              </button>
              <h1 className="ml-3 text-xl font-bold text-gray-800">Vigilance Guard Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, Admin</span>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default App;