import React from 'react';
import { Navigate } from 'react-router-dom';
import { User } from '../types';

interface DashboardResolverPageProps {
  user: User | null;
}

export const DashboardResolverPage: React.FC<DashboardResolverPageProps> = ({ user }) => {
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (user.role === 'owner') {
    return <Navigate to="/dashboard/owner" replace />;
  }

  if (user.role === 'admin') {
    return <Navigate to="/dashboard/admin" replace />;
  }

  return <Navigate to="/dashboard/customer" replace />;
};
