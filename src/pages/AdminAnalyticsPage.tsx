import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Wrench,
  DollarSign,
  ShieldCheck,
  Globe,
  Leaf,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { AdminAnalytics } from '../types';
import { analyticsService } from '../services/analyticsService';

export const AdminAnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService
      .getAdminAnalytics()
      .then((data) => {
        setAnalytics(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load admin analytics:', err);
        setLoading(false);
      });
  }, []);

  const COLORS = ['#F27D26', '#38bdf8', '#34d399', '#a78bfa', '#f43f5e'];

  if (loading || !analytics) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-slate-400">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        Running MongoDB Atlas GMV & Commission Aggregation Pipeline...
      </div>
    );
  }

  const userDistribution = [
    { name: 'Customers', value: analytics.customersCount },
    { name: 'Equipment Owners', value: analytics.ownersCount },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full w-fit mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            MongoDB Atlas Native Pipeline Aggregation
          </div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-indigo-500" />
            Platform Ecosystem Intelligence
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time Gross Transaction Volume (GMV), net platform fee earnings, and dispute metrics computed directly in MongoDB Atlas.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Gross Volume (GMV)</span>
            <DollarSign className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 font-mono">
            ${analytics.grossTransactionVolume.toLocaleString()}
          </p>
          <p className="text-xs text-indigo-400 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            100% MongoDB Aggregation Verified
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Platform Commission</span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 font-mono">
            ${analytics.platformFeesEarned.toLocaleString()}
          </p>
          <p className="text-xs text-emerald-400 mt-2">
            Net 10% platform fee margin
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Users</span>
            <Users className="w-5 h-5 text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 font-mono">
            {analytics.totalUsers} Members
          </p>
          <p className="text-xs text-slate-400 mt-2">
            {analytics.customersCount} Renter Customers / {analytics.ownersCount} Fleet Owners
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Active Inventory</span>
            <Wrench className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 font-mono">
            {analytics.totalEquipment} Assets
          </p>
          <p className="text-xs text-amber-400 mt-2">
            {analytics.pendingApprovals} Listings Pending Approval
          </p>
        </div>
      </div>

      {/* User Distribution Chart */}
      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
        <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-400" />
          Marketplace User Distribution (MongoDB Pipeline)
        </h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={userDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {userDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
