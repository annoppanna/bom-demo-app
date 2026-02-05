import React, { useState } from "react";
import {
  Calendar,
  Download,
  Plus,
  Search,
  Filter,
  X,
  Save,
} from "lucide-react";
import CreatePlanModal from "./CreatePlanModal";

const Planning = () => {
  const [activeTab, setActiveTab] = useState("daily");
  const [selectedDate, setSelectedDate] = useState("2025-01-01");
  const [showCreatePlan, setShowCreatePlan] = useState(false);

  const [newPlan, setNewPlan] = useState({
    product: "",
    plannedQuantity: 0,
    unit: "pieces",
    priority: "medium",
    startTime: "08:00",
    endTime: "16:00",
    materials: [],
  });

  const [newMaterial, setNewMaterial] = useState({
    name: "",
    required: 0,
    unit: "kg",
  });

  const dailyPlan = [
    {
      id: "DP-001",
      product: "White Bread",
      plannedQuantity: 500,
      unit: "loaves",
      priority: "high",
      estimatedDuration: "8 hours",
      startTime: "06:00",
      endTime: "14:00",
      requiredMaterials: [
        {
          name: "Flour Type 1",
          required: 200,
          available: 150,
          unit: "kg",
          status: "shortage",
        },
        {
          name: "Sugar",
          required: 40,
          available: 200,
          unit: "kg",
          status: "available",
        },
        {
          name: "Yeast",
          required: 5,
          available: 10,
          unit: "kg",
          status: "available",
        },
        {
          name: "Salt",
          required: 8,
          available: 50,
          unit: "kg",
          status: "available",
        },
      ],
    },

    {
      id: "DP-002",
      product: "Croissant",
      plannedQuantity: 300,
      unit: "pieces",
      priority: "medium",
      estimatedDuration: "6 hours",
      startTime: "08:00",
      endTime: "14:00",
      requiredMaterials: [
        {
          name: "Butter",
          required: 90,
          available: 70,
          unit: "kg",
          status: "shortage",
        },
        {
          name: "Flour Type 1",
          required: 120,
          available: 200,
          unit: "kg",
          status: "available",
        },
        {
          name: "Milk",
          required: 30,
          available: 60,
          unit: "kg",
          status: "available",
        },
      ],
    },

    {
      id: "DP-003",
      product: "Chocolate Cake",
      plannedQuantity: 150,
      unit: "cakes",
      priority: "high",
      estimatedDuration: "5 hours",
      startTime: "10:00",
      endTime: "15:00",
      requiredMaterials: [
        {
          name: "Cake Flour",
          required: 60,
          available: 90,
          unit: "kg",
          status: "available",
        },
        {
          name: "Cocoa Powder",
          required: 20,
          available: 25,
          unit: "kg",
          status: "available",
        },
        {
          name: "Chocolate",
          required: 50,
          available: 40,
          unit: "kg",
          status: "shortage",
        },
        {
          name: "Eggs",
          required: 600,
          available: 1200,
          unit: "pcs",
          status: "available",
        },
      ],
    },

    {
      id: "DP-004",
      product: "Sandwich Bread",
      plannedQuantity: 400,
      unit: "loaves",
      priority: "low",
      estimatedDuration: "7 hours",
      startTime: "05:00",
      endTime: "12:00",
      requiredMaterials: [
        {
          name: "Flour Type 2",
          required: 180,
          available: 250,
          unit: "kg",
          status: "available",
        },
        {
          name: "Milk Powder",
          required: 20,
          available: 15,
          unit: "kg",
          status: "shortage",
        },
        {
          name: "Sugar",
          required: 35,
          available: 200,
          unit: "kg",
          status: "available",
        },
      ],
    },

    {
      id: "DP-005",
      product: "Donut",
      plannedQuantity: 600,
      unit: "pieces",
      priority: "medium",
      estimatedDuration: "6 hours",
      startTime: "12:00",
      endTime: "18:00",
      requiredMaterials: [
        {
          name: "Flour Type 1",
          required: 160,
          available: 200,
          unit: "kg",
          status: "available",
        },
        {
          name: "Oil",
          required: 90,
          available: 70,
          unit: "kg",
          status: "shortage",
        },
        {
          name: "Sugar",
          required: 70,
          available: 180,
          unit: "kg",
          status: "available",
        },
      ],
    },
  ];

  const weeklyPlan = [
    { day: "Monday", plans: 5, totalQuantity: 1350 },
    { day: "Tuesday", plans: 4, totalQuantity: 1100 },
    { day: "Wednesday", plans: 6, totalQuantity: 1600 },
    { day: "Thursday", plans: 3, totalQuantity: 900 },
    { day: "Friday", plans: 7, totalQuantity: 1800 },
    { day: "Saturday", plans: 4, totalQuantity: 750 },
    { day: "Sunday", plans: 2, totalQuantity: 350 },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "text-green-600";
      case "shortage":
        return "text-red-600";
      case "warning":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">แผนการผลิต</h2>

        <div className="flex items-center space-x-4">
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>ส่งออก Excel</span>
          </button>

          <button
            onClick={() => setShowCreatePlan(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>สร้างแผนการผลิต</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "daily", name: "แผนรายวัน" },
            { id: "weekly", name: "ภาพรวมรายสัปดาห์" },
            { id: "forecast", name: "คาดการณ์ยอดขาย" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* DAILY */}
      {activeTab === "daily" && (
        <div className="space-y-6">
          {/* Filter */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-gray-400" />

                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />

                  <input
                    type="text"
                    placeholder="ค้นหาสินค้า..."
                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <Filter className="w-4 h-4" />
                <span>ตัวกรอง</span>
              </button>
            </div>
          </div>

          {/* Plan Card */}
          <div className="space-y-4">
            {dailyPlan.map((plan) => (
              <div
                key={plan.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {plan.product}
                        </h3>

                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(plan.priority)}`}
                        >
                          ความสำคัญ {plan.priority}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mt-1">
                        {plan.plannedQuantity} {plan.unit} •{" "}
                        {plan.estimatedDuration} • {plan.startTime} -{" "}
                        {plan.endTime}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-gray-500">รหัสแผน</div>
                      <div className="font-medium">{plan.id}</div>
                    </div>
                  </div>

                  {/* Materials */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      วัตถุดิบที่ต้องใช้
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {plan.requiredMaterials.map((material, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-sm">
                              {material.name}
                            </h5>

                            <span
                              className={`text-xs font-medium ${getStatusColor(material.status)}`}
                            >
                              {material.status === "available" ? "✓" : "⚠"}
                            </span>
                          </div>

                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex justify-between">
                              <span>ต้องใช้:</span>
                              <span>
                                {material.required} {material.unit}
                              </span>
                            </div>

                            <div className="flex justify-between">
                              <span>คงเหลือ:</span>
                              <span className={getStatusColor(material.status)}>
                                {material.available} {material.unit}
                              </span>
                            </div>

                            {material.status === "shortage" && (
                              <div className="text-xs text-red-600 mt-2">
                                ขาดอีก {material.required - material.available}{" "}
                                {material.unit}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                    <div className="flex space-x-4">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                        สร้างใบสั่งผลิต
                      </button>

                      <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">
                        แก้ไขแผน
                      </button>
                    </div>

                    <div className="text-sm text-gray-500">
                      คำนวณวัตถุดิบอัตโนมัติจากสูตรการผลิต
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WEEKLY */}
      {activeTab === "weekly" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              ภาพรวมแผนการผลิตรายสัปดาห์
            </h3>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {weeklyPlan.map((day, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <h4 className="font-medium text-gray-900 mb-3">{day.day}</h4>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">จำนวนแผน:</span>
                      <span className="font-medium">{day.plans}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">จำนวนรวม:</span>
                      <span className="font-medium">{day.totalQuantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FORECAST */}
      {activeTab === "forecast" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                เชื่อมต่อข้อมูลคาดการณ์ยอดขาย
              </h3>

              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                นำเข้าข้อมูลคาดการณ์
              </button>
            </div>
          </div>

          <div className="p-6 text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />

            <h4 className="text-lg font-medium text-gray-900 mb-2">
              ยังไม่มีข้อมูลคาดการณ์
            </h4>

            <p className="text-gray-600 mb-4">
              นำเข้าข้อมูลยอดขายเพื่อสร้างแผนการผลิตอัตโนมัติตามความต้องการ
            </p>

            <div className="space-y-2 text-sm text-gray-500">
              <p>• นำเข้าจากข้อมูลยอดขายย้อนหลัง</p>
              <p>• เชื่อมต่อระบบพยากรณ์ภายนอก</p>
              <p>• คำนวณวัตถุดิบอัตโนมัติ</p>
            </div>
          </div>
        </div>
      )}

      {showCreatePlan && (
        <CreatePlanModal
          onClose={() => setShowCreatePlan(false)}
          onSave={(plan) => {
            console.log("New Plan:", plan);
          }}
        />
      )}
    </div>
  );
};

export default Planning;
