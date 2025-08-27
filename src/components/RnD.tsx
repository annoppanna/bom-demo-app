import React, { useState } from 'react';
import { Plus, Search, Eye, Edit, CheckCircle, Clock, FlaskConical, Copy } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateId } from '../utils/generateId';
import type { Formula, Ingredient, DraftVersion } from '../types';

const RnD = () => {
  const [activeTab, setActiveTab] = useState('formulas');
  const [showCreateFormula, setShowCreateFormula] = useState(false);
  const [editingFormula, setEditingFormula] = useState<Formula | null>(null);

  const [formulas, setFormulas] = useLocalStorage<Formula[]>('formulas', [
    {
      id: 'F001',
      name: 'White Bread Premium',
      version: '2.1',
      status: 'approved',
      productType: 'Build to Sell',
      createdBy: 'R&D Team',
      lastModified: '2025-01-01',
      grossProfit: 35.2,
      sellingPrice: 4.50,
      materialCost: 2.25,
      processCost: 0.67,
      ingredients: [
        { name: 'Flour Type 1', quantity: 400, unit: 'g', cost: 1.00, type: 'main' },
        { name: 'Sugar', quantity: 50, unit: 'g', cost: 0.09, type: 'main' },
        { name: 'Yeast', quantity: 10, unit: 'g', cost: 0.12, type: 'secondary' },
        { name: 'Salt', quantity: 8, unit: 'g', cost: 0.02, type: 'secondary' },
        { name: 'Butter', quantity: 30, unit: 'g', cost: 0.45, type: 'secondary' }
      ]
    },
    {
      id: 'F002',
      name: 'Fish Fillet Process',
      version: '1.5',
      status: 'draft',
      productType: 'Break to Sell',
      createdBy: 'Process Engineer',
      lastModified: '2024-12-30',
      grossProfit: 28.5,
      sellingPrice: 18.00,
      materialCost: 12.00,
      processCost: 0.87,
      ingredients: [
        { name: 'Fresh Salmon', quantity: 1200, unit: 'g', cost: 12.00, type: 'main' }
      ],
      yieldLoss: {
        expectedYield: 75,
        expectedLoss: 25,
        products: [
          { name: 'Salmon Fillet', yield: 60, price: 22.00 },
          { name: 'Salmon Head', yield: 12, price: 8.00 },
          { name: 'Salmon Bones', yield: 3, price: 3.00 }
        ]
      }
    }
  ]);

  const [draftVersions, setDraftVersions] = useLocalStorage<DraftVersion[]>('draftVersions', [
    {
      id: 'F001-draft',
      formulaId: 'F001',
      version: '2.2-draft',
      changes: ['Reduced sugar by 5g', 'Added vanilla extract'],
      createdBy: 'John Smith',
      createdAt: '2025-01-01T14:30:00Z'
    }
  ]);

  const [newFormula, setNewFormula] = useState<Partial<Formula>>({
    name: '',
    productType: 'Build to Sell',
    grossProfit: 35,
    processCost: 0,
    ingredients: []
  });

  const [newIngredient, setNewIngredient] = useState<Partial<Ingredient>>({
    name: '',
    quantity: 0,
    unit: 'g',
    cost: 0,
    type: 'main'
  });

  const handleCreateFormula = () => {
    if (!newFormula.name) return;

    const materialCost = (newFormula.ingredients || []).reduce((sum, ing) => sum + ing.cost, 0);
    const totalCost = materialCost + (newFormula.processCost || 0);
    const sellingPrice = totalCost / (1 - (newFormula.grossProfit || 35) / 100);

    const formula: Formula = {
      id: generateId('F'),
      name: newFormula.name,
      version: '1.0',
      status: 'draft',
      productType: newFormula.productType || 'Build to Sell',
      createdBy: 'Current User',
      lastModified: new Date().toISOString().split('T')[0],
      grossProfit: newFormula.grossProfit || 35,
      sellingPrice,
      materialCost,
      processCost: newFormula.processCost || 0,
      ingredients: newFormula.ingredients || []
    };

    setFormulas([...formulas, formula]);
    resetNewFormula();
    setShowCreateFormula(false);
  };

  const handleUpdateFormula = () => {
    if (!editingFormula || !newFormula.name) return;

    const materialCost = (newFormula.ingredients || []).reduce((sum, ing) => sum + ing.cost, 0);
    const totalCost = materialCost + (newFormula.processCost || 0);
    const sellingPrice = totalCost / (1 - (newFormula.grossProfit || 35) / 100);

    const updatedFormula: Formula = {
      ...editingFormula,
      name: newFormula.name,
      productType: newFormula.productType || 'Build to Sell',
      grossProfit: newFormula.grossProfit || 35,
      sellingPrice,
      materialCost,
      processCost: newFormula.processCost || 0,
      ingredients: newFormula.ingredients || [],
      lastModified: new Date().toISOString().split('T')[0]
    };

    setFormulas(formulas.map(f => f.id === editingFormula.id ? updatedFormula : f));
    setEditingFormula(null);
    resetNewFormula();
    setShowCreateFormula(false);
  };

  const handleApproveFormula = (id: string) => {
    setFormulas(formulas.map(f => 
      f.id === id ? { ...f, status: 'approved' as const } : f
    ));
  };

  const handleCopyFormula = (formula: Formula) => {
    const newVersion = parseFloat(formula.version) + 0.1;
    const copiedFormula: Formula = {
      ...formula,
      id: generateId('F'),
      version: newVersion.toFixed(1),
      status: 'draft',
      lastModified: new Date().toISOString().split('T')[0]
    };
    setFormulas([...formulas, copiedFormula]);
  };

  const handleDeleteFormula = (id: string) => {
    if (confirm('Are you sure you want to delete this formula?')) {
      setFormulas(formulas.filter(f => f.id !== id));
    }
  };

  const handleEditFormula = (formula: Formula) => {
    setEditingFormula(formula);
    setNewFormula({
      name: formula.name,
      productType: formula.productType,
      grossProfit: formula.grossProfit,
      processCost: formula.processCost,
      ingredients: formula.ingredients
    });
    setShowCreateFormula(true);
  };

  const handleAddIngredient = () => {
    if (!newIngredient.name || !newIngredient.quantity) return;

    const ingredient: Ingredient = {
      name: newIngredient.name,
      quantity: newIngredient.quantity,
      unit: newIngredient.unit || 'g',
      cost: newIngredient.cost || 0,
      type: newIngredient.type || 'main'
    };

    setNewFormula({
      ...newFormula,
      ingredients: [...(newFormula.ingredients || []), ingredient]
    });

    setNewIngredient({
      name: '',
      quantity: 0,
      unit: 'g',
      cost: 0,
      type: 'main'
    });
  };

  const resetNewFormula = () => {
    setNewFormula({
      name: '',
      productType: 'Build to Sell',
      grossProfit: 35,
      processCost: 0,
      ingredients: []
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'testing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-[#8F262B]" />;
      case 'draft':
        return <Clock className="w-4 h-4 text-[#8F262B]" />;
      case 'testing':
        return <FlaskConical className="w-4 h-4 text-[#8F262B]" />;
      default:
        return <Clock className="w-4 h-4 text-[#8F262B]" />;
    }
  };

  const CreateFormulaModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Create New Formula</h3>
            <button
              onClick={() => setShowCreateFormula(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <span className="sr-only">Close</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Formula Name</label>
              <input
                type="text"
                value={newFormula.name}
                onChange={(e) => setNewFormula({ ...newFormula, name: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter formula name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
              <select
                value={newFormula.productType}
                onChange={(e) => setNewFormula({ ...newFormula, productType: e.target.value as 'Build to Sell' | 'Break to Sell' })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Build to Sell</option>
                <option>Break to Sell</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target GP %</label>
              <input
                type="number"
                step="0.1"
                value={newFormula.grossProfit}
                onChange={(e) => setNewFormula({ ...newFormula, grossProfit: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="35.0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Process Cost</label>
              <input
                type="number"
                step="0.01"
                value={newFormula.processCost}
                onChange={(e) => setNewFormula({ ...newFormula, processCost: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.67"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Calculated Price</label>
              <input
                type="number"
                step="0.01"
                disabled
                value={(() => {
                  const materialCost = (newFormula.ingredients || []).reduce((sum, ing) => sum + ing.cost, 0);
                  const totalCost = materialCost + (newFormula.processCost || 0);
                  return totalCost / (1 - (newFormula.grossProfit || 35) / 100);
                })().toFixed(2)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50"
                placeholder="Auto-calculated"
              />
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Ingredients</h4>
            <div className="space-y-3">
              <div className="grid grid-cols-6 gap-4 p-4 border border-gray-200 rounded-lg">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Ingredient</label>
                  <input
                    type="text"
                    value={newIngredient.name}
                    onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Ingredient name"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={newIngredient.quantity}
                    onChange={(e) => setNewIngredient({ ...newIngredient, quantity: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Unit</label>
                  <select
                    value={newIngredient.unit}
                    onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option>g</option>
                    <option>kg</option>
                    <option>ml</option>
                    <option>l</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Cost/Unit</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newIngredient.cost}
                    onChange={(e) => setNewIngredient({ ...newIngredient, cost: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Type</label>
                  <select
                    value={newIngredient.type}
                    onChange={(e) => setNewIngredient({ ...newIngredient, type: e.target.value as 'main' | 'secondary' })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option>main</option>
                    <option>secondary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Total Cost</label>
                  <input
                    type="number"
                    disabled
                    value={((newIngredient.quantity || 0) * (newIngredient.cost || 0)).toFixed(2)}
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
              Add Ingredient
            </button>

            {newFormula.ingredients && newFormula.ingredients.length > 0 && (
              <div className="mt-4">
                <h5 className="font-medium text-gray-900 mb-2">Added Ingredients</h5>
                <div className="space-y-2">
                  {newFormula.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="font-medium">{ingredient.name}</span>
                      <span className="text-sm text-gray-600">
                        {ingredient.quantity} {ingredient.unit} - ${ingredient.cost.toFixed(2)}
                      </span>
                      <button
                        onClick={() => {
                          const updatedIngredients = newFormula.ingredients?.filter((_, i) => i !== index) || [];
                          setNewFormula({ ...newFormula, ingredients: updatedIngredients });
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
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
              Cancel
            </button>
            <button className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700">
              Save as Draft
            </button>
            <button
              onClick={editingFormula ? handleUpdateFormula : handleCreateFormula}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {editingFormula ? 'Update' : 'Create'} Formula
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">R&D Formula Management</h2>
        <div className="flex items-center space-x-4">
          <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 flex items-center space-x-2">
            <FlaskConical className="w-4 h-4" />
            <span>Create Test Formula</span>
          </button>
          <button
            onClick={() => setShowCreateFormula(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Formula</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'formulas', name: 'Official Formulas' },
            { id: 'drafts', name: 'Draft Versions' },
            { id: 'testing', name: 'Testing' },
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

      {activeTab === 'formulas' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Product Formulas</h3>
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search formulas..."
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
                        <h4 className="text-lg font-semibold text-gray-900">{formula.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Version {formula.version}</span>
                          <span>•</span>
                          <span>{formula.productType}</span>
                          <span>•</span>
                          <span>by {formula.createdBy}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(formula.status)}`}>
                        {formula.status.toUpperCase()}
                      </span>
                      <button
                        onClick={() => alert('View formula details')}
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
                      <h5 className="font-medium text-gray-900">Cost Analysis</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Material Cost:</span>
                          <span>${formula.materialCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Process Cost:</span>
                          <span>${formula.processCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span className="text-gray-600">Selling Price:</span>
                          <span>${formula.sellingPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-green-600 font-medium">
                          <span>Gross Profit:</span>
                          <span>{formula.grossProfit.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Ingredients */}
                    <div className="space-y-3">
                      <h5 className="font-medium text-gray-900">Main Ingredients</h5>
                      <div className="space-y-2">
                        {formula.ingredients
                          .filter(ing => ing.type === 'main')
                          .map((ingredient, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-gray-600">{ingredient.name}:</span>
                              <span>{ingredient.quantity}{ingredient.unit} (${ingredient.cost.toFixed(2)})</span>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Secondary Ingredients or Yield/Loss */}
                    <div className="space-y-3">
                      {formula.productType === 'Build to Sell' ? (
                        <>
                          <h5 className="font-medium text-gray-900">Secondary Ingredients</h5>
                          <div className="space-y-2">
                            {formula.ingredients
                              .filter(ing => ing.type === 'secondary')
                              .map((ingredient, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span className="text-gray-600">{ingredient.name}:</span>
                                  <span>{ingredient.quantity}{ingredient.unit} (${ingredient.cost.toFixed(2)})</span>
                                </div>
                              ))}
                          </div>
                        </>
                      ) : (
                        <>
                          <h5 className="font-medium text-gray-900">Expected Yield/Loss</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-green-600">
                              <span>Expected Yield:</span>
                              <span>{formula.yieldLoss?.expectedYield}%</span>
                            </div>
                            <div className="flex justify-between text-red-600">
                              <span>Expected Loss:</span>
                              <span>{formula.yieldLoss?.expectedLoss}%</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {formula.yieldLoss && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <h5 className="font-medium text-gray-900 mb-3">Output Products</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {formula.yieldLoss.products.map((product, index) => (
                          <div key={index} className="p-3 border border-gray-200 rounded-lg">
                            <div className="font-medium text-sm">{product.name}</div>
                            <div className="text-xs text-gray-600 mt-1">
                              {product.yield}% yield • ${product.price.toFixed(2)}/kg
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {formula.status === 'draft' && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleApproveFormula(formula.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                        >
                          Approve Formula
                        </button>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                          Create Test Batch
                        </button>
                        <button
                          onClick={() => handleDeleteFormula(formula.id)}
                          className="text-red-600 hover:text-red-800 px-4 py-2"
                        >
                          Delete
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

      {activeTab === 'drafts' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Draft Versions</h3>
          </div>
          <div className="p-6">
            {draftVersions.map((draft) => (
              <div key={draft.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {draft.formulaId} - {draft.version}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Created by {draft.createdBy} on {new Date(draft.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                      Review Changes
                    </button>
                    <button
                      onClick={() => {
                        // Move draft to main formulas
                        const baseFormula = formulas.find(f => f.id === draft.formulaId);
                        if (baseFormula) {
                          const updatedFormula = {
                            ...baseFormula,
                            version: draft.version.replace('-draft', ''),
                            status: 'approved' as const,
                            lastModified: new Date().toISOString().split('T')[0]
                          };
                          setFormulas(formulas.map(f => f.id === draft.formulaId ? updatedFormula : f));
                          setDraftVersions(draftVersions.filter(d => d.id !== draft.id));
                        }
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                      Approve
                    </button>
                  </div>
                </div>
                <div>
                  <h5 className="font-medium text-sm text-gray-900 mb-2">Changes:</h5>
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

      {activeTab === 'testing' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Formula Testing</h3>
          </div>
          <div className="p-6">
            <div className="text-center py-12">
              <FlaskConical className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Active Tests</h4>
              <p className="text-gray-600 mb-4">
                Create test batches to validate formulas before approval.
              </p>
              <button className="bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700">
                Start New Test
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