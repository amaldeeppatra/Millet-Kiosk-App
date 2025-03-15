import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaEdit, FaBox, FaSignOutAlt, FaBell } from 'react-icons/fa';
import { CgProfile } from "react-icons/cg";
import axios from 'axios';
import Cookies from 'js-cookie';
import Skeleton from '@mui/material/Skeleton';
import ParseJwt from '../utils/ParseJWT';
import Footer from '../components/footer/Footer';

const API_URL = import.meta.env.VITE_API_URL;

const MyProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
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
    
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleLogout = () => {
    // Clear cookies and local storage
    Cookies.remove('token');
    
    // Redirect to login page
    navigate('/login');
  };

  // Function to render profile picture
  const renderProfilePicture = () => {
    if (userInfo?.user?.avatar) {
      // If profile picture exists in the token, display it
      return (
        <img 
          src={userInfo.user.avatar} 
          alt="Profile"
          className="w-14 h-14 rounded-full object-cover"
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
        <div className="w-14 h-14 bg-[#291C08] rounded-full flex items-center justify-center text-white text-xl font-bold">
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[url('./resources/homepage/Homepage.png')] bg-cover bg-center p-4">
        <div className="pt-8 pb-4 flex items-center">
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="text" width="70%" height={40} className="ml-4" />
        </div>
        <div className="bg-white/30 backdrop-blur-lg rounded-3xl p-6 shadow-lg mt-4">
          <Skeleton variant="text" width="40%" height={30} />
          <Skeleton variant="text" width="60%" height={30} />
          <Skeleton variant="text" width="80%" height={30} />
          <Skeleton variant="rectangular" width="100%" height={150} className="mt-4 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('./resources/homepage/Homepage.png')] bg-cover bg-center">
      {/* Header */}
      <div className="pt-8 pb-4 px-4 flex items-center">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 bg-[#291C08] rounded-full text-white mr-4"
        >
          <FaChevronLeft />
        </button>
        <h1 className="text-2xl font-bold text-[#291C08] flex-1">My Profile</h1>
      </div>

      {/* Profile Header Card */}
      <div className="mx-4 bg-white/30 backdrop-blur-lg rounded-3xl p-6 shadow-lg">
        <div className="flex items-center">
          {renderProfilePicture()}
          <div className="ml-4">
            <h2 className="text-xl font-bold text-[#291C08]">{userInfo?.user?.name || 'User'}</h2>
            <p className="text-[#291C08]/80">{userInfo?.user?.email || 'email@example.com'}</p>
          </div>
          <button 
            className="ml-auto p-2 bg-[#291C08] rounded-full text-white"
            onClick={() => setActiveTab('edit')}
          >
            <FaEdit />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mt-6 px-4 flex space-x-2">
        <button 
          className={`flex-1 py-3 rounded-t-lg font-medium text-center transition-colors ${
            activeTab === 'profile' 
              ? 'bg-white/30 backdrop-blur-lg text-[#291C08] border-b-2 border-[#291C08]' 
              : 'bg-white/10 backdrop-blur-lg text-[#291C08]/70'
          }`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button 
          className={`flex-1 py-3 rounded-t-lg font-medium text-center transition-colors ${
            activeTab === 'orders' 
              ? 'bg-white/30 backdrop-blur-lg text-[#291C08] border-b-2 border-[#291C08]' 
              : 'bg-white/10 backdrop-blur-lg text-[#291C08]/70'
          }`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </div>

      {/* Content Area */}
      <div className="min-h-[400px] mx-4 bg-white/30 backdrop-blur-lg rounded-b-3xl p-6 shadow-lg">
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Personal Info */}
            <div>
              <h3 className="text-lg font-semibold text-[#291C08] mb-3 border-b border-[#291C08]/30 pb-2">
                Personal Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-[#291C08]/70">Full Name</p>
                  <p className="font-medium">{userInfo?.user?.name || 'User Name'}</p>
                </div>
                <div>
                  <p className="text-sm text-[#291C08]/70">Email</p>
                  <p className="font-medium">{userInfo?.user?.email || 'email@example.com'}</p>
                </div>
                <div>
                  <p className="text-sm text-[#291C08]/70">Phone</p>
                  <p className="font-medium">{userInfo?.user?.phone || 'Not provided'}</p>
                </div>
                {userInfo?.user?.address && (
                  <div>
                    <p className="text-sm text-[#291C08]/70">Address</p>
                    <p className="font-medium">{userInfo.user.address}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Preferences */}
            <div>
              <h3 className="text-lg font-semibold text-[#291C08] mb-3 border-b border-[#291C08]/30 pb-2">
                Preferences
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p>Notifications</p>
                  <div className="relative inline-block w-10 h-5 rounded-full bg-[#291C08]/30">
                    <input 
                      type="checkbox" 
                      className="opacity-0 w-0 h-0" 
                      defaultChecked={true}
                    />
                    <span className="absolute cursor-pointer top-0.5 left-0.5 bg-[#291C08] w-4 h-4 rounded-full transition-all duration-300 transform translate-x-5"></span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p>Email Updates</p>
                  <div className="relative inline-block w-10 h-5 rounded-full bg-[#291C08]/30">
                    <input 
                      type="checkbox" 
                      className="opacity-0 w-0 h-0" 
                      defaultChecked={false}
                    />
                    <span className="absolute cursor-pointer top-0.5 left-0.5 bg-[#291C08] w-4 h-4 rounded-full transition-all"></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="pt-4">
              <button 
                className="w-full py-3 flex items-center justify-center bg-[#291C08] text-white rounded-xl mb-3"
                onClick={() => navigate('/orders')}
              >
                <FaBox className="mr-2" /> My Orders
              </button>
              <button 
                className="w-full py-3 flex items-center justify-center bg-red-600 text-white rounded-xl"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h3 className="text-lg font-semibold text-[#291C08] mb-3 border-b border-[#291C08]/30 pb-2">
              Recent Orders
            </h3>
            
            {/* Order Cards */}
            <div className="space-y-4">
              {[1, 2, 3].map((order) => (
                <div 
                  key={order} 
                  className="bg-white/40 rounded-xl p-4 shadow-sm"
                  onClick={() => navigate(`/order/${order}`)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">Order #{1000 + order}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      order === 1 ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                    }`}>
                      {order === 1 ? 'Delivered' : 'In Progress'}
                    </span>
                  </div>
                  <p className="text-sm text-[#291C08]/70">
                    {new Date(2025, 2, 15 - order).toLocaleDateString()}
                  </p>
                  <div className="flex justify-between mt-2">
                    <p className="font-medium">₹{(order * 100) + 99}</p>
                    <button className="text-[#291C08] underline text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* View All Button */}
            <button 
              className="w-full mt-4 py-3 flex items-center justify-center bg-[#291C08] text-white rounded-xl"
              onClick={() => navigate('/orders')}
            >
              View All Orders
            </button>
          </div>
        )}

        {activeTab === 'edit' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#291C08] mb-3 border-b border-[#291C08]/30 pb-2">
              Edit Profile
            </h3>
            
            {/* Profile Picture Edit */}
            <div className="flex flex-col items-center mb-4">
              <div className="relative">
                {renderProfilePicture()}
                <button className="absolute right-0 bottom-0 p-1 bg-[#291C08] rounded-full text-white text-xs">
                  <FaEdit />
                </button>
              </div>
              <p className="text-sm text-[#291C08]/70 mt-2">Change Profile Picture</p>
            </div>
            
            <div>
              <label className="block text-sm text-[#291C08]/70 mb-1">Full Name</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 bg-white/50 backdrop-blur-md border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#291C08]"
                defaultValue={userInfo?.user?.name || ''}
              />
            </div>
            
            <div>
              <label className="block text-sm text-[#291C08]/70 mb-1">Email</label>
              <input 
                type="email" 
                className="w-full px-3 py-2 bg-white/50 backdrop-blur-md border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#291C08]"
                defaultValue={userInfo?.user?.email || ''}
                disabled
              />
              <p className="text-xs text-[#291C08]/60 mt-1">Email cannot be changed</p>
            </div>
            
            <div>
              <label className="block text-sm text-[#291C08]/70 mb-1">Phone Number</label>
              <input 
                type="tel" 
                className="w-full px-3 py-2 bg-white/50 backdrop-blur-md border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#291C08]"
                defaultValue={userInfo?.user?.phone || ''}
              />
            </div>
            
            <div>
              <label className="block text-sm text-[#291C08]/70 mb-1">Address</label>
              <textarea 
                className="w-full px-3 py-2 bg-white/50 backdrop-blur-md border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#291C08]"
                defaultValue={userInfo?.user?.address || ''}
                rows="3"
              />
            </div>
            
            <div className="pt-4 flex space-x-3">
              <button 
                className="flex-1 py-3 bg-[#291C08] text-white rounded-xl"
                onClick={() => {
                  // Save logic would go here
                  setActiveTab('profile');
                }}
              >
                Save Changes
              </button>
              <button 
                className="flex-1 py-3 bg-[#291C08]/30 text-[#291C08] rounded-xl"
                onClick={() => setActiveTab('profile')}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notifications Section */}
      <div className="mx-4 mt-6 bg-white/30 backdrop-blur-lg rounded-3xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-[#291C08]">Notifications</h3>
          <FaBell className="text-[#291C08]" />
        </div>
        
        <div className="space-y-3">
          <div className="bg-white/40 p-3 rounded-xl">
            <p className="font-medium">Your order #1001 has been delivered!</p>
            <p className="text-sm text-[#291C08]/70">3 hours ago</p>
          </div>
          <div className="bg-white/40 p-3 rounded-xl">
            <p className="font-medium">Special offer: Get 10% off on all millet products</p>
            <p className="text-sm text-[#291C08]/70">Yesterday</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;