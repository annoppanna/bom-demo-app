import React, { useState } from 'react';
import { Plus, Search, Eye, Edit, CheckCircle, Clock, AlertCircle, Printer, Save, X } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateId } from '../utils/generateId';
import type { ProductionOrder, ProductionMaterial, OutputProduct } from '../types';

const ProductionOrders = () => {
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [editingOrder, setEditingOrder] = useState<ProductionOrder | null>(null);
  const [viewingOrder, setViewingOrder] = useState<ProductionOrder | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [productionOrders, setProductionOrders] = useLocalStorage<ProductionOrder[]>('productionOrders', [
    {
      id: 'PO-001',
      productName: 'White Bread',
      productionType: 'Build to Sell',
      quantity: 500,
      unit: 'loaves',
      status: 'in-progress',
      progress: 75,
      plannedStart: '2025-01-01T08:00:00Z',
      estimatedEnd: '2025-01-01T16:00:00Z',
      actualStart: '2025-01-01T08:15:00Z',
      materials: [
        { name: 'Flour Type 1', required: 200, used: 150, unit: 'kg' },
        { name: 'Sugar', required: 50, used: 37.5, unit: 'kg' },
        { name: 'Yeast', required: 5, used: 3.75, unit: 'kg' }
      ],
      yield: {
        expected: 500,
        actual: 375,
        percentage: 75
      },
      loss: {
        expected: 0,
        actual: 12,
        percentage: 2.4
      }
    },
    {
      id: 'PO-002',
      productName: 'Fish Fillet',
      productionType: 'Break to Sell',
      quantity: 100,
      unit: 'kg',
      status: 'completed',
      progress: 100,
      plannedStart: '2024-12-31T10:00:00Z',
      estimatedEnd: '2024-12-31T14:00:00Z',
      actualStart: '2024-12-31T10:00:00Z',
      actualEnd: '2024-12-31T13:45:00Z',
      materials: [
        { name: 'Fresh Salmon', required: 120, used: 120, unit: 'kg' }
      ],
      yield: {
        expected: 100,
        actual: 95,
        percentage: 95
      },
      loss: {
        expected: 20,
        actual: 25,
        percentage: 20.8
      },
      products: [
        { name: 'Salmon Fillet', quantity: 75, unit: 'kg' },
        { name: 'Salmon Head', quantity: 15, unit: 'kg' },
        { name: 'Salmon Bones', quantity: 5, unit: 'kg' }
      ]
    }
  ]);

  const [newOrder, setNewOrder] = useState<Partial<ProductionOrder>>({
    productName: '',
    productionType: 'Build to Sell',
    quantity: 0,
    unit: 'pieces',
    status: 'pending',
    progress: 0,
    plannedStart: '',
    estimatedEnd: '',
    materials: [],
    yield: { expected: 0, actual: 0, percentage: 0 },
    loss: { expected: 0, actual: 0, percentage: 0 }
  });

  const [newMaterial, setNewMaterial] = useState<Partial<ProductionMaterial>>({
    name: '',
    required: 0,
    used: 0,
    unit: 'kg'
  });

  const [newProduct, setNewProduct] = useState<Partial<OutputProduct>>({
    name: '',
    quantity: 0,
    unit: 'kg'
  });

  const filteredOrders = productionOrders.filter(order =>
    order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-[#8F262B]" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-[#8F262B]" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-[#8F262B]" />;
      default:
        return <Clock className="w-5 h-5 text-[#8F262B]" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateOrder = () => {
    // if (!newOrder.productName || !newOrder.quantity) return;

    const order: ProductionOrder = {
      id: generateId('PO'),
      productName: newOrder.productName ??generateId('NOP'),
      productionType: newOrder.productionType ?? 'Build to Sell',
      quantity: newOrder.quantity ?? 1,
      unit: newOrder.unit || 'pieces',
      status: 'pending',
      progress: 0,
      plannedStart: newOrder.plannedStart || new Date().toISOString(),
      estimatedEnd: newOrder.estimatedEnd || new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      materials: newOrder.materials || [],
      yield: { expected: newOrder.quantity, actual: 0, percentage: 0 },
      loss: { expected: 0, actual: 0, percentage: 0 },
      products: newOrder.products || []
    };

    setProductionOrders([...productionOrders, order]);
    resetNewOrder();
    setShowCreateOrder(false);
  };

  const handleUpdateOrder = () => {
    // if (!editingOrder || !newOrder.productName || !newOrder.quantity) return;

    const updatedOrder: ProductionOrder = {
      ...editingOrder,
      productName: newOrder.productName??generateId('NOP'),
      productionType: newOrder.productionType || 'Build to Sell',
      quantity: newOrder.quantity ?? 1,
      unit: newOrder.unit || 'pieces',
      plannedStart: newOrder.plannedStart || editingOrder.plannedStart,
      estimatedEnd: newOrder.estimatedEnd || editingOrder.estimatedEnd,
      materials: newOrder.materials || [],
      products: newOrder.products || []
    };

    setProductionOrders(productionOrders.map(order => 
      order.id === editingOrder.id ? updatedOrder : order
    ));
    setEditingOrder(null);
    resetNewOrder();
    setShowCreateOrder(false);
  };

  const handleUpdateOrderStatus = (id: string, status: ProductionOrder['status'], progress?: number) => {
    setProductionOrders(productionOrders.map(order => {
      if (order.id === id) {
        const updatedOrder = { ...order, status };
        if (progress !== undefined) {
          updatedOrder.progress = progress;
        }
        if (status === 'in-progress' && !order.actualStart) {
          updatedOrder.actualStart = new Date().toISOString();
        }
        if (status === 'completed') {
          updatedOrder.progress = 100;
          updatedOrder.actualEnd = new Date().toISOString();
        }
        return updatedOrder;
      }
      return order;
    }));
  };

  const handleDeleteOrder = (id: string) => {
    if (confirm('Are you sure you want to delete this production order?')) {
      setProductionOrders(productionOrders.filter(order => order.id !== id));
    }
  };

  const handleAddMaterial = () => {
    // if (!newMaterial.name || !newMaterial.required) return;

    const material: ProductionMaterial = {
      name:`p-${newOrder.materials.length + 1}`,
      required: 1,
      used: 10,
      unit: newMaterial.unit || 'kg'
    };

    setNewOrder({
      ...newOrder,
      materials: [...(newOrder.materials || []), material]
    });

    setNewMaterial({
      name: '',
      required: 0,
      used: 0,
      unit: 'kg'
    });
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.quantity) return;

    const product: OutputProduct = {
      name: newProduct.name,
      quantity: newProduct.quantity,
      unit: newProduct.unit || 'kg'
    };

    setNewOrder({
      ...newOrder,
      products: [...(newOrder.products || []), product]
    });

    setNewProduct({
      name: '',
      quantity: 0,
      unit: 'kg'
    });
  };

  const resetNewOrder = () => {
    setNewOrder({
      productName: '',
      productionType: 'Build to Sell',
      quantity: 0,
      unit: 'pieces',
      status: 'pending',
      progress: 0,
      plannedStart: '',
      estimatedEnd: '',
      materials: [],
      yield: { expected: 0, actual: 0, percentage: 0 },
      loss: { expected: 0, actual: 0, percentage: 0 }
    });
  };

  const handleEditOrder = (order: ProductionOrder) => {
    setEditingOrder(order);
    setNewOrder({
      productName: order.productName,
      productionType: order.productionType,
      quantity: order.quantity,
      unit: order.unit,
      plannedStart: order.plannedStart,
      estimatedEnd: order.estimatedEnd,
      materials: order.materials,
      products: order.products
    });
    setShowCreateOrder(true);
  };

  const CreateOrderModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingOrder ? 'Edit Production Order' : 'Create Production Order'}
            </h3>
            <button
              onClick={() => {
                setShowCreateOrder(false);
                setEditingOrder(null);
                resetNewOrder();
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Production Type</label>
              <select
                value={newOrder.productionType}
                onChange={(e) => setNewOrder({ ...newOrder, productionType: e.target.value as 'Build to Sell' | 'Break to Sell' })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Build to Sell">Build to Sell</option>
                <option value="Break to Sell">Break to Sell</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Planned Quantity</label>
              <input
                type="number"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter quantity"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
              <select
                value={newOrder.unit}
                onChange={(e) => setNewOrder({ ...newOrder, unit: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pieces">pieces</option>
                <option value="kg">kg</option>
                <option value="loaves">loaves</option>
                <option value="liters">liters</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Planned Start Date</label>
              <input
                type="datetime-local"
                value={newOrder.plannedStart ? new Date(newOrder.plannedStart).toISOString().slice(0, 16) : ''}
                onChange={(e) => setNewOrder({ ...newOrder, plannedStart: e.target.value ? new Date(e.target.value).toISOString() : '' })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estimated End Date</label>
              <input
                type="datetime-local"
                value={newOrder.estimatedEnd ? new Date(newOrder.estimatedEnd).toISOString().slice(0, 16) : ''}
                onChange={(e) => setNewOrder({ ...newOrder, estimatedEnd: e.target.value ? new Date(e.target.value).toISOString() : '' })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Material Requirements</h4>
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Material</label>
                  <input
                    type="text"
                  
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Material name"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Required Qty</label>
                  <input
                    type="number"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Unit</label>
                  <select
                    value={newMaterial.unit}
                    onChange={(e) => setNewMaterial({ ...newMaterial, unit: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="l">l</option>
                    <option value="ml">ml</option>
                    <option value="pieces">pieces</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleAddMaterial}
                    className="w-full bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {newOrder.materials && newOrder.materials.length > 0 && (
              <div className="mt-4">
                <h5 className="font-medium text-gray-900 mb-2">Added Materials</h5>
                <div className="space-y-2">
                  {newOrder.materials.map((material, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="font-medium">{material.name}</span>
                      <span className="text-sm text-gray-600">
                        {material.required} {material.unit}
                      </span>
                      <button
                        onClick={() => {
                          const updatedMaterials = newOrder.materials?.filter((_, i) => i !== index) || [];
                          setNewOrder({ ...newOrder, materials: updatedMaterials });
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {newOrder.productionType === 'Break to Sell' && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Output Products</h4>
              <div className="space-y-3">
                <div className="grid grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Product Name</label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      placeholder="Product name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Expected Qty</label>
                    <input
                      type="number"
                      value={newProduct.quantity}
                      onChange={(e) => setNewProduct({ ...newProduct, quantity: parseFloat(e.target.value) || 0 })}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Unit</label>
                    <select
                      value={newProduct.unit}
                      onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    >
                      <option value="kg">kg</option>
                      <option value="pieces">pieces</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleAddProduct}
                      className="w-full bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {newOrder.products && newOrder.products.length > 0 && (
                <div className="mt-4">
                  <h5 className="font-medium text-gray-900 mb-2">Expected Products</h5>
                  <div className="space-y-2">
                    {newOrder.products.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="font-medium">{product.name}</span>
                        <span className="text-sm text-gray-600">
                          {product.quantity} {product.unit}
                        </span>
                        <button
                          onClick={() => {
                            const updatedProducts = newOrder.products?.filter((_, i) => i !== index) || [];
                            setNewOrder({ ...newOrder, products: updatedProducts });
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                setShowCreateOrder(false);
                setEditingOrder(null);
                resetNewOrder();
              }}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={editingOrder ? handleUpdateOrder : handleCreateOrder}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{editingOrder ? 'Update' : 'Create'} Order</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ViewOrderModal = () => (
    viewingOrder && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Production Order Details</h3>
              <button
                onClick={() => setViewingOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Order Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span>{viewingOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Product:</span>
                    <span>{viewingOrder.productName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span>{viewingOrder.productionType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quantity:</span>
                    <span>{viewingOrder.quantity} {viewingOrder.unit}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Timeline</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Planned Start:</span>
                    <span>{new Date(viewingOrder.plannedStart).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated End:</span>
                    <span>{new Date(viewingOrder.estimatedEnd).toLocaleString()}</span>
                  </div>
                  {viewingOrder.actualStart && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Actual Start:</span>
                      <span>{new Date(viewingOrder.actualStart).toLocaleString()}</span>
                    </div>
                  )}
                  {viewingOrder.actualEnd && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Actual End:</span>
                      <span>{new Date(viewingOrder.actualEnd).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Materials Used</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Material</th>
                      <th className="px-4 py-2 text-left">Required</th>
                      <th className="px-4 py-2 text-left">Used</th>
                      <th className="px-4 py-2 text-left">Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewingOrder.materials.map((material, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2">{material.name}</td>
                        <td className="px-4 py-2">{material.required}</td>
                        <td className="px-4 py-2">{material.used}</td>
                        <td className="px-4 py-2">{material.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {viewingOrder.products && viewingOrder.products.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Output Products</h4>
                <div className="grid grid-cols-3 gap-4">
                  {viewingOrder.products.map((product, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg">
                      <div className="font-medium text-sm">{product.name}</div>
                      <div className="text-xs text-gray-600">{product.quantity} {product.unit}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Production Orders</h2>
        <button
          onClick={() => setShowCreateOrder(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Order</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Production Orders</h3>
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredOrders.map((order) => (
            <div key={order.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(order.status)}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{order.id}</h4>
                    <p className="text-sm text-gray-600">{order.productName} ({order.productionType})</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                    {order.status.replace('-', ' ').toUpperCase()}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setViewingOrder(order)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditOrder(order)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Details */}
                <div className="space-y-3">
                  <h5 className="font-medium text-gray-900">Order Details</h5>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quantity:</span>
                      <span>{order.quantity} {order.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Planned Start:</span>
                      <span>{new Date(order.plannedStart).toLocaleDateString()}</span>
                    </div>
                    {order.actualStart && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Actual Start:</span>
                        <span>{new Date(order.actualStart).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  
                  {order.status === 'in-progress' && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{order.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#8F262B] h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${order.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Materials */}
                <div className="space-y-3">
                  <h5 className="font-medium text-gray-900">Materials</h5>
                  <div className="space-y-2">
                    {order.materials.map((material, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">{material.name}:</span>
                        <span>{material.used}/{material.required} {material.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Yield & Loss */}
                <div className="space-y-3">
                  <h5 className="font-medium text-gray-900">Yield & Loss</h5>
                  <div className="space-y-2">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-700 font-medium">Yield:</span>
                        <span className="text-green-700">{order.yield.percentage}%</span>
                      </div>
                      <div className="text-xs text-green-600 mt-1">
                        {order.yield.actual}/{order.yield.expected} units
                      </div>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span className="text-red-700 font-medium">Loss:</span>
                        <span className="text-red-700">{order.loss.percentage}%</span>
                      </div>
                      <div className="text-xs text-red-600 mt-1">
                        {order.loss.actual} units lost
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {order.productionType === 'Break to Sell' && order.products && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h5 className="font-medium text-gray-900 mb-3">Output Products</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {order.products.map((product, index) => (
                      <div key={index} className="p-3 border border-gray-200 rounded-lg">
                        <div className="font-medium text-sm">{product.name}</div>
                        <div className="text-xs text-gray-600">{product.quantity} {product.unit}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex space-x-4">
                  {order.status === 'pending' && (
                    <button
                      onClick={() => handleUpdateOrderStatus(order.id, 'in-progress')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Start Production
                    </button>
                  )}
                  {order.status === 'in-progress' && (
                    <>
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                      >
                        Complete Order
                      </button>
                      <button
                        onClick={() => {
                          const progress = prompt('Enter progress percentage (0-100):', order.progress.toString());
                          if (progress !== null) {
                            const progressNum = Math.max(0, Math.min(100, parseInt(progress) || 0));
                            handleUpdateOrderStatus(order.id, 'in-progress', progressNum);
                          }
                        }}
                        className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
                      >
                        Update Progress
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className="text-red-600 hover:text-red-800 px-4 py-2"
                  >
                    Delete Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCreateOrder && <CreateOrderModal />}
      {viewingOrder && <ViewOrderModal />}
    </div>
  );
};

export default ProductionOrders;