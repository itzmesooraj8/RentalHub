import { apiClient } from "./apiClient";
export const auditLogService = {
  async getAuditLogs() {
    const res = await apiClient.get("/api/admin/audit-logs");
    return res.data.data;
  }
};
