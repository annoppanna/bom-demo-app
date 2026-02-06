import React, { useState, memo } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  Warehouse as WarehouseIcon,
  AlertTriangle,
  Save,
  X,
} from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { generateId } from "../utils/generateId";
import type { Material, MaterialRequest, MaterialRequestItem } from "../types";

/** ------------------------------
 *  Child: MaterialForm (Modal)
 *  ------------------------------ */
type MaterialFormProps = {
  editingMaterial: Material | null;
  newMaterial: Partial<Material>;
  setNewMaterial: React.Dispatch<React.SetStateAction<Partial<Material>>>;
  setShowAddMaterial: (v: boolean) => void;
  handleAddMaterial: () => void;
  handleUpdateMaterial: () => void;
  setEditingMaterial: (m: Material | null) => void;
};

const MaterialForm = memo(function MaterialForm({
  editingMaterial,
  newMaterial,
  setNewMaterial,
  setShowAddMaterial,
  handleAddMaterial,
  handleUpdateMaterial,
  setEditingMaterial,
}: MaterialFormProps) {
  const handleClose = () => {
    setShowAddMaterial(false);
    setEditingMaterial(null);
    setNewMaterial({
      name: "",
      category: "",
      unit: "kg",
      costPerUnit: undefined,
      currentStock: undefined,
      minimumStock: undefined,
      warehouse: "WH-A",
      status: "good",
      yieldPercentage: 95.0,
      lossPercentage: 5.0,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingMaterial ? "แก้ไขวัตถุดิบ" : "เพิ่มวัตถุดิบใหม่"}
            </h3>
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                วัตถุดิบ
              </label>
              <input
                type="text"
                value={newMaterial.name ?? ""}
                onChange={(e) =>
                  setNewMaterial((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="กรอกชื่อวัตถุดิบ"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                หมวดหมู่
              </label>
              <input
                type="text"
                value={newMaterial.category ?? ""}
                onChange={(e) =>
                  setNewMaterial((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="กรอกหมวดหมู่"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                หน่วย
              </label>
              <select
                value={newMaterial.unit ?? "kg"}
                onChange={(e) =>
                  setNewMaterial((prev) => ({ ...prev, unit: e.target.value }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled
              >
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="l">l</option>
                <option value="ml">ml</option>
                <option value="pieces">ชิ้น</option>
              </select>
            </div> */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                หน่วย
              </label>
              <input
                type="text"
                value={"kg"}
                // onChange={(e) =>
                //   setNewMaterial((prev) => ({
                //     ...prev,
                //     category: e.target.value,
                //   }))
                // }
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ราคาต่อหน่วย
              </label>
              <input
                type="number"
                // step="0.01"
                value={newMaterial.costPerUnit ?? undefined}
                onChange={(e) =>
                  setNewMaterial((prev) => ({
                    ...prev,
                    costPerUnit: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                คลังสินค้า
              </label>
              <select
                value={newMaterial.warehouse ?? "WH-A"}
                onChange={(e) =>
                  setNewMaterial((prev) => ({
                    ...prev,
                    warehouse: e.target.value,
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="WH-A">WH-A - คลังหลัก</option>
                <option value="WH-B">WH-B - คลังเย็น</option>
                <option value="WH-C">WH-C - คลังแห้ง</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                สต็อกปัจจุบัน{" "}
              </label>
              <input
                type="number"
                value={newMaterial.currentStock ?? undefined}
                onChange={(e) =>
                  setNewMaterial((prev) => ({
                    ...prev,
                    currentStock: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                สต็อกขั้นต่ำ
              </label>
              <input
                type="number"
                value={newMaterial.minimumStock ?? undefined}
                onChange={(e) =>
                  setNewMaterial((prev) => ({
                    ...prev,
                    minimumStock: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                อัตราผลผลิตที่คาดหวัง (%)
              </label>
              <input
                type="number"
                step="0.1"
                min={0}
                max={100}
                value={newMaterial.yieldPercentage ?? 95.0}
                onChange={(e) =>
                  setNewMaterial((prev) => ({
                    ...prev,
                    yieldPercentage: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="95.0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                อัตราการสูญเสียที่คาดหวัง (%)
              </label>
              <input
                type="number"
                step="0.1"
                min={0}
                max={100}
                value={newMaterial.lossPercentage ?? 5.0}
                onChange={(e) =>
                  setNewMaterial((prev) => ({
                    ...prev,
                    lossPercentage: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="5.0"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={
                editingMaterial ? handleUpdateMaterial : handleAddMaterial
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>
                {editingMaterial ? "แก้ไขวัตถุดิบ" : "เพิ่มวัตถุดิบใหม่"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

/** ---------------------------------------
 *  Child: MaterialRequestForm (Modal)
 *  --------------------------------------- */
type MaterialRequestFormProps = {
  newRequest: Partial<MaterialRequest>;
  setNewRequest: React.Dispatch<React.SetStateAction<Partial<MaterialRequest>>>;
  newRequestItem: Partial<MaterialRequestItem>;
  setNewRequestItem: React.Dispatch<
    React.SetStateAction<Partial<MaterialRequestItem>>
  >;
  materials: Material[];
  handleAddRequestItem: () => void;
  handleCreateRequest: () => void;
  setShowMaterialRequest: (v: boolean) => void;
};

const MaterialRequestForm = memo(function MaterialRequestForm({
  newRequest,
  setNewRequest,
  newRequestItem,
  setNewRequestItem,
  materials,
  handleAddRequestItem,
  handleCreateRequest,
  setShowMaterialRequest,
}: MaterialRequestFormProps) {
  console.log({ newRequestItem });
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              สร้างคำขอเบิกวัตถุดิบ
            </h3>
            <button
              type="button"
              onClick={() => setShowMaterialRequest(false)}
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
                ใบสั่งผลิต
              </label>
              <input
                type="text"
                value={newRequest.productionOrder ?? ""}
                onChange={(e) =>
                  setNewRequest((prev) => ({
                    ...prev,
                    productionOrder: e.target.value,
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="PO-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                คลังสินค้า
              </label>
              <select
                value={newRequest.warehouse ?? "WH-A"}
                onChange={(e) =>
                  setNewRequest((prev) => ({
                    ...prev,
                    warehouse: e.target.value,
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="WH-A">WH-A - คลังหลัก</option>
                <option value="WH-B">WH-B - คลังเย็น</option>
                <option value="WH-C">WH-C - คลังแห้ง</option>
              </select>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              เพิ่มวัตถุดิบ
            </h4>
            <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <select
                  value={newRequestItem.material ?? ""}
                  onChange={(e) => {
                    const material = materials.find(
                      (m) => m.name === e.target.value,
                    );
                    setNewRequestItem((prev) => ({
                      ...prev,
                      material: e.target.value,
                      available: material?.currentStock ?? 0,
                      unit: material?.unit ?? "kg",
                    }));
                  }}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">เลือกวัตถุดิบ</option>
                  {materials.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-32">
                <input
                  type="number"
                  placeholder="จำนวน"
                  value={newRequestItem.requested || undefined}
                  onChange={(e) =>
                    setNewRequestItem((prev) => ({
                      ...prev,
                      requested: Number(e.target.value) || 0,
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="text-sm text-gray-600">
                คงเหลือ: {newRequestItem.available ?? 0}{" "}
                {newRequestItem.unit ?? "kg"}
              </div>
              <button
                type="button"
                onClick={handleAddRequestItem}
                className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!!(newRequest.items && newRequest.items.length) && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                รายการวัตถุดิบที่ร้องขอ
              </h4>
              <div className="space-y-2">
                {newRequest.items!.map((item, index) => (
                  <div
                    key={`${item.material}-${index}`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded"
                  >
                    <span className="font-medium">{item.material}</span>
                    <div className="text-sm text-gray-600">
                      ขอเบิก: {item.requested} {item.unit ?? ""} | คงเหลือ:{" "}
                      {item.available} {item.unit ?? ""}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updatedItems =
                          newRequest.items?.filter((_, i) => i !== index) || [];
                        setNewRequest((prev) => ({
                          ...prev,
                          items: updatedItems,
                        }));
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
              type="button"
              onClick={() => setShowMaterialRequest(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleCreateRequest}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              สร้างคำขอ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

/** ------------------------------
 *  Parent: RawMaterialManagement
 *  ------------------------------ */
const RawMaterialManagement = () => {
  /* ================================
   NOTE: Default State ภาษาไทย
================================ */

  const [activeTab, setActiveTab] = useState<"materials" | "requests">(
    "materials",
  );

  const [showMaterialRequest, setShowMaterialRequest] = useState(false);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  /* ================================
   NOTE: Mock วัตถุดิบภาษาไทย
================================ */

  const [materials, setMaterials] = useLocalStorage<Material[]>("materials", [
    {
      id: "RM001",
      name: "แป้งสาลี เบอร์ 1",
      category: "วัตถุดิบเบเกอรี่",
      unit: "กก.",
      costPerUnit: 2.5,
      currentStock: 120,
      minimumStock: 200,
      warehouse: "คลังหลัก",
      status: "low",
      yieldPercentage: 95.0,
      lossPercentage: 5.0,
    },
    {
      id: "RM002",
      name: "ปลาแซลมอนสด",
      category: "อาหารทะเล",
      unit: "กก.",
      costPerUnit: 25,
      currentStock: 45,
      minimumStock: 50,
      warehouse: "คลังแช่เย็น",
      status: "critical",
      yieldPercentage: 75,
      lossPercentage: 25,
    },
    {
      id: "RM003",
      name: "น้ำตาลทราย",
      category: "วัตถุดิบเบเกอรี่",
      unit: "กก.",
      costPerUnit: 1.8,
      currentStock: 380,
      minimumStock: 100,
      warehouse: "คลังหลัก",
      status: "good",
      yieldPercentage: 98,
      lossPercentage: 2,
    },
  ]);

  /* ================================
   NOTE: Mock ใบเบิกวัตถุดิบ
================================ */

  const [materialRequests, setMaterialRequests] = useLocalStorage<
    MaterialRequest[]
  >("materialRequests", [
    {
      id: "MR001",
      productionOrder: "ใบสั่งผลิต PO-001",
      requestedBy: "สมชาย ใจดี",
      status: "pending",
      warehouse: "คลังหลัก",
      items: [
        {
          material: "แป้งสาลี เบอร์ 1",
          requested: 50,
          available: 120,
          unit: "กก.",
        },
        {
          material: "น้ำตาลทราย",
          requested: 20,
          available: 380,
          unit: "กก.",
        },
      ],
      createdAt: new Date().toISOString(),
    },
  ]);

  /* ================================
   NOTE: ฟอร์มเพิ่มวัตถุดิบ
================================ */

  const [newMaterial, setNewMaterial] = useState<Partial<Material>>({
    name: "",
    category: "",
    unit: "กก.",
    costPerUnit: undefined,
    currentStock: undefined,
    minimumStock: undefined,
    warehouse: "คลังหลัก",
    status: "good",
    yieldPercentage: 95,
    lossPercentage: 5,
  });

  /* ================================
   NOTE: ฟอร์มใบเบิก
================================ */

  const [newRequest, setNewRequest] = useState<Partial<MaterialRequest>>({
    productionOrder: "",
    requestedBy: "ผู้ใช้งานปัจจุบัน",
    warehouse: "คลังหลัก",
    items: [],
  });

  const [newRequestItem, setNewRequestItem] = useState<
    Partial<MaterialRequestItem>
  >({
    material: "",
    requested: 0,
    available: 0,
    unit: "กก.",
  });

  /* ================================
   NOTE: Filter Search
================================ */

  const filteredMaterials = materials.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  /* ================================
   NOTE: สถานะสต็อก
================================ */

  const getStatusFromStock = (
    current: number,
    minimum: number,
  ): Material["status"] => {
    if (current <= minimum * 0.5) return "critical";
    if (current <= minimum) return "low";
    return "good";
  };

  /* ================================
   NOTE: เพิ่มวัตถุดิบ
================================ */

  const handleAddMaterial = () => {
    if (!newMaterial.name || !newMaterial.category) return;

    const material: Material = {
      id: generateId("RM"),
      name: newMaterial.name!,
      category: newMaterial.category!,
      unit: newMaterial.unit ?? "กก.",
      costPerUnit: newMaterial.costPerUnit ?? undefined,
      currentStock: newMaterial.currentStock ?? undefined,
      minimumStock: newMaterial.minimumStock ?? undefined,
      warehouse: newMaterial.warehouse ?? "คลังหลัก",
      status: getStatusFromStock(
        newMaterial.currentStock ?? 0,
        newMaterial.minimumStock ?? 0,
      ),
      yieldPercentage: newMaterial.yieldPercentage ?? 95,
      lossPercentage: newMaterial.lossPercentage ?? 5,
    };

    setMaterials((prev) => [...prev, material]);

    alert("เพิ่มวัตถุดิบเรียบร้อย");

    setShowAddMaterial(false);
  };

  /* ================================
   NOTE: แก้ไขวัตถุดิบ
================================ */

  const handleEditMaterial = (material: Material) => {
    setEditingMaterial(material);
    setNewMaterial(material);
    setShowAddMaterial(true);
  };

  /* ================================
   NOTE: อัปเดตวัตถุดิบ
================================ */

  const handleUpdateMaterial = () => {
    if (!editingMaterial) return;

    const updatedMaterial = {
      ...editingMaterial,
      ...newMaterial,
    };

    setMaterials((prev) =>
      prev.map((m) => (m.id === editingMaterial.id ? updatedMaterial : m)),
    );

    alert("แก้ไขวัตถุดิบเรียบร้อย");

    setShowAddMaterial(false);
  };

  /* ================================
   NOTE: ลบวัตถุดิบ
================================ */

  const handleDeleteMaterial = (id: string) => {
    if (confirm("ต้องการลบวัตถุดิบรายการนี้ใช่หรือไม่?")) {
      setMaterials((prev) => prev.filter((m) => m.id !== id));
    }
  };

  /* ================================
   NOTE: เพิ่มรายการใบเบิก
================================ */

  const handleAddRequestItem = () => {
    if (
      !newRequestItem.material ||
      !newRequestItem.requested ||
      newRequestItem.requested <= 0
    ) {
      alert("กรุณาเลือกวัตถุดิบและระบุจำนวนให้ถูกต้อง");
      return;
    }

    const material = materials.find((m) => m.name === newRequestItem.material);

    const item: MaterialRequestItem = {
      material: newRequestItem.material!,
      requested: newRequestItem.requested!,
      available: material?.currentStock ?? 0,
      unit: material?.unit ?? "กก.",
    };

    setNewRequest((prev) => ({
      ...prev,
      items: [...(prev.items ?? []), item],
    }));

    alert("เพิ่มรายการใบเบิกเรียบร้อย");
  };

  /* ================================
   NOTE: สร้างใบเบิก
================================ */

  const handleCreateRequest = () => {
    const request: MaterialRequest = {
      id: generateId("MR"),
      productionOrder: newRequest.productionOrder || "",
      requestedBy: newRequest.requestedBy || "ผู้ใช้งาน",
      status: "pending",
      warehouse: newRequest.warehouse || "คลังหลัก",
      items: newRequest.items || [],
      createdAt: new Date().toISOString(),
    };

    setMaterialRequests((prev) => [...prev, request]);

    alert("สร้างใบเบิกวัตถุดิบสำเร็จ");

    setShowMaterialRequest(false);
  };

  /* ================================
   NOTE: อัปเดตสถานะใบเบิก
================================ */

  const handleUpdateRequestStatus = (
    id: string,
    status: MaterialRequest["status"],
  ) => {
    setMaterialRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status } : req)),
    );
  };

  /* ================================
   NOTE: ลบใบเบิก
================================ */

  const handleDeleteRequest = (id: string) => {
    if (confirm("ต้องการลบใบเบิกรายการนี้ใช่หรือไม่?")) {
      setMaterialRequests((prev) => prev.filter((req) => req.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">จัดการวัตถุดิบ</h2>
        <button
          type="button"
          onClick={() => setShowMaterialRequest(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>สร้างคำขอวัตถุดิบ</span>{" "}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "materials", name: "ข้อมูลวัตถุดิบ", icon: Package },
            { id: "requests", name: "คำขอเบิกวัตถุดิบ", icon: WarehouseIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "materials" | "requests")}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {activeTab === "materials" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                รายการวัตถุดิบ
              </h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="ค้นหาวัตถุดิบ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddMaterial(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>เพิ่มวัตถุดิบ</span>
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    วัตถุดิบ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    หมวดหมู่
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ราคาต่อหน่วย
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    สต๊อกปัจจุบัน
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    สต๊อกขั้นต่ำ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    คลังสินค้า
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    สถานะ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    การจัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMaterials.map((material) => (
                  <tr key={material.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">
                          {material.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {material.id}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {material.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {material.costPerUnit.toFixed(2)} บาท/{material.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {material.currentStock} {material.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {material.minimumStock} {material.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {material.warehouse}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          material.status === "critical"
                            ? "bg-red-100 text-red-800"
                            : material.status === "low"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {material.status === "critical" && (
                          <AlertTriangle className="w-3 h-3 mr-1" />
                        )}
                        {material.status === "critical"
                          ? "วิกฤต"
                          : material.status === "low"
                            ? "สต๊อกต่ำ"
                            : "ปกติ"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEditMaterial(material)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
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

      {activeTab === "requests" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              รายการคำขอเบิกวัตถุดิบ
            </h3>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {materialRequests.map((request) => (
                <div
                  key={request.id}
                  className="border border-gray-200 rounded-lg p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {request.id}
                      </h4>
                      <p className="text-sm text-gray-600">
                        ใบสั่งผลิต: {request.productionOrder} | ผู้ขอเบิก: by:{" "}
                        {request.requestedBy}
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-sm rounded-full`}>
                      {request.status === "pending"
                        ? "รอดำเนินการ"
                        : request.status === "approved"
                          ? "อนุมัติแล้ว"
                          : request.status === "completed"
                            ? "เสร็จสิ้น"
                            : request.status === "cancelled"
                              ? "ยกเลิก"
                              : request.status}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {request.items.map((item, index) => (
                      <div
                        key={`${item.material}-${index}`}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded"
                      >
                        <span className="font-medium">{item.material}</span>
                        <div className="text-sm text-gray-600">
                          ขอเบิก: {item.requested} {item.unit ?? ""} | คงเหลือ:{" "}
                          {item.available} {item.unit ?? ""}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
                    {request.status === "pending" && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateRequestStatus(request.id, "approved")
                          }
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                          อนุมัติคำขอ
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateRequestStatus(request.id, "cancelled")
                          }
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                        >
                          ยกเลิกคำขอ
                        </button>
                      </>
                    )}
                    {request.status === "approved" && (
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateRequestStatus(request.id, "completed")
                        }
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                      >
                        ทำรายการเสร็จสิ้น
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                    >
                      พิมพ์ใบเบิก
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteRequest(request.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ลบรายการ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showAddMaterial && (
        <MaterialForm
          editingMaterial={editingMaterial}
          newMaterial={newMaterial}
          setNewMaterial={setNewMaterial}
          setShowAddMaterial={setShowAddMaterial}
          handleAddMaterial={handleAddMaterial}
          handleUpdateMaterial={handleUpdateMaterial}
          setEditingMaterial={setEditingMaterial}
        />
      )}

      {showMaterialRequest && (
        <MaterialRequestForm
          newRequest={newRequest}
          setNewRequest={setNewRequest}
          newRequestItem={newRequestItem}
          setNewRequestItem={setNewRequestItem}
          materials={materials}
          handleAddRequestItem={handleAddRequestItem}
          handleCreateRequest={handleCreateRequest}
          setShowMaterialRequest={setShowMaterialRequest}
        />
      )}
    </div>
  );
};

export default RawMaterialManagement;
