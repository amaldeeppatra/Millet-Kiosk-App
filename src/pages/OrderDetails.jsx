import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaBox, FaClock, FaReceipt } from 'react-icons/fa';
import axios from 'axios';
import Cookies from 'js-cookie';
import ErrorPage from '../components/ErrorPage';

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
        navigate('/login', { replace: true });
        return;
      }

      try {
        // Fetch order details using the orderId from URL params
        const response = await axios.get(`${API_URL}/order/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!response.data.order) {
          throw new Error('Order not found');
        }
        
        setOrder(response.data.order);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order details:', err);
        
        if (err.response) {
          if (err.response.status === 401 || err.response.status === 403) {
            Cookies.remove('token');
            navigate('/login', { replace: true });
            return;
          } else if (err.response.status === 404) {
            setError({ status: 404, message: 'Order not found' });
          } else {
            setError({ 
              status: err.response.status || 500,
              message: err.response.data?.message || 'Failed to fetch order details'
            });
          }
        } else {
          setError({ 
            status: 500, 
            message: err.message || 'An unexpected error occurred'
          });
        }
        setLoading(false);
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

  // If there's an error, render the custom error page
  if (error) {
    return <ErrorPage status={error.status} message={error.message} />;
  }

  if (loading) {
    return <div className="loading-spinner">Loading order details...</div>;
  }

  return (
    <div className="order-details-container">
      <div className="order-header">
        <button 
          className="back-button" 
          onClick={() => navigate('/orders')}
        >
          <FaChevronLeft /> Back to Orders
        </button>
        <h1>Order #{order.orderNumber}</h1>
      </div>

      <div className="order-info-card">
        <div className="order-status">
          <FaClock className="icon" />
          <span className={`status-badge ${order.status.toLowerCase()}`}>
            {order.status}
          </span>
        </div>
        
        <div className="order-date">
          <p>Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="order-items-section">
        <h2><FaBox className="icon" /> Items</h2>
        <div className="order-items-list">
          {order.items.map((item, index) => (
            <div key={index} className="order-item">
              <div className="item-image">
                <img src={item.product.image} alt={item.product.name} />
              </div>
              <div className="item-details">
                <h3>{item.product.name}</h3>
                <p className="item-qty">Quantity: {item.quantity}</p>
                <p className="item-price">${formatPrice(item.price)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="order-summary">
        <h2><FaReceipt className="icon" /> Order Summary</h2>
        <div className="summary-details">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${formatPrice(order.subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <span>${formatPrice(order.shipping)}</span>
          </div>
          <div className="summary-row">
            <span>Tax:</span>
            <span>${formatPrice(order.tax)}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>${formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="shipping-info">
        <h2>Shipping Information</h2>
        <p>{order.shippingAddress.name}</p>
        <p>{order.shippingAddress.street}</p>
        <p>
          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
        </p>
        <p>{order.shippingAddress.country}</p>
      </div>
    </div>
  );
};

export default OrderDetails;
