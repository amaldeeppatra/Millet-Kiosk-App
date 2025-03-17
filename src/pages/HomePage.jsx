import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import ParseJwt from '../utils/ParseJWT';
import { CgProfile } from "react-icons/cg";
import { FaChevronLeft } from "react-icons/fa6";
import Skeleton from '@mui/material/Skeleton';
import banner1 from '../resources/homepage/banner1.png';
import banner2 from '../resources/homepage/ShaktiSaathi.png';
import ProductsByCat from '../components/homepage/ProductsByCat';
import Footer from '../components/footer/Footer';
import CartPane from '../components/homepage/CartPane';
import MissionShaktiCard from '../components/homepage/MissionShaktiCard';

const API_URL = import.meta.env.VITE_API_URL;

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract token from query parameters (if any) and store it in cookies
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('token');
    if (tokenFromUrl) {
      // Cookies.set('token', tokenFromUrl, { secure: true, sameSite: 'none' });
      Cookies.set('token', tokenFromUrl, { secure: true, sameSite: 'none', expires: 1 / 48 }); // 30 minutes expiration
      // Remove the token from the URL to prevent it from lingering
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  // Now, retrieve the token from cookies
  const token = Cookies.get('token');
  console.log('Token:', token);

  // State variables and other logic
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);

  // Check if the user is authenticated
  // useEffect(() => {
  //   axios.get(`${API_URL}/auth/login/success`, { withCredentials: true })
  //     .then(response => {
  //       console.log('User authenticated:', response.data);
  //       // Optionally, redirect if needed
  //       // navigate('/homepage');
  //     })
  //     .catch(error => {
  //       console.error('User not authenticated:', error);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // }, [navigate]);

  // Simulate data fetching delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Retrieve cart items from localStorage
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

  // Utility functions for cart operations
  const getProductId = (product) => product._id || product.prodId;
  
  const handleAddToCart = (product) => {
    // Assuming product.prodId exists or you can use getProductId(product)
    const productId = product.prodId; 
    setCartItems((prevItems) => {
      const existing = prevItems.find(item => item.prodId === productId);
      if (existing) {
        return prevItems.map(item =>
          item.prodId === productId 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Create a new item with only the necessary fields
        const newItem = {
          prodId: product.prodId,
          prodImg: product.prodImg,
          prodName: product.prodName, // mapping prodName to name
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
            ? { ...item, quantity: item.quantity - 1 } 
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

  // Carousel slides and other UI state variables
  const slides = [
    { image: banner1, alt: 'Banner 1', title: 'Welcome to Millet Hub Cafe', subtitle: '' },
    { image: banner2, alt: 'Banner 2', title: 'Title for Banner 2', subtitle: 'Subtitle for Banner 2' },
  ];
  const offers = [
    { id: 1, title: "Order Now!!!", image: banner1 },
    { id: 2, title: "Flat ₹50 Off", image: banner2 },
  ];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const recentSearches = ["Samosa", "Jalebi", "Cupcakes"];
  const popularSearches = ["Samosa", "Cupcakes", "Jalebi"];

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
      setSearchOpen(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
    const token = Cookies.get('token');
    if (token){
      try{
        // const decoded = parseJwt(token);
        const decoded = ParseJwt(token);
        setUserInfo(decoded);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  // Slide carousel auto-change effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);


  const renderProfilePicture = () => {
      if (userInfo?.user?.avatar) {
        // If profile picture exists in the token, display it
        return (
          <img 
            src={userInfo.user.avatar} 
            alt="Profile"
            className="size-8 rounded-full object-cover"
          />
        );
      } else if (userInfo?.user?.name) {
        // If no profile picture but name exists, show initials
        const initials = userInfo.user.name
          .split(' ')
          .map(name => name[0])
          .join('')
          .toUpperCase();
        
        return (
          <div className="size-8 rounded-full object-cover">
            {initials}
          </div>
        );
      } else {
        // Fallback to icon
        return (
          <div className="bg-[#291C08] p-2 rounded-full shadow-md">
            <CgProfile className="text-4xl text-white" />
          </div>
        );
      }
    };


  const handleLogout = () => {
      // Clear cookies and local storage
      Cookies.remove('token');
      
      // Redirect to login page
      navigate('/login');
    };

  // Show skeletons if loading
  if (loading) {
    return (
      <div className="min-h-screen p-4 space-y-4">
        <Skeleton variant="rectangular" width="100%" height={200} />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="rectangular" width="100%" height={400} />
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="rectangular" width="100%" height={300} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-no-repeat bg-cover bg-center bg-[url('./resources/homepage/Homepage.png')]">
      {/* Navbar */}
      <header className="bg-opacity-90 p-4 relative z-50">
        <nav className="flex items-center justify-between relative">
          {/* Hamburger Menu */}
          <div className="relative">
            <button 
              onClick={() => setMenuOpen(!menuOpen)} 
              className="flex flex-col space-y-1 focus:outline-none bg-[#291C08] p-2 rounded-md z-50 relative"
            >
              <span className="block w-4 h-0.5 bg-white"></span>
              <span className="block w-4 h-0.5 bg-white"></span>
              <span className="block w-4 h-0.5 bg-white"></span>
            </button>
            {menuOpen && (
              <div className="absolute top-12 left-0 w-48 bg-white/30 backdrop-blur-lg border border-white/40 rounded-lg shadow-lg z-50">
                <ul className="text-black text-sm">
                  <li className="px-4 py-2 hover:bg-white/50 cursor-pointer rounded-t-lg transition-all" onClick={() => navigate("/profile")}>
                    My Profile
                  </li>
                  <li className="px-4 py-2 hover:bg-white/50 cursor-pointer transition-all">
                    Previous Orders
                  </li>
                  <li className="px-4 py-2 hover:bg-white/50 cursor-pointer rounded-b-lg transition-all" onClick={handleLogout}>
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex-1 mx-4">
            <input
              type="text"
              placeholder="🔍"
              onFocus={() => setSearchOpen(true)}
              className="w-full px-3 py-1 bg-white/30 backdrop-blur-md border border-white/40 text-black placeholder-black rounded-[70px] focus:outline-none focus:ring-2 focus:ring-[#291C08]"
            />
          </div>

          {/* Profile Icon */}
          <div className="z-50">
            {/* <CgProfile 
              style={{ 
                fontSize: '2rem', 
                backgroundColor: '#291C08', 
                color: 'white', 
                borderRadius: '50px', 
                padding: '2px' 
              }} 
            /> */}
            {/* <img src={userInfo.user.avatar} alt="" className="size-8 rounded-full object-cover"/> */}
            {renderProfilePicture()}
          </div>
        </nav>
      </header>

      {/* Search Overlay */}
      {searchOpen && (
        <div 
          className="fixed inset-0 z-[999] flex flex-col bg-[url('./resources/homepage/Homepage.png')] bg-cover bg-center"
          style={{ backgroundColor: '#F8EDD6' }}
        >
          <div className="flex items-center p-4">
            <button 
              onClick={() => setSearchOpen(false)}
              className="text-xl font-semibold mr-2"
            >
              <FaChevronLeft />
            </button>
            <input
              type="text"
              placeholder="Search..."
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-3/4 px-3 py-2 border border-gray-300 rounded-full focus:outline-none"
            />
            <button 
              onClick={handleSearch}
              className="ml-2 bg-[#291C08] text-white px-4 py-2 rounded-full"
            >
              Search
            </button>
          </div>
          <div className="p-4 overflow-auto">
            <h2 className="text-lg font-semibold mb-2">Recent Searches</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {recentSearches.map((item, idx) => (
                <span 
                  key={idx} 
                  className="px-3 py-1 rounded-full bg-[#291C08] text-white text-sm cursor-pointer"
                  onClick={() => {
                    setSearchTerm(item);
                    navigate(`/search?query=${encodeURIComponent(item)}`);
                    setSearchOpen(false);
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
            <h2 className="text-lg font-semibold mb-2">Popular Searches</h2>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((item, idx) => (
                <span 
                  key={idx} 
                  className="px-3 py-1 rounded-full bg-[#291C08] text-white text-sm cursor-pointer"
                  onClick={() => {
                    setSearchTerm(item);
                    navigate(`/search?query=${encodeURIComponent(item)}`);
                    setSearchOpen(false);
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Carousel */}
      <div className="relative h-96 mt-[-65px] overflow-hidden z-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${slide.image})` }}
            aria-label={slide.alt}
          />
        ))}
        <div className="absolute inset-0 bg-[#666666] opacity-50 z-5 rounded-b-[50px]"></div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {slides.map((_, dotIndex) => (
            <span
              key={dotIndex}
              onClick={() => setCurrentSlide(dotIndex)}
              className={`block w-3 h-3 rounded-full cursor-pointer ${
                dotIndex === currentSlide ? 'bg-white' : 'bg-gray-400'
              }`}
            />
          ))}
        </div>
        <div className="absolute bottom-10 left-4 z-10">
          <h2 className="text-white text-[2rem] font-bold drop-shadow-lg">
            {slides[currentSlide].title}
          </h2>
          <p className="text-white text-sm drop-shadow-lg">
            {slides[currentSlide].subtitle}
          </p>
        </div>
      </div>

      {/* <div>
        {userInfo ? (
          <div>
            <h3>User Information</h3>
            <pre>{JSON.stringify(userInfo.user.userId, null, 2)}</pre>
            <pre>{JSON.stringify(userInfo.user.name, null, 2)}</pre>
            <pre>{JSON.stringify(userInfo.user.email, null, 2)}</pre>
          </div>
        ) : (
          <p>No user information found.</p>
        )}
      </div> */}

      {/* Offers Scrollable Carousel */}
      <div className="mt-10 px-4">
        <div className="flex space-x-4 overflow-x-auto pb-4 snap-x snap-mandatory">
          {offers.map((offer) => (
            <div 
              key={offer.id} 
              className="min-w-[220px] snap-start bg-[#291C08] rounded-3xl shadow-md pl-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-white">{offer.title}</h4>
                <img 
                  src={offer.image} 
                  alt={offer.title} 
                  className="w-[7rem] h-28" 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Products Sections */}
      <ProductsByCat title="Millet Specific" cat="Millet" onAddToCart={handleAddToCart} />
      <ProductsByCat title="Beverages" cat="Beverage" onAddToCart={handleAddToCart} />
      <ProductsByCat title="Snacks" cat="Snacks" onAddToCart={handleAddToCart} />
      <ProductsByCat title="Dessert" cat="Dessert" onAddToCart={handleAddToCart} />
      <ProductsByCat title="Fast Food" cat="Fast Food" onAddToCart={handleAddToCart} />

      {/* Render the cart pane fixed at the bottom */}
      <CartPane 
        cartItems={cartItems} 
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
        onRemove={handleRemove}
      />

      {/* millet shakti program */}
      <MissionShaktiCard/>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;