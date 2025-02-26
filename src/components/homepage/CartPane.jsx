// CartPane.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineDelete } from 'react-icons/ai';

const CartPane = ({ cartItems, onIncrease, onDecrease, onRemove }) => {
  const navigate = useNavigate();

  if (cartItems.length === 0) return null; // Hide pane if cart is empty

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 z-50">
      <h3 className="text-lg font-bold mb-2">Your Cart</h3>
      {cartItems.map((item) => (
        <div key={item._id} className="flex items-center justify-between mb-2 border-b pb-2">
          <div className="flex items-center">
            <img 
              src={item.prodImg} 
              alt={item.prodName} 
              className="w-12 h-12 object-cover rounded" 
            />
            <div className="ml-2">
              <p className="font-semibold">{item.prodName}</p>
              {/* Add price or any additional info if available */}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => onDecrease(item)} 
              className="border px-2 rounded"
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button 
              onClick={() => onIncrease(item)} 
              className="border px-2 rounded"
            >
              +
            </button>
            <button 
              onClick={() => onRemove(item)} 
              className="text-red-500"
            >
              <AiOutlineDelete />
            </button>
          </div>
        </div>
      ))}
      {/* Optionally, you can add a Checkout button here */}
      <button className="mt-2 bg-[#291C08] text-white px-4 py-2 rounded"
      onClick={() => {
        navigate('/cart');
      }}>
        Checkout
      </button>
    </div>
  );
};

export default CartPane;