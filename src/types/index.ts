export interface Material {
  id: string;
  name: string;
  category: string;
  unit: string;
  costPerUnit: number;
  currentStock: number;
  minimumStock: number;
  warehouse: string;
  status: 'good' | 'low' | 'critical';
  yieldPercentage?: number;
  lossPercentage?: number;
}

export interface MaterialRequest {
  id: string;
  productionOrder: string;
  requestedBy: string;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  warehouse: string;
  items: MaterialRequestItem[];
  createdAt: string;
}

export interface MaterialRequestItem {
  material: string;
  requested: number;
  available: number;
  unit?: string;
}

export interface ProductionOrder {
  id: string;
  productName: string;
  productionType: 'Build to Sell' | 'Break to Sell';
  quantity: number;
  unit: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  progress: number;
  plannedStart: string;
  estimatedEnd: string;
  actualStart?: string;
  actualEnd?: string;
  materials: ProductionMaterial[];
  yield: {
    expected: number;
    actual: number;
    percentage: number;
  };
  loss: {
    expected: number;
    actual: number;
    percentage: number;
  };
  products?: OutputProduct[];
}

export interface ProductionMaterial {
  name: string;
  required: number;
  used: number;
  unit: string;
}

export interface OutputProduct {
  name: string;
  quantity: number;
  unit: string;
}

export interface Formula {
  id: string;
  name: string;
  version: string;
  status: 'draft' | 'approved' | 'testing';
  productType: 'Build to Sell' | 'Break to Sell';
  createdBy: string;
  lastModified: string;
  grossProfit: number;
  sellingPrice: number;
  materialCost: number;
  processCost: number;
  ingredients: Ingredient[];
  yieldLoss?: YieldLoss;
}

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  cost: number;
  type: 'main' | 'secondary';
}

export interface YieldLoss {
  expectedYield: number;
  expectedLoss: number;
  products: {
    name: string;
    yield: number;
    price: number;
  }[];
}

export interface DraftVersion {
  id: string;
  formulaId: string;
  version: string;
  changes: string[];
  createdBy: string;
  createdAt: string;
}

export interface User {
  id: number;
  name: string;
  role: string;
  email: string;
  status: 'active' | 'inactive';
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'inactive';
}

export interface Integration {
  name: string;
  status: 'connected' | 'disconnected';
  lastSync: string | null;
  description: string;
}