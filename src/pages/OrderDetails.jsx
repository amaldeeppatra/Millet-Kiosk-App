import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaBox, FaClock, FaReceipt } from 'react-icons/fa';
import axios from 'axios';
import Cookies from 'js-cookie';
import ErrorPage from '../components/ErrorPage';  // Import the custom error component

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

  // If there's an error, render the custom error page
  if (error) {
    return <ErrorPage status={error.status} message={error.message} />;
  }

  // Rest of your component remains the same
  // ...
  
  // Helper function to format price values
  const formatPrice = (price) => {
    if (price && price.$numberDecimal) {
      return price.$numberDecimal;
    }
    return price;
  };

  // The rest of your component code...
};

export default OrderDetails;
