import { Navigate, useLocation } from "react-router-dom";
export const ProtectedRoute = ({ user, children }) => {
  const location = useLocation();
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};
