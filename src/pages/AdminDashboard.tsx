import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  Wrench,
  Layers,
  Scale,
  BarChart3,
  Calendar,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import { Booking, Dispute } from '../types';
import { ROUTES } from '../lib/routes';

import { AuditLog } from '../components/admin/AuditLog';

interface AdminDashboardProps {
  bookings: Booking[];
  disputes: Dispute[];
  onResolveDispute: (disputeId: string, winner: 'renter' | 'owner') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  bookings,
  disputes,
}) => {
  const totalVolume = bookings.reduce((sum, b) => sum + b.priceBreakdown.total, 0);
  const openDisputes = disputes.filter((d) => d.status === 'open' || d.status === 'under_review');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans text-white">
      {/* Overview Title Banner */}
      <div className="bg-[#111111] rounded-3xl p-6 sm:p-8 border border-[#1F1F1F] shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1F1F1F]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#1A1A1A] border border-[#333333] flex items-center justify-center text-[#F27D26]">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-serif italic text-white tracking-tight">Admin Operations Command Center</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#1A1A1A] border border-[#333333] text-[#F27D26] text-[10px] font-bold uppercase tracking-wider font-mono">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-[#888888] mt-0.5">
                Overview of user governance, equipment moderation, category taxonomy, escrow ledger, and dispute claims.
              </p>
            </div>
          </div>
        </div>

        {/* Global Overview Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-sans">
          <div className="p-4 rounded-2xl bg-[#1A1A1A] border border-[#222222]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#666666] font-mono">Processed GMV Volume</span>
            <div className="text-2xl font-serif italic font-bold text-[#F27D26] mt-1">${totalVolume}</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#1A1A1A] border border-[#222222]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#666666] font-mono">Total Active Bookings</span>
            <div className="text-2xl font-serif italic font-bold text-white mt-1">{bookings.length}</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#1A1A1A] border border-[#222222]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#666666] font-mono">Open Claims / Disputes</span>
            <div className="text-2xl font-serif italic font-bold text-rose-400 mt-1">{openDisputes.length}</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#1A1A1A] border border-[#222222]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#666666] font-mono">Pending Moderations</span>
            <div className="text-2xl font-serif italic font-bold text-emerald-400 mt-1">4</div>
          </div>
        </div>
      </div>

      {/* Admin Modules Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-sans text-xs">
        <Link
          to={ROUTES.adminUsers}
          className="p-6 rounded-3xl bg-[#111111] border border-[#1F1F1F] hover:border-[#F27D26]/50 transition shadow-xl space-y-3 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-[#F27D26] group-hover:scale-110 transition">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-serif italic text-lg text-white">User & KYC Governance</h3>
          <p className="text-xs text-[#888888] leading-relaxed">
            Manage user roles, verify business identity documents, inspect trust scores, and suspend accounts.
          </p>
          <div className="text-[#F27D26] font-bold uppercase text-[10px] flex items-center gap-1 font-mono">
            <span>Manage Users</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          to={ROUTES.adminEquipment}
          className="p-6 rounded-3xl bg-[#111111] border border-[#1F1F1F] hover:border-[#F27D26]/50 transition shadow-xl space-y-3 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-[#F27D26] group-hover:scale-110 transition">
            <Wrench className="w-5 h-5" />
          </div>
          <h3 className="font-serif italic text-lg text-white">Equipment Moderation</h3>
          <p className="text-xs text-[#888888] leading-relaxed">
            Approve or decline new equipment listings, inspect safety documentation, and unlist assets.
          </p>
          <div className="text-[#F27D26] font-bold uppercase text-[10px] flex items-center gap-1 font-mono">
            <span>Manage Equipment</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          to={ROUTES.adminCategories}
          className="p-6 rounded-3xl bg-[#111111] border border-[#1F1F1F] hover:border-[#F27D26]/50 transition shadow-xl space-y-3 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-[#F27D26] group-hover:scale-110 transition">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-serif italic text-lg text-white">Category Taxonomy</h3>
          <p className="text-xs text-[#888888] leading-relaxed">
            Configure multi-industry verticals, categories, subcategories, and required technical attributes.
          </p>
          <div className="text-[#F27D26] font-bold uppercase text-[10px] flex items-center gap-1 font-mono">
            <span>Manage Categories</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          to={ROUTES.adminBookings}
          className="p-6 rounded-3xl bg-[#111111] border border-[#1F1F1F] hover:border-[#F27D26]/50 transition shadow-xl space-y-3 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-[#F27D26] group-hover:scale-110 transition">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="font-serif italic text-lg text-white">Platform Bookings Ledger</h3>
          <p className="text-xs text-[#888888] leading-relaxed">
            Audit master reservation ledger, Stripe transaction authorization holds, and fee breakdowns.
          </p>
          <div className="text-[#F27D26] font-bold uppercase text-[10px] flex items-center gap-1 font-mono">
            <span>View Master Ledger</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          to={ROUTES.adminDisputes}
          className="p-6 rounded-3xl bg-[#111111] border border-[#1F1F1F] hover:border-[#F27D26]/50 transition shadow-xl space-y-3 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-[#F27D26] group-hover:scale-110 transition">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="font-serif italic text-lg text-white">Dispute Resolution Center</h3>
          <p className="text-xs text-[#888888] leading-relaxed">
            Inspect condition differences, side-by-side inspection photos, and disburse security deposits.
          </p>
          <div className="text-[#F27D26] font-bold uppercase text-[10px] flex items-center gap-1 font-mono">
            <span>Resolve Disputes ({openDisputes.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          to={ROUTES.adminAnalytics}
          className="p-6 rounded-3xl bg-[#111111] border border-[#1F1F1F] hover:border-[#F27D26]/50 transition shadow-xl space-y-3 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-[#F27D26] group-hover:scale-110 transition">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h3 className="font-serif italic text-lg text-white">Platform Analytics</h3>
          <p className="text-xs text-[#888888] leading-relaxed">
            Visualize gross transaction volume, platform commission fee revenue, category demand, and ESG offsets.
          </p>
          <div className="text-[#F27D26] font-bold uppercase text-[10px] flex items-center gap-1 font-mono">
            <span>Open Analytics</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </div>

      {/* Security Audit Stream */}
      <AuditLog />
    </div>
  );
};
