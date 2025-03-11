import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CircularIndeterminate from '../components/atoms/CircularIndeterminate';
const API_URL = import.meta.env.VITE_API_URL;

const CheckAuth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if the user is authenticated by calling the protected endpoint.
    axios.get(`${API_URL}/auth/login/success`, { withCredentials: true })
      .then(
        response => {
          console.log('User authenticated:', response.data);
          navigate('/homepage');
        }
      )
      .catch(error => {
        console.error('User not authenticated:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
        <CircularIndeterminate />
    </div>
  )
}

export default CheckAuth