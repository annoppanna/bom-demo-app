import React, { useState } from "react";
import { X, Save, Plus } from "lucide-react";

interface CreatePlanModalProps {
  onClose: () => void;
  onSave: (plan: any) => void;
}

const CreatePlanModal: React.FC<CreatePlanModalProps> = ({
  onClose,
  onSave,
}) => {
  const [newPlan, setNewPlan] = useState({
    product: "",
    plannedQuantity: 0,
    unit: "กิโลกรัม",
    priority: "medium",
    startTime: "08:00",
    endTime: "16:00",
    materials: [] as any[],
  });

  const [newMaterial, setNewMaterial] = useState({
    name: "",
    required: 0,
    unit: "กิโลกรัม",
  });

  const handleAddMaterial = () => {
    if (!newMaterial.name || newMaterial.required <= 0) return;

    setNewPlan({
      ...newPlan,
      materials: [...newPlan.materials, newMaterial],
    });

    setNewMaterial({
      name: "",
      required: 0,
      unit: "kg",
    });
  };

  const handleRemoveMaterial = (index: number) => {
    const updated = newPlan.materials.filter((_, i) => i !== index);
    setNewPlan({ ...newPlan, materials: updated });
  };

  const handleSave = () => {
    if (!newPlan.product) return;
    onSave(newPlan);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">สร้างแผนการผลิต</h3>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">สินค้า</label>
              <input
                className="w-full border rounded px-3 py-2 mt-1"
                value={newPlan.product}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, product: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">จำนวน</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2 mt-1"
                value={newPlan.plannedQuantity || undefined}
                onChange={(e) =>
                  setNewPlan({
                    ...newPlan,
                    plannedQuantity: Number(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">หน่วย</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 mt-1"
                value={newPlan.unit}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, unit: e.target.value })
                }
                disabled
              />
            </div>

            <div>
              <label className="text-sm font-medium">ลำดับความสำคัญ</label>
              <select
                className="w-full border rounded px-3 py-2 mt-1"
                value={newPlan.priority}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, priority: e.target.value })
                }
              >
                <option value="high">สูง</option>
                <option value="medium">ปานกลาง</option>
                <option value="low">ต่ำ</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">เวลาเริ่มต้น</label>
              <input
                type="time"
                className="w-full border rounded px-3 py-2 mt-1"
                value={newPlan.startTime}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, startTime: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">เวลาสิ้นสุด</label>
              <input
                type="time"
                className="w-full border rounded px-3 py-2 mt-1"
                value={newPlan.endTime}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, endTime: e.target.value })
                }
              />
            </div>
          </div>

          {/* Materials */}
          <div>
            <h4 className="font-semibold mb-3">วัตถุดิบที่ต้องใช้</h4>

            <div className="grid grid-cols-4 gap-3 border p-4 rounded">
              <input
                placeholder="ชื่อวัตถุดิบ"
                className="border px-3 py-2 rounded"
                value={newMaterial.name}
                onChange={(e) =>
                  setNewMaterial({ ...newMaterial, name: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="จำนวนที่ต้องใช้"
                className="border px-3 py-2 rounded"
                value={newMaterial.required || undefined}
                onChange={(e) =>
                  setNewMaterial({
                    ...newMaterial,
                    required: Number(e.target.value),
                  })
                }
              />

              {/* <select
                className="border px-3 py-2 rounded"
                value={newMaterial.unit}
                onChange={(e) =>
                  setNewMaterial({ ...newMaterial, unit: e.target.value })
                }
              >
                <option>kg</option>
                <option>g</option>
                <option>l</option>
                <option>ml</option>
                <option>pieces</option>
              </select> */}

              <input
                type="text"
                value={newMaterial.unit}
                onChange={(e) =>
                  setNewMaterial({ ...newMaterial, unit: e.target.value })
                }
                className="border px-3 py-2 rounded"
                disabled
              />

              <button
                onClick={handleAddMaterial}
                className="bg-blue-600 text-white rounded flex items-center justify-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                เพิ่ม
              </button>
            </div>

            {/* Material List */}
            {newPlan.materials.length > 0 && (
              <div className="mt-4 space-y-2">
                {newPlan.materials.map((mat, index) => (
                  <div
                    key={index}
                    className="flex justify-between bg-gray-50 p-3 rounded"
                  >
                    <span>{mat.name}</span>
                    <span>
                      {mat.required} {mat.unit}
                    </span>
                    <button
                      onClick={() => handleRemoveMaterial(index)}
                      className="text-red-500"
                    >
                      ลบ
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <button
              onClick={onClose}
              className="border px-5 py-2 rounded text-gray-700"
            >
              ยกเลิก
            </button>

            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-5 py-2 rounded flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              บันทึกแผน
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePlanModal;
