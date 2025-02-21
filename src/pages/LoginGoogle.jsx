// src/components/LoginGoogle.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../resources/logos/ShaktiSaathi.png';
import bgPattern from '../resources/login/login bg grey.png';
const API_URL = import.meta.env.VITE_API_URL;

const LoginGoogle = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user is authenticated by calling the protected endpoint.
    axios.get(`${API_URL}/login/success`, { withCredentials: true })
      .then(
        response => {
          console.log('User authenticated:', response.data);
          navigate('/homepage');
        }
      )
      .catch(error => {
        console.error('User not authenticated:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const handleGoogleSignIn = () => {
    try {
      // Initiate the OAuth flow by redirecting to your backend's Google auth endpoint.
      window.location.href = `${API_URL}/auth/google`;
    } catch (error) {
      console.error('Error in handleGoogleSignIn:', error);
      alert('Sign-In failed. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="relative h-screen w-screen overflow-hidden flex flex-col items-center">
      {/* Green curved background */}
      <div
        className="absolute top-0 w-full"
        style={{
          backgroundColor: "#143826",
          height: "66vh",
          clipPath: "ellipse(100% 90% at 50% 0%)",
          zIndex: 10,
        }}
      />

      {/* Background pattern image */}
      <img
        src={bgPattern}
        alt="Background Pattern"
        className="absolute top-0 w-full h-full object-cover z-0"
      />

      {/* Logo - positioned in the middle of the green area */}
      <div className="absolute z-10" style={{ top: "50vh" }}>
        <img
          src={logo}
          alt="ShaktiSaathi Logo"
          className="w-40 md:w-48 lg:w-56 h-auto"
        />
      </div>

      {/* Login Card - centered with responsive width */}
      <div className="relative z-20 mx-auto mt-auto mb-16 w-4/5 max-w-sm">
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h2 className="text-[#123B33] text-xl sm:text-2xl font-semibold mb-4">
            Sign In to your account
          </h2>

          <button
            onClick={handleGoogleSignIn}
            className="w-full font-semibold border rounded-full shadow-md px-4 py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
          >
            <img
              src="https://static.vecteezy.com/system/resources/previews/012/871/371/non_2x/google-search-icon-google-product-illustration-free-png.png"
              alt="Google logo"
              className="w-8 h-8"
            />
            Continue with Google
          </button>
        </div>
      </div>

      {/* Terms text - fixed at bottom with responsive padding */}
      <div className="absolute bottom-4 w-full text-center px-4 z-10">
        <p className="text-[#14304A] text-xs">
          By signing in, you agree to our <span className="font-bold">Terms of Service</span> and <span className="font-bold">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};

export default LoginGoogle;