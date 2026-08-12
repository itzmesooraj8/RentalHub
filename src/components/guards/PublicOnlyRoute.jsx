import { Navigate } from "react-router-dom";
export const PublicOnlyRoute = ({ user, children }) => {
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};
