import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Search,
  Eye
} from "lucide-react";
import { ROUTES } from "../lib/routes.js";
export const AdminBookingsPage = ({ bookings }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const filteredBookings = bookings.filter((b) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || b.id.toLowerCase().includes(q) || b.equipmentTitle.toLowerCase().includes(q) || b.customerName.toLowerCase().includes(q) || b.ownerName.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white font-mono">
      {
    /* Header */
  }
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1F1F1F]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#F27D26] uppercase font-bold tracking-wider mb-1">
            <Calendar className="w-4 h-4" />
            <span>Master Escrow Ledger</span>
          </div>
          <h1 className="font-serif italic text-3xl font-normal text-white">Platform Rental Bookings</h1>
          <p className="text-xs text-[#888888] font-mono mt-1">
            Comprehensive audit log of all customer reservations, financial breakdowns, Stripe authorizations, and lifecycle status.
          </p>
        </div>
      </div>

      {
    /* Search & Filter */
  }
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#111111] p-4 rounded-3xl border border-[#1F1F1F] text-xs">
        <div className="md:col-span-3 relative">
          <label className="text-[10px] text-[#666666] font-bold uppercase tracking-wider block mb-1">Search Ledger</label>
          <div className="relative">
            <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search by Booking ID, customer, owner, or equipment title..."
    className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#1A1A1A] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
  />
            <Search className="w-4 h-4 text-[#666666] absolute left-3 top-2.5" />
          </div>
        </div>

        <div>
          <label className="text-[10px] text-[#666666] font-bold uppercase tracking-wider block mb-1">Status</label>
          <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="w-full px-3 py-2 rounded-xl bg-[#1A1A1A] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
  >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="disputed">Disputed</option>
          </select>
        </div>
      </div>

      {
    /* Bookings Ledger Table */
  }
      <div className="bg-[#111111] rounded-3xl border border-[#1F1F1F] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#181818] border-b border-[#222222] text-[#888888] uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Booking ID</th>
                <th className="p-4">Equipment</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Owner</th>
                <th className="p-4">Dates</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F1F]">
              {filteredBookings.map((b) => <tr key={b.id} className="hover:bg-[#141414] transition">
                  <td className="p-4 font-bold text-[#F27D26]">#{b.id.substring(0, 10).toUpperCase()}</td>
                  <td className="p-4 font-serif italic text-white text-sm">{b.equipmentTitle}</td>
                  <td className="p-4 text-[#AAAAAA]">{b.customerName}</td>
                  <td className="p-4 text-[#AAAAAA]">{b.ownerName}</td>
                  <td className="p-4 text-[#666666]">{b.startDate} → {b.endDate}</td>
                  <td className="p-4 font-bold text-white">₹{b.priceBreakdown.total}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#1A1A1A] border border-[#333] text-[#F27D26] text-[10px] font-bold uppercase">
                      {b.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link
    to={ROUTES.bookingDetail(b.id)}
    className="p-2 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] text-white inline-flex items-center gap-1 transition"
    title="Inspect Transaction"
  >
                      <Eye className="w-4 h-4 text-[#F27D26]" />
                    </Link>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
};
