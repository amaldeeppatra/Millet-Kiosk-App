import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CartPane from '../components/homepage/CartPane'; // Ensure this import path is correct

const API_URL = import.meta.env.VITE_API_URL;

// Predefined products as a fallback
const predefinedProducts = {
  'Millet': [
    { prodId: 1, prodName: 'Millet Flour', price: 50, prodImg: '/api/placeholder/120/120' },
    { prodId: 2, prodName: 'Millet Bread', price: 30, prodImg: '/api/placeholder/120/120' }
  ],
  'Beverages': [
    { prodId: 3, prodName: 'Millet Smoothie', price: 45, prodImg: '/api/placeholder/120/120' },
    { prodId: 4, prodName: 'Herbal Tea', price: 25, prodImg: '/api/placeholder/120/120' }
  ],
  'Snacks': [
    { prodId: 5, prodName: 'Millet Chips', price: 35, prodImg: '/api/placeholder/120/120' },
    { prodId: 6, prodName: 'Roasted Nuts', price: 40, prodImg: '/api/placeholder/120/120' }
  ],
  'Desserts': [
    { prodId: 7, prodName: 'Millet Cake', price: 60, prodImg: '/api/placeholder/120/120' },
    { prodId: 8, prodName: 'Fruit Tart', price: 55, prodImg: '/api/placeholder/120/120' }
  ],
  'Fast Foods': [
    { prodId: 9, prodName: 'Millet Burger', price: 70, prodImg: '/api/placeholder/120/120' },
    { prodId: 10, prodName: 'Veggie Pizza', price: 80, prodImg: '/api/placeholder/120/120' }
  ]
};

const ProductsByCat = () => {
  const categories = [
    { name: 'Millet', icon: '🌾', apiPath: 'Millet' },
    { name: 'Beverages', icon: '🥤', apiPath: 'Beverage' },
    { name: 'Snacks', icon: '🍿', apiPath: 'Snacks' },
    { name: 'Desserts', icon: '🍰', apiPath: 'Dessert' },
    { name: 'Fast Foods', icon: '🍕', apiPath: 'Fast Food' }
  ];

  const [selectedCategory, setSelectedCategory] = useState('Millet');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  
  // Retrieve cart items from localStorage on component mount
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
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      const currentCategory = categories.find(cat => cat.name === selectedCategory);
      
      if (!currentCategory) {
        console.error('Category not found');
        setProducts([]);
        setLoading(false);
        return;
      }
      
      try {
        const fullUrl = `${API_URL}/products/cat/${currentCategory.apiPath}`;
        console.log(`Fetching products from: ${fullUrl}`);
        
        try {
          const response = await axios.get(fullUrl);
          console.log('API Response:', response.data);
          
          const fetchedProducts = response.data && Array.isArray(response.data) 
            ? response.data.map(product => ({
                ...product,
                prodName: product.prodName || 'Unnamed Product',
                price: product.price || 0,
                prodImg: product.prodImg || '/api/placeholder/120/120'
              }))
            : [];
          
          setProducts(fetchedProducts);
          setLoading(false);
        } catch (apiError) {
          console.warn('API fetch failed, using predefined products', apiError);
          const fallbackProducts = predefinedProducts[selectedCategory] || [];
          setProducts(fallbackProducts);
          setLoading(false);
        }
      } catch (err) {
        console.error('Fetch Error:', err);
        const fallbackProducts = predefinedProducts[selectedCategory] || [];
        setProducts(fallbackProducts);
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [selectedCategory]);
  
  // Utility function to get product ID
  const getProductId = (product) => product._id || product.prodId;
  
  // Cart utility functions
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
          prodId: product.prodId,
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
  
  // Safe filtering of products
  const filteredProducts = (products || []).filter(product => 
    product && 
    product.prodName && 
    product.prodName.toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  // Recent and popular searches
  const recentSearches = [
    `${selectedCategory} Smoothie`, 
    `${selectedCategory} Special`, 
    `Popular ${selectedCategory} Items`
  ];
  const popularSearches = [
    `Best ${selectedCategory}`, 
    `${selectedCategory} Favorites`, 
    `Top ${selectedCategory} Products`
  ];

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    setSearchOpen(false);
  };

  return (
    <div className="flex flex-col h-screen bg-[url('/resources/homepage/Homepage.png')] bg-repeat">
      <div className="absolute inset-0 bg-amber-50 bg-opacity-90"></div>
      
      <div className="flex flex-col h-screen z-10 relative">
        {/* Search Header */}
        <div className="flex items-center px-4 py-2 gap-3">
          <button className="text-amber-800 text-xl">
            &lt;
          </button>
          <div className="flex-1 bg-gray-200 rounded-full px-4 py-1 flex items-center gap-2">
            <span className="text-gray-500">🔍</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search items..."
              className="bg-transparent outline-none flex-1 text-gray-800"
              onClick={() => setSearchOpen(true)}
            />
          </div>
          <button className="text-xl text-gray-700">
            👤
          </button>
        </div>
        
        {/* Search Results Count */}
        <div className="px-4 py-2 text-sm text-gray-700">
          {loading ? 'Loading...' : `${filteredProducts.length} items found:`}
        </div>
        
        {/* Main Content - Split View */}
        <div className="flex flex-1 overflow-hidden">
          {/* Categories Sidebar */}
          <div className="w-24 border-r border-amber-200 flex flex-col overflow-y-auto bg-amber-50 bg-opacity-50">
            {categories.map((category) => (
              <div 
                key={category.name}
                className={`p-2 flex flex-col items-center justify-center h-16 cursor-pointer ${
                  selectedCategory === category.name ? 'bg-amber-100' : ''
                }`}
                onClick={() => {
                  setSelectedCategory(category.name);
                  setSearchTerm('');
                }}
              >
                <div className="h-10 w-10 bg-amber-100 rounded-md mb-1 flex items-center justify-center">
                  <span className="text-xl">{category.icon}</span>
                </div>
                <span className="text-xs font-medium">{category.name}</span>
              </div>
            ))}
          </div>
          
          {/* Food Grid */}
          <div className="flex-1 bg-[url('./resources/homepage/Homepage.png')] bg-no-repeat bg-cover bg-center overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p>Loading products...</p>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full text-red-500 p-4 text-center">
                <p>Error: {error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-2 bg-red-100 px-4 py-2 rounded"
                >
                  Retry
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p>No products found in this category</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 p-4">
                {filteredProducts.map((item) => (
                  <div 
                    key={item.prodId} 
                    className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center"
                  >
                    <img 
                      src={item.prodImg || '/api/placeholder/120/120'} 
                      alt={item.prodName} 
                      className="h-24 w-24 rounded-md mb-2 object-cover" 
                    />
                    <div className="text-sm font-medium text-center mb-2">{item.prodName}</div>
                    <div className="flex items-center justify-between w-full mt-auto">
                      <span className="text-sm font-bold">₹{item.price}</span>
                      <button 
                        className="bg-amber-800 text-white text-xs px-4 py-1 rounded-md"
                        onClick={() => handleAddToCart(item)}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Render the cart pane fixed at the bottom */}
        <CartPane 
          cartItems={cartItems} 
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          onRemove={handleRemove}
        />

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
                &lt;
              </button>
              <input
                type="text"
                placeholder={`Search ${selectedCategory}...`}
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-3/4 px-3 py-2 border border-gray-300 rounded-full focus:outline-none"
              />
              <button 
                onClick={() => setSearchOpen(false)}
                className="ml-2 bg-[#291C08] text-white px-4 py-2 rounded-full"
              >
                Done
              </button>
            </div>
            <div className="p-4 overflow-auto">
              <h2 className="text-lg font-semibold mb-2">Recent Searches</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {recentSearches.map((item, idx) => (
                  <span 
                    key={idx} 
                    className="px-3 py-1 rounded-full bg-[#291C08] text-white text-sm cursor-pointer"
                    onClick={() => handleSearch(item)}
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
                    onClick={() => handleSearch(item)}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsByCat;