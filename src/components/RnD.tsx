import React, { useState } from "react";
import {
  Plus,
  Search,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  FlaskConical,
  Copy,
} from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { generateId } from "../utils/generateId";
import type { Formula, Ingredient, DraftVersion } from "../types";

const RnD = () => {
  // =============================
  // การตั้งค่าหน้าจอและ State
  // =============================

  // แท็บที่กำลังเปิด
  // ใช้สำหรับสลับหน้าระหว่างสูตรการผลิต
  const [activeTab, setActiveTab] = useState("formulas");

  // ควบคุมการแสดง Modal สร้างสูตร
  const [showCreateFormula, setShowCreateFormula] = useState(false);

  // เก็บสูตรที่กำลังแก้ไข
  const [editingFormula, setEditingFormula] = useState<Formula | null>(null);

  // =============================
  // รายการสูตรการผลิต
  // =============================

  const [formulas, setFormulas] = useLocalStorage<Formula[]>("formulas", [
    // สูตรตัวอย่าง 1
    {
      id: "F001",
      name: "สูตรขนมปังขาวพรีเมียม",
      version: "2.1",
      status: "อนุมัติแล้ว",
      productType: "ผลิตเพื่อขาย",
      createdBy: "ทีมวิจัยและพัฒนา",
      lastModified: "2025-01-01",

      // กำไรขั้นต้น (%)
      grossProfit: 35.2,

      // ราคาขายสินค้า
      sellingPrice: 4.5,

      // ต้นทุนวัตถุดิบ
      materialCost: 2.25,

      // ต้นทุนกระบวนการผลิต
      processCost: 0.67,

      // ส่วนผสม
      ingredients: [
        { name: "แป้ง", quantity: 400, unit: "กรัม", cost: 1.0, type: "หลัก" },
        {
          name: "น้ำตาล",
          quantity: 50,
          unit: "กรัม",
          cost: 0.09,
          type: "หลัก",
        },
        { name: "ยีสต์", quantity: 10, unit: "กรัม", cost: 0.12, type: "รอง" },
        { name: "เกลือ", quantity: 8, unit: "กรัม", cost: 0.02, type: "รอง" },
        { name: "เนย", quantity: 30, unit: "กรัม", cost: 0.45, type: "รอง" },
      ],
    },

    // สูตรตัวอย่าง 2
    {
      id: "F002",
      name: "กระบวนการแล่ปลา",
      version: "1.5",
      status: "ฉบับร่าง",
      productType: "แยกชิ้นเพื่อขาย",
      createdBy: "วิศวกรกระบวนการ",
      lastModified: "2024-12-30",

      grossProfit: 28.5,
      sellingPrice: 18.0,
      materialCost: 12.0,
      processCost: 0.87,

      ingredients: [
        {
          name: "ปลาแซลมอนสด",
          quantity: 1200,
          unit: "กรัม",
          cost: 12.0,
          type: "หลัก",
        },
      ],

      // การคาดการณ์ผลผลิต
      yieldLoss: {
        expectedYield: 75,
        expectedLoss: 25,

        products: [
          { name: "เนื้อปลา", yield: 60, price: 22.0 },
          { name: "หัวปลา", yield: 12, price: 8.0 },
          { name: "กระดูกปลา", yield: 3, price: 3.0 },
        ],
      },
    },
  ]);

  // =============================
  // เวอร์ชัน Draft สูตร
  // =============================

  const [draftVersions, setDraftVersions] = useLocalStorage<DraftVersion[]>(
    "draftVersions",
    [
      {
        id: "F001-draft",
        formulaId: "F001",
        version: "2.2-draft",
        changes: ["ลดน้ำตาลลง 5 กรัม", "เพิ่มวานิลลา"],
        createdBy: "John Smith",
        createdAt: "2025-01-01T14:30:00Z",
      },
    ],
  );

  // =============================
  // ข้อมูลสูตรใหม่
  // =============================

  const [newFormula, setNewFormula] = useState<Partial<Formula>>({
    name: "",
    productType: "ผลิตเพื่อขาย",
    grossProfit: 35,
    processCost: undefined,
    ingredients: [],
  });

  // =============================
  // วัตถุดิบใหม่
  // =============================

  const [newIngredient, setNewIngredient] = useState<Partial<Ingredient>>({
    name: "",
    quantity: undefined,
    unit: "กิโลกรัม",
    cost: undefined,
    type: "หลัก",
  });

  // =============================
  // สร้างสูตรใหม่
  // =============================

  const handleCreateFormula = () => {
    // ตรวจสอบชื่อสูตร
    if (!newFormula.name) return;

    // คำนวณต้นทุนวัตถุดิบ
    const materialCost = (newFormula.ingredients || []).reduce(
      (sum, ing) => sum + ing.cost,
      0,
    );

    // คำนวณต้นทุนรวม
    const totalCost = materialCost + (newFormula.processCost || 0);

    // คำนวณราคาขายจากกำไร
    const sellingPrice = totalCost / (1 - (newFormula.grossProfit || 35) / 100);

    // สร้างสูตร
    const formula: Formula = {
      id: generateId("F"),
      name: newFormula.name,
      version: "1.0",
      status: "draft",
      productType: newFormula.productType || "ผลิตเพื่อขาย",
      createdBy: "ผู้ใช้งานปัจจุบัน",
      lastModified: new Date().toISOString().split("T")[0],
      grossProfit: newFormula.grossProfit || 35,
      sellingPrice,
      materialCost,
      processCost: newFormula.processCost || 0,
      ingredients: newFormula.ingredients || [],
    };

    setFormulas([...formulas, formula]);
    resetNewFormula();
    setShowCreateFormula(false);
  };

  // =============================
  // อัปเดตสูตร
  // =============================

  const handleUpdateFormula = () => {
    if (!editingFormula || !newFormula.name) return;

    const materialCost = (newFormula.ingredients || []).reduce(
      (sum, ing) => sum + ing.cost,
      0,
    );

    const totalCost = materialCost + (newFormula.processCost || 0);

    const sellingPrice = totalCost / (1 - (newFormula.grossProfit || 35) / 100);

    const updatedFormula: Formula = {
      ...editingFormula,
      name: newFormula.name,
      productType: newFormula.productType || "ผลิตเพื่อขาย",
      grossProfit: newFormula.grossProfit || 35,
      sellingPrice,
      materialCost,
      processCost: newFormula.processCost || 0,
      ingredients: newFormula.ingredients || [],
      lastModified: new Date().toISOString().split("T")[0],
    };

    setFormulas(
      formulas.map((f) => (f.id === editingFormula.id ? updatedFormula : f)),
    );

    setEditingFormula(null);
    resetNewFormula();
    setShowCreateFormula(false);
  };

  // =============================
  // อนุมัติสูตร
  // =============================

  const handleApproveFormula = (id: string) => {
    setFormulas(
      formulas.map((f) => (f.id === id ? { ...f, status: "approved" } : f)),
    );
  };

  // =============================
  // คัดลอกสูตร
  // =============================

  const handleCopyFormula = (formula: Formula) => {
    const newVersion = parseFloat(formula.version) + 0.1;

    const copiedFormula: Formula = {
      ...formula,
      id: generateId("F"),
      version: newVersion.toFixed(1),
      status: "draft",
      lastModified: new Date().toISOString().split("T")[0],
    };

    setFormulas([...formulas, copiedFormula]);
  };

  // =============================
  // ลบสูตร
  // =============================

  const handleDeleteFormula = (id: string) => {
    if (confirm("ต้องการลบสูตรนี้หรือไม่")) {
      setFormulas(formulas.filter((f) => f.id !== id));
    }
  };

  // =============================
  // แก้ไขสูตร
  // =============================

  const handleEditFormula = (formula: Formula) => {
    setEditingFormula(formula);

    setNewFormula({
      name: formula.name,
      productType: formula.productType,
      grossProfit: formula.grossProfit,
      processCost: formula.processCost,
      ingredients: formula.ingredients,
    });

    setShowCreateFormula(true);
  };

  // =============================
  // เพิ่มวัตถุดิบในสูตร
  // =============================

  const handleAddIngredient = () => {
    if (!newIngredient.name || !newIngredient.quantity) return;

    const ingredient: Ingredient = {
      name: newIngredient.name,
      quantity: newIngredient.quantity,
      unit: newIngredient.unit || "กิโลกรัม",
      cost: newIngredient.cost || 0,
      type: newIngredient.type || "main",
    };

    setNewFormula({
      ...newFormula,
      ingredients: [...(newFormula.ingredients || []), ingredient],
    });

    setNewIngredient({
      name: "",
      quantity: 0,
      unit: "กิโลกรัม",
      cost: 0,
      type: "main",
    });
  };

  // =============================
  // รีเซ็ตฟอร์มสูตร
  // =============================

  const resetNewFormula = () => {
    setNewFormula({
      name: "",
      productType: "ผลิตเพื่อขาย",
      grossProfit: 35,
      processCost: 0,
      ingredients: [],
    });
  };

  // =============================
  // สีสถานะสูตร
  // =============================

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "สีเขียว = อนุมัติแล้ว";

      case "draft":
        return "สีเหลือง = ฉบับร่าง";

      case "testing":
        return "สีน้ำเงิน = กำลังทดลอง";

      default:
        return "สีเทา = ไม่ระบุ";
    }
  };

  // =============================
  // ไอคอนสถานะสูตร
  // =============================

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-[#8F262B]" />;

      case "draft":
        return <Clock className="w-4 h-4 text-[#8F262B]" />;
      case "testing":
        return <FlaskConical className="w-4 h-4 text-[#8F262B]" />;

      default:
        return <Clock className="w-4 h-4 text-[#8F262B]" />;
    }
  };

  const CreateFormulaModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                สร้างสูตรใหม่
              </h3>
              <button
                onClick={() => setShowCreateFormula(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">ปิด</span>
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อสูตร
                </label>
                <input
                  type="text"
                  value={newFormula.name}
                  onChange={(e) =>
                    setNewFormula({ ...newFormula, name: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ระบุชื่อสูตร"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ประเภทสินค้า
                </label>
                <select
                  value={newFormula.productType}
                  onChange={(e) =>
                    setNewFormula({
                      ...newFormula,
                      productType: e.target.value as
                        | "Build to Sell"
                        | "Break to Sell",
                    })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>ผลิตเพื่อขาย</option>
                  <option>แยกชิ้นเพื่อขาย</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เปอร์เซ็นต์กำไรเป้าหมาย (GP %)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newFormula.grossProfit}
                  onChange={(e) =>
                    setNewFormula({
                      ...newFormula,
                      grossProfit: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="35.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ต้นทุนกระบวนการผลิต
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newFormula.processCost}
                  onChange={(e) =>
                    setNewFormula({
                      ...newFormula,
                      processCost: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.67"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ราคาขายที่คำนวณได้
                </label>
                <input
                  type="number"
                  step="0.01"
                  disabled
                  value={(() => {
                    const materialCost = (newFormula.ingredients || []).reduce(
                      (sum, ing) => sum + ing.cost,
                      0,
                    );
                    const totalCost =
                      materialCost + (newFormula.processCost || 0);
                    return (
                      totalCost / (1 - (newFormula.grossProfit || 35) / 100)
                    );
                  })().toFixed(2)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50"
                  placeholder="คำนวณอัตโนมัติ"
                />
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                วัตถุดิบ
              </h4>

              <div className="space-y-3">
                <div className="grid grid-cols-6 gap-4 p-4 border border-gray-200 rounded-lg">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      ชื่อวัตถุดิบ
                    </label>
                    <input
                      type="text"
                      value={newIngredient.name}
                      onChange={(e) =>
                        setNewIngredient({
                          ...newIngredient,
                          name: e.target.value,
                        })
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      placeholder="ระบุชื่อวัตถุดิบ"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      ปริมาณ
                    </label>
                    <input
                      type="number"
                      value={newIngredient.quantity}
                      onChange={(e) =>
                        setNewIngredient({
                          ...newIngredient,
                          quantity: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>

                  {/* <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      หน่วย
                    </label>
                    <select
                      value={newIngredient.unit}
                      onChange={(e) =>
                        setNewIngredient({
                          ...newIngredient,
                          unit: e.target.value,
                        })
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    >
                      <option>g</option>
                      <option>kg</option>
                      <option>ml</option>
                      <option>l</option>
                    </select>
                  </div> */}

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      หน่วย
                    </label>
                    <input
                      type="text"
                      value={newIngredient.unit}
                      onChange={(e) =>
                        setNewIngredient({
                          ...newIngredient,
                          unit: e.target.value,
                        })
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      ต้นทุนต่อหน่วย
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newIngredient.cost}
                      onChange={(e) =>
                        setNewIngredient({
                          ...newIngredient,
                          cost: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      ประเภท
                    </label>
                    <select
                      value={newIngredient.type}
                      onChange={(e) =>
                        setNewIngredient({
                          ...newIngredient,
                          type: e.target.value as "main" | "secondary",
                        })
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    >
                      <option>วัตถุดิบหลัก</option>
                      <option>วัตถุดิบรอง</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      ต้นทุนรวม
                    </label>
                    <input
                      type="number"
                      disabled
                      value={(
                        (newIngredient.quantity || 0) *
                        (newIngredient.cost || 0)
                      ).toFixed(2)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddIngredient}
                className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                เพิ่มวัตถุดิบ
              </button>

              {newFormula.ingredients && newFormula.ingredients.length > 0 && (
                <div className="mt-4">
                  <h5 className="font-medium text-gray-900 mb-2">
                    รายการวัตถุดิบที่เพิ่มแล้ว
                  </h5>
                  <div className="space-y-2">
                    {newFormula.ingredients.map((ingredient, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded"
                      >
                        <span className="font-medium">{ingredient.name}</span>
                        <span className="text-sm text-gray-600">
                          {ingredient.quantity} {ingredient.unit} - $
                          {ingredient.cost.toFixed(2)}
                        </span>
                        <button
                          onClick={() => {
                            const updatedIngredients =
                              newFormula.ingredients?.filter(
                                (_, i) => i !== index,
                              ) || [];
                            setNewFormula({
                              ...newFormula,
                              ingredients: updatedIngredients,
                            });
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          ลบ
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowCreateFormula(false)}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                ยกเลิก
              </button>

              <button className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700">
                บันทึกเป็นแบบร่าง
              </button>

              <button
                onClick={
                  editingFormula ? handleUpdateFormula : handleCreateFormula
                }
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {editingFormula ? "อัปเดตสูตร" : "สร้างสูตร"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">จัดการสูตร R&D</h2>
        <div className="flex items-center space-x-4">
          <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 flex items-center space-x-2">
            <FlaskConical className="w-4 h-4" />
            <span>สร้างสูตรทดสอบ</span>
          </button>

          <button
            onClick={() => setShowCreateFormula(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>สร้างสูตร</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "formulas", name: "สูตรทางการ" },
            { id: "drafts", name: "แบบร่าง" },
            { id: "testing", name: "การทดสอบ" },
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

      {activeTab === "formulas" && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  สูตรสินค้า
                </h3>

                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="ค้นหาสูตร..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {formulas.map((formula) => (
                <div key={formula.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(formula.status)}

                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {formula.name}
                        </h4>

                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>เวอร์ชัน {formula.version}</span>
                          <span>•</span>
                          <span>{formula.productType}</span>
                          <span>•</span>
                          <span>โดย {formula.createdBy}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(formula.status)}`}
                      >
                        {formula.status.toUpperCase()}
                      </span>

                      <button
                        onClick={() => alert("ดูรายละเอียดสูตร")}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleEditFormula(formula)}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleCopyFormula(formula)}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Cost Analysis */}
                    <div className="space-y-3">
                      <h5 className="font-medium text-gray-900">
                        การวิเคราะห์ต้นทุน
                      </h5>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">ต้นทุนวัตถุดิบ:</span>
                          <span>{formula.materialCost.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            ต้นทุนกระบวนการ:
                          </span>
                          <span>{formula.processCost.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between font-medium">
                          <span className="text-gray-600">ราคาขาย:</span>
                          <span>{formula.sellingPrice.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between text-green-600 font-medium">
                          <span>กำไรขั้นต้น:</span>
                          <span>{formula.grossProfit.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Main Ingredients */}
                    <div className="space-y-3">
                      <h5 className="font-medium text-gray-900">
                        วัตถุดิบหลัก
                      </h5>

                      <div className="space-y-2">
                        {formula.ingredients
                          .filter((ing) => ing.type === "main")
                          .map((ingredient, index) => (
                            <div
                              key={index}
                              className="flex justify-between text-sm"
                            >
                              <span className="text-gray-600">
                                {ingredient.name}:
                              </span>
                              <span>
                                {ingredient.quantity}
                                {ingredient.unit} (${ingredient.cost.toFixed(2)}
                                )
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Secondary or Yield */}
                    <div className="space-y-3">
                      {formula.productType === "Build to Sell" ? (
                        <>
                          <h5 className="font-medium text-gray-900">
                            วัตถุดิบรอง
                          </h5>

                          <div className="space-y-2">
                            {formula.ingredients
                              .filter((ing) => ing.type === "secondary")
                              .map((ingredient, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between text-sm"
                                >
                                  <span className="text-gray-600">
                                    {ingredient.name}:
                                  </span>
                                  <span>
                                    {ingredient.quantity}
                                    {ingredient.unit} ($
                                    {ingredient.cost.toFixed(2)})
                                  </span>
                                </div>
                              ))}
                          </div>
                        </>
                      ) : (
                        <>
                          <h5 className="font-medium text-gray-900">
                            อัตราผลผลิต/สูญเสียที่คาดการณ์
                          </h5>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-green-600">
                              <span>ผลผลิตที่คาดการณ์:</span>
                              <span>{formula.yieldLoss?.expectedYield}%</span>
                            </div>

                            <div className="flex justify-between text-red-600">
                              <span>การสูญเสียที่คาดการณ์:</span>
                              <span>{formula.yieldLoss?.expectedLoss}%</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {formula.yieldLoss && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <h5 className="font-medium text-gray-900 mb-3">
                        สินค้าที่ได้จากการผลิต
                      </h5>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {formula.yieldLoss.products.map((product, index) => (
                          <div
                            key={index}
                            className="p-3 border border-gray-200 rounded-lg"
                          >
                            <div className="font-medium text-sm">
                              {product.name}
                            </div>

                            <div className="text-xs text-gray-600 mt-1">
                              {product.yield}% ผลผลิต • $
                              {product.price.toFixed(2)}/kg
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {formula.status === "draft" && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleApproveFormula(formula.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                        >
                          อนุมัติสูตร
                        </button>

                        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                          สร้างชุดทดสอบ
                        </button>

                        <button
                          onClick={() => handleDeleteFormula(formula.id)}
                          className="text-red-600 hover:text-red-800 px-4 py-2"
                        >
                          ลบ
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "drafts" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">แบบร่างสูตร</h3>
          </div>

          <div className="p-6">
            {draftVersions.map((draft) => (
              <div
                key={draft.id}
                className="border border-gray-200 rounded-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {draft.formulaId} - {draft.version}
                    </h4>

                    <p className="text-sm text-gray-600">
                      สร้างโดย {draft.createdBy} วันที่{" "}
                      {new Date(draft.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                      ตรวจสอบการเปลี่ยนแปลง
                    </button>

                    <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                      อนุมัติ
                    </button>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-sm text-gray-900 mb-2">
                    รายการเปลี่ยนแปลง:
                  </h5>

                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {draft.changes.map((change, index) => (
                      <li key={index}>{change}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "testing" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              การทดสอบสูตร
            </h3>
          </div>

          <div className="p-6">
            <div className="text-center py-12">
              <FlaskConical className="w-12 h-12 text-gray-400 mx-auto mb-4" />

              <h4 className="text-lg font-medium text-gray-900 mb-2">
                ไม่มีการทดสอบที่กำลังดำเนินการ
              </h4>

              <p className="text-gray-600 mb-4">
                สร้างชุดทดสอบเพื่อยืนยันสูตรก่อนอนุมัติใช้งานจริง
              </p>

              <button className="bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700">
                เริ่มการทดสอบใหม่
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateFormula && <CreateFormulaModal />}
    </div>
  );
};

export default RnD;
