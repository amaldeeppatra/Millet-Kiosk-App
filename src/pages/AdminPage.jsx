import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import ParseJwt from "../utils/ParseJWT";
import axios from "axios";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaBell,
  FaCheck,
  FaTimes,
  FaImage,
} from "react-icons/fa";
import Skeleton from "@mui/material/Skeleton";

const API_URL = import.meta.env.VITE_API_URL;

const AdminPage = () => {
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

    return (
        <div className="flex min-h-screen bg-background">
                {/* Dynamic Content Area */}
                <div className="w-full">
                    {/* React Router will render the matching child route component here */}
                    <Outlet />
                </div>
        </div>
    );
};

export default AdminPage;
