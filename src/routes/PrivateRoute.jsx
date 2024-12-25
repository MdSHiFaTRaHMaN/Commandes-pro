import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Spin } from "antd";
import { useAdminProfile } from "../api/api";

const PrivateRoute = ({ children }) => {
  const { admin, isLoading, isError, error } = useAdminProfile();

  console.log(admin, "admin")

  const location = useLocation();
  const token = localStorage.getItem("token");

  if (isLoading) {
    return <Spin />;
  }

  if (isError || error || !admin || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
