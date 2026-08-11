import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wrench,
  Plus,
  Search,
  SlidersHorizontal,
  Grid,
  List,
  Eye,
  Edit,
  Sparkles,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Star,
  Activity,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Equipment, User } from '../types';
import { ROUTES } from '../lib/routes';
import { AiPricingModal } from '../components/AiPricingModal';

interface OwnerEquipmentPageProps {
  currentUser: User | null;
  equipmentList: Equipment[];
  onDeleteEquipment?: (id: string) => void;
  onUpdateRate?: (id: string, newRate: number) => void;
  onUpdateStatus?: (id: string, status: 'active' | 'maintenance' | 'unlisted') => void;
}

export const OwnerEquipmentPage: React.FC<OwnerEquipmentPageProps> = ({
  currentUser,
  equipmentList,
  onDeleteEquipment,
  onUpdateRate,
  onUpdateStatus,
}) => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [selectedAiEquipment, setSelectedAiEquipment] = useState<Equipment | null>(null);

  // Filter owner equipment only (if currentUser exists)
  const ownerItems = currentUser
    ? equipmentList.filter((eq) => eq.ownerId === currentUser.id || true) // fallback show all if demo
    : equipmentList;

  const filteredItems = ownerItems.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q);

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = ['All', 'Heavy Machinery', 'Power Tools', 'Photography & Drones', 'Event & Audio', 'Agriculture & Farming', 'Generators'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white font-mono">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1F1F1F]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#F27D26] uppercase font-bold tracking-wider mb-1">
            <Wrench className="w-4 h-4" />
            <span>Owner Workspace</span>
          </div>
          <h1 className="font-serif italic text-3xl font-normal text-white">My Fleet Equipment</h1>
          <p className="text-xs text-[#888888] font-mono mt-1">
            Manage asset inventory, specifications, dynamic rates, availability schedules, and performance metrics.
          </p>
        </div>

        <Link
          to={ROUTES.ownerNewEquipment}
          className="px-4 py-2.5 rounded-xl bg-[#F27D26] hover:bg-[#d96a1a] text-black font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Equipment</span>
        </Link>
      </div>

      {/* Filter Controls Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#111111] p-4 rounded-3xl border border-[#1F1F1F] text-xs">
        {/* Search */}
        <div className="md:col-span-2 relative">
          <label className="text-[10px] text-[#666666] font-bold uppercase tracking-wider block mb-1">Search Fleet</label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by equipment title, category, model..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#1A1A1A] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
            />
            <Search className="w-4 h-4 text-[#666666] absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="text-[10px] text-[#666666] font-bold uppercase tracking-wider block mb-1">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#1A1A1A] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-end justify-between md:justify-end gap-2">
          <div className="flex items-center gap-1 bg-[#1A1A1A] p-1 rounded-xl border border-[#333333]">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition ${
                viewMode === 'table' ? 'bg-[#F27D26] text-black' : 'text-[#888888] hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition ${
                viewMode === 'grid' ? 'bg-[#F27D26] text-black' : 'text-[#888888] hover:text-white'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Equipment Table / Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-[#111111] rounded-3xl p-12 text-center border border-[#1F1F1F] max-w-md mx-auto space-y-3 font-mono">
          <Wrench className="w-10 h-10 text-[#444444] mx-auto" />
          <h3 className="font-serif italic text-white text-base">Your Fleet is Empty</h3>
          <p className="text-xs text-[#888888]">
            No equipment listings match your current filters. Add a new listing to start earning rental revenue.
          </p>
          <Link
            to={ROUTES.ownerNewEquipment}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F27D26] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#d96a1a] transition"
          >
            <Plus className="w-4 h-4" />
            <span>List Equipment Now</span>
          </Link>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-[#111111] rounded-3xl border border-[#1F1F1F] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#181818] border-b border-[#222222] text-[#888888] uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Equipment Asset</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Daily Rate</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Utilization</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F1F1F]">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#141414] transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-12 h-12 rounded-xl object-cover border border-[#333333] shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=1000';
                          }}
                        />
                        <div>
                          <Link
                            to={ROUTES.ownerEquipmentDetail(item.id)}
                            className="font-serif italic text-sm text-white hover:text-[#F27D26] transition font-normal"
                          >
                            {item.title}
                          </Link>
                          <div className="text-[10px] text-[#666666]">{item.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-[#AAAAAA]">{item.category}</td>
                    <td className="p-4 font-bold text-[#F27D26]">₹{item.dailyRate}/d</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase">
                        {item.status || 'Active'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-[#F27D26] font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{item.rating || 5.0}</span>
                      </div>
                    </td>
                    <td className="p-4 text-[#AAAAAA]">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 rounded-full bg-[#222222] overflow-hidden">
                          <div className="h-full bg-[#F27D26]" style={{ width: '75%' }}></div>
                        </div>
                        <span className="text-[10px]">75%</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={ROUTES.ownerEquipmentDetail(item.id)}
                          className="p-2 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] text-[#888888] hover:text-white transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={ROUTES.ownerEquipmentEdit(item.id)}
                          className="p-2 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] text-[#888888] hover:text-white transition"
                          title="Edit Equipment"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setSelectedAiEquipment(item)}
                          className="p-2 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] text-[#F27D26] transition"
                          title="AI Dynamic Pricing"
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                        {onDeleteEquipment && (
                          <button
                            onClick={() => onDeleteEquipment(item.id)}
                            className="p-2 rounded-xl bg-[#1A1A1A] hover:bg-rose-500/10 text-rose-400 transition"
                            title="Delete Asset"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-[#111111] rounded-3xl p-5 border border-[#1F1F1F] shadow-xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-[#1A1A1A]">
                  <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-[#0A0A0A]/80 backdrop-blur-md text-[#F27D26] font-mono text-[10px] font-bold uppercase tracking-wider border border-[#333333]">
                    {item.category}
                  </span>
                </div>
                <div>
                  <h3 className="font-serif italic text-white text-base line-clamp-1">{item.title}</h3>
                  <div className="flex items-center justify-between text-xs text-[#888888] font-mono mt-1">
                    <span>Rate: <strong className="text-white">₹{item.dailyRate}/day</strong></span>
                    <span>Deposit: <strong className="text-[#F27D26]">₹{item.securityDeposit}</strong></span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1F1F1F] flex items-center justify-between gap-2">
                <Link
                  to={ROUTES.ownerEquipmentDetail(item.id)}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] text-white border border-[#333333] text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition"
                >
                  <Eye className="w-3.5 h-3.5 text-[#F27D26]" />
                  <span>View Details</span>
                </Link>

                <button
                  onClick={() => setSelectedAiEquipment(item)}
                  className="p-2 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] text-[#F27D26] border border-[#333333] transition"
                  title="AI Rate Tool"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Dynamic Pricing Modal */}
      {selectedAiEquipment && (
        <AiPricingModal
          equipment={selectedAiEquipment}
          onClose={() => setSelectedAiEquipment(null)}
          onUpdateRate={onUpdateRate || (() => {})}
        />
      )}
    </div>
  );
};
