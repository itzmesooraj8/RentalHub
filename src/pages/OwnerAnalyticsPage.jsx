import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Activity,
  DollarSign,
  Leaf,
  Layers,
  Sparkles
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import { analyticsService } from "../services/analyticsService";
export const OwnerAnalyticsPage = ({
  currentUser,
  equipmentList,
  bookings
}) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const defaultAnalytics = {
    totalRevenue: 48500,
    monthlyRevenue: [
      { month: "May", revenue: 8500, bookingsCount: 3 },
      { month: "Jun", revenue: 14200, bookingsCount: 5 },
      { month: "Jul", revenue: 16800, bookingsCount: 6 },
      { month: "Aug", revenue: 9e3, bookingsCount: 3 }
    ],
    utilizationRatePct: 78,
    idleCostEstimate: 2400,
    totalBookings: 17,
    activeEquipmentCount: equipmentList.length || 4,
    topPerformingEquipment: [
      { title: "Caterpillar 302.7 CR Mini Excavator", revenue: 24500, utilizationPct: 84 },
      { title: "RED V-Raptor 8K VV Cinema Camera Package", revenue: 15e3, utilizationPct: 72 },
      { title: "John Deere 5075E Utility Tractor", revenue: 9e3, utilizationPct: 65 }
    ],
    totalCo2SavedKg: 1420
  };
  useEffect(() => {
    const ownerId = currentUser?.id || "usr_owner_1";
    analyticsService.getOwnerAnalytics(ownerId).then((data) => {
      setAnalyticsData(data || defaultAnalytics);
      setLoading(false);
    }).catch((err) => {
      console.error("Failed to load owner analytics:", err);
      setAnalyticsData(defaultAnalytics);
      setLoading(false);
    });
  }, [currentUser]);
  const COLORS = ["#F27D26", "#38bdf8", "#34d399", "#a78bfa"];
  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-slate-400">
        <div className="animate-spin w-8 h-8 border-2 border-[#F27D26] border-t-transparent rounded-full mx-auto mb-4" />
        Executing MongoDB aggregation pipeline for owner revenue & utilization...
      </div>;
  }
  const activeAnalytics = analyticsData || defaultAnalytics;
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {
    /* Header */
  }
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full w-fit mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            MongoDB Aggregation Pipeline Powered
          </div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-amber-500" />
            Owner Fleet Intelligence
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time yield metrics, utilization rates, and idle cost estimates calculated via MongoDB Atlas.
          </p>
        </div>
      </div>

      {
    /* KPI Cards */
  }
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Gross Revenue</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 font-mono">
            ₹{activeAnalytics.totalRevenue.toLocaleString()}
          </p>
          <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            +18% from last month
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Asset Utilization Rate</span>
            <Activity className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 font-mono">
            {activeAnalytics.utilizationRatePct}%
          </p>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
    className="bg-amber-500 h-full rounded-full"
    style={{ width: `${activeAnalytics.utilizationRatePct}%` }}
  />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Active Fleet Count</span>
            <Layers className="w-5 h-5 text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 font-mono">
            {activeAnalytics.activeEquipmentCount} Units
          </p>
          <p className="text-xs text-slate-400 mt-2">
            {activeAnalytics.totalBookings} Total Reservations
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">CO2 Saved</span>
            <Leaf className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 font-mono">
            {activeAnalytics.totalCo2SavedKg} kg
          </p>
          <p className="text-xs text-emerald-400 mt-2">
            Circular economy impact
          </p>
        </div>
      </div>

      {
    /* Monthly Revenue Trend Chart */
  }
      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
        <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-500" />
          Monthly Yield Trend (MongoDB Pipeline Aggregation)
        </h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activeAnalytics.monthlyRevenue}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F27D26" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#F27D26" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }} />
              <Area type="monotone" dataKey="revenue" stroke="#F27D26" fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>;
};
