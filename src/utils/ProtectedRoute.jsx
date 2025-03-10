import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/auth/verify`, {
      credentials: 'include', // ensures cookies are sent
    })
      .then((res) => res.json())
      .then((data) => {
        // Use the "success" property from the response instead of "authenticated"
        setAuthenticated(data.success);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error verifying auth:', error);
        setAuthenticated(false);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;