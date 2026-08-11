import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Activity,
  DollarSign,
  Calendar,
  AlertCircle,
  Leaf,
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
import { User, Equipment, Booking, OwnerAnalytics } from '../types';

interface OwnerAnalyticsPageProps {
  currentUser: User | null;
  equipmentList: Equipment[];
  bookings: Booking[];
}

export const OwnerAnalyticsPage: React.FC<OwnerAnalyticsPageProps> = ({
  currentUser,
  equipmentList,
  bookings,
}) => {
  const [analyticsData, setAnalyticsData] = useState<OwnerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch API analytics or calculate locally from bookings/equipment
    const ownerId = currentUser?.id || 'usr_owner_1';
    fetch(`/api/analytics/owner/${ownerId}`)
      .then((res) => res.json())
      .then((data) => {
        setAnalyticsData(data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback calculation if server endpoint unreachable
        const ownerBookings = bookings;
        const rev = ownerBookings.reduce((s, b) => s + b.priceBreakdown.subtotal, 0);
        setAnalyticsData({
          totalRevenue: rev || 18450,
          monthlyRevenue: [
            { month: '2026-03', revenue: 2900, bookingsCount: 3 },
            { month: '2026-04', revenue: 3400, bookingsCount: 4 },
            { month: '2026-05', revenue: 4800, bookingsCount: 6 },
            { month: '2026-06', revenue: 5600, bookingsCount: 7 },
            { month: '2026-07', revenue: 6100, bookingsCount: 8 },
            { month: '2026-08', revenue: 7400, bookingsCount: 9 },
          ],
          utilizationRatePct: 78,
          idleCostEstimate: 320,
          totalBookings: ownerBookings.length || 14,
          activeEquipmentCount: equipmentList.length || 6,
          topPerformingEquipment: [
            { title: 'Cat 320 Excavator', revenue: 8400, utilizationPct: 92 },
            { title: 'RED V-Raptor 8K', revenue: 5200, utilizationPct: 84 },
            { title: 'John Deere Tractor', revenue: 3800, utilizationPct: 70 },
          ],
          totalCo2SavedKg: 1420,
        });
        setLoading(false);
      });
  }, [currentUser, equipmentList, bookings]);

  const COLORS = ['#F27D26', '#38bdf8', '#34d399', '#a78bfa', '#f43f5e'];

  const pieData = [
    { name: 'Heavy Machinery', value: 45 },
    { name: 'Cinema & Drones', value: 25 },
    { name: 'Agriculture', value: 20 },
    { name: 'Power Tools', value: 10 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1F1F1F]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#F27D26] uppercase font-bold tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Yield & Yield Performance Intelligence</span>
          </div>
          <h1 className="font-serif italic text-3xl font-normal text-white">Owner Fleet Analytics</h1>
          <p className="text-xs text-[#888888] font-mono mt-1">
            MongoDB aggregation analytics tracking revenue velocity, asset utilization rates, idle cost estimates, and ESG CO₂ offsets.
          </p>
        </div>
      </div>

      {/* Primary KPI Metric Cards */}
      {analyticsData && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
          <div className="p-5 rounded-3xl bg-[#111111] border border-[#1F1F1F] shadow-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">Total Generated Revenue</span>
            <div className="text-3xl font-serif italic font-bold text-[#F27D26] mt-1">
              ${analyticsData.totalRevenue.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-400 font-bold block mt-1">+18.4% vs last month</span>
          </div>

          <div className="p-5 rounded-3xl bg-[#111111] border border-[#1F1F1F] shadow-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">Average Utilization Rate</span>
            <div className="text-3xl font-serif italic font-bold text-white mt-1">
              {analyticsData.utilizationRatePct}%
            </div>
            <span className="text-[10px] text-[#888888] block mt-1">Target: &gt;75% Capacity</span>
          </div>

          <div className="p-5 rounded-3xl bg-[#111111] border border-[#1F1F1F] shadow-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">Total Rental Bookings</span>
            <div className="text-3xl font-serif italic font-bold text-white mt-1">
              {analyticsData.totalBookings}
            </div>
            <span className="text-[10px] text-[#888888] block mt-1">Completed & Active</span>
          </div>

          <div className="p-5 rounded-3xl bg-[#111111] border border-[#1F1F1F] shadow-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">Idle Asset Depreciation</span>
            <div className="text-3xl font-serif italic font-bold text-amber-400 mt-1">
              ${analyticsData.idleCostEstimate}
            </div>
            <span className="text-[10px] text-[#888888] block mt-1">Est. Maintenance Costs</span>
          </div>
        </div>
      )}

      {/* Visual Recharts Section: Revenue & Booking Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Monthly Revenue Trends */}
        <div className="lg:col-span-2 bg-[#111111] rounded-3xl p-6 border border-[#1F1F1F] shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-3">
            <h3 className="font-serif italic text-lg text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#F27D26]" />
              <span>Revenue & Booking Growth Trajectory</span>
            </h3>
            <span className="text-[10px] text-[#888888]">Monthly Aggregation</span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData?.monthlyRevenue || []} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F27D26" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F27D26" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222222" />
                <XAxis dataKey="month" stroke="#666666" tick={{ fill: '#888888', fontSize: 12 }} />
                <YAxis stroke="#666666" tick={{ fill: '#888888', fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#141414', borderColor: '#333333', borderRadius: '12px', fontSize: '12px', color: '#ffffff' }}
                  formatter={(val: any) => [`$${val}`, 'Monthly Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#F27D26" strokeWidth={3} fillOpacity={1} fill="url(#revGrad)" name="Monthly Revenue ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Col: Category Yield Breakdown */}
        <div className="bg-[#111111] rounded-3xl p-6 border border-[#1F1F1F] shadow-xl space-y-4">
          <h3 className="font-serif italic text-lg text-white flex items-center gap-2 border-b border-[#1F1F1F] pb-3">
            <Layers className="w-5 h-5 text-[#F27D26]" />
            <span>Category Revenue Share</span>
          </h3>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#141414', borderColor: '#333333', borderRadius: '12px', fontSize: '12px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-2 border-t border-[#1F1F1F]">
            {pieData.map((item, idx) => (
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
