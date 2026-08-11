import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  Edit,
  FolderTree,
  CheckCircle,
  ChevronRight,
  Sliders,
} from 'lucide-react';

interface CategoryNode {
  id: string;
  industry: string;
  category: string;
  subcategories: string[];
  attributes: string[];
}

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<CategoryNode[]>([
    {
      id: 'cat-1',
      industry: 'Construction & Civil Engineering',
      category: 'Heavy Machinery',
      subcategories: ['Excavators', 'Skid Steers', 'Bulldozers', 'Compactors'],
      attributes: ['Operating Weight', 'Bucket Capacity', 'Engine HP', 'Fuel Type'],
    },
    {
      id: 'cat-2',
      industry: 'Media & Entertainment',
      category: 'Photography & Drones',
      subcategories: ['Cinema Cameras', 'Anamorphic Lenses', 'Lighting Rigs', 'Enterprise Drones'],
      attributes: ['Sensor Type', 'Max Resolution', 'Lens Mount', 'FPS Rating'],
    },
    {
      id: 'cat-3',
      industry: 'Event & Live Production',
      category: 'Event & Audio',
      subcategories: ['Line Array Sound', 'Stage Lighting', 'Wireless Mics', 'Generators'],
      attributes: ['Power Output (Watts)', 'Channel Count', 'SPL Rating', 'Connectivity'],
    },
    {
      id: 'cat-4',
      industry: 'Agriculture & Farming',
      category: 'Agriculture & Farming',
      subcategories: ['Row Crop Tractors', 'Combines & Harvesters', 'Tillage', 'Bale Handling'],
      attributes: ['PTO Horsepower', 'Hitch Capacity', 'Grain Tank Size', 'GPS Guidance'],
    },
    {
      id: 'cat-5',
      industry: 'Industrial & Trade Services',
      category: 'Power Tools',
      subcategories: ['Rotary Hammer Drills', 'Demolition Hammers', 'Concrete Saws'],
      attributes: ['Voltage', 'Power Source', 'Blows Per Minute', 'Chuck Size'],
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newIndustry, setNewIndustry] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newSubcats, setNewSubcats] = useState('');
  const [newAttributes, setNewAttributes] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const node: CategoryNode = {
      id: `cat-${Date.now()}`,
      industry: newIndustry || 'General Industry',
      category: newCategory || 'New Category',
      subcategories: newSubcats.split(',').map((s) => s.trim()).filter(Boolean),
      attributes: newAttributes.split(',').map((a) => a.trim()).filter(Boolean),
    };
    setCategories([...categories, node]);
    setIsModalOpen(false);
    setNewIndustry('');
    setNewCategory('');
    setNewSubcats('');
    setNewAttributes('');
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1F1F1F]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#F27D26] uppercase font-bold tracking-wider mb-1">
            <FolderTree className="w-4 h-4" />
            <span>Multi-Industry Architecture</span>
          </div>
          <h1 className="font-serif italic text-3xl font-normal text-white">Category Taxonomy Management</h1>
          <p className="text-xs text-[#888888] font-mono mt-1">
            Configure dynamic multi-industry equipment categories, subcategories, and required technical specification schema.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#F27D26] hover:bg-[#d96a1a] text-black font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category Schema</span>
        </button>
      </div>

      {/* Category Tree Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((c) => (
          <div
            key={c.id}
            className="bg-[#111111] rounded-3xl p-6 border border-[#1F1F1F] shadow-xl space-y-4 font-mono text-xs flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3 border-b border-[#1F1F1F] pb-3">
                <div>
                  <span className="text-[10px] text-[#F27D26] uppercase font-bold tracking-wider">{c.industry}</span>
                  <h3 className="font-serif italic text-xl text-white mt-0.5">{c.category}</h3>
                </div>
                <button
                  onClick={() => handleDeleteCategory(c.id)}
                  className="p-2 rounded-xl bg-[#1A1A1A] text-[#666666] hover:text-rose-400 border border-[#262626] transition cursor-pointer"
                  title="Remove Category Schema"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Subcategories */}
              <div>
                <span className="text-[10px] text-[#888888] uppercase font-bold block mb-1.5">Subcategories</span>
                <div className="flex flex-wrap gap-1.5">
                  {c.subcategories.map((sub, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl bg-[#1A1A1A] border border-[#2B2B2B] text-white text-[11px]"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dynamic Technical Attributes */}
              <div>
                <span className="text-[10px] text-[#888888] uppercase font-bold block mb-1.5">Dynamic Specification Schema</span>
                <div className="flex flex-wrap gap-1.5">
                  {c.attributes.map((attr, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl bg-[#F27D26]/10 text-[#F27D26] border border-[#F27D26]/30 text-[10px] font-bold"
                    >
                      + {attr}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] rounded-3xl max-w-md w-full p-6 border border-[#1F1F1F] shadow-2xl space-y-4 font-mono text-white">
            <h3 className="font-serif italic text-lg text-white">Add Equipment Category Taxonomy</h3>

            <form onSubmit={handleAddCategory} className="space-y-4 text-xs">
              <div>
                <label className="text-[#888888] font-bold uppercase block mb-1">Industry Vertical</label>
                <input
                  type="text"
                  value={newIndustry}
                  onChange={(e) => setNewIndustry(e.target.value)}
                  placeholder="e.g. Energy & Utilities"
                  className="w-full px-3 py-2 rounded-xl bg-[#1A1A1A] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
                  required
                />
              </div>

              <div>
                <label className="text-[#888888] font-bold uppercase block mb-1">Category Title</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="e.g. Solar Power Rigs"
                  className="w-full px-3 py-2 rounded-xl bg-[#1A1A1A] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
                  required
                />
              </div>

              <div>
                <label className="text-[#888888] font-bold uppercase block mb-1">Subcategories (comma separated)</label>
                <input
                  type="text"
                  value={newSubcats}
                  onChange={(e) => setNewSubcats(e.target.value)}
                  placeholder="Inverters, Solar Arrays, Battery Storage"
                  className="w-full px-3 py-2 rounded-xl bg-[#1A1A1A] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
                />
              </div>

              <div>
                <label className="text-[#888888] font-bold uppercase block mb-1">Dynamic Attributes (comma separated)</label>
                <input
                  type="text"
                  value={newAttributes}
                  onChange={(e) => setNewAttributes(e.target.value)}
                  placeholder="Output Voltage, Battery Capacity, Efficiency %"
                  className="w-full px-3 py-2 rounded-xl bg-[#1A1A1A] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#333] text-xs font-bold text-[#888888] hover:text-white uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#F27D26] text-black text-xs font-bold uppercase"
                >
                  Save Schema
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
