import { useState } from "react";
import {
  Plus,
  Search,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  AlertCircle,
  Printer,
  Save,
  X,
} from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { generateId } from "../utils/generateId";
import type {
  ProductionOrder,
  ProductionMaterial,
  OutputProduct,
} from "../types";

const ProductionOrders = () => {
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [editingOrder, setEditingOrder] = useState<ProductionOrder | null>(
    null,
  );
  const [viewingOrder, setViewingOrder] = useState<ProductionOrder | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");

  const [productionOrders, setProductionOrders] = useLocalStorage<
    ProductionOrder[]
  >("productionOrders", [
    {
      id: "PO-001",
      productName: "ขนมปังขาว",
      productionType: "ผลิตเพื่อจำหน่าย",
      quantity: 500,
      unit: "ก้อน",
      status: "in-progress",
      progress: 75,
      plannedStart: "2025-01-01T08:00:00Z",
      estimatedEnd: "2025-01-01T16:00:00Z",
      actualStart: "2025-01-01T08:15:00Z",
      materials: [
        { name: "แป้งชนิดที่ 1", required: 200, used: 150, unit: "กก." },
        { name: "น้ำตาล", required: 50, used: 37.5, unit: "กก." },
        { name: "ยีสต์", required: 5, used: 3.75, unit: "กก." },
      ],
      yield: {
        expected: 500,
        actual: 375,
        percentage: 75,
      },
      loss: {
        expected: 0,
        actual: 12,
        percentage: 2.4,
      },
    },

    {
      id: "PO-002",
      productName: "เนื้อปลาแล่",
      productionType: "แปรรูปเพื่อจำหน่าย",
      quantity: 100,
      unit: "กก.",
      status: "completed",
      progress: 100,
      plannedStart: "2024-12-31T10:00:00Z",
      estimatedEnd: "2024-12-31T14:00:00Z",
      actualStart: "2024-12-31T10:00:00Z",
      actualEnd: "2024-12-31T13:45:00Z",
      materials: [
        { name: "ปลาแซลมอนสด", required: 120, used: 120, unit: "กก." },
      ],
      yield: {
        expected: 100,
        actual: 95,
        percentage: 95,
      },
      loss: {
        expected: 20,
        actual: 25,
        percentage: 20.8,
      },
      products: [
        { name: "เนื้อปลาแซลมอน", quantity: 75, unit: "กก." },
        { name: "หัวปลาแซลมอน", quantity: 15, unit: "กก." },
        { name: "ก้างปลาแซลมอน", quantity: 5, unit: "กก." },
      ],
    },
  ]);

  const [newOrder, setNewOrder] = useState<Partial<ProductionOrder>>({
    productName: "",
    productionType: "ผลิตเพื่อจำหน่าย",
    quantity: 0,
    unit: "ชิ้น",
    status: "pending",
    progress: 0,
    plannedStart: "",
    estimatedEnd: "",
    materials: [],
    yield: { expected: 0, actual: 0, percentage: 0 },
    loss: { expected: 0, actual: 0, percentage: 0 },
  });

  const [newMaterial, setNewMaterial] = useState<Partial<ProductionMaterial>>({
    name: "",
    required: 0,
    used: 0,
    unit: "กก.",
  });

  const [newProduct, setNewProduct] = useState<Partial<OutputProduct>>({
    name: "",
    quantity: 0,
    unit: "กก.",
  });

  const filteredOrders = productionOrders.filter(
    (order) =>
      order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-[#8F262B]" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-[#8F262B]" />;
      case "pending":
        return <AlertCircle className="w-5 h-5 text-[#8F262B]" />;
      default:
        return <Clock className="w-5 h-5 text-[#8F262B]" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"; // เสร็จสิ้น
      case "in-progress":
        return "bg-blue-100 text-blue-800"; // กำลังดำเนินการ
      case "pending":
        return "bg-orange-100 text-orange-800"; // รอดำเนินการ
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCreateOrder = () => {
    const order: ProductionOrder = {
      id: generateId("PO"),
      productName: newOrder.productName ?? generateId("NOP"),
      productionType: newOrder.productionType ?? "ผลิตเพื่อจำหน่าย",
      quantity: newOrder.quantity ?? 1,
      unit: newOrder.unit || "ชิ้น",
      status: "pending",
      progress: 0,
      plannedStart: newOrder.plannedStart || new Date().toISOString(),
      estimatedEnd:
        newOrder.estimatedEnd ||
        new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      materials: newOrder.materials || [],
      yield: { expected: newOrder.quantity, actual: 0, percentage: 0 },
      loss: { expected: 0, actual: 0, percentage: 0 },
      products: newOrder.products || [],
    };

    setProductionOrders([...productionOrders, order]);
    resetNewOrder();
    setShowCreateOrder(false);
  };

  const handleUpdateOrder = () => {
    const updatedOrder: ProductionOrder = {
      ...editingOrder,
      productName: newOrder.productName ?? generateId("NOP"),
      productionType: newOrder.productionType || "ผลิตเพื่อจำหน่าย",
      quantity: newOrder.quantity ?? 1,
      unit: newOrder.unit || "ชิ้น",
      plannedStart: newOrder.plannedStart || editingOrder?.plannedStart,
      estimatedEnd: newOrder.estimatedEnd || editingOrder?.estimatedEnd,
      materials: newOrder.materials || [],
      products: newOrder.products || [],
    };

    setProductionOrders(
      productionOrders.map((order) =>
        order.id === editingOrder?.id ? updatedOrder : order,
      ),
    );

    setEditingOrder(null);
    resetNewOrder();
    setShowCreateOrder(false);
  };

  const handleUpdateOrderStatus = (
    id: string,
    status: ProductionOrder["status"],
    progress?: number,
  ) => {
    setProductionOrders(
      productionOrders.map((order) => {
        if (order.id === id) {
          const updatedOrder = { ...order, status };

          if (progress !== undefined) {
            updatedOrder.progress = progress;
          }

          if (status === "in-progress" && !order.actualStart) {
            updatedOrder.actualStart = new Date().toISOString();
          }

          if (status === "completed") {
            updatedOrder.progress = 100;
            updatedOrder.actualEnd = new Date().toISOString();
          }

          return updatedOrder;
        }

        return order;
      }),
    );
  };

  const handleDeleteOrder = (id: string) => {
    if (confirm("คุณต้องการลบใบสั่งผลิตนี้หรือไม่?")) {
      setProductionOrders(productionOrders.filter((order) => order.id !== id));
    }
  };

  const handleAddMaterial = () => {
    const material: ProductionMaterial = {
      name: `วัตถุดิบ-${newOrder.materials.length + 1}`,
      required: 1,
      used: 10,
      unit: newMaterial.unit || "กก.",
    };

    setNewOrder({
      ...newOrder,
      materials: [...(newOrder.materials || []), material],
    });

    setNewMaterial({
      name: "",
      required: 0,
      used: 0,
      unit: "กก.",
    });
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.quantity) return;

    const product: OutputProduct = {
      name: newProduct.name,
      quantity: newProduct.quantity,
      unit: newProduct.unit || "กก.",
    };

    setNewOrder({
      ...newOrder,
      products: [...(newOrder.products || []), product],
    });

    setNewProduct({
      name: "",
      quantity: 0,
      unit: "กก.",
    });
  };

  const resetNewOrder = () => {
    setNewOrder({
      productName: "",
      productionType: "ผลิตเพื่อจำหน่าย",
      quantity: 0,
      unit: "ชิ้น",
      status: "pending",
      progress: 0,
      plannedStart: "",
      estimatedEnd: "",
      materials: [],
      yield: { expected: 0, actual: 0, percentage: 0 },
      loss: { expected: 0, actual: 0, percentage: 0 },
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
      products: order.products,
    });

    setShowCreateOrder(true);
  };

  const CreateOrderModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingOrder ? "แก้ไขใบสั่งผลิต" : "สร้างใบสั่งผลิต"}
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
          {/* ================== ข้อมูลหลัก ================== */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ประเภทการผลิต
              </label>

              <select
                value={newOrder.productionType}
                onChange={(e) =>
                  setNewOrder({
                    ...newOrder,
                    productionType: e.target.value as
                      | "Build to Sell"
                      | "Break to Sell",
                  })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="Build to Sell">ผลิตเพื่อจำหน่าย</option>
                <option value="Break to Sell">แปรรูปเพื่อจำหน่าย</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ชื่อสินค้า
              </label>

              <input
                type="text"
                placeholder="กรอกชื่อสินค้า"
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                จำนวนที่วางแผนผลิต
              </label>

              <input
                type="number"
                placeholder="กรอกจำนวน"
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                หน่วย
              </label>

              <select
                value={newOrder.unit}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, unit: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="pieces">ชิ้น</option>
                <option value="kg">กิโลกรัม</option>
                <option value="loaves">ก้อน</option>
                <option value="liters">ลิตร</option>
              </select>
            </div>
          </div>

          {/* ================== วันที่ผลิต ================== */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                วันที่เริ่มผลิต
              </label>

              <input
                type="datetime-local"
                value={
                  newOrder.plannedStart
                    ? new Date(newOrder.plannedStart).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  setNewOrder({
                    ...newOrder,
                    plannedStart: e.target.value
                      ? new Date(e.target.value).toISOString()
                      : "",
                  })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                วันที่คาดว่าจะเสร็จ
              </label>

              <input
                type="datetime-local"
                value={
                  newOrder.estimatedEnd
                    ? new Date(newOrder.estimatedEnd).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  setNewOrder({
                    ...newOrder,
                    estimatedEnd: e.target.value
                      ? new Date(e.target.value).toISOString()
                      : "",
                  })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>

          {/* ================== วัตถุดิบ ================== */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              วัตถุดิบที่ใช้ในการผลิต
            </h4>

            <div className="grid grid-cols-4 gap-4 p-4 border rounded-lg">
              <div>
                <label className="text-xs text-gray-500">ชื่อวัตถุดิบ</label>
                <input
                  type="text"
                  placeholder="ชื่อวัตถุดิบ"
                  className="w-full border px-3 py-2 text-sm rounded-md"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">จำนวนที่ใช้</label>
                <input
                  type="number"
                  className="w-full border px-3 py-2 text-sm rounded-md"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">หน่วย</label>

                <select
                  value={newMaterial.unit}
                  onChange={(e) =>
                    setNewMaterial({ ...newMaterial, unit: e.target.value })
                  }
                  className="w-full border px-3 py-2 text-sm rounded-md"
                >
                  <option value="kg">กิโลกรัม</option>
                  <option value="g">กรัม</option>
                  <option value="l">ลิตร</option>
                  <option value="ml">มิลลิลิตร</option>
                  <option value="pieces">ชิ้น</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleAddMaterial}
                  className="w-full bg-blue-600 text-white py-2 rounded-md"
                >
                  เพิ่มวัตถุดิบ
                </button>
              </div>
            </div>

            {newOrder.materials?.length > 0 && (
              <div className="mt-4">
                <h5 className="font-medium mb-2">รายการวัตถุดิบที่เพิ่มแล้ว</h5>

                {newOrder.materials.map((material, index) => (
                  <div
                    key={index}
                    className="flex justify-between p-3 bg-gray-50 rounded"
                  >
                    <span>{material.name}</span>

                    <span>
                      {material.required} {material.unit}
                    </span>

                    <button
                      className="text-red-600"
                      onClick={() => {
                        const updatedMaterials =
                          newOrder.materials?.filter((_, i) => i !== index) ||
                          [];

                        setNewOrder({
                          ...newOrder,
                          materials: updatedMaterials,
                        });
                      }}
                    >
                      ลบ
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ================== ผลผลิต ================== */}
          {newOrder.productionType === "Break to Sell" && (
            <div>
              <h4 className="text-lg font-medium mb-4">ผลผลิตที่คาดว่าจะได้</h4>

              <div className="grid grid-cols-4 gap-4 p-4 border rounded-lg">
                <div>
                  <label className="text-xs text-gray-500">ชื่อสินค้า</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    className="w-full border px-3 py-2 text-sm rounded-md"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500">
                    จำนวนที่คาดว่าจะได้
                  </label>
                  <input
                    type="number"
                    value={newProduct.quantity}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        quantity: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full border px-3 py-2 text-sm rounded-md"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500">หน่วย</label>
                  <select
                    value={newProduct.unit}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, unit: e.target.value })
                    }
                    className="w-full border px-3 py-2 text-sm rounded-md"
                  >
                    <option value="kg">กิโลกรัม</option>
                    <option value="pieces">ชิ้น</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleAddProduct}
                    className="w-full bg-green-600 text-white py-2 rounded-md"
                  >
                    เพิ่มสินค้า
                  </button>
                </div>
              </div>

              {newOrder.products?.length > 0 && (
                <div className="mt-4">
                  <h5 className="font-medium mb-2">รายการผลผลิต</h5>

                  {newOrder.products.map((product, index) => (
                    <div
                      key={index}
                      className="flex justify-between p-3 bg-gray-50 rounded"
                    >
                      <span>{product.name}</span>

                      <span>
                        {product.quantity} {product.unit}
                      </span>

                      <button
                        className="text-red-600"
                        onClick={() => {
                          const updatedProducts =
                            newOrder.products?.filter((_, i) => i !== index) ||
                            [];

                          setNewOrder({
                            ...newOrder,
                            products: updatedProducts,
                          });
                        }}
                      >
                        ลบ
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================== ปุ่ม ================== */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              onClick={() => {
                setShowCreateOrder(false);
                setEditingOrder(null);
                resetNewOrder();
              }}
              className="px-6 py-2 border rounded-md"
            >
              ยกเลิก
            </button>

            <button
              onClick={editingOrder ? handleUpdateOrder : handleCreateOrder}
              className="px-6 py-2 bg-blue-600 text-white rounded-md flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{editingOrder ? "บันทึกการแก้ไข" : "สร้างใบสั่งผลิต"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ViewOrderModal = () =>
    viewingOrder && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          {/* ===== Header ===== */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                รายละเอียดใบสั่งผลิต
              </h3>

              <button
                onClick={() => setViewingOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* ===== Content ===== */}
          <div className="p-6 space-y-6">
            {/* ===== ข้อมูลใบสั่งผลิต ===== */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  ข้อมูลใบสั่งผลิต
                </h4>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">เลขที่ใบสั่งผลิต:</span>
                    <span>{viewingOrder.id}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">สินค้า:</span>
                    <span>{viewingOrder.productName}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">ประเภทการผลิต:</span>
                    <span>{viewingOrder.productionType}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">จำนวน:</span>
                    <span>
                      {viewingOrder.quantity} {viewingOrder.unit}
                    </span>
                  </div>
                </div>
              </div>

              {/* ===== Timeline ===== */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  ระยะเวลาดำเนินการ
                </h4>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">เริ่มผลิตตามแผน:</span>
                    <span>
                      {new Date(viewingOrder.plannedStart).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">กำหนดเสร็จตามแผน:</span>
                    <span>
                      {new Date(viewingOrder.estimatedEnd).toLocaleString()}
                    </span>
                  </div>

                  {viewingOrder.actualStart && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">เริ่มผลิตจริง:</span>
                      <span>
                        {new Date(viewingOrder.actualStart).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {viewingOrder.actualEnd && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">เสร็จสิ้นจริง:</span>
                      <span>
                        {new Date(viewingOrder.actualEnd).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ===== วัตถุดิบที่ใช้ ===== */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                วัตถุดิบที่ใช้ในการผลิต
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">วัตถุดิบ</th>
                      <th className="px-4 py-2 text-left">ปริมาณที่ต้องใช้</th>
                      <th className="px-4 py-2 text-left">ปริมาณที่ใช้จริง</th>
                      <th className="px-4 py-2 text-left">หน่วย</th>
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

            {/* ===== ผลผลิต ===== */}
            {viewingOrder.products && viewingOrder.products.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">ผลผลิตที่ได้</h4>

                <div className="grid grid-cols-3 gap-4">
                  {viewingOrder.products.map((product, index) => (
                    <div
                      key={index}
                      className="p-3 border border-gray-200 rounded-lg"
                    >
                      <div className="font-medium text-sm">{product.name}</div>

                      <div className="text-xs text-gray-600">
                        {product.quantity} {product.unit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">ใบสั่งผลิต</h2>

        <button
          onClick={() => setShowCreateOrder(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>สร้างใบสั่งผลิต</span>
        </button>
      </div>

      {/* ===== Card ===== */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* ===== Header Table ===== */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              รายการใบสั่งผลิต
            </h3>

            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />

              <input
                type="text"
                placeholder="ค้นหาใบสั่งผลิต..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* ===== Order List ===== */}
        <div className="divide-y divide-gray-200">
          {filteredOrders.map((order) => (
            <div key={order.id} className="p-6">
              {/* ===== Order Header ===== */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(order.status)}

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {order.id}
                    </h4>

                    <p className="text-sm text-gray-600">
                      {order.productName} ({order.productionType})
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}
                  >
                    {order.status.replace("-", " ").toUpperCase()}
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

              {/* ===== Grid Info ===== */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ===== Order Detail ===== */}
                <div className="space-y-3">
                  <h5 className="font-medium text-gray-900">
                    รายละเอียดใบสั่งผลิต
                  </h5>

                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">จำนวนผลิต:</span>
                      <span>
                        {order.quantity} {order.unit}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">เริ่มผลิตตามแผน:</span>
                      <span>
                        {new Date(order.plannedStart).toLocaleDateString()}
                      </span>
                    </div>

                    {order.actualStart && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">เริ่มผลิตจริง:</span>
                        <span>
                          {new Date(order.actualStart).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* ===== Progress ===== */}
                  {order.status === "in-progress" && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>ความคืบหน้า</span>
                        <span>{order.progress}%</span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#8F262B] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${order.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* ===== Materials ===== */}
                <div className="space-y-3">
                  <h5 className="font-medium text-gray-900">วัตถุดิบที่ใช้</h5>

                  <div className="space-y-2">
                    {order.materials.map((material, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">{material.name}:</span>

                        <span>
                          {material.used}/{material.required} {material.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ===== Yield & Loss ===== */}
                <div className="space-y-3">
                  <h5 className="font-medium text-gray-900">
                    อัตราผลผลิต และ การสูญเสีย
                  </h5>

                  <div className="space-y-2">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-700 font-medium">
                          Yield (ผลผลิต):
                        </span>

                        <span className="text-green-700">
                          {order.yield.percentage}%
                        </span>
                      </div>

                      <div className="text-xs text-green-600 mt-1">
                        {order.yield.actual}/{order.yield.expected} หน่วย
                      </div>
                    </div>

                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span className="text-red-700 font-medium">
                          Loss (สูญเสีย):
                        </span>

                        <span className="text-red-700">
                          {order.loss.percentage}%
                        </span>
                      </div>

                      <div className="text-xs text-red-600 mt-1">
                        สูญเสีย {order.loss.actual} หน่วย
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ===== Output Product ===== */}
              {order.productionType === "Break to Sell" && order.products && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h5 className="font-medium text-gray-900 mb-3">
                    ผลผลิตที่ได้
                  </h5>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {order.products.map((product, index) => (
                      <div
                        key={index}
                        className="p-3 border border-gray-200 rounded-lg"
                      >
                        <div className="font-medium text-sm">
                          {product.name}
                        </div>

                        <div className="text-xs text-gray-600">
                          {product.quantity} {product.unit}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ===== Actions ===== */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex space-x-4">
                  {order.status === "pending" && (
                    <button
                      onClick={() =>
                        handleUpdateOrderStatus(order.id, "in-progress")
                      }
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      เริ่มการผลิต
                    </button>
                  )}

                  {order.status === "in-progress" && (
                    <>
                      <button
                        onClick={() =>
                          handleUpdateOrderStatus(order.id, "completed")
                        }
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                      >
                        ปิดงานการผลิต
                      </button>

                      <button
                        onClick={() => {
                          const progress = prompt(
                            "กรอกเปอร์เซ็นต์ความคืบหน้า (0-100):",
                            order.progress.toString(),
                          );

                          if (progress !== null) {
                            const progressNum = Math.max(
                              0,
                              Math.min(100, parseInt(progress) || 0),
                            );

                            handleUpdateOrderStatus(
                              order.id,
                              "in-progress",
                              progressNum,
                            );
                          }
                        }}
                        className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
                      >
                        อัปเดตความคืบหน้า
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className="text-red-600 hover:text-red-800 px-4 py-2"
                  >
                    ลบใบสั่งผลิต
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
