import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Camera,
  Star,
  Heart,
  Clock,
  CheckCircle,
  ShieldCheck,
  ChevronRight,
  Bookmark,
  Bell,
  Search,
} from 'lucide-react';
import { Booking, Equipment, User, Review } from '../types';
import { ROUTES } from '../lib/routes';
import { EquipmentCard } from '../components/EquipmentCard';
import { DamageReportModal } from '../components/DamageReportModal';
import { TrustScoreBadge } from '../components/TrustScoreBadge';

interface CustomerDashboardProps {
  user: User;
  bookings: Booking[];
  favoriteItems: Equipment[];
  onToggleFavorite: (id: string) => void;
  onSubmitConditionReport: (
    bookingId: string,
    beforePhotos: string[],
    afterPhotos: string[],
    conditionNotes: string
  ) => void;
  onAddReview: (review: Review) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  user,
  bookings,
  favoriteItems,
  onToggleFavorite,
  onSubmitConditionReport,
  onAddReview,
}) => {
  const [selectedBookingForDamage, setSelectedBookingForDamage] = useState<Booking | null>(null);

  const upcomingBookings = bookings.filter(
    (b) => b.status === 'confirmed' || b.status === 'pending' || b.status === 'pickup_ready'
  );
  const activeBookings = bookings.filter((b) => b.status === 'active' || b.status === 'locked');
  const recentBookings = bookings.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-mono text-white">
      {/* Title Banner */}
      <div className="bg-[#111111] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#1F1F1F] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover border border-[#333333]"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-serif italic text-white">{user?.name}'s Customer Dashboard</h1>
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
            <p className="text-xs text-[#888888] font-mono mt-1">
              Active Rentals, Scheduled Bookings & Saved Equipment Assets
            </p>
          </div>
        </div>

        <Link
          to={ROUTES.browse}
          className="px-4 py-2.5 rounded-xl bg-[#F27D26] hover:bg-[#d96a1a] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition"
        >
          <Search className="w-4 h-4" />
          <span>Find Equipment</span>
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
        <Link
          to={ROUTES.bookings}
          className="p-4 rounded-2xl bg-[#111111] border border-[#1F1F1F] hover:border-[#F27D26]/50 transition shadow-lg"
        >
          <span className="text-[10px] font-bold uppercase text-[#666666]">Active Rentals</span>
          <div className="text-2xl font-serif italic font-bold text-emerald-400 mt-1">{activeBookings.length}</div>
        </Link>

        <Link
          to={ROUTES.bookings}
          className="p-4 rounded-2xl bg-[#111111] border border-[#1F1F1F] hover:border-[#F27D26]/50 transition shadow-lg"
        >
          <span className="text-[10px] font-bold uppercase text-[#666666]">Upcoming Bookings</span>
          <div className="text-2xl font-serif italic font-bold text-[#F27D26] mt-1">{upcomingBookings.length}</div>
        </Link>

        <Link
          to={ROUTES.favorites}
          className="p-4 rounded-2xl bg-[#111111] border border-[#1F1F1F] hover:border-[#F27D26]/50 transition shadow-lg"
        >
          <span className="text-[10px] font-bold uppercase text-[#666666]">Saved Favorites</span>
          <div className="text-2xl font-serif italic font-bold text-white mt-1">{favoriteItems.length}</div>
        </Link>

        <Link
          to={ROUTES.notifications}
          className="p-4 rounded-2xl bg-[#111111] border border-[#1F1F1F] hover:border-[#F27D26]/50 transition shadow-lg"
        >
          <span className="text-[10px] font-bold uppercase text-[#666666]">Recent Notifications</span>
          <div className="text-2xl font-serif italic font-bold text-purple-400 mt-1">3 New</div>
        </Link>
      </div>

      {/* Recent Bookings Summary */}
      <div className="bg-[#111111] rounded-3xl p-6 border border-[#1F1F1F] shadow-xl space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-3">
          <h2 className="text-lg font-serif italic text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#F27D26]" />
            <span>Recent Rental Bookings</span>
          </h2>
          <Link
            to={ROUTES.bookings}
            className="text-xs text-[#F27D26] font-bold uppercase tracking-wider flex items-center gap-1 hover:underline"
          >
            <span>View All Bookings</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <p className="text-xs text-[#888888] italic">No active or recent bookings found.</p>
        ) : (
          <div className="space-y-3">
            {recentBookings.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-2xl bg-[#1A1A1A] border border-[#222222] flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img src={b.equipmentImage} alt={b.equipmentTitle} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <span className="font-serif italic text-white text-base">{b.equipmentTitle}</span>
                    <div className="text-[11px] text-[#888888]">
                      {b.startDate} to {b.endDate} • ${b.priceBreakdown.total}
                    </div>
                  </div>
                </div>

                <Link
                  to={ROUTES.bookingDetail(b.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#111111] hover:bg-[#222222] text-white border border-[#333333] font-bold uppercase text-[10px] flex items-center gap-1"
                >
                  <span>Details</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#F27D26]" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Saved Favorites Quick Grid */}
      {favoriteItems.length > 0 && (
        <div className="space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-3">
            <h2 className="text-lg font-serif italic text-white flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-[#F27D26]" />
              <span>Saved Equipment Assets</span>
            </h2>
            <Link
              to={ROUTES.favorites}
              className="text-xs text-[#F27D26] font-bold uppercase tracking-wider flex items-center gap-1 hover:underline"
            >
              <span>View All Saved</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteItems.slice(0, 3).map((item) => (
              <EquipmentCard
                key={item.id}
                equipment={item}
                isFavorite={true}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </div>
      )}

      {/* Damage Report Modal */}
      {selectedBookingForDamage && (
        <DamageReportModal
          booking={selectedBookingForDamage}
          onClose={() => setSelectedBookingForDamage(null)}
          onSubmitConditionReport={onSubmitConditionReport}
        />
      )}
    </div>
  );
};
