import React from 'react'

const OrderSuccess = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex justify-center items-center bg-[url('./resources/homepage/Homepage.png')] "
      // classNae="relative min-h-screen bg-no-repeat bg-cover bg-center bg-[url('./resources/homepage/Homepage.png')]"
    >
      <div className="text-center">
        <img 
          src="src\resources\payment\Group 50.png"  // Replace with your centered image URL
          alt="Order placed" 
          className="mx-auto mb-4"
        />
        <h1 
          className="font-bold text-2xl" 
          style={{ color: "#6A3A3A" }}
        >
          Your Order Has Been Placed!!!
        </h1>
      </div>
    </div>
  )
}

export default OrderSuccess