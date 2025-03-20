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
    const token = Cookies.get('token');
    const userInfo = localStorage.getItem('userInfo') ? 
      JSON.parse(localStorage.getItem('userInfo')) : null;
    
    if (!token || !userInfo || !userInfo.user) {
      setError('User not authenticated. Please log in.');
      setLoading(false);
      // Optionally redirect to login
      // navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
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
  }, [navigate]);

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[url('./resources/homepage/Homepage.png')] bg-cover bg-center p-4">
        <div className="pt-8 text-center">
          <h2 className="text-2xl font-bold text-[#291C08]">Loading Orders...</h2>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-[url('./resources/homepage/Homepage.png')] bg-cover bg-center p-4">
        <div className="pt-8 text-center">
          <h2 className="text-2xl font-bold text-[#291C08]">Error</h2>
          <p className="mt-4 text-red-600">{error}</p>
          <button 
            className="mt-6 px-6 py-3 bg-[#291C08] text-white rounded-xl"
            onClick={() => navigate('/login')}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Format date string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get order status styling
  const getStatusStyle = (status) => {
    switch(status) {
      case 'DELIVERED':
        return 'bg-green-500 text-white';
      case 'PLACED':
        return 'bg-yellow-500 text-white';
      case 'PREPARING':
        return 'bg-blue-500 text-white';
      case 'CANCELLED':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-[url('./resources/homepage/Homepage.png')] bg-cover bg-center p-4">
      {/* Header */}
      <div className="pt-8 pb-4 flex items-center">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 bg-[#291C08] rounded-full text-white mr-4"
        >
          <span>←</span>
        </button>
        <h1 className="text-2xl font-bold text-[#291C08] flex-1">Your Orders</h1>
      </div>

      {/* Orders List */}
      <div className="bg-white/30 backdrop-blur-lg rounded-3xl p-6 shadow-lg">
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto bg-[#291C08]/10 rounded-full flex items-center justify-center mb-3">
              <span className="text-[#291C08]/50 text-2xl">📦</span>
            </div>
            <p className="text-[#291C08]/70">No orders found</p>
            <button 
              className="mt-4 px-6 py-2 bg-[#291C08] text-white rounded-xl"
              onClick={() => navigate('/homepage')}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div 
                key={order._id} 
                className="bg-white/40 rounded-xl p-4 shadow-sm cursor-pointer"
                onClick={() => navigate(`/order/${order.orderId}`)}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Order #{order.orderId || order._id}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusStyle(order.orderStatus || order.status)}`}>
                    {order.orderStatus || order.status}
                  </span>
                </div>
                <p className="text-sm text-[#291C08]/70">
                  {formatDate(order.createdAt)}
                </p>
                <div className="flex justify-between mt-2">
                  <p className="font-medium">₹{order.totalPrice?.$numberDecimal || order.totalPrice || order.amount}</p>
                  <button className="text-[#291C08] underline text-sm">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewOrders;
