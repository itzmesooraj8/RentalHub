import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Wrench,
  Search,
  CheckCircle,
  XCircle,
  Eye
} from "lucide-react";
import { ROUTES } from "../lib/routes";
import { equipmentService } from "../services/equipmentService";
import { apiClient } from "../services/apiClient";
export const AdminEquipmentPage = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    loadEquipment();
  }, []);
  async function loadEquipment() {
    setLoading(true);
    try {
      const data = await equipmentService.getEquipment();
      setEquipmentList(data || []);
    } catch (err) {
      console.error("Failed to load equipment:", err);
    } finally {
      setLoading(false);
    }
  }
  const handleApprove = async (id, approved) => {
    try {
      await apiClient.patch(`/api/admin/equipment/${id}/approve`, { approved });
      setEquipmentList((prev) => prev.map((e) => e.id === id ? { ...e, approvedByAdmin: approved } : e));
    } catch (err) {
      console.error("Failed to update equipment approval:", err);
    }
  };
  const filteredEquipment = equipmentList.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q) || item.ownerName.toLowerCase().includes(q);
    if (activeTab === "pending") return matchesSearch && !item.approvedByAdmin;
    if (activeTab === "active") return matchesSearch && item.approvedByAdmin;
    return matchesSearch;
  });
  return <div className="space-y-6 font-sans">
      {
    /* Header Banner */
  }
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#111111] p-6 rounded-3xl border border-[#222222]">
        <div className="space-y-1">
          <h1 className="text-2xl font-serif font-bold italic text-white flex items-center gap-3">
            <Wrench className="w-6 h-6 text-[#F27D26]" />
            <span>Equipment Listing Approvals</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Approve owner listings, inspect specifications, and manage equipment moderation live in MongoDB Atlas.
          </p>
        </div>
      </div>

      {
    /* Tabs & Search */
  }
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#111111] p-4 rounded-2xl border border-[#222222]">
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
    onClick={() => setActiveTab("all")}
    className={`px-4 py-2 rounded-xl transition ${activeTab === "all" ? "bg-[#F27D26] text-black font-bold" : "bg-[#1A1A1A] text-slate-300 hover:bg-[#252525]"}`}
  >
            All Fleet ({equipmentList.length})
          </button>
          <button
    onClick={() => setActiveTab("pending")}
    className={`px-4 py-2 rounded-xl transition ${activeTab === "pending" ? "bg-[#F27D26] text-black font-bold" : "bg-[#1A1A1A] text-slate-300 hover:bg-[#252525]"}`}
  >
            Pending Approval ({equipmentList.filter((e) => !e.approvedByAdmin).length})
          </button>
          <button
    onClick={() => setActiveTab("active")}
    className={`px-4 py-2 rounded-xl transition ${activeTab === "active" ? "bg-[#F27D26] text-black font-bold" : "bg-[#1A1A1A] text-slate-300 hover:bg-[#252525]"}`}
  >
            Approved Active ({equipmentList.filter((e) => e.approvedByAdmin).length})
          </button>
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
    type="text"
    placeholder="Search equipment or owner..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#F27D26]"
  />
        </div>
      </div>

      {
    /* Equipment Table */
  }
      {loading ? <div className="text-center py-16 bg-[#111111] border border-[#222222] rounded-3xl">
          <div className="w-8 h-8 border-2 border-[#F27D26] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs font-mono text-slate-400">Querying MongoDB EquipmentModel...</p>
        </div> : <div className="bg-[#111111] border border-[#222222] rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#181818] border-b border-[#222222] text-[#888888] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Equipment Listing</th>
                  <th className="p-4">Category & Industry</th>
                  <th className="p-4">Owner Name</th>
                  <th className="p-4">Daily Rate</th>
                  <th className="p-4">Approval Status</th>
                  <th className="p-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F1F1F]">
                {filteredEquipment.map((item) => <tr key={item.id} className="hover:bg-[#161616] transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={item.images[0]} alt={item.title} className="w-12 h-9 rounded-xl object-cover border border-[#333333]" />
                        <div className="font-bold text-white text-sm line-clamp-1">{item.title}</div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-400">
                      {item.category} • {item.industry}
                    </td>
                    <td className="p-4 text-slate-300">{item.ownerName}</td>
                    <td className="p-4 font-bold text-[#F27D26]">${item.dailyRate}/day</td>
                    <td className="p-4">
                      <span
    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${item.approvedByAdmin !== false ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-amber-500/10 border border-amber-500/20 text-amber-400"}`}
  >
                        {item.approvedByAdmin !== false ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{item.approvedByAdmin !== false ? "Approved" : "Pending Approval"}</span>
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link
    to={ROUTES.equipmentDetail(item.id)}
    className="px-2.5 py-1.5 rounded-lg bg-[#1A1A1A] hover:bg-[#252525] border border-[#333333] text-slate-300 text-[11px] inline-flex items-center gap-1"
  >
                        <Eye className="w-3 h-3" /> View
                      </Link>

                      {item.approvedByAdmin === false ? <button
    onClick={() => handleApprove(item.id, true)}
    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-[11px] transition cursor-pointer"
  >
                          Approve Listing
                        </button> : <button
    onClick={() => handleApprove(item.id, false)}
    className="px-3 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 font-bold text-[11px] transition cursor-pointer"
  >
                          Revoke Approval
                        </button>}
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>}
    </div>;
};
