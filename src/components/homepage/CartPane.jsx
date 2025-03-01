// CartPane.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineDelete } from 'react-icons/ai';

const CartPane = ({ cartItems, onIncrease, onDecrease, onRemove }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  if (cartItems.length === 0) return null; // Hide pane if cart is empty

  // Show only the first 3 items by default, unless expanded
  const displayedItems =
    cartItems.length > 3 && !isExpanded ? cartItems.slice(0, 3) : cartItems;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 z-50">
      <h3 className="text-lg font-bold mb-2">Your Cart</h3>
      {/* Wrap the items in a container that scrolls if expanded */}
      <div className={`${isExpanded ? 'max-h-60 overflow-y-auto' : ''}`}>
        {displayedItems.map((item) => (
          <div key={item.prodId} className="flex items-center justify-between mb-2 border-b pb-2">
            <div className="flex items-center">
              <img 
                src={item.prodImg} 
                alt={item.prodName} 
                className="w-12 h-12 object-cover rounded" 
              />
              <div className="ml-2">
                <p className="font-semibold">{item.prodName}</p>
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
      </div>
      {cartItems.length > 3 && (
        <div className="text-center mt-2">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-blue-500"
          >
            {isExpanded ? 'Show Less' : `Show ${cartItems.length - 3} More Items`}
          </button>
        </div>
      )}
      <button 
        className="mt-2 bg-[#291C08] text-white px-4 py-2 rounded"
        onClick={() => navigate('/cart')}
      >
        Checkout
      </button>
    </div>
  );
};

export default CartPane;