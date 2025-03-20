import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaBox, FaClock, FaReceipt } from 'react-icons/fa';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL;

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const token = Cookies.get('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Fetch order details using the orderId from URL params
        const response = await axios.get(`${API_URL}/order/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setOrder(response.data.order || null);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order details:', err);
        
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          Cookies.remove('token');
          navigate('/login');
        } else {
          setError(err.message || 'Failed to fetch order details');
          setLoading(false);
        }
      }
    };

    fetchOrderDetails();
  }, [orderId, navigate]);

  // Helper function to format price values
  const formatPrice = (price) => {
    if (price && price.$numberDecimal) {
      return price.$numberDecimal;
    }
    return price;
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch(status) {
      case 'COMPLETED': return 'green';
      case 'PLACED': return 'yellow';
      default: return 'gray';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-[url('./resources/homepage/Homepage.png')] bg-cover bg-center p-4">
      <div className="pt-8 pb-4 flex items-center">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 bg-[#291C08] rounded-full text-white mr-4"
        >
          <FaChevronLeft />
        </button>
        <h1 className="text-2xl font-bold text-[#291C08] flex-1">Order Details</h1>
      </div>

      <div className="bg-white/30 backdrop-blur-lg rounded-3xl p-6 shadow-lg">
        {loading ? (
          <p className="text-center py-8">Loading order details...</p>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <button 
              className="mt-4 px-6 py-2 bg-[#291C08] text-white rounded-xl"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : order ? (
          <div className="space-y-6">
            {/* Order Header */}
            <div className="bg-white/40 rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-lg">Order #{order.orderId}</h2>
                <span className={`px-3 py-1 text-sm rounded-full bg-${getStatusColor(order.orderStatus)}-500 text-white`}>
                  {order.orderStatus}
                </span>
              </div>
              <div className="flex items-center mt-2 text-sm text-[#291C08]/70">
                <FaClock className="mr-2" />
                <p>{formatDate(order.createdAt)}</p>
              </div>
              {order.transactionId && (
                <div className="flex items-center mt-1 text-sm text-[#291C08]/70">
                  <FaReceipt className="mr-2" />
                  <p>Transaction ID: {order.transactionId}</p>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white/40 rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold mb-3">Order Items</h3>
              <div className="space-y-3">
                {order.items && order.items.map((item, index) => (
                  <div key={index} className="flex justify-between border-b last:border-b-0 pb-3 last:pb-0">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-[#291C08]/10 rounded-lg flex items-center justify-center mr-3">
                        <FaBox className="text-[#291C08]/50" />
                      </div>
                      <div>
                        <p className="font-medium">{item.prodName}</p>
                        <p className="text-sm text-[#291C08]/70">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#291C08]/70">Product ID</p>
                      <p className="text-sm">{item.prodId}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white/40 rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold mb-3">Payment Summary</h3>
              <div className="flex justify-between border-t pt-2">
                <p className="font-bold">Total</p>
                <p className="font-bold">₹{formatPrice(order.totalPrice)}</p>
              </div>
            </div>

            {/* Action Buttons */}
            {order.orderStatus === 'PLACED' && (
              <div className="flex justify-center mt-4">
                <button 
                  className="px-6 py-3 bg-red-500 text-white rounded-xl"
                  onClick={() => {
                    // Add cancel order functionality here
                    alert('Cancel order functionality to be implemented');
                  }}
                >
                  Cancel Order
                </button>
              </div>
            )}

            {/* Track Order Button */}
            <div className="flex justify-center">
              <button 
                className="px-6 py-3 bg-[#291C08] text-white rounded-xl w-full"
                onClick={() => {
                  // Add track order functionality or navigation
                  alert('Track order functionality to be implemented');
                }}
              >
                Track Order
              </button>
            </div>

            {/* Back to Orders Button */}
            <div className="flex justify-center">
              <button 
                className="px-6 py-3 border border-[#291C08] text-[#291C08] rounded-xl w-full"
                onClick={() => navigate('/orders')}
              >
                Back to My Orders
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto bg-[#291C08]/10 rounded-full flex items-center justify-center mb-3">
              <FaBox className="text-[#291C08]/50 text-2xl" />
            </div>
            <p className="text-[#291C08]/70">Order not found</p>
            <button 
              className="mt-4 px-6 py-2 bg-[#291C08] text-white rounded-xl"
              onClick={() => navigate('/orders')}
            >
              Back to Orders
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
