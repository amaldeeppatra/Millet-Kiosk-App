import React, { useState, useEffect } from 'react';
import { AiOutlinePlus } from "react-icons/ai";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

const ProductsByCat = ({ title, cat }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/products/cat/${cat}`);
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching product data');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [cat]);

  if (loading) {
    return <div className="mt-8 px-7">Loading {title} products...</div>;
  }

  if (error) {
    return <div className="mt-8 px-7">Error: {error}</div>;
  }

  return (
    <div className="mt-8 px-7">
      {/* Header with horizontal line and custom title */}
      <div className="flex items-center mb-4">
        <h3 className="text-2xl font-semibold text-[#783A0D] mr-4">{title}</h3>
        <div className="flex-grow border-b-2 border-[#783A0D]"></div>
        <button className="ml-4 text-[#783A0D] font-semibold">See All</button>
      </div>
      
      {/* Products Scrollable Section */}
      <div className="flex flex-nowrap space-x-7 overflow-x-auto pb-4 scrollbar-hide">
        {products && products.length > 0 ? (
          products.slice(0, 5).map((product) => (
            <div 
              key={product._id || product.prodId} 
              className="flex-none w-[20%] cursor-pointer"
              onClick={() => navigate(`/product/${product._id || product.prodId}`)} // Navigate on click
            >
              <div className="aspect-square rounded-[26px] overflow-hidden relative bg-gray-100">
                <img
                  src={product.prodImg}
                  alt={product.prodName}
                  className="w-full h-full object-cover"
                />
                <button 
                  className="absolute top-1 right-1 bg-white text-[#783A0D] text-3xl rounded-full border-4 border-[#783A0D] w-8 h-8 flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the parent onClick
                    // You can add additional functionality here (e.g., adding to cart)
                  }}
                >
                  <AiOutlinePlus />
                </button>
              </div>
              <p className="mt-2 text-center text-sm font-semibold text-[#783A0D]">
                {product.prodName}
              </p>
            </div>
          ))
        ) : (
          <div>No products found in this category.</div>
        )}
      </div>
    </div>
  );
};

export default ProductsByCat;