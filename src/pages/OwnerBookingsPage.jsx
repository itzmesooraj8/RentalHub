import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Eye,
  MessageSquare,
  Loader2
} from "lucide-react";
import { ROUTES } from "../lib/routes.js";
export const OwnerBookingsPage = ({
  currentUser,
  incomingBookings,
  onUpdateBookingStatus
}) => {
  const [activeTab, setActiveTab] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);
  const handleStatusChange = async (id, status) => {
    try {
      setUpdatingId(id);
      if (onUpdateBookingStatus) {
        await onUpdateBookingStatus(id, status);
      }
    } catch (err) {
      alert(err?.message || "Failed to update booking status.");
    } finally {
      setUpdatingId(null);
    }
  };
  const ownerBookings = currentUser ? incomingBookings.filter((b) => b.ownerId === currentUser.id || true) : incomingBookings;
  const tabs = [
    { id: "all", label: "All Requests", count: ownerBookings.length },
    { id: "pending", label: "Pending", count: ownerBookings.filter((b) => b.status === "pending").length },
    { id: "confirmed", label: "Confirmed", count: ownerBookings.filter((b) => b.status === "confirmed" || b.status === "locked").length },
    { id: "active", label: "Active", count: ownerBookings.filter((b) => b.status === "active").length },
    { id: "returning", label: "Returning", count: ownerBookings.filter((b) => b.status === "return_pending").length },
    { id: "completed", label: "Completed", count: ownerBookings.filter((b) => b.status === "completed").length },
    { id: "disputed", label: "Disputed", count: ownerBookings.filter((b) => b.status === "disputed" || b.hasDisputeFlag).length }
  ];
  const filteredBookings = ownerBookings.filter((b) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return b.status === "pending";
    if (activeTab === "confirmed") return b.status === "confirmed" || b.status === "locked";
    if (activeTab === "active") return b.status === "active";
    if (activeTab === "returning") return b.status === "return_pending";
    if (activeTab === "completed") return b.status === "completed";
    if (activeTab === "disputed") return b.status === "disputed" || b.hasDisputeFlag;
    return true;
  });
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white font-mono">
      {
    /* Header */
  }
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1F1F1F]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#F27D26] uppercase font-bold tracking-wider mb-1">
            <Calendar className="w-4 h-4" />
            <span>Fleet Reservations</span>
          </div>
          <h1 className="font-serif italic text-3xl font-normal text-white">Owner Booking Operations</h1>
          <p className="text-xs text-[#888888] font-mono mt-1">
            Approve incoming rental requests, verify pickup conditions, mark equipment returned, and monitor escrow holds.
          </p>
        </div>
      </div>

      {
    /* Tabs */
  }
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar border-b border-[#1F1F1F]">
        {tabs.map((tab) => <button
    key={tab.id}
    onClick={() => setActiveTab(tab.id)}
    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? "bg-[#F27D26] text-black shadow-md" : "bg-[#111111] text-[#888888] hover:text-white border border-[#1F1F1F]"}`}
  >
            <span>{tab.label}</span>
            <span
    className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === tab.id ? "bg-black text-white" : "bg-[#1F1F1F] text-[#AAAAAA]"}`}
  >
              {tab.count}
            </span>
          </button>)}
      </div>

      {
    /* Bookings List */
  }
      {filteredBookings.length === 0 ? <div className="bg-[#111111] rounded-3xl p-12 text-center border border-[#1F1F1F] max-w-md mx-auto space-y-3 font-mono">
          <Calendar className="w-10 h-10 text-[#444444] mx-auto" />
          <h3 className="font-serif italic text-white text-base">No Booking Requests</h3>
          <p className="text-xs text-[#888888]">
            No incoming customer reservations match the "{activeTab}" filter.
          </p>
        </div> : <div className="space-y-4">
          {filteredBookings.map((b) => <div
    key={b.id}
    className="bg-[#111111] rounded-3xl p-6 border border-[#1F1F1F] shadow-xl space-y-4 font-mono text-xs"
  >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#1F1F1F]">
                <div className="flex items-start gap-4">
                  <img
    src={b.equipmentImage}
    alt={b.equipmentTitle}
    className="w-16 h-16 rounded-2xl object-cover border border-[#333333] shrink-0"
    onError={(e) => {
      e.target.src = "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=1000";
    }}
  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif italic text-white text-base">{b.equipmentTitle}</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F27D26]/10 text-[#F27D26] border border-[#F27D26]/30 text-[10px] font-bold uppercase">
                        {b.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-xs text-[#888888] mt-1">
                      Customer: <strong className="text-white">{b.customerName}</strong> • Ref <strong className="text-white">#{b.id.substring(0, 10).toUpperCase()}</strong>
                    </p>
                    <div className="flex items-center gap-3 text-[#AAAAAA] mt-1">
                      <span>{b.startDate} to {b.endDate} ({b.priceBreakdown.rentalDays}d)</span>
                      <span>•</span>
                      <span>Method: {b.deliveryMethod || "Pickup"}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-serif italic font-bold text-[#F27D26]">₹{b.priceBreakdown.total}</div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">Payout Subtotal: ₹{b.priceBreakdown.subtotal}</span>
                </div>
              </div>

              {
    /* Owner Contextual Status Actions */
  }
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <Link
    to={ROUTES.bookingDetail(b.id)}
    className="px-3.5 py-2 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] text-white border border-[#333333] font-bold uppercase tracking-wider flex items-center gap-1.5 transition"
  >
                    <Eye className="w-3.5 h-3.5 text-[#F27D26]" />
                    <span>View Details</span>
                  </Link>
                  <a
    href={`mailto:customer@rentalhub.com?subject=Regarding Rental ${b.id}`}
    className="px-3.5 py-2 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] text-white border border-[#333333] font-bold uppercase tracking-wider flex items-center gap-1.5 transition"
  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#F27D26]" />
                    <span>Contact Customer</span>
                  </a>
                </div>

                {onUpdateBookingStatus && <div className="flex items-center gap-2">
                    {b.status === "pending" && <>
                        <button
    onClick={() => handleStatusChange(b.id, "confirmed")}
    disabled={updatingId === b.id}
    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
  >
                          {updatingId === b.id ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                          <span>Approve Request</span>
                        </button>
                        <button
    onClick={() => handleStatusChange(b.id, "cancelled")}
    disabled={updatingId === b.id}
    className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
  >
                          {updatingId === b.id ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                          <span>Decline</span>
                        </button>
                      </>}

                    {(b.status === "confirmed" || b.status === "locked") && <button
    onClick={() => handleStatusChange(b.id, "pickup_ready")}
    disabled={updatingId === b.id}
    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
  >
                        {updatingId === b.id ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        <span>Mark Pickup Ready</span>
                      </button>}

                    {b.status === "pickup_ready" && <button
    onClick={() => handleStatusChange(b.id, "active")}
    disabled={updatingId === b.id}
    className="px-4 py-2 rounded-xl bg-[#F27D26] hover:bg-[#d96a1a] text-black font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
  >
                        {updatingId === b.id ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        <span>Mark Handed Over / Active</span>
                      </button>}

                    {b.status === "active" && <button
    onClick={() => handleStatusChange(b.id, "return_pending")}
    disabled={updatingId === b.id}
    className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-black font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
  >
                        {updatingId === b.id ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        <span>Mark Return Inspection Pending</span>
                      </button>}

                    {b.status === "return_pending" && <button
    onClick={() => handleStatusChange(b.id, "completed")}
    disabled={updatingId === b.id}
    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
  >
                        {updatingId === b.id ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        <span>Confirm Return & Release Deposit</span>
                      </button>}
                  </div>}
              </div>
            </div>)}
        </div>}
    </div>;
};
