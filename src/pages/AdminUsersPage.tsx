import React, { useState } from 'react';
import {
  Users,
  Search,
  ShieldCheck,
  UserCheck,
  UserX,
  Star,
  CheckCircle,
  AlertTriangle,
  Lock,
  Filter,
  Clock,
} from 'lucide-react';
import { User, UserRole, KycStatus } from '../types';

interface AdminUsersPageProps {
  currentUser: User | null;
  users?: User[];
  onVerifyKyc?: (userId: string) => void;
  onSuspendUser?: (userId: string) => void;
}

export const AdminUsersPage: React.FC<AdminUsersPageProps> = ({
  currentUser,
  users: propUsers,
  onVerifyKyc,
  onSuspendUser,
}) => {
  const defaultUsers: User[] = [
    {
      id: 'usr_cust_1',
      name: 'Sarah Jenkins',
      email: 'sarah.j@contracting.com',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
      trustScore: 99,
      kycStatus: 'verified',
      kycVerified: true,
      completedRentalsCount: 28,
      memberSince: 'March 2024',
      createdAt: '2024-03-01T12:00:00Z',
    },
    {
      id: 'usr_own_1',
      name: 'Marcus Vance',
      email: 'm.vance@heavyfleet.com',
      role: 'owner',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      trustScore: 96,
      kycStatus: 'verified',
      kycVerified: true,
      completedRentalsCount: 42,
      memberSince: 'January 2024',
      createdAt: '2024-01-15T12:00:00Z',
    },
    {
      id: 'usr-301',
      name: 'Cascadia Trenching LLC',
      email: 'operations@cascadiatrenching.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      role: 'customer',
      trustScore: 88,
      kycStatus: 'pending',
      kycVerified: false,
      completedRentalsCount: 2,
      memberSince: 'August 2026',
      createdAt: '2026-08-01T12:00:00Z',
    },
  ];

  const [userList, setUserList] = useState<User[]>(propUsers || defaultUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [kycFilter, setKycFilter] = useState<string>('all');

  const filteredUsers = userList.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.id.toLowerCase().includes(q);

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesKyc = kycFilter === 'all' || u.kycStatus === kycFilter;

    return matchesSearch && matchesRole && matchesKyc;
  });

  const handleVerify = (id: string) => {
    setUserList((prev) =>
      prev.map((u) => (u.id === id ? { ...u, kycStatus: 'verified', kycVerified: true, trustScore: u.trustScore + 5 } : u))
    );
    if (onVerifyKyc) onVerifyKyc(id);
  };

  const handleSuspend = (id: string) => {
    setUserList((prev) => prev.filter((u) => u.id !== id));
    if (onSuspendUser) onSuspendUser(id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1F1F1F]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#F27D26] uppercase font-bold tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Admin Authority Operations</span>
          </div>
          <h1 className="font-serif italic text-3xl font-normal text-white">User & Member Governance</h1>
          <p className="text-xs text-[#888888] font-mono mt-1">
            Audit user profiles, verify business KYC identification documents, manage role permissions, and issue suspensions.
          </p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#111111] p-4 rounded-3xl border border-[#1F1F1F] text-xs">
        <div className="md:col-span-2 relative">
          <label className="text-[10px] text-[#666666] font-bold uppercase tracking-wider block mb-1">Search Members</label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or user ID..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#1A1A1A] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
            />
            <Search className="w-4 h-4 text-[#666666] absolute left-3 top-2.5" />
          </div>
        </div>

        <div>
          <label className="text-[10px] text-[#666666] font-bold uppercase tracking-wider block mb-1">Filter Role</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#1A1A1A] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
          >
            <option value="all">All Roles</option>
            <option value="customer">Customer</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] text-[#666666] font-bold uppercase tracking-wider block mb-1">KYC Status</label>
          <select
            value={kycFilter}
            onChange={(e) => setKycFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#1A1A1A] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
          >
            <option value="all">All KYC Statuses</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending Review</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#111111] rounded-3xl border border-[#1F1F1F] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#181818] border-b border-[#222222] text-[#888888] uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">KYC Status</th>
                <th className="p-4">Trust Score</th>
                <th className="p-4">Rentals</th>
                <th className="p-4">Joined</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F1F]">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[#141414] transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-xl object-cover border border-[#333333] shrink-0" />
                      <div>
                        <div className="font-bold text-white text-sm">{u.name}</div>
                        <div className="text-[10px] text-[#666666]">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#1A1A1A] border border-[#333333] text-[#F27D26] text-[10px] font-bold uppercase">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4">
                    {u.kycStatus === 'verified' || u.kycVerified ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase flex items-center gap-1 w-max">
                        <CheckCircle className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    ) : u.kycStatus === 'pending' ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase flex items-center gap-1 w-max">
                        <Clock className="w-3 h-3" />
                        <span>Pending KYC</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#1A1A1A] text-[#888888] border border-[#333] text-[10px] font-bold uppercase">
                        Unverified
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-bold text-white">
                    <div className="flex items-center gap-1 text-[#F27D26]">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{u.trustScore || 90}/100</span>
                    </div>
                  </td>
                  <td className="p-4 text-[#AAAAAA]">{u.completedRentalsCount || 0} Rentals</td>
                  <td className="p-4 text-[#666666]">{u.memberSince || '2024'}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {(!u.kycVerified || u.kycStatus === 'pending') && (
                        <button
                          onClick={() => handleVerify(u.id)}
                          className="px-3 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase text-[10px] transition cursor-pointer"
                        >
                          Verify KYC
                        </button>
                      )}
                      <button
                        onClick={() => handleSuspend(u.id)}
                        className="px-3 py-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold uppercase text-[10px] transition cursor-pointer"
                      >
                        Suspend
                      </button>
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
