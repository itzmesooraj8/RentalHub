import React, { useState, useEffect } from 'react';
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
import { apiClient } from '../services/apiClient';

interface AdminUsersPageProps {
  currentUser?: User | null;
  users?: User[];
  onVerifyKyc?: (userId: string) => void;
  onSuspendUser?: (userId: string) => void;
}

export const AdminUsersPage: React.FC<AdminUsersPageProps> = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [kycFilter, setKycFilter] = useState<'all' | KycStatus>('all');

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const res = await apiClient.get<{ success: boolean; data: User[] }>('/api/admin/users');
      setUsers(res.data.data || []);
    } catch (err) {
      console.error('Failed to load admin users:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleToggleRole = async (userId: string, currentRole: UserRole) => {
    const nextRole: UserRole = currentRole === 'customer' ? 'owner' : 'customer';
    try {
      await apiClient.patch(`/api/admin/users/${userId}/role`, { role: nextRole });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: nextRole } : u)));
    } catch (err) {
      console.error('Failed to update role:', err);
    }
  };

  const handleVerifyKyc = async (userId: string) => {
    try {
      await apiClient.patch(`/api/admin/users/${userId}/kyc`, { status: 'verified' });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, kycStatus: 'verified', kycVerified: true } : u)));
    } catch (err) {
      console.error('Failed to verify KYC:', err);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesKyc = kycFilter === 'all' || u.kycStatus === kycFilter;
    return matchesSearch && matchesRole && matchesKyc;
  });

  const verifiedCount = users.filter((u) => u.kycStatus === 'verified').length;
  const pendingCount = users.filter((u) => u.kycStatus === 'pending').length;

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#111111] p-6 rounded-3xl border border-[#222222]">
        <div className="space-y-1">
          <h1 className="text-2xl font-serif font-bold italic text-white flex items-center gap-3">
            <Users className="w-6 h-6 text-[#F27D26]" />
            <span>User & Governance Management</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Manage user roles, verify identity (KYC) documentation, and monitor trust scores live from MongoDB Atlas.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
            {verifiedCount} Verified Users
          </span>
          {pendingCount > 0 && (
            <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold animate-pulse">
              {pendingCount} KYC Pending
            </span>
          )}
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#111111] p-4 rounded-2xl border border-[#222222]">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#F27D26]"
          />
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#F27D26]" />
            <span className="text-slate-400">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-[#F27D26]"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customer</option>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-400">KYC:</span>
            <select
              value={kycFilter}
              onChange={(e) => setKycFilter(e.target.value as any)}
              className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-[#F27D26]"
            >
              <option value="all">All Statuses</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="text-center py-16 bg-[#111111] border border-[#222222] rounded-3xl">
          <div className="w-8 h-8 border-2 border-[#F27D26] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs font-mono text-slate-400">Querying MongoDB UserModel...</p>
        </div>
      ) : (
        <div className="bg-[#111111] border border-[#222222] rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#181818] border-b border-[#222222] text-[#888888] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">User Details</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Trust Score</th>
                  <th className="p-4">KYC Status</th>
                  <th className="p-4">Rentals</th>
                  <th className="p-4 text-right">Governance Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F1F1F]">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#161616] transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover border border-[#333333]" />
                        <div>
                          <div className="font-bold text-white text-sm">{u.name}</div>
                          <div className="text-[11px] text-slate-400">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                            : u.role === 'owner'
                            ? 'bg-[#F27D26]/10 border border-[#F27D26]/20 text-[#F27D26]'
                            : 'bg-slate-500/10 border border-slate-500/20 text-slate-300'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-emerald-400">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{u.trustScore || 95}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          u.kycStatus === 'verified'
                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                            : u.kycStatus === 'pending'
                            ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                            : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                        }`}
                      >
                        {u.kycStatus === 'verified' && <CheckCircle className="w-3 h-3" />}
                        {u.kycStatus === 'pending' && <Clock className="w-3 h-3" />}
                        <span>{u.kycStatus}</span>
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">{u.completedRentalsCount || 0} completed</td>
                    <td className="p-4 text-right space-x-2">
                      {u.kycStatus !== 'verified' && (
                        <button
                          onClick={() => handleVerifyKyc(u.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-[11px] transition cursor-pointer"
                        >
                          Verify KYC
                        </button>
                      )}
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleRole(u.id, u.role)}
                          className="px-3 py-1.5 rounded-lg bg-[#1A1A1A] hover:bg-[#252525] border border-[#333333] text-slate-200 text-[11px] transition cursor-pointer"
                        >
                          Switch to {u.role === 'customer' ? 'Owner' : 'Customer'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
