import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ClipboardList, 
  Calendar, 
  FlaskConical, 
  BarChart3, 
  Settings
} from 'lucide-react';

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeModule, setActiveModule }) => {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'raw-materials', name: 'Raw Materials', icon: Package },
    { id: 'production-orders', name: 'Production Orders', icon: ClipboardList },
    { id: 'planning', name: 'Planning', icon: Calendar },
    { id: 'rnd', name: 'R&D', icon: FlaskConical },
    { id: 'reports', name: 'Reports', icon: BarChart3 },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#8F262B] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">BM</span>
          </div>
          <span className="font-bold text-gray-900">BOM Fresh</span>
        </div>
      </div>
      
      <nav className="mt-8">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                isActive
                  ? 'bg-red-50 border-r-2 border-[#8F262B] text-[#8F262B]'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-[#8F262B]' : 'text-gray-500'}`} />
              <span className="font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;