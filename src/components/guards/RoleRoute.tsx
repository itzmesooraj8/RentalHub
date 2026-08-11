import React from 'react';
import { Navigate } from 'react-router-dom';
import { User, UserRole } from '../../types';

interface RoleRouteProps {
  user: User | null;
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ user, allowedRoles, children }) => {
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
};
