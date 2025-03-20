import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

// Define API_URL at the top level
const API_URL = import.meta.env.VITE_API_URL;

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = Cookies.get('token');
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));

      if (!userInfo || !userInfo.user || !token) {
        setError('User not authenticated. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const token = Cookies.get('token');
        const response = await axios.get(`${API_URL}/order/user/${userInfo.user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data.orders || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Your Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order._id}>
              <strong>Order ID:</strong> {order._id} <br />
              <strong>Amount:</strong> {order.amount} <br />
              <strong>Status:</strong> {order.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewOrders;
