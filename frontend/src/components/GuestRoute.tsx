import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import React from "react";

export default function GuestRoute({
  children,
}: {
  children: React.ReactElement;
}) {
  const { user } = useAuth();

  if (user) {
    return (
      <Navigate to={user.role === "ADMIN" ? "/admin" : "/dashboard"} replace />
    );
  }

  return children;
}
