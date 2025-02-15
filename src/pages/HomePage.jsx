import React, { useState, useEffect, useRef } from 'react';
import { CgProfile } from "react-icons/cg";
import banner1 from '../resources/homepage/banner1.png';
import banner2 from '../resources/homepage/ShaktiSaathi.png';
// import missionshaktisupport from '../resources/homepage/missionshaktisupport.png';
// import ProductsByCat from '../components/homepage/ProductsByCat';
// import Footer from '../components/homepage/Footer';

const HomePage = () => {
  // Main carousel slides
  const slides = [
    { image: banner1, alt: 'Banner 1', title: 'Welcome to Millet Hub Cafe', subtitle: '' },
    { image: banner2, alt: 'Banner 2', title: 'Title for Banner 2', subtitle: 'Subtitle for Banner 2' },
    { image: banner1, alt: 'Banner 3', title: 'Title for Banner 3', subtitle: 'Subtitle for Banner 3' },
  ];

  // Products for the "Millet Specific" section – note the added "image" property
  const offers = [
    { id: 1, title: "Order Now!!!", image: banner1 },
    { id: 2, title: "Flat ₹50 Off", image: banner2 },
    { id: 3, title: "15% Discount", image: banner1 }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Automatic carousel slide change every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Close hamburger menu if click occurs outside its area
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative min-h-screen bg-no-repeat bg-cover bg-center bg-[url('./resources/homepage/Homepage.png')]">
      {/* Navbar */}
      <header className="bg-opacity-90 p-4 relative z-50">
        <nav className="flex items-center justify-between relative">
          {/* Hamburger Menu */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setMenuOpen(!menuOpen)} 
              className="flex flex-col space-y-1 focus:outline-none bg-[#291C08] p-2 rounded-md z-50 relative"
            >
              <span className="block w-4 h-0.5 bg-white"></span>
              <span className="block w-4 h-0.5 bg-white"></span>
              <span className="block w-4 h-0.5 bg-white"></span>
            </button>

            {/* Dropdown Menu (Glassmorphism) */}
            {menuOpen && (
              <div className="absolute top-12 left-0 w-48 bg-white/30 backdrop-blur-lg border border-white/40 rounded-lg shadow-lg z-50 animate-fade-in">
                <ul className="text-black text-sm">
                  <li 
                    className="px-4 py-2 hover:bg-white/50 cursor-pointer rounded-t-lg transition-all"
                    onClick={() => alert('Go to Profile')}
                  >
                    My Profile
                  </li>
                  <li 
                    className="px-4 py-2 hover:bg-white/50 cursor-pointer transition-all"
                    onClick={() => alert('Go to Previous Orders')}
                  >
                    Previous Orders
                  </li>
                  <li 
                    className="px-4 py-2 hover:bg-white/50 cursor-pointer rounded-b-lg transition-all"
                    onClick={() => alert('Logging Out')}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Search Bar with Glassmorphism */}
          <div className="flex-1 mx-4">
            <input
              type="text"
              placeholder="🔍"
              className="
                w-full px-3 py-1 
                bg-white/30 backdrop-blur-md border border-white/40 
                text-black placeholder-black 
                rounded-[70px]
                focus:outline-none focus:ring-2 focus:ring-[#291C08]
              "
            />
          </div>

          {/* Profile Icon */}
          <div className="z-50">
            <CgProfile 
              style={{ 
                fontSize: '2rem', 
                backgroundColor: '#291C08', 
                color: 'white', 
                borderRadius: '50px', 
                padding: '2px' 
              }} 
            />
          </div>
        </nav>
      </header>

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

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-[#666666] opacity-50 z-5 rounded-b-[50px]"></div>

        {/* Dots (Carousel Indicators) */}
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

        {/* Dynamic Text on the Bottom Left */}
        <div className="absolute bottom-10 left-4 z-10">
          <h2 className="text-white text-[2rem] font-bold drop-shadow-lg">
            {slides[currentSlide].title}
          </h2>
          <p className="text-white text-sm drop-shadow-lg">
            {slides[currentSlide].subtitle}
          </p>
        </div>
      </div>


    </div>
  );
};

export default HomePage;