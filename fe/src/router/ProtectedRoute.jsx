// src/router/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "./routerConstants";
import { ROLE_ACCESS } from "../utils/rolesAccess";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const location = useLocation();

  
  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const allowedRoles = ROLE_ACCESS[location.pathname];
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={ROUTES.HOME} replace />;
  }


  return children;
}
