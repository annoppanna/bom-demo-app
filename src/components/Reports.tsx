import { useState } from "react";
import {
  Download,
  Filter,
  Calendar,
  BarChart3,
  PieChart,
  TrendingUp,
} from "lucide-react";

const Reports = () => {
  const [activeReport, setActiveReport] = useState("production-cost");
  const [dateRange, setDateRange] = useState("last-7-days");

  const reportTypes = [
    {
      id: "production-cost",
      name: "การวิเคราะห์ต้นทุนการผลิต",
      icon: BarChart3,
    },
    { id: "efficiency", name: "ประสิทธิภาพการผลิต", icon: TrendingUp },
    {
      id: "yield-loss",
      name: "การวิเคราะห์ผลผลิตและการสูญเสีย",
      icon: PieChart,
    },
  ];

  const productionCostData = [
    {
      product: "ขนมปังขาว",
      quantity: 500,
      materialCost: 1125.0,
      processCost: 335.0,
      totalCost: 1460.0,
      revenue: 2250.0,
      profit: 790.0,
      profitMargin: 35.1,
    },
    {
      product: "เนื้อปลาฟิเลต์",
      quantity: 100,
      materialCost: 1200.0,
      processCost: 87.0,
      totalCost: 1287.0,
      revenue: 1800.0,
      profit: 513.0,
      profitMargin: 28.5,
    },
    {
      product: "ครัวซองต์",
      quantity: 300,
      materialCost: 450.0,
      processCost: 180.0,
      totalCost: 630.0,
      revenue: 900.0,
      profit: 270.0,
      profitMargin: 30.0,
    },
  ];

  const efficiencyData = [
    {
      product: "ขนมปังขาว",
      plannedTime: 480,
      actualTime: 495,
      efficiency: 97.0,
      wastePercentage: 2.4,
      downtime: 15,
      speed: 62.5,
    },
    {
      product: "เนื้อปลาฟิเลต์",
      plannedTime: 240,
      actualTime: 225,
      efficiency: 106.7,
      wastePercentage: 4.2,
      downtime: 0,
      speed: 26.7,
    },
    {
      product: "ครัวซองต์",
      plannedTime: 360,
      actualTime: 380,
      efficiency: 94.7,
      wastePercentage: 3.1,
      downtime: 20,
      speed: 47.4,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          รายงานและการวิเคราะห์
        </h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">วันนี้</option>
              <option value="last-7-days">7 วันที่ผ่านมา</option>
              <option value="last-30-days">30 วันที่ผ่านมา</option>
              <option value="this-month">เดือนนี้</option>
              <option value="custom">กำหนดช่วงเวลาเอง</option>
            </select>
          </div>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
            <Filter className="w-4 h-4" />
            <span>ตัวกรอง</span>
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>ส่งออก</span>
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
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
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
        {activeReport === "production-cost" && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-900">
                  {productionCostData
                    .reduce((sum, item) => sum + item.totalCost, 0)
                    .toLocaleString()}
                </div>
                <div className="text-sm text-blue-600 mt-1">
                  ต้นทุนการผลิตรวม
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-900">
                  {productionCostData
                    .reduce((sum, item) => sum + item.revenue, 0)
                    .toLocaleString()}
                </div>
                <div className="text-sm text-green-600 mt-1">รายได้รวม</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-900">
                  {productionCostData
                    .reduce((sum, item) => sum + item.profit, 0)
                    .toLocaleString()}
                </div>
                <div className="text-sm text-purple-600 mt-1">กำไรรวม</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-900">
                  {(
                    (productionCostData.reduce(
                      (sum, item) => sum + item.profit,
                      0,
                    ) /
                      productionCostData.reduce(
                        (sum, item) => sum + item.revenue,
                        0,
                      )) *
                    100
                  ).toFixed(1)}
                  %
                </div>
                <div className="text-sm text-orange-600 mt-1">
                  อัตรากำไรเฉลี่ย
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      สินค้า
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      จำนวน
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      ต้นทุนวัตถุดิบ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      ต้นทุนกระบวนการ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      ต้นทุนรวม
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      รายได้
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      กำไร
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      อัตรากำไร %
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {productionCostData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {item.product}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {item.materialCost.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {item.processCost.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {item.totalCost.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {item.revenue.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-green-600 font-medium">
                        {item.profit.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
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
        {activeReport === "efficiency" && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-900">
                  {(
                    efficiencyData.reduce(
                      (sum, item) => sum + item.efficiency,
                      0,
                    ) / efficiencyData.length
                  ).toFixed(1)}
                  %
                </div>
                <div className="text-sm text-green-600 mt-1">
                  ประสิทธิภาพเฉลี่ย
                </div>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-900">
                  {(
                    efficiencyData.reduce(
                      (sum, item) => sum + item.wastePercentage,
                      0,
                    ) / efficiencyData.length
                  ).toFixed(1)}
                  %
                </div>
                <div className="text-sm text-red-600 mt-1">
                  อัตราของเสียเฉลี่ย
                </div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-900">
                  {efficiencyData.reduce((sum, item) => sum + item.downtime, 0)}{" "}
                  นาที
                </div>
                <div className="text-sm text-orange-600 mt-1">
                  เวลาหยุดเครื่องรวม
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-900">
                  {(
                    efficiencyData.reduce((sum, item) => sum + item.speed, 0) /
                    efficiencyData.length
                  ).toFixed(1)}
                </div>
                <div className="text-sm text-blue-600 mt-1">
                  หน่วยต่อชั่วโมงเฉลี่ย
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Yield & Loss Analysis */}
        {activeReport === "yield-loss" && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  วิเคราะห์ผลผลิต
                </h4>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  วิเคราะห์การสูญเสีย
                </h4>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
