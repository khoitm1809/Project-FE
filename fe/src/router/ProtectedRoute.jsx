// src/router/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { ROUTES } from "./routerConstants";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // ✅ Có token => cho vào trang
  return children;
}
