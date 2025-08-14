import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaChevronLeft, FaSearch, FaBoxOpen } from 'react-icons/fa';
import Skeleton from '@mui/material/Skeleton';
import CartPane from '../components/homepage/CartPane';
import { CgProfile } from 'react-icons/cg';

const API_URL = import.meta.env.VITE_API_URL;

// --- Mock Data (from your reference, used as fallback) ---
const predefinedProducts = {
    'Millet': [{ prodId: 1, prodName: 'Millet Flour', price: 50, prodImg: 'https://images.unsplash.com/photo-1627485718909-503c7a0e5b12?q=80&w=2940&auto=format&fit=crop' }, { prodId: 2, prodName: 'Millet Bread', price: 30, prodImg: 'https://images.unsplash.com/photo-1598373182133-5b681a2517b7?q=80&w=2940&auto=format&fit=crop' }],
    'Beverages': [{ prodId: 3, prodName: 'Millet Smoothie', price: 45, prodImg: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=2836&auto=format&fit=crop' }, { prodId: 4, prodName: 'Herbal Tea', price: 25, prodImg: 'https://images.unsplash.com/photo-1576092762791-ddc29a265e58?q=80&w=2940&auto=format&fit=crop' }],
    'Snacks': [{ prodId: 5, prodName: 'Millet Chips', price: 35, prodImg: 'https://images.unsplash.com/photo-1599232581043-40019e078234?q=80&w=2803&auto=format&fit=crop' }, { prodId: 6, prodName: 'Roasted Nuts', price: 40, prodImg: 'https://images.unsplash.com/photo-1608772388049-55e433a72a17?q=80&w=2940&auto=format&fit=crop' }],
    'Dessert': [{ prodId: 7, prodName: 'Millet Cake', price: 60, prodImg: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=2850&auto=format&fit=crop' }, { prodId: 8, prodName: 'Fruit Tart', price: 55, prodImg: 'https://images.unsplash.com/photo-1562440102-395a4a4022a2?q=80&w=2864&auto=format&fit=crop' }],
    'Fast Food': [{ prodId: 9, prodName: 'Millet Burger', price: 70, prodImg: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=2942&auto=format&fit=crop' }, { prodId: 10, prodName: 'Veggie Pizza', price: 80, prodImg: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=2881&auto=format&fit=crop' }]
};

// --- Sub-component for Skeleton Loading Card ---
const ProductCardSkeleton = () => (
    <div className="bg-white/30 backdrop-blur-lg rounded-2xl p-4 shadow-lg">
        <Skeleton variant="rectangular" width="100%" height={128} className="rounded-xl" />
        <Skeleton variant="text" width="80%" height={28} className="mt-4" />
        <Skeleton variant="text" width="50%" height={20} className="mt-1" />
        <div className="flex justify-between items-center mt-4">
            <Skeleton variant="text" width="30%" height={32} />
            <Skeleton variant="rectangular" width={90} height={36} className="rounded-full" />
        </div>
    </div>
);


const ProductsByCat = () => {
    const navigate = useNavigate();

    // Using the category data structure from your code
    const categories = [
        { name: 'Millet', icon: '/src/resources/categories/millet.png', apiPath: 'Millet' },
        { name: 'Beverages', icon: '/src/resources/categories/beverages.png', apiPath: 'Beverage' },
        { name: 'Snacks', icon: '/src/resources/categories/snacks.png', apiPath: 'Snacks' },
        { name: 'Dessert', icon: '/src/resources/categories/baked.png', apiPath: 'Dessert' },
        { name: 'Fast Food', icon: '/src/resources/categories/fast food.jpg', apiPath: 'Fast Food' }
    ];

    const user = {
        name: 'Jane Doe',
        profilePicture: '/api/placeholder/40/40'
    };

    const [selectedCategory, setSelectedCategory] = useState('Millet');
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cartItems, setCartItems] = useState(() => {
        try {
            const storedCart = localStorage.getItem('cartItems');
            return storedCart ? JSON.parse(storedCart) : [];
        } catch {
            return [];
        }
    });

    // Sync cart to localStorage
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    // Fetch products when category changes
    useEffect(() => {
        const controller = new AbortController(); 
        
        const fetchProducts = async () => {
            setLoading(true);
            const currentCategory = categories.find(cat => cat.name === selectedCategory);
            // Default to mock data
            let productsToSet = predefinedProducts[selectedCategory.replace(' ', '')] || [];

            if (currentCategory && API_URL) {
                try {
                    const fullUrl = `${API_URL}/products/cat/${currentCategory.apiPath}`;
                    const response = await axios.get(fullUrl, { timeout: 5000 });
                    if (Array.isArray(response.data)) {
                        productsToSet = response.data.map(product => ({
                            ...product,
                            prodName: product.prodName || 'Unnamed Product',
                            price: product.price || 0,
                            prodImg: product.prodImg || '/api/placeholder/120/120'
                        }));
                    }
                } catch (apiError) {
                    console.warn('API fetch failed, using predefined products', apiError);
                }
            }
            
            if (isMounted) {
                setProducts(productsToSet);
                setLoading(false);
            }
        };
        fetchProducts();
        
        return () => { 
            controller.abort(); 
        };
    }, [selectedCategory]);

    const getProductId = (product) => product._id || product.prodId;

    const handleAddToCart = (product) => {
        setCartItems(prev => {
            const productId = getProductId(product);
            const existing = prev.find(item => getProductId(item) === productId);
            if (existing) {
                return prev.map(item => getProductId(item) === productId ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const handleIncrease = (product) => {
        const productId = getProductId(product);
        setCartItems((prevItems = []) =>
            prevItems.map(item =>
                getProductId(item) === productId ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };
    
    const handleDecrease = (product) => {
        const productId = getProductId(product);
        setCartItems((prevItems = []) =>
            prevItems
                .map(item =>
                    getProductId(item) === productId ? { ...item, quantity: item.quantity - 1 } : item
                )
                .filter(item => item.quantity > 0)
        );
    };

    const handleRemove = (product) => {
        const productId = getProductId(product);
        setCartItems((prevItems = []) =>
            prevItems.filter(item => getProductId(item) !== productId)
        );
    };

    const filteredProducts = Array.isArray(products)
        ? products.filter(p => p && p.prodName && p.prodName.toLowerCase().includes(searchTerm.toLowerCase()))
        : [];

    const recentSearches = [`${selectedCategory} Smoothie`, `${selectedCategory} Special`, `Popular Items`];
    const popularSearches = [`Best of ${selectedCategory}`, `Top Choices`, `Favorites`];

    const handleSearch = (term) => {
        setSearchTerm(term);
        setSearchOpen(false);
    };

    return (
        <div className="flex flex-col h-screen bg-[url('/resources/homepage/Homepage.png')] bg-repeat">
            <div className="absolute inset-0 bg-amber-50 bg-opacity-90"></div>
            <div className="flex flex-col h-screen z-10 relative">
                <div className="flex items-center px-4 py-2 gap-3">
                    <button onClick={() => navigate(-1)} className="text-amber-800 text-2xl font-bold">
                        &lt;
                    </button>
                    {/* MODIFICATION: Changed bg and shadow for a deeper, softer look */}
                    <div className="flex-1 bg-slate-100 rounded-full px-4 py-2 flex items-center gap-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)]">
                        <span className="text-gray-500">🔍</span>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search items..."
                            className="bg-transparent outline-none flex-1 text-gray-800"
                            onFocus={() => setSearchOpen(true)}
                        />
                    </div>
                    <button className="w-9 h-9 rounded-full overflow-hidden">
                        <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                    </button>
                </div>
                
                <div className="px-4 py-2 text-sm text-gray-700">
                    {loading ? 'Finding items...' : `${filteredProducts.length} items found:`}
                </div>
                
                <div className="flex flex-1 overflow-hidden">
                    <div className="w-24 border-r border-amber-200 flex flex-col overflow-y-auto bg-amber-50 bg-opacity-50">
                        {categories.map((category) => (
                            <div key={category.name} className={`p-2 flex flex-col items-center justify-center h-20 cursor-pointer transition-colors duration-200 ${selectedCategory === category.name ? 'bg-amber-100' : 'hover:bg-amber-50'}`} onClick={() => setSelectedCategory(category.name)}>
                                <div className="h-10 w-10 rounded-md mb-1 flex items-center justify-center overflow-hidden">
                                    <img src={category.icon} alt={category.name} className="w-full h-full object-cover"/>
                                </div>
                                <span className="text-xs font-medium text-center">{category.name}</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="flex-1 bg-[url('./resources/homepage/Homepage.png')] bg-repeat bg-center overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center h-full"><p>Loading...</p></div>
                        ) : error ? (
                            <div className="flex items-center justify-center h-full text-red-500 p-4 text-center"><p>{error}</p></div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="flex items-center justify-center h-full"><p>No products found.</p></div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 p-4">
                                {filteredProducts.map((item) => (
                                    <div key={item.prodId} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
                                        <img src={item.prodImg} alt={item.prodName} className="h-24 w-24 rounded-md mb-2 object-cover"/>
                                        <div className="text-sm font-medium text-center mb-2">{item.prodName}</div>
                                        <div className="flex items-center justify-between w-full mt-auto">
                                            <span className="text-sm font-bold">₹{item.price}</span>
                                            <button className="bg-amber-800 text-white text-xs px-4 py-1 rounded-md" onClick={() => handleAddToCart(item)}>Add</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <CartPane cartItems={cartItems} onIncrease={handleIncrease} onDecrease={handleDecrease} onRemove={handleRemove}/>

                {searchOpen && (
                    <div className="fixed inset-0 z-[999] flex flex-col bg-[url('./resources/homepage/Homepage.png')] bg-cover bg-center" style={{ backgroundColor: '#F8EDD6' }}>
                        <div className="flex items-center p-4">
                            <button onClick={() => setSearchOpen(false)} className="text-xl font-semibold mr-2">&lt;</button>
                            <input type="text" placeholder={`Search ${selectedCategory}...`} autoFocus value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-3/4 px-3 py-2 border border-gray-300 rounded-full focus:outline-none"/>
                            <button onClick={() => setSearchOpen(false)} className="ml-2 bg-[#291C08] text-white px-4 py-2 rounded-full">Done</button>
                        </div>
                        <div className="p-4 overflow-auto">
                            <h2 className="text-lg font-semibold mb-2">Recent Searches</h2>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {recentSearches.map((item, idx) => (
                                    <span key={idx} className="px-3 py-1 rounded-full bg-[#291C08] text-white text-sm cursor-pointer" onClick={() => handleSearch(item)}>{item}</span>
                                ))}
                            </div>
                            <h2 className="text-lg font-semibold mb-2">Popular Searches</h2>
                            <div className="flex flex-wrap gap-2">
                                {popularSearches.map((item, idx) => (
                                    <span key={idx} className="px-3 py-1 rounded-full bg-[#291C08] text-white text-sm cursor-pointer" onClick={() => handleSearch(item)}>{item}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <CartPane cartItems={cartItems} onIncrease={handleIncrease} onDecrease={handleDecrease} onRemove={handleRemove} />
        </div>
    );
};

export default ProductsByCat;