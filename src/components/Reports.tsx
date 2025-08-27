import React, { useState } from 'react';
import { Download, Filter, Calendar, BarChart3, PieChart, TrendingUp } from 'lucide-react';

const Reports = () => {
  const [activeReport, setActiveReport] = useState('production-cost');
  const [dateRange, setDateRange] = useState('last-7-days');

  const reportTypes = [
    { id: 'production-cost', name: 'Production Cost Analysis', icon: BarChart3 },
    { id: 'efficiency', name: 'Production Efficiency', icon: TrendingUp },
    { id: 'yield-loss', name: 'Yield & Loss Analysis', icon: PieChart },
  ];

  const productionCostData = [
    {
      product: 'White Bread',
      quantity: 500,
      materialCost: 1125.00,
      processCost: 335.00,
      totalCost: 1460.00,
      revenue: 2250.00,
      profit: 790.00,
      profitMargin: 35.1
    },
    {
      product: 'Fish Fillet',
      quantity: 100,
      materialCost: 1200.00,
      processCost: 87.00,
      totalCost: 1287.00,
      revenue: 1800.00,
      profit: 513.00,
      profitMargin: 28.5
    },
    {
      product: 'Croissant',
      quantity: 300,
      materialCost: 450.00,
      processCost: 180.00,
      totalCost: 630.00,
      revenue: 900.00,
      profit: 270.00,
      profitMargin: 30.0
    }
  ];

  const efficiencyData = [
    {
      product: 'White Bread',
      plannedTime: 480,
      actualTime: 495,
      efficiency: 97.0,
      wastePercentage: 2.4,
      downtime: 15,
      speed: 62.5
    },
    {
      product: 'Fish Fillet',
      plannedTime: 240,
      actualTime: 225,
      efficiency: 106.7,
      wastePercentage: 4.2,
      downtime: 0,
      speed: 26.7
    },
    {
      product: 'Croissant',
      plannedTime: 360,
      actualTime: 380,
      efficiency: 94.7,
      wastePercentage: 3.1,
      downtime: 20,
      speed: 47.4
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="last-7-days">Last 7 Days</option>
              <option value="last-30-days">Last 30 Days</option>
              <option value="this-month">This Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex space-x-4">
            {reportTypes.map((report) => {
              const Icon = report.icon;
              return (
                <button
                  key={report.id}
                  onClick={() => setActiveReport(report.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeReport === report.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{report.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Production Cost Analysis */}
        {activeReport === 'production-cost' && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-900">
                  ${productionCostData.reduce((sum, item) => sum + item.totalCost, 0).toLocaleString()}
                </div>
                <div className="text-sm text-blue-600 mt-1">Total Production Cost</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-900">
                  ${productionCostData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
                </div>
                <div className="text-sm text-green-600 mt-1">Total Revenue</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-900">
                  ${productionCostData.reduce((sum, item) => sum + item.profit, 0).toLocaleString()}
                </div>
                <div className="text-sm text-purple-600 mt-1">Total Profit</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-900">
                  {(productionCostData.reduce((sum, item) => sum + item.profit, 0) / 
                    productionCostData.reduce((sum, item) => sum + item.revenue, 0) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-orange-600 mt-1">Average Profit Margin</div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material Cost</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Process Cost</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Margin %</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {productionCostData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.product}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">${item.materialCost.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">${item.processCost.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">${item.totalCost.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">${item.revenue.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-green-600 font-medium">${item.profit.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {item.profitMargin.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Production Efficiency */}
        {activeReport === 'efficiency' && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-900">
                  {(efficiencyData.reduce((sum, item) => sum + item.efficiency, 0) / efficiencyData.length).toFixed(1)}%
                </div>
                <div className="text-sm text-green-600 mt-1">Average Efficiency</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-900">
                  {(efficiencyData.reduce((sum, item) => sum + item.wastePercentage, 0) / efficiencyData.length).toFixed(1)}%
                </div>
                <div className="text-sm text-red-600 mt-1">Average Waste</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-900">
                  {efficiencyData.reduce((sum, item) => sum + item.downtime, 0)} min
                </div>
                <div className="text-sm text-orange-600 mt-1">Total Downtime</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-900">
                  {(efficiencyData.reduce((sum, item) => sum + item.speed, 0) / efficiencyData.length).toFixed(1)}
                </div>
                <div className="text-sm text-blue-600 mt-1">Avg Units/Hour</div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Planned Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waste %</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Downtime</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Speed</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {efficiencyData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.product}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">{item.plannedTime} min</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">{item.actualTime} min</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.efficiency >= 100 ? 'bg-green-100 text-green-800' : 
                          item.efficiency >= 90 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.efficiency.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.wastePercentage <= 3 ? 'bg-green-100 text-green-800' : 
                          item.wastePercentage <= 5 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.wastePercentage.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">{item.downtime} min</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">{item.speed.toFixed(1)} units/hr</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Yield & Loss Analysis */}
        {activeReport === 'yield-loss' && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Yield Analysis */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Yield Analysis</h4>
                <div className="space-y-4">
                  {[
                    { product: 'Fish Fillet', expected: 75, actual: 72, variance: -3 },
                    { product: 'White Bread', expected: 95, actual: 97, variance: 2 },
                    { product: 'Croissant', expected: 90, actual: 88, variance: -2 }
                  ].map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{item.product}</h5>
                        <span className={`text-sm font-medium ${
                          item.variance >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {item.variance > 0 ? '+' : ''}{item.variance}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>Expected: {item.expected}%</span>
                        <span>Actual: {item.actual}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            item.variance >= 0 ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${item.actual}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Loss Analysis */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Loss Analysis</h4>
                <div className="space-y-4">
                  {[
                    { product: 'Fish Fillet', expected: 25, actual: 28, variance: 3 },
                    { product: 'White Bread', expected: 5, actual: 3, variance: -2 },
                    { product: 'Croissant', expected: 10, actual: 12, variance: 2 }
                  ].map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{item.product}</h5>
                        <span className={`text-sm font-medium ${
                          item.variance <= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {item.variance > 0 ? '+' : ''}{item.variance}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>Expected: {item.expected}%</span>
                        <span>Actual: {item.actual}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            item.variance <= 0 ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${item.actual}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;