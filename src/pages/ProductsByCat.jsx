import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CartPane from '../components/homepage/CartPane';
import { CgProfile } from 'react-icons/cg';

const API_URL = import.meta.env.VITE_API_URL;

// Predefined products for fallback
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
    const navigate = useNavigate();

    const categories = [
        { name: 'Millet', icon: '/src/resources/categories/millet.png', apiPath: 'Millet' },
        { name: 'Beverages', icon: '/src/resources/categories/beverages.png', apiPath: 'Beverage' },
        { name: 'Snacks', icon: '/src/resources/categories/snacks.png', apiPath: 'Snacks' },
        { name: 'Desserts', icon: '/src/resources/categories/baked.png', apiPath: 'Dessert' },
        { name: 'Fast Foods', icon: '/src/resources/categories/fast food.jpg', apiPath: 'Fast Food' }
    ];
    
    const userInfo = {
        user: { name: 'Jane Doe' }
    };

    const [selectedCategory, setSelectedCategory] = useState('Millet');
    const [searchTerm, setSearchTerm] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchOpen, setSearchOpen] = useState(false);

    useEffect(() => {
        try {
            const storedCart = localStorage.getItem('cartItems');
            if (storedCart) {
                const parsedCart = JSON.parse(storedCart);
                if (Array.isArray(parsedCart)) setCartItems(parsedCart);
            }
        } catch {
            console.warn("Could not parse cart items from localStorage.");
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        const controller = new AbortController(); 
        
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            
            const currentCategory = categories.find(cat => cat.name === selectedCategory);
            const fallbackProducts = predefinedProducts[selectedCategory] || [];
            let productsToSet = fallbackProducts;

            if (currentCategory && API_URL) {
                try {
                    const fullUrl = `${API_URL}/products/cat/${currentCategory.apiPath}`;
                    const response = await axios.get(fullUrl, { timeout: 5000, signal: controller.signal });
                    if (Array.isArray(response.data)) {
                        productsToSet = response.data.map(product => ({
                            ...product,
                            prodName: product.prodName || 'Unnamed Product',
                            price: product.price || 0,
                            prodImg: product.prodImg || '/api/placeholder/120/120'
                        }));
                    }
                } catch (apiError) {
                    if (axios.isCancel(apiError)) {
                        console.log('Request canceled:', apiError.message);
                    } else {
                        console.warn('API fetch failed, using predefined products', apiError);
                        setError('Could not fetch latest items. Showing available products.');
                    }
                }
            }
            
            setProducts(productsToSet);
            setLoading(false);
        };
        fetchProducts();
        
        return () => { 
            controller.abort(); 
        };
    }, [selectedCategory]);

    const getProductId = (product) => product._id || product.prodId;

    const handleAddToCart = (product) => {
        setCartItems((prevItems = []) => {
            const productId = getProductId(product);
            const existing = prevItems.find(item => getProductId(item) === productId);
            if (existing) {
                return prevItems.map(item =>
                    getProductId(item) === productId ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevItems, { ...product, quantity: 1 }];
        });
    };

    const handleIncrease = (product) => {
        const productId = getProductId(product);
        setCartItems(prevItems => prevItems.map(item => 
            getProductId(item) === productId ? { ...item, quantity: item.quantity + 1 } : item
        ));
    };

    const handleDecrease = (product) => {
        const productId = getProductId(product);
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => getProductId(item) === productId);
            if (existingItem && existingItem.quantity > 1) {
                return prevItems.map(item => 
                    getProductId(item) === productId ? { ...item, quantity: item.quantity - 1 } : item
                );
            }
            return prevItems.filter(item => getProductId(item) !== productId);
        });
    };

    const handleRemove = (product) => {
        const productId = getProductId(product);
        setCartItems(prevItems => prevItems.filter(item => getProductId(item) !== productId));
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
    
    const renderProfilePicture = () => {
        if (userInfo?.user?.avatar) {
            return (
                <img
                    src={userInfo.user.avatar}
                    alt="Profile"
                    className="size-8 rounded-full object-cover"
                />
            );
        } else if (userInfo?.user?.name) {
            const initials = userInfo.user.name
                .split(' ')
                .map(name => name[0])
                .join('')
                .toUpperCase();
            return (
                <div className="size-8 rounded-full bg-[#291C08] text-white flex items-center justify-center font-bold text-sm">
                    {initials}
                </div>
            );
        } else {
            return (
                <div className="bg-[#291C08] p-2 rounded-full shadow-md">
                    <CgProfile className="text-4xl text-white" />
                </div>
            );
        }
    };

    return (
        <div className="min-h-screen bg-[url('./resources/homepage/Homepage.png')] bg-cover bg-center px-4 pb-8">
            <div className="flex flex-col h-screen relative">
                
                <header className="flex items-center py-2 gap-3">
                    <button onClick={() => navigate(-1)} className="text-amber-800 text-2xl font-bold">
                        &lt;
                    </button>
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => setSearchOpen(true)}
                            className="w-full px-3 py-1.5 bg-white/30 backdrop-blur-md border border-white/40 text-black placeholder-black rounded-full focus:outline-none focus:ring-2 focus:ring-[#291C08]"
                        />
                    </div>
                    <div className="z-50">
                        {renderProfilePicture()}
                    </div>
                </header>
                
                <div className="py-2 text-sm text-gray-700">
                    {loading ? 'Finding items...' : `${filteredProducts.length} items found:`}
                    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
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
                    
                    <main className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center h-full"><p>Loading...</p></div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="flex items-center justify-center h-full"><p>No products found.</p></div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                {filteredProducts.map((item) => (
                                    <div key={getProductId(item)} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
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
                    </main>
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
        </div>
    );
};

export default ProductsByCat;