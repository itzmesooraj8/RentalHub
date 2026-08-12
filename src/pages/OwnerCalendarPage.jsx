import { useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Lock,
  Wrench,
  Plus
} from "lucide-react";
export const OwnerCalendarPage = ({
  currentUser,
  equipmentList,
  bookings,
  onBlockDateRange
}) => {
  const [selectedMonth, setSelectedMonth] = useState(7);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState("All");
  const [calendarView, setCalendarView] = useState("month");
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [blockEqId, setBlockEqId] = useState(equipmentList[0]?.id || "");
  const [blockStart, setBlockStart] = useState("2026-08-20");
  const [blockEnd, setBlockEnd] = useState("2026-08-22");
  const [blockReason, setBlockReason] = useState("maintenance");
  const ownerEquipment = currentUser ? equipmentList.filter((e) => e.ownerId === currentUser.id || true) : equipmentList;
  const daysInAugust = Array.from({ length: 31 }, (_, i) => i + 1);
  const getDayStatus = (day) => {
    const dateStr = `2026-08-${day < 10 ? "0" + day : day}`;
    const matchingBookings = bookings.filter((b) => {
      if (selectedEquipmentId !== "All" && b.equipmentId !== selectedEquipmentId) return false;
      return dateStr >= b.startDate && dateStr <= b.endDate;
    });
    if (matchingBookings.length > 0) {
      const activeBooking = matchingBookings[0];
      return {
        status: "booked",
        label: `Booked: ${activeBooking.equipmentTitle}`,
        booking: activeBooking
      };
    }
    if (day >= 20 && day <= 22 && (selectedEquipmentId === "All" || selectedEquipmentId === "eq_1")) {
      return { status: "maintenance", label: "Scheduled Maintenance" };
    }
    return { status: "available", label: "Available" };
  };
  const handleCreateBlock = (e) => {
    e.preventDefault();
    if (onBlockDateRange) {
      onBlockDateRange(blockEqId, blockStart, blockEnd, blockReason);
    }
    setIsBlockModalOpen(false);
  };
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white font-mono">
      {
    /* Header */
  }
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1F1F1F]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#F27D26] uppercase font-bold tracking-wider mb-1">
            <CalendarIcon className="w-4 h-4" />
            <span>Centralized Availability Engine</span>
          </div>
          <h1 className="font-serif italic text-3xl font-normal text-white">Fleet Availability Calendar</h1>
          <p className="text-xs text-[#888888] font-mono mt-1">
            Real-time availability schedule, conflict prevention locks, maintenance blocks, and booking dates.
          </p>
        </div>

        <button
    onClick={() => setIsBlockModalOpen(true)}
    className="px-4 py-2.5 rounded-xl bg-[#F27D26] hover:bg-[#d96a1a] text-black font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg flex items-center gap-2 self-start md:self-auto"
  >
          <Plus className="w-4 h-4" />
          <span>Block Dates / Maintenance</span>
        </button>
      </div>

      {
    /* Calendar Controls & Legend */
  }
      <div className="bg-[#111111] p-5 rounded-3xl border border-[#1F1F1F] space-y-4 shadow-xl text-xs font-mono">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-[#1A1A1A] p-1 rounded-2xl border border-[#333333]">
              <button className="p-1.5 rounded-xl text-[#888888] hover:text-white transition">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 font-serif italic text-base text-white">August 2026</span>
              <button className="p-1.5 rounded-xl text-[#888888] hover:text-white transition">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {
    /* Equipment Filter Dropdown */
  }
            <select
    value={selectedEquipmentId}
    onChange={(e) => setSelectedEquipmentId(e.target.value)}
    className="px-3 py-2 rounded-xl bg-[#1A1A1A] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
  >
              <option value="All">All Fleet Assets</option>
              {ownerEquipment.map((eq) => <option key={eq.id} value={eq.id}>{eq.title}</option>)}
            </select>
          </div>

          {
    /* View Toggle */
  }
          <div className="flex items-center gap-1 bg-[#1A1A1A] p-1 rounded-2xl border border-[#333333]">
            {["month", "week", "day"].map((v) => <button
    key={v}
    onClick={() => setCalendarView(v)}
    className={`px-3 py-1.5 rounded-xl uppercase font-bold text-[10px] tracking-wider transition ${calendarView === v ? "bg-[#F27D26] text-black" : "text-[#888888] hover:text-white"}`}
  >
                {v}
              </button>)}
          </div>
        </div>

        {
    /* Legend */
  }
        <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-[#1F1F1F] text-[11px] text-[#AAAAAA]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500" />
            <span>Available for Rent</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#F27D26]/20 border border-[#F27D26]" />
            <span>Booked / Locked Date</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500" />
            <span>Owner Maintenance</span>
          </div>
        </div>
      </div>

      {
    /* Interactive Calendar Grid */
  }
      <div className="bg-[#111111] rounded-3xl border border-[#1F1F1F] p-6 shadow-2xl space-y-4">
        {
    /* Days of Week Header */
  }
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono font-bold text-[#888888] uppercase tracking-wider pb-3 border-b border-[#1F1F1F]">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>

        {
    /* Month Day Cells */
  }
        <div className="grid grid-cols-7 gap-2">
          {daysInAugust.map((day) => {
    const dayInfo = getDayStatus(day);
    const isBooked = dayInfo.status === "booked";
    const isMaintenance = dayInfo.status === "maintenance";
    return <div
      key={day}
      className={`min-h-[90px] p-2 rounded-2xl border transition-all flex flex-col justify-between ${isBooked ? "bg-[#F27D26]/10 border-[#F27D26]/60 shadow-md" : isMaintenance ? "bg-amber-500/10 border-amber-500/50" : "bg-[#1A1A1A] border-[#222222] hover:border-[#333333]"}`}
    >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold font-mono ${isBooked ? "text-[#F27D26]" : "text-white"}`}>
                    {day}
                  </span>
                  {isBooked && <Lock className="w-3 h-3 text-[#F27D26]" />}
                  {isMaintenance && <Wrench className="w-3 h-3 text-amber-400" />}
                </div>

                <div className="mt-1">
                  {isBooked && <div className="text-[9px] font-mono text-white font-bold truncate bg-[#F27D26]/20 px-1.5 py-0.5 rounded border border-[#F27D26]/40">
                      Booked #{dayInfo.booking?.id.substring(0, 6)}
                    </div>}
                  {isMaintenance && <div className="text-[9px] font-mono text-amber-300 font-bold truncate bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/40">
                      Maintenance Block
                    </div>}
                </div>
              </div>;
  })}
        </div>
      </div>

      {
    /* Block Date Range Modal */
  }
      {isBlockModalOpen && <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] rounded-3xl max-w-md w-full p-6 border border-[#1F1F1F] shadow-2xl space-y-4 font-mono text-white">
            <h3 className="font-serif italic text-lg text-white">Block Availability / Maintenance</h3>

            <form onSubmit={handleCreateBlock} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-[#888888] font-bold uppercase block mb-1">Select Equipment Asset</label>
                <select
    value={blockEqId}
    onChange={(e) => setBlockEqId(e.target.value)}
    className="w-full px-3 py-2 rounded-xl bg-[#1A1A1A] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
  >
                  {ownerEquipment.map((eq) => <option key={eq.id} value={eq.id}>{eq.title}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#888888] font-bold uppercase block mb-1">Start Date</label>
                  <input
    type="date"
    value={blockStart}
    onChange={(e) => setBlockStart(e.target.value)}
    className="w-full px-3 py-2 rounded-xl bg-[#1A1A1A] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
  />
                </div>
                <div>
                  <label className="text-[#888888] font-bold uppercase block mb-1">End Date</label>
                  <input
    type="date"
    value={blockEnd}
    onChange={(e) => setBlockEnd(e.target.value)}
    className="w-full px-3 py-2 rounded-xl bg-[#1A1A1A] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
  />
                </div>
              </div>

              <div>
                <label className="text-[#888888] font-bold uppercase block mb-1">Block Reason</label>
                <select
    value={blockReason}
    onChange={(e) => setBlockReason(e.target.value)}
    className="w-full px-3 py-2 rounded-xl bg-[#1A1A1A] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
  >
                  <option value="maintenance">Scheduled Maintenance / Tune-up</option>
                  <option value="owner_block">Owner Personal Use / Reserved</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
    type="button"
    onClick={() => setIsBlockModalOpen(false)}
    className="flex-1 py-2.5 rounded-xl border border-[#333] text-xs font-bold text-[#888888] hover:text-white uppercase"
  >
                  Cancel
                </button>
                <button
    type="submit"
    className="flex-1 py-2.5 rounded-xl bg-[#F27D26] text-black text-xs font-bold uppercase"
  >
                  Save Lock
                </button>
              </div>
            </form>
          </div>
        </div>}
    </div>;
};
