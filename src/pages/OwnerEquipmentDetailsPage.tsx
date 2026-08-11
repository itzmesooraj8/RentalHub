import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Wrench,
  ArrowLeft,
  DollarSign,
  Calendar,
  Activity,
  Sparkles,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Star,
  MapPin,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { Equipment, Booking, User, Review } from '../types';
import { ROUTES } from '../lib/routes';
import { AiPricingModal } from '../components/AiPricingModal';

interface OwnerEquipmentDetailsPageProps {
  currentUser: User | null;
  equipmentList: Equipment[];
  bookings: Booking[];
  reviews: Review[];
  onDeleteEquipment?: (id: string) => void;
  onUpdateRate?: (id: string, newRate: number) => void;
  onUpdateStatus?: (id: string, status: 'active' | 'maintenance' | 'unlisted') => void;
}

export const OwnerEquipmentDetailsPage: React.FC<OwnerEquipmentDetailsPageProps> = ({
  currentUser,
  equipmentList,
  bookings,
  reviews,
  onDeleteEquipment,
  onUpdateRate,
  onUpdateStatus,
}) => {
  const { equipmentId } = useParams<{ equipmentId: string }>();
  const navigate = useNavigate();

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const equipment = equipmentList.find((e) => e.id === equipmentId);

  if (!equipment) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4 font-mono text-white">
        <AlertTriangle className="w-12 h-12 text-[#F27D26] mx-auto" />
        <h2 className="font-serif italic text-2xl">Asset Not Found</h2>
        <p className="text-xs text-[#888888]">No equipment listing matches ID "{equipmentId}".</p>
        <Link
          to={ROUTES.ownerEquipment}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F27D26] text-black font-bold text-xs uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to My Equipment Fleet</span>
        </Link>
      </div>
    );
  }

  // Calculate asset specific performance metrics
  const assetBookings = bookings.filter((b) => b.equipmentId === equipment.id);
  const totalRevenue = assetBookings.reduce((sum, b) => sum + b.priceBreakdown.subtotal, 0);
  const totalDaysBooked = assetBookings.reduce((sum, b) => sum + b.priceBreakdown.rentalDays, 0);
  const utilizationPct = Math.min(100, Math.round((totalDaysBooked / 30) * 100)) || 68;
  const assetReviews = reviews.filter((r) => r.equipmentId === equipment.id);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-mono text-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-4">
        <Link
          to={ROUTES.ownerEquipment}
          className="flex items-center gap-2 text-xs text-[#888888] hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Fleet Equipment</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#666666] font-bold">
            Asset ID <strong className="text-[#F27D26]">#{equipment.id.substring(0, 8).toUpperCase()}</strong>
          </span>
        </div>
      </div>

      {/* Hero Management Card */}
      <div className="bg-[#111111] rounded-3xl p-6 sm:p-8 border border-[#1F1F1F] shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#1F1F1F]">
          <div className="flex items-start gap-4">
            <img
              src={equipment.images[0]}
              alt={equipment.title}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-[#333333] shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=1000';
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-[#F27D26]/10 text-[#F27D26] border border-[#F27D26]/30 text-[10px] uppercase font-bold tracking-wider">
                  {equipment.category}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] uppercase font-bold tracking-wider">
                  {equipment.status || 'Active'}
                </span>
              </div>
              <h1 className="font-serif italic text-2xl sm:text-3xl text-white mt-1">{equipment.title}</h1>
              <p className="text-xs text-[#888888] mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#666666]" /> {equipment.location}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <Link
              to={ROUTES.ownerEquipmentEdit(equipment.id)}
              className="px-3.5 py-2 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] text-white border border-[#333333] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition"
            >
              <Edit className="w-4 h-4 text-[#F27D26]" />
              <span>Edit Asset</span>
            </Link>
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#F27D26] hover:bg-[#d96a1a] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Dynamic Rate</span>
            </button>
          </div>
        </div>

        {/* Financial & Yield Performance Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-[#1A1A1A] border border-[#222222]">
            <span className="text-[10px] font-bold uppercase text-[#666666]">Total Generated Revenue</span>
            <div className="text-2xl font-serif italic font-bold text-[#F27D26] mt-1">₹{totalRevenue}</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#1A1A1A] border border-[#222222]">
            <span className="text-[10px] font-bold uppercase text-[#666666]">Completed Bookings</span>
            <div className="text-2xl font-serif italic font-bold text-white mt-1">{assetBookings.length}</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#1A1A1A] border border-[#222222]">
            <span className="text-[10px] font-bold uppercase text-[#666666]">30-Day Utilization</span>
            <div className="text-2xl font-serif italic font-bold text-white mt-1">{utilizationPct}%</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#1A1A1A] border border-[#222222]">
            <span className="text-[10px] font-bold uppercase text-[#666666]">Daily Rental Rate</span>
            <div className="text-2xl font-serif italic font-bold text-emerald-400 mt-1">₹{equipment.dailyRate}</div>
          </div>
        </div>
      </div>

      {/* Specifications & Availability Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Specifications */}
          <div className="bg-[#111111] rounded-3xl p-6 border border-[#1F1F1F] shadow-xl space-y-4">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white border-b border-[#1F1F1F] pb-3">
              Technical Specifications & Features
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {Object.entries(equipment.specs || {}).map(([key, val]) => (
                <div key={key} className="p-3 bg-[#1A1A1A] rounded-2xl border border-[#222222]">
                  <span className="text-[10px] text-[#888888] font-bold uppercase block">{key}</span>
                  <span className="font-bold text-white mt-0.5 block truncate">{val}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <span className="text-[10px] text-[#888888] font-bold uppercase block mb-1">Description</span>
              <p className="text-xs text-[#AAAAAA] leading-relaxed bg-[#1A1A1A] p-4 rounded-2xl border border-[#222222]">
                {equipment.description}
              </p>
            </div>
          </div>

          {/* Asset Reviews History */}
          <div className="bg-[#111111] rounded-3xl p-6 border border-[#1F1F1F] shadow-xl space-y-4">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white border-b border-[#1F1F1F] pb-3">
              Customer Reviews ({assetReviews.length})
            </h3>
            {assetReviews.length === 0 ? (
              <p className="text-xs text-[#888888] italic">No reviews submitted for this specific asset yet.</p>
            ) : (
              <div className="space-y-3">
                {assetReviews.map((r) => (
                  <div key={r.id} className="p-3.5 bg-[#1A1A1A] rounded-2xl border border-[#222222] space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{r.fromUserName}</span>
                      <div className="flex items-center text-[#F27D26] font-bold text-xs">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{r.rating}</span>
                      </div>
                    </div>
                    <p className="text-[#AAAAAA]">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Actions */}
        <div className="space-y-6">
          <div className="bg-[#111111] rounded-3xl p-6 border border-[#1F1F1F] shadow-xl space-y-3 font-mono text-xs">
            <h3 className="font-bold uppercase tracking-wider text-white mb-2">Asset Controls</h3>

            <Link
              to={ROUTES.ownerCalendar}
              className="w-full py-2.5 px-4 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] text-white border border-[#333333] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition"
            >
              <Calendar className="w-4 h-4 text-[#F27D26]" />
              <span>Availability Calendar</span>
            </Link>

            <button
              onClick={() => setIsAiModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-[#F27D26] hover:bg-[#d96a1a] text-black font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Dynamic Rate Tool</span>
            </button>

            {onDeleteEquipment && (
              <button
                onClick={() => {
                  onDeleteEquipment(equipment.id);
                  navigate(ROUTES.ownerEquipment);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Asset Listing</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* AI Dynamic Pricing Modal */}
      {isAiModalOpen && (
        <AiPricingModal
          equipment={equipment}
          onClose={() => setIsAiModalOpen(false)}
          onUpdateRate={onUpdateRate || (() => {})}
        />
      )}
    </div>
  );
};
