import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaBox, FaMapMarkerAlt, FaUserAlt, FaPhone } from 'react-icons/fa';
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

  // Helper function to calculate item total
  const calculateItemTotal = (item) => {
    const price = formatPrice(item.price);
    return (parseFloat(price) * item.quantity).toFixed(2);
  };

  // Get the appropriate status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'DELIVERED': return 'green';
      case 'PLACED': return 'yellow';
      case 'PREPARING': return 'blue';
      case 'CANCELLED': return 'red';
      default: return 'gray';
    }
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
              <p className="text-sm text-[#291C08]/70 mt-1">
                {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
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
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-[#291C08]/70">₹{formatPrice(item.price)} × {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold">₹{calculateItemTotal(item)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            {order.deliveryAddress && (
              <div className="bg-white/40 rounded-xl p-4 shadow-sm">
                <h3 className="font-semibold mb-3">Delivery Address</h3>
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-[#291C08]/70 mt-1 mr-2" />
                  <div>
                    <p className="font-medium">{order.deliveryAddress.addressType || 'Delivery Address'}</p>
                    <p className="text-sm text-[#291C08]/70">
                      {order.deliveryAddress.houseNo}, {order.deliveryAddress.street}, 
                      {order.deliveryAddress.landmark && ` Near ${order.deliveryAddress.landmark},`} {order.deliveryAddress.city}, 
                      {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
                    </p>
                  </div>
                </div>
                <div className="flex items-center mt-3">
                  <FaUserAlt className="text-[#291C08]/70 mr-2" />
                  <p className="text-sm">{order.deliveryAddress.name}</p>
                </div>
                <div className="flex items-center mt-1">
                  <FaPhone className="text-[#291C08]/70 mr-2" />
                  <p className="text-sm">{order.deliveryAddress.phone}</p>
                </div>
              </div>
            )}

            {/* Payment Summary */}
            <div className="bg-white/40 rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold mb-3">Payment Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-[#291C08]/70">Subtotal</p>
                  <p>₹{formatPrice(order.subtotalPrice)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[#291C08]/70">Delivery Fee</p>
                  <p>₹{formatPrice(order.deliveryFee) || '0.00'}</p>
                </div>
                {order.discount && (
                  <div className="flex justify-between">
                    <p className="text-[#291C08]/70">Discount</p>
                    <p className="text-green-600">-₹{formatPrice(order.discount)}</p>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2 mt-3">
                  <p className="font-bold">Total</p>
                  <p className="font-bold">₹{formatPrice(order.totalPrice)}</p>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white/40 rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold mb-2">Payment Method</h3>
              <p>{order.paymentMethod || 'Cash on Delivery'}</p>
            </div>

            {/* Action Buttons */}
            {(order.orderStatus === 'PLACED' || order.orderStatus === 'PREPARING') && (
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