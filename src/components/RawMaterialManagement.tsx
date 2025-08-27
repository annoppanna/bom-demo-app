import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Package, Warehouse, AlertTriangle, Save, X, Eye, ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateId } from '../utils/generateId';
import type { Material, MaterialRequest, MaterialRequestItem } from '../types';

const RawMaterialManagement = () => {
  const [activeTab, setActiveTab] = useState('materials');
  const [showMaterialRequest, setShowMaterialRequest] = useState(false);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [productionOrder, setProductionOrder] = useState("");
  const [viewingMaterial, setViewingMaterial] = useState<Material | null>(null);
  
  const [materials, setMaterials] = useLocalStorage<Material[]>('materials', [
    {
      id: 'RM001',
      name: 'Flour Type 1',
      category: 'Baking',
      unit: 'kg',
      costPerUnit: 2.50,
      currentStock: 120,
      minimumStock: 200,
      warehouse: 'WH-A',
      status: 'low',
      yieldPercentage: 95.0,
      lossPercentage: 5.0
    },
    {
      id: 'RM002',
      name: 'Fresh Salmon',
      category: 'Seafood',
      unit: 'kg',
      costPerUnit: 25.00,
      currentStock: 45,
      minimumStock: 50,
      warehouse: 'WH-B',
      status: 'critical',
      yieldPercentage: 75.0,
      lossPercentage: 25.0
    },
    {
      id: 'RM003',
      name: 'Sugar',
      category: 'Baking',
      unit: 'kg',
      costPerUnit: 1.80,
      currentStock: 380,
      minimumStock: 100,
      warehouse: 'WH-A',
      status: 'good',
      yieldPercentage: 98.0,
      lossPercentage: 2.0
    },
  ]);

  const [materialRequests, setMaterialRequests] = useLocalStorage<MaterialRequest[]>('materialRequests', [
    {
      id: 'MR001',
      productionOrder: 'PO-001',
      requestedBy: 'John Smith',
      status: 'pending',
      warehouse: 'WH-A',
      items: [
        { material: 'Flour Type 1', requested: 50, available: 120 },
        { material: 'Sugar', requested: 20, available: 380 }
      ],
      createdAt: '2025-01-01T10:30:00Z'
    }
  ]);

  const [newMaterial, setNewMaterial] = useState<Partial<Material>>({
    name: '',
    category: '',
    unit: 'kg',
    costPerUnit: 0,
    currentStock: 0,
    minimumStock: 0,
    warehouse: 'WH-A',
    status: 'good',
    yieldPercentage: 95.0,
    lossPercentage: 5.0
  });

  const [newRequest, setNewRequest] = useState<Partial<MaterialRequest>>({
    productionOrder: '',
    requestedBy: 'Current User',
    warehouse: 'WH-A',
    items: []
  });

  const [newRequestItem, setNewRequestItem] = useState<Partial<MaterialRequestItem>>({
    material: '',
    requested: 0,
    available: 0,
    unit: 'kg'
  });

  const filteredMaterials = materials.filter(material =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusFromStock = (current: number, minimum: number): Material['status'] => {
    if (current <= minimum * 0.5) return 'critical';
    if (current <= minimum) return 'low';
    return 'good';
  };

  const handleAddMaterial = () => {
    if (!newMaterial.name || !newMaterial.category) return;

    const material: Material = {
      id: generateId('RM'),
      name: newMaterial.name,
      category: newMaterial.category,
      unit: newMaterial.unit || 'kg',
      costPerUnit: newMaterial.costPerUnit || 0,
      currentStock: newMaterial.currentStock || 0,
      minimumStock: newMaterial.minimumStock || 0,
      warehouse: newMaterial.warehouse || 'WH-A',
      status: getStatusFromStock(newMaterial.currentStock || 0, newMaterial.minimumStock || 0)
    };

    setMaterials([...materials, material]);
    setNewMaterial({
      name: '',
      category: '',
      unit: 'kg',
      costPerUnit: 0,
      currentStock: 0,
      minimumStock: 0,
      warehouse: 'WH-A',
      status: 'good'
    });
    setShowAddMaterial(false);
  };

  const handleEditMaterial = (material: Material) => {
    setEditingMaterial(material);
    setNewMaterial(material);
    setShowAddMaterial(true);
  };

  const handleUpdateMaterial = () => {
    if (!editingMaterial || !newMaterial.name || !newMaterial.category) return;

    const updatedMaterial: Material = {
      ...editingMaterial,
      name: newMaterial.name,
      category: newMaterial.category,
      unit: newMaterial.unit || 'kg',
      costPerUnit: newMaterial.costPerUnit || 0,
      currentStock: newMaterial.currentStock || 0,
      minimumStock: newMaterial.minimumStock || 0,
      warehouse: newMaterial.warehouse || 'WH-A',
      status: getStatusFromStock(newMaterial.currentStock || 0, newMaterial.minimumStock || 0)
    };

    setMaterials(materials.map(m => m.id === editingMaterial.id ? updatedMaterial : m));
    setEditingMaterial(null);
    setNewMaterial({
      name: '',
      category: '',
      unit: 'kg',
      costPerUnit: 0,
      currentStock: 0,
      minimumStock: 0,
      warehouse: 'WH-A',
      status: 'good'
    });
    setShowAddMaterial(false);
  };

  const handleDeleteMaterial = (id: string) => {
    if (confirm('Are you sure you want to delete this material?')) {
      setMaterials(materials.filter(m => m.id !== id));
    }
  };

  const handleAddRequestItem = () => {
    if (!newRequestItem.material || !newRequestItem.requested || newRequestItem.requested <= 0) {
      alert('Please select a material and enter a valid quantity.');
      return;
    }

    const material = materials.find(m => m.name === newRequestItem.material);
    const item: MaterialRequestItem = {
      material: newRequestItem.material || '',
      requested: newRequestItem.requested || 0,
      available: material?.currentStock || 0,
      unit: material?.unit || 'kg'
    };

    setNewRequest({
      ...newRequest,
      items: [...(newRequest.items || []), item]
    });

    setNewRequestItem({
      material: '',
      requested: 0,
      available: 0,
      unit: 'kg'
    });
    
    alert('Material added to request!');
  };

  const handleCreateRequest = () => {
    // if (!newRequest.productionOrder || !newRequest.items || newRequest.items.length === 0) {
    //   alert('Please enter a production order and add at least one material item.');
    //   return;
    // }

    const request: MaterialRequest = {
      id: generateId('MR'),
      productionOrder: newRequest.productionOrder || '',
      requestedBy: newRequest.requestedBy || 'Current User',
      status: 'pending',
      warehouse: newRequest.warehouse || 'WH-A',
      items: newRequest.items || [],
      createdAt: new Date().toISOString()
    };

    setMaterialRequests([...materialRequests, request]);
    
    // Reset form
    setNewRequest({
      productionOrder: '',
      requestedBy: 'Current User',
      warehouse: 'WH-A',
      items: []
    });
    
    alert('Material request created successfully!');
    setShowMaterialRequest(false);
  };

  const handleUpdateRequestStatus = (id: string, status: MaterialRequest['status']) => {
    setMaterialRequests(materialRequests.map(req => 
      req.id === id ? { ...req, status } : req
    ));
  };

  const handleDeleteRequest = (id: string) => {
    if (confirm('Are you sure you want to delete this request?')) {
      setMaterialRequests(materialRequests.filter(req => req.id !== id));
    }
  };

  const MaterialDetailView = () => {
    if (!viewingMaterial) return null;

    const yieldLossHistory = [
      { date: '2025-01-01', batch: 'B001', yield: 94.2, loss: 5.8, quantity: 100 },
      { date: '2024-12-30', batch: 'B002', yield: 95.8, loss: 4.2, quantity: 150 },
      { date: '2024-12-29', batch: 'B003', yield: 93.5, loss: 6.5, quantity: 120 },
      { date: '2024-12-28', batch: 'B004', yield: 96.1, loss: 3.9, quantity: 200 },
      { date: '2024-12-27', batch: 'B005', yield: 94.7, loss: 5.3, quantity: 180 }
    ];

    const avgYield = yieldLossHistory.reduce((sum, item) => sum + item.yield, 0) / yieldLossHistory.length;
    const avgLoss = yieldLossHistory.reduce((sum, item) => sum + item.loss, 0) / yieldLossHistory.length;

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setViewingMaterial(null)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Materials</span>
          </button>
          <h2 className="text-2xl font-bold text-gray-900">{viewingMaterial.name} - Details</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Material Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Material Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">ID:</span>
                <span className="font-medium">{viewingMaterial.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium">{viewingMaterial.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Unit:</span>
                <span className="font-medium">{viewingMaterial.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cost per Unit:</span>
                <span className="font-medium">${viewingMaterial.costPerUnit.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Warehouse:</span>
                <span className="font-medium">{viewingMaterial.warehouse}</span>
              </div>
            </div>
          </div>

          {/* Stock Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Current Stock:</span>
                <span className="font-medium">{viewingMaterial.currentStock} {viewingMaterial.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Minimum Stock:</span>
                <span className="font-medium">{viewingMaterial.minimumStock} {viewingMaterial.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  viewingMaterial.status === 'critical' ? 'bg-red-100 text-red-800' :
                  viewingMaterial.status === 'low' ? 'bg-orange-100 text-orange-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {viewingMaterial.status === 'critical' ? 'Critical' :
                   viewingMaterial.status === 'low' ? 'Low Stock' : 'Good'}
                </span>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Stock Level</span>
                  <span>{((viewingMaterial.currentStock / viewingMaterial.minimumStock) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      viewingMaterial.status === 'critical' ? 'bg-red-500' :
                      viewingMaterial.status === 'low' ? 'bg-orange-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(100, (viewingMaterial.currentStock / viewingMaterial.minimumStock) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Yield & Loss Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Yield & Loss Summary</h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-700 font-medium">Expected Yield</span>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-900">
                  {viewingMaterial.yieldPercentage?.toFixed(1) || '95.0'}%
                </div>
                <div className="text-sm text-green-600 mt-1">
                  Actual Avg: {avgYield.toFixed(1)}%
                </div>
              </div>
              
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-red-700 font-medium">Expected Loss</span>
                  <TrendingDown className="w-4 h-4 text-red-600" />
                </div>
                <div className="text-2xl font-bold text-red-900">
                  {viewingMaterial.lossPercentage?.toFixed(1) || '5.0'}%
                </div>
                <div className="text-sm text-red-600 mt-1">
                  Actual Avg: {avgLoss.toFixed(1)}%
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-700 font-medium mb-1">Variance</div>
                <div className="text-sm text-blue-600">
                  Yield: {(avgYield - (viewingMaterial.yieldPercentage || 95)).toFixed(1)}%
                </div>
                <div className="text-sm text-blue-600">
                  Loss: {(avgLoss - (viewingMaterial.lossPercentage || 5)).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Historical Data */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Yield & Loss History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yield %</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loss %</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variance</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {yieldLossHistory.map((record, index) => {
                  const yieldVariance = record.yield - (viewingMaterial.yieldPercentage || 95);
                  const lossVariance = record.loss - (viewingMaterial.lossPercentage || 5);
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {record.batch}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.quantity} {viewingMaterial.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-green-600">
                          {record.yield.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-red-600">
                          {record.loss.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="space-y-1">
                          <div className={`${yieldVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            Y: {yieldVariance > 0 ? '+' : ''}{yieldVariance.toFixed(1)}%
                          </div>
                          <div className={`${lossVariance <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            L: {lossVariance > 0 ? '+' : ''}{lossVariance.toFixed(1)}%
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cost Impact Analysis */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Cost Impact Analysis</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  ${(viewingMaterial.costPerUnit * (avgLoss / 100) * 1000).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Avg Loss Cost per 1000 {viewingMaterial.unit}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${(viewingMaterial.costPerUnit / (avgYield / 100)).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Effective Cost per {viewingMaterial.unit}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {((avgYield / (viewingMaterial.yieldPercentage || 95)) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Efficiency vs Expected
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MaterialForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingMaterial ? 'Edit Material' : 'Add New Material'}
            </h3>
            <button
              onClick={() => {
                setShowAddMaterial(false);
                setEditingMaterial(null);
                setNewMaterial({
                  name: '',
                  category: '',
                  unit: 'kg',
                  costPerUnit: 0,
                  currentStock: 0,
                  minimumStock: 0,
                  warehouse: 'WH-A',
                  status: 'good'
                });
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Material Name</label>
              <input
                type="text"
                value={newMaterial.name}
                onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter material name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <input
                type="text"
                value={newMaterial.category}
                onChange={(e) => setNewMaterial({ ...newMaterial, category: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter category"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
              <select
                value={newMaterial.unit}
                onChange={(e) => setNewMaterial({ ...newMaterial, unit: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="l">l</option>
                <option value="ml">ml</option>
                <option value="pieces">pieces</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cost per Unit</label>
              <input
                type="number"
                step="0.01"
                value={newMaterial.costPerUnit}
                onChange={(e) => setNewMaterial({ ...newMaterial, costPerUnit: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Warehouse</label>
              <select
                value={newMaterial.warehouse}
                onChange={(e) => setNewMaterial({ ...newMaterial, warehouse: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="WH-A">WH-A - Main Warehouse</option>
                <option value="WH-B">WH-B - Cold Storage</option>
                <option value="WH-C">WH-C - Dry Storage</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Stock</label>
              <input
                type="number"
                value={newMaterial.currentStock}
                onChange={(e) => setNewMaterial({ ...newMaterial, currentStock: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Stock</label>
              <input
                type="number"
                value={newMaterial.minimumStock}
                onChange={(e) => setNewMaterial({ ...newMaterial, minimumStock: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expected Yield %</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={newMaterial.yieldPercentage}
                onChange={(e) => setNewMaterial({ ...newMaterial, yieldPercentage: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="95.0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expected Loss %</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={newMaterial.lossPercentage}
                onChange={(e) => setNewMaterial({ ...newMaterial, lossPercentage: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="5.0"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                setShowAddMaterial(false);
                setEditingMaterial(null);
                setNewMaterial({
                  name: '',
                  category: '',
                  unit: 'kg',
                  costPerUnit: 0,
                  currentStock: 0,
                  minimumStock: 0,
                  warehouse: 'WH-A',
                  status: 'good'
                });
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={editingMaterial ? handleUpdateMaterial : handleAddMaterial}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{editingMaterial ? 'Update' : 'Add'} Material</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const MaterialRequestForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Create Material Request</h3>
            <button
              onClick={() => {
                setShowMaterialRequest(false);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Production Order
              </label>
              <input
                type="text"
                value={newRequest.productionOrder || ''}
                onChange={(e) => setNewRequest({ ...newRequest, productionOrder: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="PO-001"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Warehouse</label>
              <select
                value={newRequest.warehouse}
                onChange={(e) => setNewRequest({ ...newRequest, warehouse: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="WH-A">WH-A - Main Warehouse</option>
                <option value="WH-B">WH-B - Cold Storage</option>
              </select>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Add Material</h4>
            <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <select
                  value={newRequestItem.material}
                  onChange={(e) => {
                    const material = materials.find(m => m.name === e.target.value);
                    setNewRequestItem({
                      ...newRequestItem,
                      material: e.target.value,
                      available: material?.currentStock || 0,
                      unit: material?.unit || 'kg'
                    });
                  }}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Material</option>
                  {materials.map(material => (
                    <option key={material.id} value={material.name}>{material.name}</option>
                  ))}
                </select>
              </div>
              <div className="w-32">
                <input
                  type="number"
                  placeholder="Quantity"
                  value={newRequestItem.requested || ''}
                  onChange={(e) => setNewRequestItem({ ...newRequestItem, requested: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="text-sm text-gray-600">
                Available: {newRequestItem.available} {newRequestItem.unit}
              </div>
              <button
                onClick={handleAddRequestItem}
                className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {newRequest.items && newRequest.items.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Requested Materials</h4>
              <div className="space-y-2">
                {newRequest.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="font-medium">{item.material}</span>
                    <div className="text-sm text-gray-600">
                      Requested: {item.requested} {item.unit} | Available: {item.available} {item.unit}
                    </div>
                    <button
                      onClick={() => {
                        const updatedItems = newRequest.items?.filter((_, i) => i !== index) || [];
                        setNewRequest({ ...newRequest, items: updatedItems });
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                setShowMaterialRequest(false);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateRequest}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {viewingMaterial ? (
        <MaterialDetailView />
      ) : (
        <>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Raw Material Management</h2>
        <button
          onClick={() => setShowMaterialRequest(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Material Request</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'materials', name: 'Materials Master', icon: Package },
            { id: 'requests', name: 'Material Requests', icon: Warehouse },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {activeTab === 'materials' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Raw Materials</h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search materials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={() => setShowAddMaterial(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Material</span>
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost/Unit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouse</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMaterials.map((material) => (
                  <tr key={material.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">{material.name}</div>
                        <div className="text-sm text-gray-500">{material.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{material.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${material.costPerUnit.toFixed(2)}/{material.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {material.currentStock} {material.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {material.minimumStock} {material.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{material.warehouse}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        material.status === 'critical' ? 'bg-red-100 text-red-800' :
                        material.status === 'low' ? 'bg-orange-100 text-orange-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {material.status === 'critical' && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {material.status === 'critical' ? 'Critical' :
                         material.status === 'low' ? 'Low Stock' : 'Good'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setViewingMaterial(material)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditMaterial(material)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMaterial(material.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Material Requests</h3>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {materialRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{request.id}</h4>
                      <p className="text-sm text-gray-600">
                        Production Order: {request.productionOrder} | Requested by: {request.requestedBy}
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                      request.status === 'completed' ? 'bg-green-100 text-green-800' :
                      request.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {request.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="font-medium">{item.material}</span>
                        <div className="text-sm text-gray-600">
                          Requested: {item.requested} | Available: {item.available}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
                    {request.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateRequestStatus(request.id, 'approved')}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                          Approve Request
                        </button>
                        <button
                          onClick={() => handleUpdateRequestStatus(request.id, 'cancelled')}
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                        >
                          Cancel Request
                        </button>
                      </>
                    )}
                    {request.status === 'approved' && (
                      <button
                        onClick={() => handleUpdateRequestStatus(request.id, 'completed')}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                      >
                        Mark Complete
                      </button>
                    )}
                    <button
                      onClick={() => window.print()}
                      className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                    >
                      Print Slip
                    </button>
                    <button
                      onClick={() => handleDeleteRequest(request.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showAddMaterial && <MaterialForm />}
      {showMaterialRequest && <MaterialRequestForm />}
        </>
      )}
    </div>
  );
};

export default RawMaterialManagement;