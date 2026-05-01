// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../services/api";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const user = getCurrentUser();
  const token = localStorage.getItem("token");

  // Check if user is authenticated
  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to home if role not allowed
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;