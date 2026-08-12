import { apiClient } from "./apiClient.js";
export const authService = {
  async register(data) {
    const payload = {
      ...data,
      password: data.password || "password123"
    };
    const res = await apiClient.post("/api/auth/register", payload);
    localStorage.setItem("rentalhub_token", res.data.data.token);
    return res.data.data;
  },
  async login(email, password) {
    const res = await apiClient.post("/api/auth/login", {
      email,
      password: password || "password123"
    });
    localStorage.setItem("rentalhub_token", res.data.data.token);
    return res.data.data;
  },
  async loginWithRole(role) {
    const res = await apiClient.post("/api/auth/demo-login", { role });
    localStorage.setItem("rentalhub_token", res.data.data.token);
    return res.data.data;
  },
  async getCurrentUser() {
    const res = await apiClient.get("/api/auth/me");
    return res.data.data;
  },
  async getUserById(userId) {
    const res = await apiClient.get(`/api/auth/me/${userId}`);
    return res.data.data;
  },
  async toggleFavorite(equipmentId) {
    const res = await apiClient.post("/api/auth/favorite", {
      equipmentId
    });
    return res.data.data.favorites;
  },
  async submitKyc(docUrl) {
    const res = await apiClient.post("/api/auth/kyc", {
      docUrl
    });
    return res.data.data;
  },
  logout() {
    localStorage.removeItem("rentalhub_token");
  }
};
