import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Wrench,
  Calendar,
  ChevronRight,
  Plus
} from "lucide-react";
import { ROUTES } from "../lib/routes.js";
import { AiPricingModal } from "../components/AiPricingModal.jsx";
import { TrustScoreBadge } from "../components/TrustScoreBadge.jsx";
export const OwnerDashboard = ({
  user,
  equipmentList,
  incomingBookings,
  onCreateEquipment,
  onDeleteEquipment,
  onUpdateRate
}) => {
  const [selectedAiEquipment, setSelectedAiEquipment] = useState(null);
  const analytics = {
    totalRevenue: 18450,
    completedRentals: 14,
    assetUtilizationRate: 78,
    co2SavedKg: 1420
  };
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-mono text-white">
      {
    /* Title Banner */
  }
      <div className="bg-[#111111] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#1F1F1F] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1F1F1F]">
          <div className="flex items-center gap-4">
            <img
    src={user?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300"}
    alt={user?.name}
    className="w-16 h-16 rounded-2xl object-cover border border-[#333333]"
  />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-serif italic text-white tracking-tight">{user?.name}'s Equipment Fleet Workspace</h1>
                <TrustScoreBadge
    score={user?.trustScore || 96}
    kycVerified={user?.kycVerified ?? true}
    rating={4.9}
    completedRentals={14}
    onTimeRentals={14}
    userName={user?.name}
    size="md"
  />
              </div>
              <p className="text-xs text-[#888888] font-mono mt-0.5">
                Centralized owner portal for asset management, availability locks, booking requests, and revenue yield analytics.
              </p>
            </div>
          </div>

          <Link
    to={ROUTES.ownerNewEquipment}
    className="px-4 py-2.5 rounded-xl bg-[#F27D26] hover:bg-[#d96a1a] text-black font-bold text-xs uppercase tracking-wider font-mono flex items-center gap-2 shadow-lg transition cursor-pointer self-start sm:self-auto"
  >
            <Plus className="w-4 h-4" />
            <span>List New Equipment</span>
          </Link>
        </div>

        {
    /* Workspace Quick Links Grid */
  }
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
          <Link
    to={ROUTES.ownerEquipment}
    className="p-4 rounded-2xl bg-[#1A1A1A] border border-[#222222] hover:border-[#F27D26]/50 transition shadow-md"
  >
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">Active Fleet Assets</span>
            <div className="text-2xl font-serif italic font-bold text-white mt-1">{equipmentList.length}</div>
            <span className="text-[10px] text-[#F27D26] font-bold flex items-center gap-1 mt-1">
              <span>Manage Fleet</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </Link>

          <Link
    to={ROUTES.ownerBookings}
    className="p-4 rounded-2xl bg-[#1A1A1A] border border-[#222222] hover:border-[#F27D26]/50 transition shadow-md"
  >
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">Pending Bookings</span>
            <div className="text-2xl font-serif italic font-bold text-[#F27D26] mt-1">{incomingBookings.length}</div>
            <span className="text-[10px] text-[#F27D26] font-bold flex items-center gap-1 mt-1">
              <span>Manage Requests</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </Link>

          <Link
    to={ROUTES.ownerCalendar}
    className="p-4 rounded-2xl bg-[#1A1A1A] border border-[#222222] hover:border-[#F27D26]/50 transition shadow-md"
  >
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">Availability Locks</span>
            <div className="text-2xl font-serif italic font-bold text-white mt-1">Real-time</div>
            <span className="text-[10px] text-[#F27D26] font-bold flex items-center gap-1 mt-1">
              <span>Open Calendar</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </Link>

          <Link
    to={ROUTES.ownerAnalytics}
    className="p-4 rounded-2xl bg-[#1A1A1A] border border-[#222222] hover:border-[#F27D26]/50 transition shadow-md"
  >
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">Fleet Revenue</span>
            <div className="text-2xl font-serif italic font-bold text-emerald-400 mt-1">₹{analytics.totalRevenue}</div>
            <span className="text-[10px] text-[#F27D26] font-bold flex items-center gap-1 mt-1">
              <span>View Analytics</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </Link>
        </div>
      </div>

      {
    /* Fleet Equipment Summary */
  }
      <div className="bg-[#111111] rounded-3xl p-6 border border-[#1F1F1F] shadow-xl space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-3">
          <h2 className="text-lg font-serif italic text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-[#F27D26]" />
            <span>Active Equipment Fleet</span>
          </h2>
          <Link
    to={ROUTES.ownerEquipment}
    className="text-xs text-[#F27D26] font-bold uppercase tracking-wider flex items-center gap-1 hover:underline"
  >
            <span>View All Assets</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipmentList.slice(0, 3).map((eq) => <div key={eq.id} className="bg-[#1A1A1A] rounded-2xl p-4 border border-[#262626] space-y-3">
              <div className="aspect-16/9 rounded-xl overflow-hidden bg-[#0A0A0A]">
                <img
    src={eq.images[0]}
    alt={eq.title}
    className="w-full h-full object-cover"
    onError={(e) => {
      e.target.src = "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=1000";
    }}
  />
              </div>
              <div>
                <Link to={ROUTES.ownerEquipmentDetail(eq.id)} className="font-serif italic text-white text-base hover:text-[#F27D26] transition">
                  {eq.title}
                </Link>
                <div className="flex justify-between text-[#888888] mt-1">
                  <span>Rate: <strong className="text-white">₹{eq.dailyRate}/d</strong></span>
                  <span>Deposit: <strong className="text-[#F27D26]">₹{eq.securityDeposit}</strong></span>
                </div>
              </div>
            </div>)}
        </div>
      </div>

      {
    /* Incoming Requests Summary */
  }
      <div className="bg-[#111111] rounded-3xl p-6 border border-[#1F1F1F] shadow-xl space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-3">
          <h2 className="text-lg font-serif italic text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#F27D26]" />
            <span>Incoming Booking Requests</span>
          </h2>
          <Link
    to={ROUTES.ownerBookings}
    className="text-xs text-[#F27D26] font-bold uppercase tracking-wider flex items-center gap-1 hover:underline"
  >
            <span>View All Bookings</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {incomingBookings.length === 0 ? <p className="text-xs text-[#888888] italic">No pending booking requests.</p> : <div className="space-y-3">
            {incomingBookings.slice(0, 3).map((b) => <div key={b.id} className="p-3.5 rounded-2xl bg-[#1A1A1A] border border-[#262626] flex items-center justify-between">
                <div>
                  <div className="font-serif italic text-white text-sm">{b.equipmentTitle}</div>
                  <div className="text-[11px] text-[#888888]">Renter: {b.customerName} • {b.startDate} to {b.endDate}</div>
                </div>
                <div className="font-bold text-[#F27D26] text-sm">₹{b.priceBreakdown.total}</div>
              </div>)}
          </div>}
      </div>

      {
    /* AI Dynamic Pricing Modal */
  }
      {selectedAiEquipment && <AiPricingModal
    equipment={selectedAiEquipment}
    onClose={() => setSelectedAiEquipment(null)}
    onUpdateRate={onUpdateRate}
  />}
    </div>;
};
