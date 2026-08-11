import { apiClient } from './apiClient';

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actorRole: string;
  actorName: string;
  action: string;
  targetId: string;
  metadata?: string;
}

export const auditLogService = {
  async getAuditLogs(): Promise<AuditLogItem[]> {
    const res = await apiClient.get<{ success: boolean; data: AuditLogItem[] }>('/api/admin/audit-logs');
    return res.data.data;
  },
};
