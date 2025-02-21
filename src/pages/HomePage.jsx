import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { FaChevronLeft } from "react-icons/fa6";
import banner1 from '../resources/homepage/banner1.png';
import banner2 from '../resources/homepage/ShaktiSaathi.png';
import ProductsByCat from '../components/homepage/ProductsByCat';
import Footer from '../components/footer/Footer';

const HomePage = () => {
  // Carousel slides (for example)
  const slides = [
    { image: banner1, alt: 'Banner 1', title: 'Welcome to Millet Hub Cafe', subtitle: '' },
    { image: banner2, alt: 'Banner 2', title: 'Title for Banner 2', subtitle: 'Subtitle for Banner 2' },
  ];

  // Sample offers
  const offers = [
    { id: 1, title: "Order Now!!!", image: banner1 },
    { id: 2, title: "Flat ₹50 Off", image: banner2 },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // <-- NEW: track user input
  const [searchTerm, setSearchTerm] = useState("");

  // React Router hook for navigation
  const navigate = useNavigate();

  // Dummy data for recent and popular searches
  const recentSearches = ["Samosa", "Jalebi", "Cupcakes"];
  const popularSearches = ["Samosa", "Cupcakes", "Jalebi"];

  // Function to handle search
  const handleSearch = () => {
    // If there's something typed, navigate to /search?query=...
    if (searchTerm.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
      setSearchOpen(false);  // Close the overlay
    }
  };

  // If you also want to automatically navigate when pressing Enter:
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

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
            {/* Dropdown Menu Example */}
            {menuOpen && (
              <div className="absolute top-12 left-0 w-48 bg-white/30 backdrop-blur-lg border border-white/40 rounded-lg shadow-lg z-50">
                <ul className="text-black text-sm">
                  <li className="px-4 py-2 hover:bg-white/50 cursor-pointer rounded-t-lg transition-all">
                    My Profile
                  </li>
                  <li className="px-4 py-2 hover:bg-white/50 cursor-pointer transition-all">
                    Previous Orders
                  </li>
                  <li className="px-4 py-2 hover:bg-white/50 cursor-pointer rounded-b-lg transition-all">
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

      {/* Search Overlay (Full Screen) */}
      {searchOpen && (
        <div 
          className="fixed inset-0 z-[999] flex flex-col bg-[url('./resources/homepage/Homepage.png')] bg-cover bg-center"
          style={{ backgroundColor: '#F8EDD6' }} // Fallback background color
        >
          {/* Top Bar with Search Input */}
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
              value={searchTerm}               // bind state
              onChange={(e) => setSearchTerm(e.target.value)}  // update state
              onKeyDown={handleKeyDown}        // handle Enter key
              className="w-3/4 px-3 py-2 border border-gray-300 rounded-full focus:outline-none"
            />
            {/* Optional Search Button */}
            <button 
              onClick={handleSearch}
              className="ml-2 bg-[#291C08] text-white px-4 py-2 rounded-full"
            >
              Search
            </button>
          </div>

          {/* Body of the Search Screen */}
          <div className="p-4 overflow-auto">
            {/* Recent Searches */}
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

            {/* Popular Searches */}
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

      {/* Millet Specific Products Section */}
      <ProductsByCat title="Millet Specific" cat="Millet"/>
      <ProductsByCat title="Beverages" cat="Beverage"/>
      <ProductsByCat title="Snacks" cat="Snacks"/>
      <ProductsByCat title="Dessert" cat="Dessert"/>
      <ProductsByCat title="Fast Food" cat="Fast Food"/>


      {/* misson shakti support code here */}
      

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default HomePage;