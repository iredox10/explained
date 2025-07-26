
// src/components/PublicRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PublicRoute({ children }) {
  const { currentUser } = useAuth();

  // If the user is logged in, redirect them away from the public page (e.g., login)
  // and send them to their admin dashboard.
  if (currentUser) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
