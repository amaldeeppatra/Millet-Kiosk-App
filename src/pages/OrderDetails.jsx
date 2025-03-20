import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaBox, FaClock, FaReceipt } from 'react-icons/fa';
import axios from 'axios';
import Cookies from 'js-cookie';
import ErrorPage from '../components/ErrorPage';

// Fallback to an empty string if environment variable is not defined
const API_URL = import.meta.env.VITE_API_URL || '';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Helper function with better null checking
  const formatPrice = (price) => {
    if (!price) return '0.00';
    if (typeof price === 'object' && price.$numberDecimal) {
      return price.$numberDecimal;
    }
    return typeof price === 'number' ? price.toFixed(2) : price;
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!API_URL) {
        console.error('API URL is not defined');
        setError({ status: 500, message: 'API configuration error' });
        setLoading(false);
        return;
      }

      const token = Cookies.get('token');
      
      if (!token) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        console.log(`Fetching order: ${API_URL}/order/${orderId}`); // Debug log
        
        const response = await axios.get(`${API_URL}/order/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('API Response:', response.data); // Debug log
        
        if (!response.data || !response.data.order) {
          throw new Error('Invalid response format or order not found');
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

  // Show custom error page if ErrorPage component exists, otherwise show basic error
  if (error) {
    try {
      return <ErrorPage status={error.status} message={error.message} />;
    } catch (e) {
      console.error('Error rendering ErrorPage component:', e);
      return (
        <div className="error-fallback">
          <h1>Error {error.status || 500}</h1>
          <p>{error.message || 'An unexpected error occurred'}</p>
          <button onClick={() => navigate('/orders')}>Back to Orders</button>
        </div>
      );
    }
  }

  if (loading) {
    return <div className="loading-spinner">Loading order details...</div>;
  }

  // Fallback for missing order data
  if (!order) {
    return (
      <div className="error-fallback">
        <h1>Error</h1>
        <p>Order data is missing</p>
        <button onClick={() => navigate('/orders')}>Back to Orders</button>
      </div>
    );
  }

  // Safe rendering with conditional checks for all properties
  return (
    <div className="order-details-container">
      <div className="order-header">
        <button className="back-button" onClick={() => navigate('/orders')}>
          <FaChevronLeft /> Back to Orders
        </button>
        <h1>Order #{order.orderNumber || orderId}</h1>
      </div>

      <div className="order-info-card">
        <div className="order-status">
          <FaClock className="icon" />
          <span className={`status-badge ${(order.status || '').toLowerCase()}`}>
            {order.status || 'Processing'}
          </span>
        </div>
        
        <div className="order-date">
          <p>Placed on: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
        </div>
      </div>

      <div className="order-items-section">
        <h2><FaBox className="icon" /> Items</h2>
        <div className="order-items-list">
          {order.items && order.items.length > 0 ? (
            order.items.map((item, index) => (
              <div key={index} className="order-item">
                <div className="item-image">
                  {item.product && item.product.image && (
                    <img src={item.product.image} alt={item.product?.name || 'Product'} />
                  )}
                </div>
                <div className="item-details">
                  <h3>{item.product?.name || 'Unknown Product'}</h3>
                  <p className="item-qty">Quantity: {item.quantity || 0}</p>
                  <p className="item-price">${formatPrice(item.price)}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No items found in this order.</p>
          )}
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

      {order.shippingAddress && (
        <div className="shipping-info">
          <h2>Shipping Information</h2>
          <p>{order.shippingAddress.name || 'N/A'}</p>
          <p>{order.shippingAddress.street || 'N/A'}</p>
          <p>
            {order.shippingAddress.city || 'N/A'}, {order.shippingAddress.state || 'N/A'} {order.shippingAddress.zip || 'N/A'}
          </p>
          <p>{order.shippingAddress.country || 'N/A'}</p>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
