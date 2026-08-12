import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
const AuthContext = createContext(void 0);
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const role = currentUser?.role || "customer";
  const isAuthenticated = Boolean(currentUser);
  useEffect(() => {
    const token = localStorage.getItem("rentalhub_token");
    if (token) {
      authService.getCurrentUser().then((user) => {
        setCurrentUser(user);
      }).catch(() => {
        authService.logout();
        setCurrentUser(null);
      }).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);
  const loginRole = async (targetRole) => {
    const res = await authService.loginWithRole(targetRole);
    setCurrentUser(res.user);
  };
  const login = async (email, password) => {
    const res = await authService.login(email, password);
    setCurrentUser(res.user);
    return res.user;
  };
  const register = async (data) => {
    const res = await authService.register(data);
    setCurrentUser(res.user);
    return res.user;
  };
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };
  const switchRole = (newRole) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, role: newRole });
    } else {
      loginRole(newRole);
    }
  };
  const toggleFavorite = async (equipmentId) => {
    if (!currentUser) return;
    const currentFavs = currentUser.favorites || [];
    const updatedFavs = currentFavs.includes(equipmentId) ? currentFavs.filter((id) => id !== equipmentId) : [...currentFavs, equipmentId];
    const previousUser = { ...currentUser };
    setCurrentUser({ ...currentUser, favorites: updatedFavs });
    try {
      await authService.toggleFavorite(equipmentId);
    } catch (err) {
      console.error("Failed to sync favorite status with server:", err);
      setCurrentUser(previousUser);
    }
  };
  const updateUser = (updates) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...updates });
    }
  };
  return <AuthContext.Provider
    value={{
      currentUser,
      role,
      isAuthenticated,
      loading,
      loginRole,
      login,
      register,
      logout,
      switchRole,
      toggleFavorite,
      updateUser,
      setCurrentUser
    }}
  >
      {children}
    </AuthContext.Provider>;
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
