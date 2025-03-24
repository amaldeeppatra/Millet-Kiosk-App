import { useState, useEffect } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import MilletLogo from '../resources/homepage/ShaktiSaathi.png';
import Cookies from 'js-cookie';
import ParseJwt from '../utils/ParseJWT';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const CartPage = () => {
  // Initialize cartItems from localStorage if available, otherwise use default items.
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem('cartItems');
    return storedCart 
      ? JSON.parse(storedCart) 
      : [];
  });

  // State for suggested items
  const [allSuggestedItems, setAllSuggestedItems] = useState([]);
  const [randomSuggestions, setRandomSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);

  // Save cartItems to localStorage whenever they change.
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Fetch all products from API to use as suggestions
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingSuggestions(true);
      try {
        const response = await axios.get(`${API_URL}/products`);
        setAllSuggestedItems(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to default items if API fails
        setAllSuggestedItems([
          { prodId: 1, prodName: 'Ladoo', prodImg: 'https://source.unsplash.com/100x100/?indian,sweet,ladoo', price: 15 },
          { prodId: 2, prodName: 'Bagel', prodImg: 'https://source.unsplash.com/100x100/?bagel', price: 20 },
          { prodId: 3, prodName: 'Paratha', prodImg: 'https://source.unsplash.com/100x100/?indian,paratha', price: 25 },
          { prodId: 4, prodName: 'Samosa', prodImg: 'https://source.unsplash.com/100x100/?samosa', price: 15 },
          { prodId: 5, prodName: 'Dosa', prodImg: 'https://source.unsplash.com/100x100/?dosa', price: 30 },
          { prodId: 6, prodName: 'Idli', prodImg: 'https://source.unsplash.com/100x100/?idli', price: 18 },
        ]);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    fetchProducts();
  }, []);

  // Select and update 3 random suggestions every 45 seconds
  useEffect(() => {
    if (allSuggestedItems.length < 3) return;

    const getRandomSuggestions = () => {
      const shuffled = [...allSuggestedItems].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 3);
    };
    
    setRandomSuggestions(getRandomSuggestions());
    
    const interval = setInterval(() => {
      setRandomSuggestions(getRandomSuggestions());
    }, 45000); // 45 seconds
    
    return () => clearInterval(interval);
  }, [allSuggestedItems]);

  const getProductId = (product) => product._id || product.prodId;
  
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
            ? { ...item, quantity: item.quantity - 1 } 
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const addSuggestedItem = (item) => {
    const productId = getProductId(item);
    setCartItems(items => {
      const existingItem = items.find(i => getProductId(i) === productId);
      if (existingItem) {
        return items.map(i =>
          getProductId(i) === productId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      // Format the price correctly
      const price = item.price.$numberDecimal ? parseFloat(item.price.$numberDecimal) : item.price;
      return [...items, { 
        prodId: item.prodId, 
        prodName: item.prodName, 
        prodImg: item.prodImg, 
        price: price, 
        quantity: 1 
      }];
    });
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);  

  const clearCart = () => {
    setCartItems([]);
  };

  const amount = total * 100;
  const currency = 'INR';
  const receiptId = 'qwsaq1';
  
  const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
    const token = Cookies.get('token');
    if (token){
      try{
        const decoded = ParseJwt(token);
        setUserInfo(decoded);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const customerName = userInfo?.user?.name;
  const customerEmail = userInfo?.user?.email;

  const paymentHandler = async (e) => {
    e.preventDefault();
    
    const response = await fetch(`${API_URL}/order`, {
      method: 'POST',
      body: JSON.stringify({
        amount,
        currency,
        receipt: receiptId,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const order = await response.json();
    console.log(order);

    var options = {
      key: "rzp_test_FmFnhFzbQdnD1h", // Your Key ID from the Dashboard
      amount, // Amount in currency subunits
      currency,
      name: "Millet Kiosk App", // Your business name
      description: "Test Transaction",
      image: MilletLogo,
      order_id: order.id, // Order ID from your backend
      handler: async function (response) {
          const body = {
            ...response,
            cartItems,
            userId: userInfo?.user?._id,
            email: userInfo?.user?.email,
            name: userInfo?.user?.name,
            totalPrice: total
          };

          const validateRes = await fetch(`${API_URL}/order/validate`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
              "Content-Type": "application/json",
            }
          });
          const jsonRes = await validateRes.json();
          console.log(jsonRes);

          if (jsonRes.message === 'success') {
            // Update inventory after successful payment verification
            await fetch(`${API_URL}/order/update-inventory`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ cartItems }),
            });
            // Clear the cart and navigate to the order success page
            clearCart();
            navigate('/order-success', { state: { orderId: jsonRes.orderId } });
          }
          else {
            console.log("Payment failed!");
          }
      },
      prefill: {
          name: customerName,
          email: customerEmail,
          contact: "9000090000"
      },
      notes: {
          address: "Razorpay Corporate Office"
      },
      theme: {
          color: "#3399cc"
      }
    };

    var rzp1 = new window.Razorpay(options);
    rzp1.on('payment.failed', function (response) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
    });
    rzp1.open();
  };

  // Helper function to get the price display value
  const getDisplayPrice = (item) => {
    if (item.price.$numberDecimal) {
      return parseFloat(item.price.$numberDecimal);
    }
    return item.price;
  };

  return (
    <div className="min-h-screen bg-[url('./resources/homepage/Homepage.png')] bg-cover bg-center p-5">
      <div className="max-w-[430px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <button onClick={handleGoBack}>
              <IoArrowBack className="text-2xl mr-2 text-[#8B4513]" />
            </button>
            <h1 className="text-2xl font-semibold text-[#8B4513]">Your Cart</h1>
          </div>
          <button 
            onClick={clearCart}
            className="bg-[#8B4513] text-white px-4 py-2 rounded-[15px] font-medium hover:bg-[#654321]"
          >
            Clear Cart
          </button>
        </div>

        {/* Coupon Card */}
        <div className="bg-[#8B4513] text-white rounded-[20px] p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold leading-none mb-1">Get more,</h2>
              <p className="text-lg font-medium">For less!</p>
            </div>
            <div className="text-4xl font-bold leading-none">40%<br />off!!!</div>
          </div>
          <button className="bg-white text-[#8B4513] px-6 py-2 rounded-full mt-4 text-sm font-medium w-full text-center">
            View more coupons
          </button>
        </div>

        {/* Review Order Title */}
        <h2 className="text-[#8B4513] mb-4 flex justify-between text-lg font-semibold px-2">
          Review Your Order
          <span>{cartItems.length} Items</span>
        </h2>

        {/* Cart Items */}
        <div className="bg-[#8B4513] rounded-[25px] p-4 mb-6">
          {cartItems.length === 0 ? (
            <div className="text-white text-center py-4">
              Your cart is empty. Add some items to proceed.
            </div>
          ) : (
            cartItems.map(item => (
              <div key={getProductId(item)} className="flex items-center justify-between bg-[#8B4513] rounded-[15px] p-3 mb-3 last:mb-0">
                <div className="flex items-center">
                  <img
                    src={item.prodImg}
                    alt={item.prodName}
                    className="w-14 h-14 rounded-[12px] object-cover mr-3"
                  />
                  <span className="font-medium text-white">{item.prodName}</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-white rounded-full px-2 py-1 flex items-center">
                    <button
                      onClick={() => handleDecrease(item)}
                      className="w-6 h-6 flex items-center justify-center text-[#8B4513] text-lg font-medium"
                    >
                      -
                    </button>
                    <span className="mx-2 font-medium text-[#8B4513]">{item.quantity}</span>
                    <button
                      onClick={() => handleIncrease(item)}
                      className="w-6 h-6 flex items-center justify-center text-[#8B4513] text-lg font-medium"
                    >
                      +
                    </button>
                  </div>
                  <span className="ml-4 font-medium text-white">₹{item.price * item.quantity}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Random Suggested Items */}
        <div className="mb-8">
          <p className="text-center mb-4 text-[#8B4513] font-medium">
            Missing Something?<br />
            Add more Items!
          </p>
          {loadingSuggestions ? (
            <div className="flex justify-between px-4">
              {[1, 2, 3].map(index => (
                <div key={index} className="relative w-24 h-24 bg-gray-200 rounded-[15px] animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="flex justify-between px-4">
              {randomSuggestions.map(item => (
                <div key={getProductId(item)} className="relative w-24 h-24">
                  <img
                    src={item.prodImg}
                    alt={item.prodName}
                    className="w-full h-full rounded-[15px] object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 rounded-b-[15px]">
                    <p className="text-white text-xs font-medium truncate">{item.prodName}</p>
                    <p className="text-white text-xs">₹{getDisplayPrice(item)}</p>
                  </div>
                  <button 
                    onClick={() => addSuggestedItem(item)}
                    className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg text-sm"
                  >
                    +
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bill Details */}
        <div className="mb-8 px-4">
          <h2 className="font-semibold mb-4 text-xl text-[#8B4513]">Bill Details</h2>
          <div className="bg-[#8B4513] rounded-[20px] p-4 text-white">
            {cartItems.length === 0 ? (
              <div className="text-center py-2">No items in cart</div>
            ) : (
              cartItems.map(item => (
                <div key={getProductId(item)} className="flex justify-between mb-3 text-lg">
                  <span>{item.prodName}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))
            )}
            <div className="border-t border-white mt-4 pt-4 flex justify-between font-bold text-xl">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>

        {/* Place Order Button */}
        <button 
          className={`w-full py-4 rounded-[20px] text-lg font-semibold mb-4 ${
            cartItems.length === 0 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-[#8B4513] text-white hover:bg-[#654321]'
          }`}
          onClick={paymentHandler}
          disabled={cartItems.length === 0}
        >
          PLACE ORDER
        </button>
      </div>
    </div>
  );
};

export default CartPage;