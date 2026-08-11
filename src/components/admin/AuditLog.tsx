import React from 'react';
import { ShieldCheck, Lock, Clock, UserCheck, Activity } from 'lucide-react';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorRole: 'customer' | 'owner' | 'admin' | 'system';
  actorName: string;
  action: string;
  targetId: string;
  metadata?: string;
}

interface AuditLogProps {
  logs?: AuditLogEntry[];
}

export const AuditLog: React.FC<AuditLogProps> = ({ logs: propLogs }) => {
  const defaultLogs: AuditLogEntry[] = [
    {
      id: 'aud-104',
      timestamp: '2026-08-11T10:41:00Z',
      actorRole: 'owner',
      actorName: 'Marcus Vance',
      action: 'Updated Equipment Daily Rate ($285/d)',
      targetId: 'EQ-001',
      metadata: 'AI Rate Recommendation accepted',
    },
    {
      id: 'aud-103',
      timestamp: '2026-08-11T10:38:00Z',
      actorRole: 'customer',
      actorName: 'Sarah Jenkins',
      action: 'Created Rental Reservation & Stripe Escrow Lock',
      targetId: 'BK-901',
      metadata: 'Hold $500 Security Deposit',
    },
    {
      id: 'aud-102',
      timestamp: '2026-08-11T10:35:00Z',
      actorRole: 'admin',
      actorName: 'Super Admin',
      action: 'Approved Equipment Catalog Submission',
      targetId: 'EQ-006',
      metadata: 'Safety Inspection Verified',
    },
    {
      id: 'aud-101',
      timestamp: '2026-08-11T09:20:00Z',
      actorRole: 'system',
      actorName: 'MongoDB Engine',
      action: 'Real-time Availability Lock Released',
      targetId: 'BK-902',
      metadata: 'Completed Return Inspection',
    },
  ];

  const logs = propLogs || defaultLogs;

  const getRoleBadge = (role: AuditLogEntry['actorRole']) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'owner':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'customer':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'system':
      default:
        return 'bg-[#F27D26]/10 text-[#F27D26] border-[#F27D26]/30';
    }
  };

  return (
    <div className="bg-[#111111] rounded-3xl p-6 border border-[#1F1F1F] shadow-xl space-y-4 font-sans text-xs">
      <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-3 font-mono">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#F27D26]" />
          <span>Security & Transaction Audit Trail</span>
        </h3>
        <span className="text-[10px] text-[#666666]">MongoDB Audit Stream</span>
      </div>

      <div className="overflow-x-auto font-mono">
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
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-[#141414] transition">
                <td className="p-3 text-[#666666] whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="p-3 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase ${getRoleBadge(log.actorRole)}`}>
                    {log.actorRole}
                  </span>
                </td>
                <td className="p-3 font-bold text-white whitespace-nowrap">{log.actorName}</td>
                <td className="p-3 text-slate-200">{log.action}</td>
                <td className="p-3 font-bold text-[#F27D26] whitespace-nowrap">{log.targetId}</td>
                <td className="p-3 text-right text-[#888888]">{log.metadata || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
