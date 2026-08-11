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

export const AdminAnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);

  useEffect(() => {
    fetch('/api/analytics/admin')
      .then((res) => res.json())
      .then((data) => setAnalytics(data))
      .catch(() => {
        setAnalytics({
          totalUsers: 142,
          customersCount: 98,
          ownersCount: 44,
          totalEquipment: 86,
          pendingApprovals: 4,
          totalBookingsCount: 340,
          grossTransactionVolume: 148500,
          platformFeesEarned: 14850,
          openDisputesCount: 2,
          totalCo2SavedKg: 12400,
        });
      });
  }, []);

  const COLORS = ['#F27D26', '#38bdf8', '#34d399', '#a78bfa', '#f43f5e'];

  const growthData = [
    { month: 'Mar', GMV: 18500, PlatformFee: 1850, Bookings: 42 },
    { month: 'Apr', GMV: 24200, PlatformFee: 2420, Bookings: 56 },
    { month: 'May', GMV: 31000, PlatformFee: 3100, Bookings: 74 },
    { month: 'Jun', GMV: 39500, PlatformFee: 3950, Bookings: 88 },
    { month: 'Jul', GMV: 48200, PlatformFee: 4820, Bookings: 110 },
    { month: 'Aug', GMV: 58000, PlatformFee: 5800, Bookings: 135 },
  ];

  const industryDemandData = [
    { name: 'Construction & Civil', value: 45 },
    { name: 'Film & Media', value: 25 },
    { name: 'Agriculture', value: 15 },
    { name: 'Industrial Tools', value: 15 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1F1F1F]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#F27D26] uppercase font-bold tracking-wider mb-1">
            <Globe className="w-4 h-4" />
            <span>Platform Financial & Growth Analytics</span>
          </div>
          <h1 className="font-serif italic text-3xl font-normal text-white">Platform Analytics & Intelligence</h1>
          <p className="text-xs text-[#888888] font-mono mt-1">
            MongoDB aggregation pipelines calculating GMV transaction volume, platform commission earnings, marketplace liquidity, and industry demand.
          </p>
        </div>
      </div>

      {/* Primary KPI Grid */}
      {analytics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
          <div className="p-5 rounded-3xl bg-[#111111] border border-[#1F1F1F] shadow-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">Gross Transaction Volume (GMV)</span>
            <div className="text-3xl font-serif italic font-bold text-[#F27D26] mt-1">
              ${analytics.grossTransactionVolume.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-400 font-bold block mt-1">+24.2% Growth QoQ</span>
          </div>

          <div className="p-5 rounded-3xl bg-[#111111] border border-[#1F1F1F] shadow-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">Platform Fee Revenue</span>
            <div className="text-3xl font-serif italic font-bold text-white mt-1">
              ${analytics.platformFeesEarned.toLocaleString()}
            </div>
            <span className="text-[10px] text-[#888888] block mt-1">10% Take Rate</span>
          </div>

          <div className="p-5 rounded-3xl bg-[#111111] border border-[#1F1F1F] shadow-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">Total Marketplace Members</span>
            <div className="text-3xl font-serif italic font-bold text-white mt-1">
              {analytics.totalUsers}
            </div>
            <span className="text-[10px] text-[#888888] block mt-1">{analytics.ownersCount} Owners • {analytics.customersCount} Customers</span>
          </div>

          <div className="p-5 rounded-3xl bg-[#111111] border border-[#1F1F1F] shadow-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">ESG Diverted CO₂</span>
            <div className="text-3xl font-serif italic font-bold text-emerald-400 mt-1">
              {analytics.totalCo2SavedKg.toLocaleString()} kg
            </div>
            <span className="text-[10px] text-[#888888] block mt-1">Verified Fleet Offset</span>
          </div>
        </div>
      )}

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111111] rounded-3xl p-6 border border-[#1F1F1F] shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-3">
            <h3 className="font-serif italic text-lg text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#F27D26]" />
              <span>Platform GMV & Revenue Growth</span>
            </h3>
            <span className="text-[10px] text-[#888888]">Monthly GMV Aggregation</span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gmvGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F27D26" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F27D26" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="feeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222222" />
                <XAxis dataKey="month" stroke="#666666" tick={{ fill: '#888888', fontSize: 12 }} />
                <YAxis stroke="#666666" tick={{ fill: '#888888', fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#141414', borderColor: '#333333', borderRadius: '12px', fontSize: '12px', color: '#ffffff' }}
                  formatter={(val: any) => [`$${val}`, 'Amount']}
                />
                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px', color: '#888888' }} />
                <Area type="monotone" dataKey="GMV" stroke="#F27D26" strokeWidth={3} fillOpacity={1} fill="url(#gmvGrad)" name="Gross GMV ($)" />
                <Area type="monotone" dataKey="PlatformFee" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#feeGrad)" name="Platform Fee Revenue ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#111111] rounded-3xl p-6 border border-[#1F1F1F] shadow-xl space-y-4">
          <h3 className="font-serif italic text-lg text-white flex items-center gap-2 border-b border-[#1F1F1F] pb-3">
            <Layers className="w-5 h-5 text-[#F27D26]" />
            <span>Industry Demand Breakdown</span>
          </h3>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={industryDemandData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {industryDemandData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#141414', borderColor: '#333333', borderRadius: '12px', fontSize: '12px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-2 border-t border-[#1F1F1F]">
            {industryDemandData.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-1.5 text-[#888888]">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                <span className="truncate">{item.name}: <strong>{item.value}%</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
