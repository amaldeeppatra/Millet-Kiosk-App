import { useState, useEffect } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import MilletLogo from '../resources/homepage/ShaktiSaathi.png';
import Cookies from 'js-cookie';
import ParseJwt from '../utils/ParseJWT';

const CartPage = () => {
  // Initialize cartItems from localStorage if available, otherwise use default items.
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem('cartItems');
    return storedCart 
      ? JSON.parse(storedCart) 
      : [
        ];
  });

  // Save cartItems to localStorage whenever they change.
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const suggestedItems = [
    { id: 1, name: 'Ladoo', image: 'https://source.unsplash.com/100x100/?indian,sweet,ladoo' },
    { id: 2, name: 'Bagel', image: 'https://source.unsplash.com/100x100/?bagel' },
    { id: 3, name: 'Paratha', image: 'https://source.unsplash.com/100x100/?indian,paratha' },
  ];

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
    setCartItems(items => {
      const existingItem = items.find(i => i.id === item.id);
      if (existingItem) {
        return items.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      // Adjust the price as needed.
      return [...items, { ...item, quantity: 1, price: 15 }];
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


  const amount = total*100;
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
    const response = await fetch('http://localhost:5000/order', {
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
      "key": "rzp_test_FmFnhFzbQdnD1h", // Enter the Key ID generated from the Dashboard
      amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency,
      "name": "Millet Kiosk App", //your business name
      "description": "Test Transaction",
      "image": MilletLogo,
      "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      "handler": function (response){
          alert(response.razorpay_payment_id);
          alert(response.razorpay_order_id);
          alert(response.razorpay_signature)
      },
      "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
          "name": customerName, //your customer's name
          "email": customerEmail, //your customer's email
          "contact": "9000090000"  //Provide the customer's phone number for better conversion rates 
      },
      "notes": {
          "address": "Razorpay Corporate Office"
      },
      "theme": {
          "color": "#3399cc"
      }
    };
    var rzp1 = new window.Razorpay(options);
    rzp1.on('payment.failed', function (response){
            alert(response.error.code);
            alert(response.error.description);
            alert(response.error.source);
            alert(response.error.step);
            alert(response.error.reason);
            alert(response.error.metadata.order_id);
            alert(response.error.metadata.payment_id);
    });
    rzp1.open();
    e.preventDefault();
  }


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
          {cartItems.map(item => (
            <div key={item.id} className="flex items-center justify-between bg-[#8B4513] rounded-[15px] p-3 mb-3 last:mb-0">
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
          ))}
        </div>

        {/* Suggested Items */}
        <div className="mb-8">
          <p className="text-center mb-4 text-[#8B4513] font-medium">
            Missing Something?<br />
            Add more Items!
          </p>
          <div className="flex justify-between px-4">
            {suggestedItems.map(item => (
              <div key={item.id} className="relative w-24 h-24">
                <img
                  src={item.image}
                  alt={item.prodName}
                  className="w-full h-full rounded-[15px] object-cover"
                />
                <button 
                  onClick={() => addSuggestedItem(item)}
                  className="absolute bottom-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg text-lg"
                >
                  +
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bill Details */}
        <div className="mb-8 px-4">
          <h2 className="font-semibold mb-4 text-xl text-[#8B4513]">Bill Details</h2>
          <div className="bg-[#8B4513] rounded-[20px] p-4 text-white">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between mb-3 text-lg">
                <span>{item.prodName}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="border-t border-white mt-4 pt-4 flex justify-between font-bold text-xl">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>

        {/* Place Order Button */}
        <button className="w-full bg-[#8B4513] text-white py-4 rounded-[20px] text-lg font-semibold hover:bg-[#654321] mb-4" onClick={paymentHandler}>
          PLACE ORDER
        </button>
      </div>
    </div>
  )
}

export default CartPage;