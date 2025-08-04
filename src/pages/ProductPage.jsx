import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaStar } from 'react-icons/fa';
import axios from 'axios';
import Cookies from 'js-cookie';
import Skeleton from '@mui/material/Skeleton';
import nutritionImg from '../resources/productpage/nutrition facts.png';
import CartPane from '../components/homepage/CartPane';
import ParseJwt from '../utils/ParseJWT';

const API_URL = import.meta.env.VITE_API_URL;

const ProductPage = () => {
  const params = useParams();
  let productId = params.prodId;
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  
  // New state for user rating
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  // Utility functions for cart operations
  const getProductId = (product) => product._id || product.prodId;
  
  const handleAddToCart = (product) => {
    const productId = getProductId(product);
    setCartItems((prevItems) => {
      const existing = prevItems.find(item => getProductId(item) === productId);
      if (existing) {
        return prevItems.map(item =>
          getProductId(item) === productId 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Create a new item with only the necessary fields
        const newItem = {
          prodId: productId,
          prodImg: product.prodImg,
          prodName: product.prodName,
          price: product.price,
          quantity: 1,
        };
        return [...prevItems, newItem];
      }
    });
  };
  
  const handleIncrease = (product) => {
    const productId = getProductId(product);
    setCartItems((prevItems) =>
      prevItems.map(item =>
        getProductId(item) === productId 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      )
    );
  };
  
  const handleDecrease = (product) => {
    const productId = getProductId(product);
    setCartItems((prevItems) =>
      prevItems
        .map(item =>
          getProductId(item) === productId 
            ? { ...item, quantity: Math.max(0, item.quantity - 1) } 
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };
  
  const handleRemove = (product) => {
    const productId = getProductId(product);
    setCartItems((prevItems) =>
      prevItems.filter(item => getProductId(item) !== productId)
    );
  };

  // Check if current product is in cart and get its quantity
  const getCurrentProductQuantity = () => {
    if (!product) return 0;
    const cartItem = cartItems.find(item => getProductId(item) === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  // New function to handle user rating
  const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const decoded = ParseJwt(token);
        setUserInfo(decoded);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const handleRating = async (rating) => {
    try {
      await axios.post(`${API_URL}/rate/${productId}`, { 
        rating,
        userId: userInfo?.user?.userId
      });
  
      setUserRating(rating);
      
      // Optionally, refetch the product to display the updated average rating
      const response = await axios.get(`${API_URL}/products/id/${productId}`);
      setProduct(response.data);
    } catch (err) {
      console.error('Error submitting rating:', err);
    }
  };  

  // Render method for star rating
  const renderStarRating = () => {
    return (
      <div className="flex items-center justify-center space-x-1 my-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            size={30}
            className={`cursor-pointer transition-colors duration-200 ${
              (hoveredRating || userRating) >= star 
                ? 'text-yellow-500' 
                : 'text-gray-300'
            }`}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => handleRating(star)}
          />
        ))}
      </div>
    );
  };

  // Load cart items from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Update localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_URL}/products/id/${productId}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching product data');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[url('./resources/homepage/Homepage.png')] bg-cover bg-center p-4">
        {/* Skeleton for the product image */}
        <Skeleton variant="rectangular" width="100%" height={400} className="rounded-b-[50px]" />
        <div className="px-4 py-6">
          {/* Skeleton for product name */}
          <Skeleton variant="text" width="70%" height={40} />
          {/* Skeleton for product description */}
          <Skeleton variant="text" width="90%" height={30} />
          {/* Skeleton for the Price and Rating row */}
          <div className="flex justify-between items-center my-4">
            <Skeleton variant="text" width="30%" height={30} />
            <Skeleton variant="rectangular" width="30%" height={40} />
          </div>
          {/* Skeleton for the Nutrition Facts image */}
          <Skeleton variant="rectangular" width="100%" height={200} />
          {/* Skeleton for the Cart button */}
          <div className="flex justify-center mt-4">
            <Skeleton variant="rectangular" width="50%" height={40} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-xl font-bold mb-4">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Product not found.</p>
      </div>
    );
  }

  const currentProduct = product[0];
  const quantity = getCurrentProductQuantity();

  return (
    <div className="min-h-screen bg-[url('./resources/homepage/Homepage.png')] bg-cover bg-center pb-20">
      {/* Product Image Container */}
      <div className="relative">
        <img 
          src={currentProduct.prodImg} 
          alt={currentProduct.prodName} 
          className="w-full object-cover rounded-b-[50px]"
        />
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 bg-white bg-opacity-75 rounded-full shadow-md"
        >
          <FaChevronLeft className="text-[#6A3A3A]" />
        </button>
      </div>

      {/* Product Details */}
      <div className="px-4 py-6">
        <h1 className="text-3xl text-[#6A3A3A] font-bold mb-4">{currentProduct.prodName}</h1>
        <p className="text-lg mb-4">{currentProduct.prodDesc}</p>
        
        {/* Price, Rating and Add Button Row */}
        <div className="flex justify-between items-center mb-6">
          {/* Left side - Price */}
          <p className="text-lg text-[#6A3A3A] font-semibold">
            Price: Rs.{currentProduct.price}
          </p>
          
          {/* Right side - Rating and Add/Quantity */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center px-5 py-1 bg-[#6A3A3A] text-white rounded-[20px]">
              <FaStar className="text-yellow-500 mr-1" />
              <p className="text-lg font-semibold">
                {currentProduct.rating 
                  ? currentProduct.rating.toFixed(1) 
                  : 'No ratings'}
              </p>
            </div>
            
            {/* Quantity Controls */}
            <div className="flex items-center">
              {quantity === 0 ? (
                <button
                  onClick={() => handleAddToCart(currentProduct)}
                  className="px-8 py-2 bg-[#6A3A3A] text-white font-bold rounded-[20px]"
                >
                  ADD
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleDecrease(currentProduct)}
                    className="px-4 py-2 bg-[#6A3A3A] text-white rounded-full mx-1"
                  >
                    -
                  </button>
                  <span className="px-5 py-2 bg-[#6A3A3A] text-white rounded-full">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleIncrease(currentProduct)}
                    className="px-4 py-2 bg-[#6A3A3A] text-white rounded-full mx-1"
                  >
                    +
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* New Rating Section */}
        <div className="text-center mb-6">
          <h3 className="text-xl text-[#6A3A3A] mb-2">Rate this Product</h3>
          {renderStarRating()}
          {userRating > 0 && (
            <p className="text-sm text-gray-600">
              You rated this product {userRating} star{userRating !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        
        {/* Centered Nutrition Image */}
        <div className="w-full flex justify-center mb-6">
          <img 
            src={nutritionImg} 
            alt="Nutrition Facts" 
            className="max-w-full"
          />
        </div>
        
        {/* Cart Button - Centered */}
        <div className="flex justify-center">
          <button 
            className="px-8 py-2 bg-[#6A3A3A] text-white rounded"
            onClick={() => navigate('/cart')}
          >
            {quantity > 0 ? "Go to Cart" : "Show the Cart"}
          </button>
        </div>
      </div>

      {/* Render the cart pane fixed at the bottom */}
      <CartPane 
        cartItems={cartItems} 
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
        onRemove={handleRemove}
      />
    </div>
  );
};

export default ProductPage;
