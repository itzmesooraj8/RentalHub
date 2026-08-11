import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  MessageSquare,
  ShieldCheck,
  Star,
  Camera,
  Truck,
  MapPin,
  ChevronRight,
  Filter,
  Loader2,
} from 'lucide-react';
import { Booking, BookingStatus, User } from '../types';
import { ROUTES } from '../lib/routes';

interface BookingsPageProps {
  currentUser: User | null;
  bookings: Booking[];
  onCancelBooking?: (bookingId: string) => Promise<void> | void;
  onAddReview?: (bookingId: string) => void;
}

export const BookingsPage: React.FC<BookingsPageProps> = ({
  currentUser,
  bookings,
  onCancelBooking,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancel = async (bookingId: string) => {
    try {
      setCancellingId(bookingId);
      if (onCancelBooking) {
        await onCancelBooking(bookingId);
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  const tabs = [
    { id: 'all', label: 'All Bookings', count: bookings.length },
    {
      id: 'upcoming',
      label: 'Upcoming',
      count: bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending' || b.status === 'pickup_ready').length,
    },
    {
      id: 'active',
      label: 'Active',
      count: bookings.filter((b) => b.status === 'active' || b.status === 'locked').length,
    },
    {
      id: 'completed',
      label: 'Completed',
      count: bookings.filter((b) => b.status === 'completed').length,
    },
    {
      id: 'cancelled',
      label: 'Cancelled',
      count: bookings.filter((b) => b.status === 'cancelled').length,
    },
    {
      id: 'disputed',
      label: 'Disputed',
      count: bookings.filter((b) => b.status === 'disputed' || b.hasDisputeFlag).length,
    },
  ];

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming')
      return b.status === 'confirmed' || b.status === 'pending' || b.status === 'pickup_ready';
    if (activeTab === 'active') return b.status === 'active' || b.status === 'locked';
    if (activeTab === 'completed') return b.status === 'completed';
    if (activeTab === 'cancelled') return b.status === 'cancelled';
    if (activeTab === 'disputed') return b.status === 'disputed' || b.hasDisputeFlag;
    return true;
  });

  const getStatusBadge = (status: BookingStatus, hasDispute?: boolean) => {
    if (hasDispute || status === 'disputed') {
      return (
        <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          <span>Disputed</span>
        </span>
      );
    }
    switch (status) {
      case 'pending':
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Pending Approval</span>
          </span>
        );
      case 'confirmed':
      case 'locked':
        return (
          <span className="px-2.5 py-1 rounded-full bg-[#F27D26]/10 text-[#F27D26] border border-[#F27D26]/30 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            <span>Confirmed</span>
          </span>
        );
      case 'pickup_ready':
        return (
          <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
            <Truck className="w-3 h-3" />
            <span>Pickup Ready</span>
          </span>
        );
      case 'active':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            <span>Active Rental</span>
          </span>
        );
      case 'return_pending':
        return (
          <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Return Pending</span>
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            <span>Completed</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full bg-[#1A1A1A] text-[#888888] border border-[#333] text-[10px] font-mono font-bold uppercase tracking-wider">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1F1F1F]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#F27D26] uppercase tracking-wider font-bold mb-1">
            <Calendar className="w-4 h-4" />
            <span>Customer Portal</span>
          </div>
          <h1 className="font-serif italic text-3xl font-normal text-white">Rental Bookings</h1>
          <p className="text-xs text-[#888888] font-mono mt-1">
            Track active rentals, view pickup/return status, inspect condition reports, and manage booking history.
          </p>
        </div>

        <Link
          to={ROUTES.browse}
          className="px-4 py-2.5 rounded-xl bg-[#F27D26] hover:bg-[#d96a1a] text-black font-bold text-xs uppercase tracking-wider transition cursor-pointer self-start md:self-auto shadow-lg flex items-center gap-2"
        >
          <span>Find Equipment</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Navigation Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar border-b border-[#1F1F1F]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#F27D26] text-black shadow-md'
                : 'bg-[#111111] text-[#888888] hover:text-white hover:bg-[#1A1A1A] border border-[#1F1F1F]'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === tab.id ? 'bg-black text-white' : 'bg-[#1F1F1F] text-[#AAAAAA]'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-[#111111] rounded-3xl p-12 text-center border border-[#1F1F1F] max-w-md mx-auto space-y-4 font-mono">
          <Calendar className="w-12 h-12 text-[#444444] mx-auto" />
          <h3 className="font-serif italic text-white text-lg">No Bookings Found</h3>
          <p className="text-xs text-[#888888]">
            {activeTab === 'all'
              ? "You haven't rented any equipment yet. Explore the marketplace to make your first reservation!"
              : `No bookings currently match the "${activeTab}" status filter.`}
          </p>
          <Link
            to={ROUTES.browse}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F27D26] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#d96a1a] transition"
          >
            <span>Explore Marketplace</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-[#111111] rounded-3xl p-6 border border-[#1F1F1F] shadow-xl hover:border-[#333333] transition-all space-y-4"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#1F1F1F]">
                <div className="flex items-start gap-4">
                  <img
                    src={b.equipmentImage}
                    alt={b.equipmentTitle}
                    className="w-20 h-20 rounded-2xl object-cover border border-[#333333] shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=1000';
                    }}
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-serif italic text-white text-lg">{b.equipmentTitle}</h3>
                      {getStatusBadge(b.status, b.hasDisputeFlag)}
                    </div>
                    <p className="text-xs text-[#888888] font-mono mt-1 flex items-center gap-2">
                      <span>Ref <strong className="text-white">#{b.id.substring(0, 10).toUpperCase()}</strong></span>
                      <span>•</span>
                      <span>Owner: <strong className="text-white">{b.ownerName}</strong></span>
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#AAAAAA] mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#F27D26]" />
                        {b.startDate} → {b.endDate} ({b.priceBreakdown.rentalDays} days)
                      </span>
                      <span className="flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-[#F27D26]" />
                        {b.deliveryMethod === 'delivery' ? 'Delivery to Site' : 'Owner Pickup'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 pt-3 lg:pt-0 border-[#1F1F1F]">
                  <div className="text-right">
                    <div className="text-2xl font-serif italic font-bold text-[#F27D26]">
                      ₹{b.priceBreakdown.total}
                    </div>
                    <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                      Payment {b.paymentStatus || 'Paid'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <Link
                    to={ROUTES.bookingDetail(b.id)}
                    className="px-4 py-2 rounded-xl bg-[#F27D26] hover:bg-[#d96a1a] text-black font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Booking Details</span>
                  </Link>

                  <a
                    href={`mailto:owner@rentalhub.com?subject=Inquiry regarding Booking ${b.id}`}
                    className="px-3.5 py-2 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] text-white border border-[#333333] font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-[#F27D26]" />
                    <span>Contact Owner</span>
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  {b.status === 'completed' && (
                    <Link
                      to={ROUTES.bookingDetail(b.id)}
                      className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Star className="w-4 h-4 fill-current" />
                      <span>Review Experience</span>
                    </Link>
                  )}

                  {(b.status === 'pending' || b.status === 'confirmed' || b.status === 'locked') && onCancelBooking && (
                    <button
                      onClick={() => handleCancel(b.id)}
                      disabled={cancellingId === b.id}
                      className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                    >
                      {cancellingId === b.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                      <span>Cancel Booking</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
