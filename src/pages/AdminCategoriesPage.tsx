import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  FolderTree,
  CheckCircle,
} from 'lucide-react';
import { Category } from '../types';
import { apiClient } from '../services/apiClient';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('Folder');
  const [newDesc, setNewDesc] = useState('');
  const [newIndustry, setNewIndustry] = useState('Construction');

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setLoading(true);
    try {
      const res = await apiClient.get<{ success: boolean; data: Category[] }>('/api/admin/categories');
      setCategories(res.data.data || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    try {
      const res = await apiClient.post<{ success: boolean; data: Category }>('/api/admin/categories', {
        name: newName,
        icon: newIcon,
        description: newDesc,
        industry: newIndustry,
      });

      setCategories((prev) => [...prev, res.data.data]);
      setIsModalOpen(false);
      setNewName('');
      setNewDesc('');
    } catch (err) {
      console.error('Failed to create category:', err);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await apiClient.delete(`/api/admin/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Failed to delete category:', err);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#111111] p-6 rounded-3xl border border-[#222222]">
        <div className="space-y-1">
          <h1 className="text-2xl font-serif font-bold italic text-white flex items-center gap-3">
            <Layers className="w-6 h-6 text-[#F27D26]" />
            <span>Category & Industry Taxonomy</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Manage equipment rental categories and industry classifications live in MongoDB Atlas.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-[#F27D26] hover:bg-[#d96c1e] text-black font-mono font-bold text-xs transition shadow-lg shadow-[#F27D26]/20 cursor-pointer flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="text-center py-16 bg-[#111111] border border-[#222222] rounded-3xl">
          <div className="w-8 h-8 border-2 border-[#F27D26] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs font-mono text-slate-400">Querying MongoDB CategoryModel...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-[#111111] border border-[#222222] rounded-3xl p-6 space-y-4 relative flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#F27D26] bg-[#F27D26]/10 px-2.5 py-0.5 rounded border border-[#F27D26]/20">
                    {cat.industry || 'General'}
                  </span>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-1.5 rounded-lg bg-[#181818] hover:bg-rose-600 text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h3 className="text-lg font-serif font-bold italic text-white flex items-center gap-2">
                  <FolderTree className="w-4 h-4 text-[#F27D26]" />
                  <span>{cat.name}</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono">{cat.description || 'No description provided.'}</p>
              </div>

              <div className="pt-3 border-t border-[#1F1F1F] flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Items Registered:</span>
                <span className="font-bold text-white">{cat.itemCount || 0} listings</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#222222] rounded-3xl p-6 max-w-md w-full space-y-4">
            <h2 className="text-xl font-serif font-bold italic text-white">Create New Category</h2>
            <form onSubmit={handleAddCategory} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Aerial Lifts"
                  className="w-full bg-[#1A1A1A] border border-[#2B2B2B] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#F27D26]"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Industry</label>
                <select
                  value={newIndustry}
                  onChange={(e) => setNewIndustry(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#2B2B2B] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#F27D26]"
                >
                  <option value="Construction">Construction</option>
                  <option value="Film & Media">Film & Media</option>
                  <option value="Event & Production">Event & Production</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Logistics">Logistics</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Description</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Category description..."
                  className="w-full bg-[#1A1A1A] border border-[#2B2B2B] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#F27D26] h-20"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#252525] border border-[#333333] text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-[#F27D26] hover:bg-[#d96c1e] text-black font-bold"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
