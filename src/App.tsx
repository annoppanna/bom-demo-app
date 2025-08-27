import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import RawMaterialManagement from './components/RawMaterialManagement';
import ProductionOrders from './components/ProductionOrders';
import Planning from './components/Planning';
import RnD from './components/RnD';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Sidebar from './components/Sidebar';

function App() {
  const [activeModule, setActiveModule] = useState('dashboard');

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'raw-materials':
        return <RawMaterialManagement />;
      case 'production-orders':
        return <ProductionOrders />;
      case 'planning':
        return <Planning />;
      case 'rnd':
        return <RnD />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">BOM Fresh</h1>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome, Production Manager
              </div>
              <div className="w-8 h-8 bg-[#8F262B] rounded-full flex items-center justify-center text-white text-sm font-medium">
                PM
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">
          {renderActiveModule()}
        </main>
      </div>
    </div>
  );
}

export default App;