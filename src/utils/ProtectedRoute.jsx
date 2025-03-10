import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  // Check for the JWT cookie (assumed to be stored with the key 'jwt')
  const token = Cookies.get('token');
  
  // If no token is found, redirect to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // If token exists, render the children components (i.e. the protected page)
  return children;
};

export default ProtectedRoute;