import React, { useState } from 'react';
import { Calendar, Download, Plus, Search, Filter, X, Save } from 'lucide-react';

const Planning = () => {
  const [activeTab, setActiveTab] = useState('daily');
  const [selectedDate, setSelectedDate] = useState('2025-01-01');
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [newPlan, setNewPlan] = useState({
    product: '',
    plannedQuantity: 0,
    unit: 'pieces',
    priority: 'medium',
    startTime: '08:00',
    endTime: '16:00',
    materials: []
  });
  const [newMaterial, setNewMaterial] = useState({
    name: '',
    required: 0,
    unit: 'kg'
  });

  const dailyPlan = [
    {
      id: 'DP-001',
      product: 'White Bread',
      plannedQuantity: 500,
      unit: 'loaves',
      priority: 'high',
      estimatedDuration: '8 hours',
      requiredMaterials: [
        { name: 'Flour Type 1', required: 200, available: 120, unit: 'kg', status: 'shortage' },
        { name: 'Sugar', required: 50, available: 380, unit: 'kg', status: 'available' },
        { name: 'Yeast', required: 5, available: 12, unit: 'kg', status: 'available' }
      ],
      startTime: '08:00',
      endTime: '16:00'
    },
    {
      id: 'DP-002',
      product: 'Croissant',
      plannedQuantity: 300,
      unit: 'pieces',
      priority: 'medium',
      estimatedDuration: '6 hours',
      requiredMaterials: [
        { name: 'Flour Type 1', required: 120, available: 120, unit: 'kg', status: 'shortage' },
        { name: 'Butter', required: 80, available: 95, unit: 'kg', status: 'available' }
      ],
      startTime: '10:00',
      endTime: '16:00'
    }
  ];

  const weeklyPlan = [
    { day: 'Monday', plans: 3, totalQuantity: 800 },
    { day: 'Tuesday', plans: 2, totalQuantity: 600 },
    { day: 'Wednesday', plans: 4, totalQuantity: 950 },
    { day: 'Thursday', plans: 3, totalQuantity: 700 },
    { day: 'Friday', plans: 5, totalQuantity: 1200 },
    { day: 'Saturday', plans: 2, totalQuantity: 400 },
    { day: 'Sunday', plans: 1, totalQuantity: 200 }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-green-600';
      case 'shortage':
        return 'text-red-600';
      case 'warning':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Production Planning</h2>
        <div className="flex items-center space-x-4">
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export to Excel</span>
          </button>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Plan</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'daily', name: 'Daily Planning' },
            { id: 'weekly', name: 'Weekly Overview' },
            { id: 'forecast', name: 'Sales Forecast' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'daily' && (
        <div className="space-y-6">
          {/* Date Selector and Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>

          {/* Daily Plans */}
          <div className="space-y-4">
            {dailyPlan.map((plan) => (
              <div key={plan.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900">{plan.product}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(plan.priority)}`}>
                          {plan.priority} priority
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {plan.plannedQuantity} {plan.unit} • {plan.estimatedDuration} • {plan.startTime} - {plan.endTime}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Plan ID</div>
                      <div className="font-medium">{plan.id}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Required Materials</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {plan.requiredMaterials.map((material, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-sm">{material.name}</h5>
                            <span className={`text-xs font-medium ${getStatusColor(material.status)}`}>
                              {material.status === 'available' ? '✓' : '⚠'}
                            </span>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex justify-between">
                              <span>Required:</span>
                              <span>{material.required} {material.unit}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Available:</span>
                              <span className={getStatusColor(material.status)}>
                                {material.available} {material.unit}
                              </span>
                            </div>
                            {material.status === 'shortage' && (
                              <div className="text-xs text-red-600 mt-2">
                                Shortage: {material.required - material.available} {material.unit}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                    <div className="flex space-x-4">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                        Create Production Order
                      </button>
                      <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">
                        Edit Plan
                      </button>
                    </div>
                    <div className="text-sm text-gray-500">
                      Auto-calculated materials based on formula
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'weekly' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Production Overview</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {weeklyPlan.map((day, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">{day.day}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plans:</span>
                      <span className="font-medium">{day.plans}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Qty:</span>
                      <span className="font-medium">{day.totalQuantity}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="h-20 bg-gray-50 rounded flex items-center justify-center">
                      <div 
                        className="bg-[#8F262B] rounded w-full"
                        style={{ 
                          height: `${(day.totalQuantity / 1200) * 100}%`,
                          minHeight: '4px'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'forecast' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Sales Forecast Integration</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Import Forecast
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Forecast Data</h4>
              <p className="text-gray-600 mb-4">
                Import sales forecast data to automatically generate production plans based on expected demand.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>• Import from past sales data</p>
                <p>• Connect with external forecasting systems</p>
                <p>• Auto-calculate material requirements</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreatePlan && <CreatePlanModal />}
    </div>
  );
};

export default Planning;