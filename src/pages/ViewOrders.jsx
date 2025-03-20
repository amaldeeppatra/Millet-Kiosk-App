import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL;

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const token = Cookies.get('token');
      
      // If no token, redirect to login
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Try to get user info from localStorage first
        let userInfo = null;
        try {
          userInfo = JSON.parse(localStorage.getItem('userInfo'));
        } catch (err) {
          console.error('Failed to parse user info from localStorage');
        }

        // If userInfo doesn't exist in localStorage, try to get it from the token
        if (!userInfo || !userInfo.user) {
          // You might need a function to decode JWT token
          // This is a simplified approach
          const response = await axios.get(`${API_URL}/user/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          userInfo = response.data;
          // Save user info to localStorage
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
        }

        // Now fetch orders
        const response = await axios.get(`${API_URL}/order/user/${userInfo.user._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setOrders(response.data.orders || []);
        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        // If there's an authentication error, clear token and redirect
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          Cookies.remove('token');
          localStorage.removeItem('userInfo');
          navigate('/login');
        } else {
          setError(err.response?.data?.message || 'Failed to fetch orders');
          setLoading(false);
        }
      }
    };

    checkAuth();
  }, [navigate]);

  // Rest of your component (loading, error handling, rendering orders)
  // ...

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {orders.map(order => (
            <li key={order._id}>{order.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewOrders;
