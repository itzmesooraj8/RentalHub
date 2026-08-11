import React, { useState } from 'react';
import {
  Scale,
  AlertTriangle,
  CheckCircle,
  ShieldCheck,
  Camera,
  DollarSign,
  User as UserIcon,
  Filter,
} from 'lucide-react';
import { Dispute } from '../types';

interface AdminDisputesPageProps {
  disputes: Dispute[];
  onResolveDispute?: (disputeId: string, winner: 'renter' | 'owner') => void;
}

export const AdminDisputesPage: React.FC<AdminDisputesPageProps> = ({
  disputes: initialDisputes,
  onResolveDispute,
}) => {
  const [disputes, setDisputes] = useState<Dispute[]>(initialDisputes);
  const [activeTab, setActiveTab] = useState<'all' | 'open' | 'resolved'>('all');

  const filteredDisputes = disputes.filter((d) => {
    if (activeTab === 'open') return d.status === 'open' || d.status === 'under_review';
    if (activeTab === 'resolved') return d.status === 'resolved' || d.status === 'dismissed';
    return true;
  });

  const handleResolve = (disputeId: string, winner: 'renter' | 'owner') => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === disputeId ? { ...d, status: 'resolved' as const } : d))
    );
    if (onResolveDispute) onResolveDispute(disputeId, winner);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1F1F1F]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#F27D26] uppercase font-bold tracking-wider mb-1">
            <Scale className="w-4 h-4" />
            <span>Escrow & Dispute Authority</span>
          </div>
          <h1 className="font-serif italic text-3xl font-normal text-white">Dispute Resolution Center</h1>
          <p className="text-xs text-[#888888] font-mono mt-1">
            Inspect condition discrepancies, evaluate pickup vs return photos, and adjudicate security deposit disbursements.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#1F1F1F] pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition ${
            activeTab === 'all' ? 'bg-[#F27D26] text-black' : 'bg-[#111111] text-[#888888] hover:text-white'
          }`}
        >
          All Claims ({disputes.length})
        </button>
        <button
          onClick={() => setActiveTab('open')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition ${
            activeTab === 'open' ? 'bg-[#F27D26] text-black' : 'bg-[#111111] text-[#888888] hover:text-white'
          }`}
        >
          Open Claims ({disputes.filter((d) => d.status === 'open' || d.status === 'under_review').length})
        </button>
        <button
          onClick={() => setActiveTab('resolved')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition ${
            activeTab === 'resolved' ? 'bg-[#F27D26] text-black' : 'bg-[#111111] text-[#888888] hover:text-white'
          }`}
        >
          Resolved
        </button>
      </div>

      {/* Dispute Cards */}
      {filteredDisputes.length === 0 ? (
        <div className="bg-[#111111] rounded-3xl p-12 text-center border border-[#1F1F1F] max-w-md mx-auto space-y-3 font-mono">
          <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="font-serif italic text-white text-base">No Active Disputes</h3>
          <p className="text-xs text-[#888888]">
            Zero open dispute claims currently require administrative inspection.
          </p>
        </div>
      ) : (
        <div className="space-y-6 font-mono text-xs">
          {filteredDisputes.map((d) => (
            <div key={d.id} className="p-6 rounded-3xl bg-[#111111] border border-[#1F1F1F] space-y-5 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1F1F1F]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif italic text-white text-lg">{d.equipmentTitle}</span>
                    <span className="px-2.5 py-0.5 rounded bg-[#F27D26]/20 text-[#F27D26] border border-[#F27D26]/40 text-[10px] font-bold uppercase">
                      {d.reason}
                    </span>
                  </div>
                  <div className="text-xs text-[#888888] mt-1">
                    Renter: <strong className="text-white">{d.renterName || 'Customer'}</strong> • Owner: <strong className="text-white">{d.ownerName || 'Owner'}</strong> • Ref <strong className="text-white">#{d.bookingId.toUpperCase()}</strong>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-serif italic font-bold text-[#F27D26]">${d.amountClaimed || 500} Deposit Hold Claim</span>
                  <span className="block text-[10px] text-[#888888]">Opened: {d.createdAt}</span>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 bg-[#1A1A1A] rounded-2xl border border-[#262626] space-y-2">
                <div className="text-[10px] font-bold text-[#F27D26] uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Noted Condition Differences & Damage Claim</span>
                </div>
                <p className="text-xs text-white leading-relaxed">{d.description}</p>
              </div>

              {/* Photos comparison */}
              {(d.beforePhotos?.length || d.afterPhotos?.length) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-[#1A1A1A] rounded-2xl border border-[#262626] space-y-2">
                    <span className="text-[10px] font-bold text-[#888888] uppercase block">Pickup Photos</span>
                    <div className="flex gap-2 overflow-x-auto">
                      {d.beforePhotos?.map((p, i) => (
                        <img key={i} src={p} alt="Before" className="w-20 h-20 rounded-xl object-cover border border-[#333]" />
                      ))}
                    </div>
                  </div>
                  <div className="p-3 bg-[#1A1A1A] rounded-2xl border border-[#262626] space-y-2">
                    <span className="text-[10px] font-bold text-[#F27D26] uppercase block">Return Inspection Photos</span>
                    <div className="flex gap-2 overflow-x-auto">
                      {d.afterPhotos?.map((p, i) => (
                        <img key={i} src={p} alt="After" className="w-20 h-20 rounded-xl object-cover border border-[#F27D26]/50" />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Resolution Controls */}
              {d.status !== 'resolved' ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#1F1F1F]">
                  <span className="text-[11px] text-[#888888]">
                    Authorizing an action will release or transfer the escrow deposit hold immediately.
                  </span>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleResolve(d.id, 'renter')}
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] text-white border border-[#333333] text-xs font-bold uppercase cursor-pointer"
                    >
                      Release Full Hold to Renter
                    </button>
                    <button
                      onClick={() => handleResolve(d.id, 'owner')}
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#F27D26] hover:bg-[#d96a1a] text-black text-xs font-bold uppercase cursor-pointer"
                    >
                      Approve Owner Claim (${d.amountClaimed || 500})
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 font-bold uppercase text-[11px]">
                  Dispute Resolved by Admin Authority
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
