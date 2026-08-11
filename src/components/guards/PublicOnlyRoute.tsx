import React from 'react';
import { Navigate } from 'react-router-dom';
import { User } from '../../types';

interface PublicOnlyRouteProps {
  user: User | null;
  children: React.ReactNode;
}

export const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({ user, children }) => {
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
