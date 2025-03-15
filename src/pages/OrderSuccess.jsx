import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaChevronLeft, FaCheck, FaMapMarkerAlt, FaRegClock } from 'react-icons/fa';
import Lottie from 'lottie-react';
import successAnimation from '../resources/animations/success-animation.json'; // You'll need to add this animation file
import Skeleton from '@mui/material/Skeleton';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);
  
  // Get order details from location state or fetch from API
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      // This would normally come from the order completion process
      setOrderDetails({
        orderId: 'ORD' + Math.floor(1000 + Math.random() * 9000),
        date: new Date().toLocaleString(),
        items: 3,
        total: 499,
        estimatedDelivery: '20 minutes',
        deliveryAddress: 'Main Campus, IIIT Bangalore'
      });
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [location]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[url('./resources/homepage/Homepage.png')] bg-cover bg-center p-4">
        <div className="pt-8 pb-4 flex items-center">
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="text" width="70%" height={40} className="ml-4" />
        </div>
        <div className="mx-auto max-w-md">
          <Skeleton variant="circular" width={150} height={150} className="mx-auto my-8" />
          <Skeleton variant="text" width="100%" height={40} className="mb-2" />
          <Skeleton variant="text" width="60%" height={30} className="mx-auto mb-8" />
          <Skeleton variant="rectangular" width="100%" height={150} className="rounded-xl mb-6" />
          <Skeleton variant="rectangular" width="100%" height={50} className="rounded-xl mb-3" />
          <Skeleton variant="rectangular" width="100%" height={50} className="rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('./resources/homepage/Homepage.png')] bg-cover bg-center px-4 pb-8">
      {/* Header */}
      <div className="pt-8 pb-4 flex items-center">
        <button 
          onClick={() => navigate('/homepage')}
          className="p-3 bg-[#291C08] rounded-full text-white mr-4"
        >
          <FaChevronLeft />
        </button>
        <h1 className="text-2xl font-bold text-[#291C08] flex-1">Order Confirmation</h1>
      </div>

      {/* Success Animation */}
      <div className="flex flex-col items-center justify-center my-6">
        <div className="w-32 h-32 mb-4">
          <Lottie 
            animationData={successAnimation} 
            loop={false} 
            autoplay={true}
          />
        </div>
        <h2 className="text-2xl font-bold text-[#291C08] text-center">Order Placed Successfully!</h2>
        <p className="text-[#291C08]/70 text-center mt-2">
          Your delicious food is on its way to you
        </p>
      </div>

      {/* Order Details Card */}
      <div className="mx-auto max-w-md bg-white/30 backdrop-blur-lg rounded-3xl p-6 shadow-lg mb-6">
        <h3 className="text-lg font-semibold text-[#291C08] mb-3 border-b border-[#291C08]/30 pb-2">
          Order Details
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <p className="text-[#291C08]/70">Order ID</p>
            <p className="font-medium">{orderDetails.orderId}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-[#291C08]/70">Date & Time</p>
            <p className="font-medium">{orderDetails.date}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-[#291C08]/70">Items</p>
            <p className="font-medium">{orderDetails.items} items</p>
          </div>
          <div className="flex justify-between">
            <p className="text-[#291C08]/70">Total Amount</p>
            <p className="font-bold">₹{orderDetails.total}</p>
          </div>
        </div>
      </div>

      {/* Delivery Information */}
      {/* <div className="mx-auto max-w-md bg-white/30 backdrop-blur-lg rounded-3xl p-6 shadow-lg mb-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-[#291C08] rounded-full flex items-center justify-center text-white mr-3">
            <FaRegClock />
          </div>
          <div>
            <p className="text-sm text-[#291C08]/70">Estimated Delivery Time</p>
            <p className="font-semibold">{orderDetails.estimatedDelivery}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="w-10 h-10 bg-[#291C08] rounded-full flex items-center justify-center text-white mr-3">
            <FaMapMarkerAlt />
          </div>
          <div>
            <p className="text-sm text-[#291C08]/70">Delivery Address</p>
            <p className="font-semibold">{orderDetails.deliveryAddress}</p>
          </div>
        </div>
      </div> */}

      {/* Action Buttons */}
      <div className="mx-auto max-w-md space-y-3">
        {/* <button 
          className="w-full py-3 flex items-center justify-center bg-[#291C08] text-white rounded-xl"
          onClick={() => navigate(`/track-order/${orderDetails.orderId}`)}
        >
          Track Order
        </button> */}
        <button 
          className="w-full py-3 flex items-center justify-center bg-white/50 backdrop-blur-md border border-[#291C08] text-[#291C08] rounded-xl"
          onClick={() => navigate('/homepage')}
        >
          Continue Shopping
        </button>
      </div>

      {/* Promotional Note */}
      <div className="mx-auto max-w-md mt-8 text-center absolute bottom-5 left-7">
        {/* <div className="bg-[#291C08] rounded-full text-white text-xs px-3 py-1 inline-flex items-center">
          <FaCheck className="mr-1" /> New User
        </div> */}
        <p className="mt-2 text-[0.9rem] text-[#291C08]">
          {/* Use code <span className="font-bold">WELCOME10</span> for 10% off on your next order! */}
          Thank you for ordering! With ❤️ from Milet Hub Cafe.
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;