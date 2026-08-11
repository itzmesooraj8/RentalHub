import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  currentUser: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  loading: boolean;
  loginRole: (role: UserRole) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  toggleFavorite: (equipmentId: string) => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const role: UserRole = currentUser?.role || 'customer';
  const isAuthenticated = Boolean(currentUser);

  useEffect(() => {
    const token = localStorage.getItem('rentalhub_token');
    if (token) {
      authService
        .getCurrentUser()
        .then((user) => {
          setCurrentUser(user);
        })
        .catch(() => {
          authService.logout();
          setCurrentUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const loginRole = async (targetRole: UserRole) => {
    const res = await authService.loginWithRole(targetRole);
    setCurrentUser(res.user);
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, role: newRole });
    } else {
      loginRole(newRole);
    }
  };

  const toggleFavorite = (equipmentId: string) => {
    if (!currentUser) return;
    const currentFavs = currentUser.favorites || [];
    const updatedFavs = currentFavs.includes(equipmentId)
      ? currentFavs.filter((id) => id !== equipmentId)
      : [...currentFavs, equipmentId];

    setCurrentUser({ ...currentUser, favorites: updatedFavs });
    authService.toggleFavorite(equipmentId).catch(() => {});
  };

  const updateUser = (updates: Partial<User>) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...updates });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        isAuthenticated,
        loading,
        loginRole,
        logout,
        switchRole,
        toggleFavorite,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
