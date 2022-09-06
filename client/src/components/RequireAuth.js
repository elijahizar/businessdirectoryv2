import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return allowedRoles?.includes(isAuthenticated?.roles) ? (
    <Outlet />
  ) : isAuthenticated?.user ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login?m=Please login." state={{ from: location }} replace />
  );
};

export default RequireAuth;
