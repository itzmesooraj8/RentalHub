import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  ShieldCheck,
  Filter,
} from 'lucide-react';
import { Equipment } from '../types';
import { ROUTES } from '../lib/routes';

interface AdminEquipmentPageProps {
  equipmentList: Equipment[];
  onApproveEquipment?: (id: string) => void;
  onRejectEquipment?: (id: string) => void;
  onSuspendEquipment?: (id: string) => void;
}

export const AdminEquipmentPage: React.FC<AdminEquipmentPageProps> = ({
  equipmentList: initialList,
  onApproveEquipment,
  onRejectEquipment,
  onSuspendEquipment,
}) => {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>(initialList);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'active' | 'unlisted' | 'maintenance' | 'flagged'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'all', label: 'All Fleet', count: equipmentList.length },
    { id: 'pending', label: 'Pending Approval', count: equipmentList.filter((e) => !e.approvedByAdmin).length },
    { id: 'active', label: 'Active Marketplace', count: equipmentList.filter((e) => e.approvedByAdmin && e.status !== 'unlisted').length },
    { id: 'unlisted', label: 'Unlisted', count: equipmentList.filter((e) => e.status === 'unlisted').length },
    { id: 'flagged', label: 'Flagged Assets', count: 0 },
  ];

  const filteredEquipment = equipmentList.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.ownerName.toLowerCase().includes(q);

    if (activeTab === 'pending') return matchesSearch && !item.approvedByAdmin;
    if (activeTab === 'active') return matchesSearch && item.approvedByAdmin && item.status !== 'unlisted';
    if (activeTab === 'unlisted') return matchesSearch && item.status === 'unlisted';
    return matchesSearch;
  });

  const handleApprove = (id: string) => {
    setEquipmentList((prev) => prev.map((e) => (e.id === id ? { ...e, approvedByAdmin: true } : e)));
    if (onApproveEquipment) onApproveEquipment(id);
  };

  const handleReject = (id: string) => {
    setEquipmentList((prev) => prev.filter((e) => e.id !== id));
    if (onRejectEquipment) onRejectEquipment(id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1F1F1F]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#F27D26] uppercase font-bold tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Marketplace Moderation</span>
          </div>
          <h1 className="font-serif italic text-3xl font-normal text-white">Equipment Catalog Control</h1>
          <p className="text-xs text-[#888888] font-mono mt-1">
            Audit owner equipment submissions, verify safety certifications, approve listings, and manage catalog status.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar border-b border-[#1F1F1F]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#F27D26] text-black shadow-md'
                : 'bg-[#111111] text-[#888888] hover:text-white border border-[#1F1F1F]'
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

      {/* Search */}
      <div className="bg-[#111111] p-4 rounded-3xl border border-[#1F1F1F] text-xs font-mono">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search equipment title, category, owner name..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#1A1A1A] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
          />
          <Search className="w-4 h-4 text-[#666666] absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Equipment Table */}
      <div className="bg-[#111111] rounded-3xl border border-[#1F1F1F] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#181818] border-b border-[#222222] text-[#888888] uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Equipment Listing</th>
                <th className="p-4">Category</th>
                <th className="p-4">Owner</th>
                <th className="p-4">Daily Rate</th>
                <th className="p-4">Moderation Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F1F]">
              {filteredEquipment.map((item) => (
                <tr key={item.id} className="hover:bg-[#141414] transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={item.images[0]} alt={item.title} className="w-12 h-12 rounded-xl object-cover border border-[#333] shrink-0" />
                      <div>
                        <div className="font-serif italic text-sm text-white">{item.title}</div>
                        <div className="text-[10px] text-[#666666]">{item.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-[#AAAAAA]">{item.category}</td>
                  <td className="p-4 text-white font-bold">{item.ownerName}</td>
                  <td className="p-4 font-bold text-[#F27D26]">${item.dailyRate}/d</td>
                  <td className="p-4">
                    {item.approvedByAdmin ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase">
                        Approved Active
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase">
                        Pending Moderation
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={ROUTES.equipmentDetail(item.id)}
                        className="p-2 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] text-[#888888] hover:text-white transition"
                        title="View Marketplace Page"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      {!item.approvedByAdmin && (
                        <>
                          <button
                            onClick={() => handleApprove(item.id)}
                            className="px-3 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase text-[10px] transition cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(item.id)}
                            className="px-3 py-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold uppercase text-[10px] transition cursor-pointer"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
