import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/seller/Sidebar';
import { FiLogOut } from "react-icons/fi";
import Cookies from 'js-cookie';
import ParseJwt from '../utils/ParseJWT';

const SellerPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userInfo, setUserInfo] = useState(null);

    // Extract token from query parameters and store it in cookies
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tokenFromUrl = queryParams.get('token');
        if (tokenFromUrl) {
            Cookies.set('token', tokenFromUrl, { secure: true, sameSite: 'none', expires: 1 / 48 }); // 30 minutes expiration
            navigate(location.pathname, { replace: true });
        }
        const token = Cookies.get('token');
        if (token) {
            try {
                const decoded = ParseJwt(token);
                setUserInfo(decoded);
                console.log('Decoded user info:', decoded);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        } else {
            // Redirect to login if no token found
            navigate('/login');
        }
    }, [location, navigate]);

    const handleLogout = () => {
        Cookies.remove('token');
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-text-dark">Welcome, {userInfo?.user?.name} 👋</h2>
                        <p className="text-text-light">
                            Today is {new Date().toLocaleDateString('en-US', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
                        >
                            <FiLogOut className="text-lg" />
                            <span>Logout</span>
                        </button>
                    </div>
                </header>
                {/* Dynamic Content Area */}
                <div className="w-full">
                    {/* React Router will render the matching child route component here */}
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default SellerPage;