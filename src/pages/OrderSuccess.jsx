import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
  const navigate = useNavigate();

  const goToHomepage = () => {
    navigate('/homepage'); // Navigates to /homepage
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex justify-center items-center bg-[url('./resources/homepage/Homepage.png')]"
    >
      <div className="text-center">
        <img 
          src="src/resources/payment/Group 50.png"  // Replace with your centered image URL
          alt="Order placed" 
          className="mx-auto mb-4"
        />
        <h1 
          className="font-bold text-2xl" 
          style={{ color: "#6A3A3A" }}
        >
          Your Order Has Been Placed!!!
        </h1>
        <button 
          onClick={goToHomepage}
          className="mt-8 px-6 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#654321] transition"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;