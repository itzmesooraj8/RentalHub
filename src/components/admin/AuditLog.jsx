import { useState, useEffect } from "react";
import { ShieldCheck, Activity } from "lucide-react";
import { auditLogService } from "../../services/auditLogService.js";
export const AuditLog = ({ logs: propLogs }) => {
  const [fetchedLogs, setFetchedLogs] = useState([]);
  const [loading, setLoading] = useState(!propLogs);
  useEffect(() => {
    if (!propLogs) {
      auditLogService.getAuditLogs().then((logs2) => {
        setFetchedLogs(logs2);
        setLoading(false);
      }).catch((err) => {
        console.error("Failed to fetch audit logs:", err);
        setLoading(false);
      });
    }
  }, [propLogs]);
  const logs = propLogs || fetchedLogs;
  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      case "owner":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
      case "customer":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "system":
      default:
        return "bg-[#F27D26]/10 text-[#F27D26] border-[#F27D26]/30";
    }
  };
  return <div className="bg-[#111111] rounded-3xl p-6 border border-[#1F1F1F] shadow-xl space-y-4 font-sans text-xs">
      <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-3 font-mono">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#F27D26]" />
          <span>Security & Transaction Audit Trail</span>
        </h3>
        <span className="text-[10px] text-[#666666] flex items-center gap-1">
          <Activity className="w-3 h-3 text-emerald-400" />
          Live MongoDB Audit Stream
        </span>
      </div>

      {loading ? <div className="p-8 text-center text-slate-400 font-mono">Loading MongoDB audit log stream...</div> : logs.length === 0 ? <div className="p-8 text-center text-slate-500 font-mono">No security audit records logged yet.</div> : <div className="overflow-x-auto font-mono">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#181818] border-b border-[#222222] text-[#888888] uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="p-3">Time</th>
                <th className="p-3">Role</th>
                <th className="p-3">Actor</th>
                <th className="p-3">Action Performed</th>
                <th className="p-3">Target ID</th>
                <th className="p-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F1F]">
              {logs.map((log) => <tr key={log.id} className="hover:bg-[#141414] transition">
                  <td className="p-3 text-[#666666] whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase ${getRoleBadge(log.actorRole)}`}>
                      {log.actorRole}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-white whitespace-nowrap">{log.actorName}</td>
                  <td className="p-3 text-slate-200">{log.action}</td>
                  <td className="p-3 font-bold text-[#F27D26] whitespace-nowrap">{log.targetId}</td>
                  <td className="p-3 text-right text-[#888888]">{log.metadata || "-"}</td>
                </tr>)}
            </tbody>
          </table>
        </div>}
    </div>;
};
