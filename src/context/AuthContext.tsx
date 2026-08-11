import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { CURRENT_USER } from '../data/mockData';
import { authService } from '../services/authService';

interface AuthContextType {
  currentUser: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  loginRole: (role: UserRole) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  toggleFavorite: (equipmentId: string) => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(CURRENT_USER);

  const role: UserRole = currentUser?.role || 'customer';
  const isAuthenticated = Boolean(currentUser);

  const loginRole = async (targetRole: UserRole) => {
    const res = await authService.loginWithRole(targetRole);
    setCurrentUser(res.user);
  };

  const logout = () => {
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
    authService.toggleFavorite(currentUser.id, equipmentId).catch(() => {});
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
