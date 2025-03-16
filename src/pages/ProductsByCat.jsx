import React, { useState, useEffect } from 'react';


const ProductsByCat = () => {
  const [time, setTime] = useState('11:20');
  const [batteryLevel, setBatteryLevel] = useState('68%');
  
  const categories = [
    { name: 'Millet', icon: '🌾' },
    { name: 'Beverages', icon: '🥤' },
    { name: 'Baked', icon: '🍞' },
    { name: 'Snacks', icon: '🍿' }
  ];
  
  const foodItems = [
    { id: 1, name: 'Papad', price: 30, imageUrl: '/api/placeholder/120/120' },
    { id: 2, name: 'Jalebi', price: 45, imageUrl: '/api/placeholder/120/120' },
    { id: 3, name: 'Laddos', price: 30, imageUrl: '/api/placeholder/120/120' },
    { id: 4, name: 'Cookies', price: 45, imageUrl: '/api/placeholder/120/120' }
  ];
  
  const [selectedCategory, setSelectedCategory] = useState('Millet');
  return (
    <div className="min-h-screen bg-[url('./resources/homepage/Homepage.png')] bg-cover bg-center">
        {/* start writing your code here */}
      <div className="flex justify-between items-center px-4 py-1 text-sm">
        <div>{time}</div>
        <div className="flex items-center gap-2">
          <span className="text-xs">📶</span>
          <span className="text-xs">📡</span>
          <span className="text-xs">{batteryLevel}</span>
        </div>
      </div>
      
      {/* Search Header */}
      <div className="flex items-center px-4 py-2 gap-3">
        <button className="text-amber-800 text-xl">
          &lt;
        </button>
        <div className="flex-1 bg-gray-200 rounded-full px-4 py-1 flex items-center gap-2">
          <span className="text-gray-500">🔍</span>
          <span className="text-gray-800 font-medium">Millet</span>
        </div>
        <button className="text-xl text-gray-700">
          👤
        </button>
      </div>
      
      {/* Search Results Count */}
      <div className="px-4 py-2 text-sm text-gray-700">
        4 items found:
      </div>
      
      {/* Main Content - Split View */}
      <div className="flex flex-1 overflow-hidden">
        {/* Categories Sidebar */}
        <div className="w-24 border-r border-amber-200 flex flex-col">
          {categories.map((category) => (
            <div 
              key={category.name}
              className={`p-2 flex flex-col items-center justify-center h-16 cursor-pointer ${
                selectedCategory === category.name ? 'bg-amber-100' : ''
              }`}
              onClick={() => setSelectedCategory(category.name)}
            >
              <div className="h-10 w-10 bg-amber-100 rounded-md mb-1 flex items-center justify-center">
                {category.name === 'Millet' && 
                  <img src="/api/placeholder/40/40" alt="Millet" className="h-8 w-8 rounded" />
                }
                {category.name === 'Beverages' && 
                  <img src="/api/placeholder/40/40" alt="Beverages" className="h-8 w-8 rounded" />
                }
                {category.name === 'Baked' && 
                  <img src="/api/placeholder/40/40" alt="Baked" className="h-8 w-8 rounded" />
                }
                {category.name === 'Snacks' && 
                  <img src="/api/placeholder/40/40" alt="Snacks" className="h-8 w-8 rounded" />
                }
              </div>
              <span className="text-xs font-medium">{category.name}</span>
            </div>
          ))}
        </div>
        
        {/* Food Grid */}
        <div className="flex-1 grid grid-cols-2 gap-px bg-amber-100">
          {foodItems.map((item) => (
            <div key={item.id} className="bg-amber-50 p-4 flex flex-col items-center">
              <img src={item.imageUrl} alt={item.name} className="h-16 w-16 rounded-md mb-2" />
              <div className="text-sm font-medium">{item.name}</div>
              <div className="flex items-center justify-between w-full mt-1">
                <span className="text-sm">₹{item.price}</span>
                <button className="bg-amber-800 text-white text-xs px-4 py-1 rounded-md">
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsByCat