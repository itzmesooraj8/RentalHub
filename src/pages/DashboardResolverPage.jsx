import { Navigate } from "react-router-dom";
export const DashboardResolverPage = ({ user }) => {
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  if (user.role === "owner") {
    return <Navigate to="/dashboard/owner" replace />;
  }
  if (user.role === "admin") {
    return <Navigate to="/dashboard/admin" replace />;
  }
  return <Navigate to="/dashboard/customer" replace />;
};
