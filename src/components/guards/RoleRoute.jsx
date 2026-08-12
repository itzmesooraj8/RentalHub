import { Navigate } from "react-router-dom";
export const RoleRoute = ({ user, allowedRoles, children }) => {
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }
  return <>{children}</>;
};
