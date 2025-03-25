import React, { useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

// Predefined products as a fallback
const predefinedProducts = {
  'Millet': [
    { id: 1, name: 'Millet Flour', price: 50, imageUrl: '/api/placeholder/120/120' },
    { id: 2, name: 'Millet Bread', price: 30, imageUrl: '/api/placeholder/120/120' }
  ],
  'Beverages': [
    { id: 3, name: 'Millet Smoothie', price: 45, imageUrl: '/api/placeholder/120/120' },
    { id: 4, name: 'Herbal Tea', price: 25, imageUrl: '/api/placeholder/120/120' }
  ],
  'Snacks': [
    { id: 5, name: 'Millet Chips', price: 35, imageUrl: '/api/placeholder/120/120' },
    { id: 6, name: 'Roasted Nuts', price: 40, imageUrl: '/api/placeholder/120/120' }
  ],
  'Desserts': [
    { id: 7, name: 'Millet Cake', price: 60, imageUrl: '/api/placeholder/120/120' },
    { id: 8, name: 'Fruit Tart', price: 55, imageUrl: '/api/placeholder/120/120' }
  ],
  'Fast Foods': [
    { id: 9, name: 'Millet Burger', price: 70, imageUrl: '/api/placeholder/120/120' },
    { id: 10, name: 'Veggie Pizza', price: 80, imageUrl: '/api/placeholder/120/120' }
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
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
                name: product.prodName || 'Unnamed Product',
                price: product.price || 0,
                imageUrl: product.prodImg || '/api/placeholder/120/120'
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
  
  const addToCart = (item) => {
    setCart([...cart, item]);
  };
  
  // Safe filtering of products
  const filteredProducts = (products || []).filter(product => 
    product && 
    product.name && 
    product.name.toLowerCase().includes((searchTerm || '').toLowerCase())
  );
  
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
                    key={item.id} 
                    className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center"
                  >
                    <img 
                      src={item.imageUrl || '/api/placeholder/120/120'} 
                      alt={item.name} 
                      className="h-24 w-24 rounded-md mb-2 object-cover" 
                    />
                    <div className="text-sm font-medium text-center mb-2">{item.name}</div>
                    <div className="flex items-center justify-between w-full mt-auto">
                      <span className="text-sm font-bold">₹{item.price}</span>
                      <button 
                        className="bg-amber-800 text-white text-xs px-4 py-1 rounded-md"
                        onClick={() => addToCart(item)}
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
      </div>
    </div>
  );
};

export default ProductsByCat;