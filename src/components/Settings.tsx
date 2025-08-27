import React, { useState } from 'react';
import { Settings as SettingsIcon, Database, Users, Warehouse, Package, FileText, RefreshCw, Plus, X, Save } from 'lucide-react';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('master-data');
  const [showAddWarehouse, setShowAddWarehouse] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditWarehouse, setShowEditWarehouse] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<any>(null);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  const [newWarehouse, setNewWarehouse] = useState({
    id: '',
    name: '',
    location: '',
    status: 'active' as 'active' | 'inactive'
  });

  const [newUser, setNewUser] = useState({
    name: '',
    role: '',
    email: '',
    status: 'active' as 'active' | 'inactive'
  });

  const sections = [
    { id: 'master-data', name: 'Master Data', icon: Database },
    { id: 'users', name: 'User Management', icon: Users },
    { id: 'warehouses', name: 'Warehouses', icon: Warehouse },
    { id: 'products', name: 'Product Master', icon: Package },
    { id: 'integrations', name: 'Integrations', icon: FileText },
  ];

  const warehouses = [
    { id: 'WH-A', name: 'Main Warehouse', location: 'Building A', status: 'active' },
    { id: 'WH-B', name: 'Cold Storage', location: 'Building B', status: 'active' },
    { id: 'WH-C', name: 'Dry Storage', location: 'Building C', status: 'inactive' }
  ];

  const users = [
    { id: 1, name: 'John Smith', role: 'Production Manager', email: 'john@company.com', status: 'active' },
    { id: 2, name: 'Sarah Johnson', role: 'R&D Specialist', email: 'sarah@company.com', status: 'active' },
    { id: 3, name: 'Mike Chen', role: 'Warehouse Supervisor', email: 'mike@company.com', status: 'active' }
  ];

  const integrations = [
    {
      name: 'RMS (Inventory System)',
      status: 'connected',
      lastSync: '2025-01-01T10:30:00Z',
      description: 'Sync finished goods quantity and cost'
    },
    {
      name: 'Sales Forecasting System',
      status: 'disconnected',
      lastSync: null,
      description: 'Import sales forecast for production planning'
    },
    {
      name: 'Material Master Database',
      status: 'connected',
      lastSync: '2025-01-01T09:15:00Z',
      description: 'Import/export material master and costs'
    }
  ];

  const handleSyncMasterData = async () => {
    setSyncStatus('syncing');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (error) {
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  };

  const handleAddWarehouse = () => {
    if (!newWarehouse.name || !newWarehouse.location) {
      alert('Please fill in all required fields');
      return;
    }
    
    const warehouseId = `WH-${String.fromCharCode(65 + warehouses.length)}`;
    const warehouse = {
      ...newWarehouse,
      id: warehouseId
    };
    
    // In a real app, this would update the warehouses state
    console.log('Adding warehouse:', warehouse);
    alert('Warehouse added successfully!');
    
    setNewWarehouse({
      id: '',
      name: '',
      location: '',
      status: 'active'
    });
    setShowAddWarehouse(false);
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.role || !newUser.email) {
      alert('Please fill in all required fields');
      return;
    }
    
    const user = {
      ...newUser,
      id: users.length + 1
    };
    
    // In a real app, this would update the users state
    console.log('Adding user:', user);
    alert('User added successfully!');
    
    setNewUser({
      name: '',
      role: '',
      email: '',
      status: 'active'
    });
    setShowAddUser(false);
  };

  const handleEditWarehouse = (warehouse: any) => {
    setEditingWarehouse(warehouse);
    setNewWarehouse({
      id: warehouse.id,
      name: warehouse.name,
      location: warehouse.location,
      status: warehouse.status
    });
    setShowEditWarehouse(true);
  };

  const handleUpdateWarehouse = () => {
    if (!newWarehouse.name || !newWarehouse.location) {
      alert('Please fill in all required fields');
      return;
    }
    
    // In a real app, this would update the warehouses state
    console.log('Updating warehouse:', newWarehouse);
    alert('Warehouse updated successfully!');
    
    setNewWarehouse({
      id: '',
      name: '',
      location: '',
      status: 'active'
    });
    setEditingWarehouse(null);
    setShowEditWarehouse(false);
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setNewUser({
      name: user.name,
      role: user.role,
      email: user.email,
      status: user.status
    });
    setShowEditUser(true);
  };

  const handleUpdateUser = () => {
    if (!newUser.name || !newUser.role || !newUser.email) {
      alert('Please fill in all required fields');
      return;
    }
    
    // In a real app, this would update the users state
    console.log('Updating user:', newUser);
    alert('User updated successfully!');
    
    setNewUser({
      name: '',
      role: '',
      email: '',
      status: 'active'
    });
    setEditingUser(null);
    setShowEditUser(false);
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Settings & Master Data</h2>
      </div>

      <div className="flex space-x-6">
        {/* Sidebar */}
        <div className="w-64 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4">
            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-md text-sm font-medium ${
                      activeSection === section.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {section.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200">
          {activeSection === 'master-data' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Master Data Management</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Package className="w-6 h-6 text-[#8F262B]" />
                    <h4 className="text-md font-medium text-gray-900">Material Master</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Manage raw materials, costs, and specifications
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Materials:</span>
                      <span className="font-medium">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Updated:</span>
                      <span className="font-medium">2025-01-01</span>
                    </div>
                  </div>
                  <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                    Manage Materials
                  </button>
                  <button 
                    onClick={handleSyncMasterData}
                    disabled={syncStatus === 'syncing'}
                    className={`mt-2 w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
                      syncStatus === 'syncing' 
                        ? 'bg-gray-400 text-white cursor-not-allowed' 
                        : syncStatus === 'success'
                        ? 'bg-green-600 text-white'
                        : syncStatus === 'error'
                        ? 'bg-red-600 text-white'
                        : 'bg-orange-600 text-white hover:bg-orange-700'
                    }`}
                  >
                    <RefreshCw className={`w-4 h-4 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                    <span>
                      {syncStatus === 'syncing' ? 'Syncing...' :
                       syncStatus === 'success' ? 'Sync Complete' :
                       syncStatus === 'error' ? 'Sync Failed' :
                       'Sync Master Data'}
                    </span>
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <FileText className="w-6 h-6 text-[#8F262B]" />
                    <h4 className="text-md font-medium text-gray-900">Product Master</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Manage finished products and pricing
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Products:</span>
                      <span className="font-medium">48</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Updated:</span>
                      <span className="font-medium">2024-12-30</span>
                    </div>
                  </div>
                  <button className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
                    Manage Products
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <SettingsIcon className="w-6 h-6 text-[#8F262B]" />
                    <h4 className="text-md font-medium text-gray-900">System Configuration</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Configure system settings and preferences
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Default Currency:</span>
                      <span className="font-medium">USD</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time Zone:</span>
                      <span className="font-medium">UTC-5</span>
                    </div>
                  </div>
                  <button className="mt-4 w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700">
                    Configure System
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Database className="w-6 h-6 text-[#8F262B]" />
                    <h4 className="text-md font-medium text-gray-900">Data Import/Export</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Import and export data to external systems
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Last Import:</span>
                      <span className="font-medium">2025-01-01</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Export:</span>
                      <span className="font-medium">2024-12-31</span>
                    </div>
                  </div>
                  <button className="mt-4 w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700">
                    Manage Data
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'warehouses' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Warehouse Management</h3>
                <button 
                  onClick={() => setShowAddWarehouse(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Warehouse</span>
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {warehouses.map((warehouse) => (
                      <tr key={warehouse.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {warehouse.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {warehouse.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {warehouse.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            warehouse.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {warehouse.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => handleEditWarehouse(warehouse)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'users' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                <button 
                  onClick={() => setShowAddUser(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add User</span>
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => handleEditUser(user)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-900">Deactivate</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'integrations' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">System Integrations</h3>
              
              <div className="space-y-4">
                {integrations.map((integration, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-md font-medium text-gray-900">{integration.name}</h4>
                        <p className="text-sm text-gray-600">{integration.description}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          integration.status === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {integration.status}
                        </span>
                        <button className={`px-4 py-2 rounded-md text-sm font-medium ${
                          integration.status === 'connected' 
                            ? 'bg-red-600 text-white hover:bg-red-700' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}>
                          {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                        </button>
                      </div>
                    </div>
                    {integration.lastSync && (
                      <div className="text-sm text-gray-600">
                        Last sync: {new Date(integration.lastSync).toLocaleString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'products' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Product Master Data</h3>
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Product master data management will be integrated with the main product catalog.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Warehouse Modal */}
      {showAddWarehouse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Add New Warehouse</h3>
                <button
                  onClick={() => setShowAddWarehouse(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Warehouse Name *</label>
                <input
                  type="text"
                  value={newWarehouse.name}
                  onChange={(e) => setNewWarehouse({ ...newWarehouse, name: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter warehouse name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                <input
                  type="text"
                  value={newWarehouse.location}
                  onChange={(e) => setNewWarehouse({ ...newWarehouse, location: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter location"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={newWarehouse.status}
                  onChange={(e) => setNewWarehouse({ ...newWarehouse, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowAddWarehouse(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddWarehouse}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Add Warehouse</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Warehouse Modal */}
      {showEditWarehouse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Edit Warehouse</h3>
                <button
                  onClick={() => {
                    setShowEditWarehouse(false);
                    setEditingWarehouse(null);
                    setNewWarehouse({
                      id: '',
                      name: '',
                      location: '',
                      status: 'active'
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Warehouse ID</label>
                <input
                  type="text"
                  value={newWarehouse.id}
                  disabled
                  className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Warehouse Name *</label>
                <input
                  type="text"
                  value={newWarehouse.name}
                  onChange={(e) => setNewWarehouse({ ...newWarehouse, name: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter warehouse name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                <input
                  type="text"
                  value={newWarehouse.location}
                  onChange={(e) => setNewWarehouse({ ...newWarehouse, location: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter location"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={newWarehouse.status}
                  onChange={(e) => setNewWarehouse({ ...newWarehouse, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowEditWarehouse(false);
                    setEditingWarehouse(null);
                    setNewWarehouse({
                      id: '',
                      name: '',
                      location: '',
                      status: 'active'
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateWarehouse}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Warehouse</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Edit User</h3>
                <button
                  onClick={() => {
                    setShowEditUser(false);
                    setEditingUser(null);
                    setNewUser({
                      name: '',
                      role: '',
                      email: '',
                      status: 'active'
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Role</option>
                  <option value="Production Manager">Production Manager</option>
                  <option value="R&D Specialist">R&D Specialist</option>
                  <option value="Warehouse Supervisor">Warehouse Supervisor</option>
                  <option value="Quality Control">Quality Control</option>
                  <option value="Operations Manager">Operations Manager</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={newUser.status}
                  onChange={(e) => setNewUser({ ...newUser, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowEditUser(false);
                    setEditingUser(null);
                    setNewUser({
                      name: '',
                      role: '',
                      email: '',
                      status: 'active'
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateUser}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Update User</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Add New User</h3>
                <button
                  onClick={() => setShowAddUser(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Role</option>
                  <option value="Production Manager">Production Manager</option>
                  <option value="R&D Specialist">R&D Specialist</option>
                  <option value="Warehouse Supervisor">Warehouse Supervisor</option>
                  <option value="Quality Control">Quality Control</option>
                  <option value="Operations Manager">Operations Manager</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={newUser.status}
                  onChange={(e) => setNewUser({ ...newUser, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowAddUser(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Add User</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;