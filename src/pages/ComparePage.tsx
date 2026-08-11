import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Sparkles, Check, Trash2, ShieldCheck, MapPin, Star, Truck, Calendar } from 'lucide-react';
import { Equipment } from '../types';
import { equipmentService } from '../services/equipmentService';
import { ROUTES } from '../lib/routes';

export const ComparePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const idsParam = searchParams.get('ids');

  useEffect(() => {
    async function loadCompareItems() {
      setLoading(true);
      try {
        const all = await equipmentService.getEquipment();
        if (idsParam) {
          const selectedIds = idsParam.split(',');
          const filtered = all.filter((item) => selectedIds.includes(item.id));
          setItems(filtered.length > 0 ? filtered : all.slice(0, 3));
        } else {
          setItems(all.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load compare items:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCompareItems();
  }, [idsParam]);

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Best Value Item Calculation (Lowest Daily Rate with High Rating)
  const bestValueItem = items.reduce((prev, current) => {
    return !prev || current.dailyRate < prev.dailyRate ? current : prev;
  }, null as Equipment | null);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-slate-100 p-8 flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-[#F27D26] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-mono text-slate-400">Loading equipment comparison data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-100 p-6 md:p-12 font-sans space-y-8 max-w-7xl mx-auto">
      {/* Top Header Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#222222]">
        <div className="space-y-1">
          <button
            onClick={() => navigate(ROUTES.browse)}
            className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition cursor-pointer mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Marketplace
          </button>
          <h1 className="text-3xl font-serif font-bold italic text-white flex items-center gap-3">
            <span>Equipment Comparison Workspace</span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#F27D26] bg-[#F27D26]/10 px-3 py-1 rounded-full border border-[#F27D26]/20">
              Live Evaluation
            </span>
          </h1>
          <p className="text-xs font-mono text-slate-400">
            Compare rental rates, security deposits, distance, specifications, and trust scores side-by-side.
          </p>
        </div>

        <button
          onClick={() => navigate(ROUTES.browse)}
          className="px-5 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#252525] border border-[#333333] text-xs font-mono font-bold text-white transition cursor-pointer"
        >
          + Add Equipment to Compare
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-[#111111] border border-[#222222] rounded-3xl space-y-4">
          <p className="text-slate-400 text-sm font-mono">No equipment selected for comparison.</p>
          <button
            onClick={() => navigate(ROUTES.browse)}
            className="px-6 py-3 bg-[#F27D26] hover:bg-[#d96c1e] text-black font-mono font-bold text-xs rounded-xl transition"
          >
            Browse Listings
          </button>
        </div>
      ) : (
        /* Comparison Table Grid */
        <div className="overflow-x-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-w-[900px]">
            {items.map((item) => {
              const isBestValue = bestValueItem?.id === item.id;

              return (
                <div
                  key={item.id}
                  className={`bg-[#111111] border rounded-3xl p-6 space-y-6 flex flex-col justify-between transition relative ${
                    isBestValue ? 'border-[#F27D26] shadow-xl shadow-[#F27D26]/10' : 'border-[#222222]'
                  }`}
                >
                  {isBestValue && (
                    <div className="absolute -top-3 left-6 inline-flex items-center gap-1.5 bg-[#F27D26] text-black px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider shadow-md">
                      <Sparkles className="w-3 h-3" /> Best Value Asset
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Header Image & Remove Button */}
                    <div className="relative rounded-2xl overflow-hidden aspect-video border border-[#222222]">
                      <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-rose-600 text-slate-300 hover:text-white transition cursor-pointer"
                        title="Remove from comparison"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Asset Info */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold uppercase text-[#F27D26] bg-[#F27D26]/10 px-2 py-0.5 rounded border border-[#F27D26]/20">
                        {item.category} • {item.industry}
                      </span>
                      <h3 className="text-lg font-serif font-bold italic text-white line-clamp-1">{item.title}</h3>
                      <p className="text-xs text-slate-400 font-mono flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#F27D26]" /> {item.location}
                      </p>
                    </div>

                    {/* Comparison Attribute List */}
                    <div className="space-y-3 pt-4 border-t border-[#222222] font-mono text-xs">
                      <div className="flex justify-between py-1 border-b border-[#1A1A1A]">
                        <span className="text-slate-400">Daily Rate:</span>
                        <span className="font-bold text-[#F27D26]">${item.dailyRate}/day</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#1A1A1A]">
                        <span className="text-slate-400">Weekly Rate:</span>
                        <span className="font-bold text-white">${item.weeklyRate}/wk</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#1A1A1A]">
                        <span className="text-slate-400">Security Deposit:</span>
                        <span className="font-bold text-white">${item.securityDeposit}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#1A1A1A]">
                        <span className="text-slate-400">Owner Trust Score:</span>
                        <span className="font-bold text-emerald-400 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> {item.ownerTrustScore}%
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#1A1A1A]">
                        <span className="text-slate-400">Delivery Option:</span>
                        <span className="font-bold text-slate-200 flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5 text-[#F27D26]" /> Standard $45
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#1A1A1A]">
                        <span className="text-slate-400">Atomic Availability:</span>
                        <span className="font-bold text-emerald-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> Ready in MongoDB
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Primary CTA */}
                  <button
                    onClick={() => navigate(ROUTES.equipmentDetail(item.id))}
                    className="w-full py-3 rounded-xl bg-[#F27D26] hover:bg-[#d96c1e] text-black font-mono font-bold text-xs transition shadow-lg shadow-[#F27D26]/10 cursor-pointer"
                  >
                    View Details & Book
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
