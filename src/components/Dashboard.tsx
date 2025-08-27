import React from 'react';
import { TrendingUp, TrendingDown, Package, ClipboardList, AlertTriangle, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const kpis = [
    {
      title: 'Production Output',
      value: '2,847',
      unit: 'units',
      change: '+12.3%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-[#8F262B]',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Yield Efficiency',
      value: '94.2',
      unit: '%',
      change: '+2.1%',
      trend: 'up',
      icon: CheckCircle,
      color: 'text-[#8F262B]',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Waste Percentage',
      value: '3.8',
      unit: '%',
      change: '-0.5%',
      trend: 'down',
      icon: AlertTriangle,
      color: 'text-[#8F262B]',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Active Orders',
      value: '156',
      unit: 'orders',
      change: '+8.7%',
      trend: 'up',
      icon: ClipboardList,
      color: 'text-[#8F262B]',
      bgColor: 'bg-red-50',
    },
  ];

  const recentOrders = [
    { id: 'PO-001', product: 'White Bread', status: 'In Progress', completion: 75 },
    { id: 'PO-002', product: 'Fish Fillet', status: 'Completed', completion: 100 },
    { id: 'PO-003', product: 'Croissant', status: 'Pending', completion: 0 },
    { id: 'PO-004', product: 'Salmon Steaks', status: 'In Progress', completion: 45 },
  ];

  const materialAlerts = [
    { material: 'Flour Type 1', stock: 120, minimum: 200, status: 'low' },
    { material: 'Fresh Salmon', stock: 45, minimum: 50, status: 'critical' },
    { material: 'Sugar', stock: 380, minimum: 100, status: 'good' },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-full ${kpi.bgColor}`}>
                  <Icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
                <span className={`text-sm font-medium ${
                  kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {kpi.change}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {kpi.value} <span className="text-sm text-gray-500">{kpi.unit}</span>
                </h3>
                <p className="text-sm text-gray-600 mt-1">{kpi.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Production Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Production Orders</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{order.id}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{order.product}</p>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Progress</span>
                        <span>{order.completion}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-[#8F262B] h-1.5 rounded-full transition-all duration-300" 
                          style={{ width: `${order.completion}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Material Stock Alerts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Material Stock Alerts</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {materialAlerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <Package className={`w-5 h-5 ${
                      alert.status === 'critical' ? 'text-red-500' :
                      alert.status === 'low' ? 'text-orange-500' :
                      'text-green-500'
                    }`} />
                    <div>
                      <h4 className="font-medium text-gray-900">{alert.material}</h4>
                      <p className="text-sm text-gray-600">
                        Current: {alert.stock} | Min: {alert.minimum}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    alert.status === 'critical' ? 'bg-red-100 text-red-800' :
                    alert.status === 'low' ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {alert.status === 'critical' ? 'Critical' :
                     alert.status === 'low' ? 'Low Stock' : 'Good'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Production Forecast vs Actual Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Production Forecast vs Actual (Last 7 Days)</h3>
        </div>
        <div className="p-6">
          <div className="h-64 flex items-end justify-between space-x-2">
            {[
              { day: 'Mon', forecast: 280, actual: 265 },
              { day: 'Tue', forecast: 320, actual: 342 },
              { day: 'Wed', forecast: 290, actual: 278 },
              { day: 'Thu', forecast: 350, actual: 367 },
              { day: 'Fri', forecast: 380, actual: 392 },
              { day: 'Sat', forecast: 250, actual: 234 },
              { day: 'Sun', forecast: 200, actual: 189 },
            ].map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="flex items-end space-x-1 h-48">
                  <div 
                    className="bg-red-200 rounded-t relative group cursor-pointer transition-all hover:bg-red-300"
                    style={{ height: `${(data.forecast / 400) * 100}%`, width: '20px' }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {data.forecast}
                    </div>
                  </div>
                  <div 
                    className="bg-[#8F262B] rounded-t relative group cursor-pointer transition-all hover:bg-red-700"
                    style={{ height: `${(data.actual / 400) * 100}%`, width: '20px' }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {data.actual}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-600 mt-2">{data.day}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center mt-4 space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-200 rounded"></div>
              <span className="text-sm text-gray-600">Forecast</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#8F262B] rounded"></div>
              <span className="text-sm text-gray-600">Actual</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;