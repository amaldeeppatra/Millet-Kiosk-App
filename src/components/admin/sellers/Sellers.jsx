import { useState, useEffect } from 'react';

export default function Sellers() {
  const [sellerInput, setSellerInput] = useState('');
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [sellerToRemove, setSellerToRemove] = useState(null);

  // Fetch all sellers on component mount
  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const response = await fetch('/api/seller/sellers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSellers(data.sellers || []);
      }
    } catch (err) {
      console.error('Error fetching sellers:', err);
    }
  };

  const handleAddSeller = async () => {
    if (!sellerInput.trim()) {
      setError('Please enter a valid email');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/seller/manage', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          email: sellerInput.trim(),
          action: 'add'
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || 'Seller added successfully');
        setSellerInput('');
        fetchSellers(); // Refresh the list
      } else {
        setError(data.message || 'Failed to add seller');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Error adding seller:', err);
    } finally {
      setLoading(false);
    }
  };

  const openRemoveModal = (seller) => {
    setSellerToRemove(seller);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSellerToRemove(null);
  };

  const confirmRemoveSeller = async () => {
    if (!sellerToRemove) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/seller/manage', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          email: sellerToRemove.email,
          action: 'remove'
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || 'Seller removed successfully');
        fetchSellers(); // Refresh the list
        closeModal();
      } else {
        setError(data.message || 'Failed to remove seller');
        closeModal();
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Error removing seller:', err);
      closeModal();
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddSeller();
    }
  };

  return (
    <div className="flex-1 p-8">
      <div className={`max-w-6xl ${showModal ? 'blur-sm' : ''}`}>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Sellers</h1>
        
        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        <div className='rounded-2xl border-2'>
          <div className="rounded-2xl p-8 mb-6">
            <h2 className="text-2xl font-semibold text-primary mb-6">Add New Seller</h2>
            
            <div className="bg-accent rounded-xl p-6 mb-6">
              <input
                type="email"
                placeholder="Enter Seller ID or Email ID *"
                value={sellerInput}
                onChange={(e) => setSellerInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                className="w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 text-base"
              />
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={handleAddSeller}
                disabled={loading}
                className="bg-primary hover:bg-primary-600 text-white font-medium px-8 py-3 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-xl">+</span>
                <span>{loading ? 'Adding...' : 'Add Seller'}</span>
              </button>
            </div>
          </div>

          <div className="rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-primary mb-6">Active Sellers</h2>
            
            <div className="bg-accent rounded-xl p-6 min-h-[300px]">
              {sellers.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-500 text-center">
                    No active sellers right now, sowile.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sellers.map((seller) => (
                    <div
                      key={seller._id || seller.email}
                      className="bg-white rounded-lg p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                          {seller.name ? seller.name.charAt(0).toUpperCase() : seller.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {seller.name || 'Seller'}
                          </p>
                          <p className="text-sm text-gray-500">{seller.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => openRemoveModal(seller)}
                        disabled={loading}
                        className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop with blur */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
            onClick={closeModal}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all">
            <div className="text-center">
              {/* Warning Icon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              {/* Modal Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Remove Seller
              </h3>

              {/* Modal Message */}
              <p className="text-gray-600 mb-2">
                Are you sure you want to remove
              </p>
              <p className="font-semibold text-gray-800 mb-6">
                {sellerToRemove?.email}
              </p>
              <p className="text-sm text-gray-500 mb-8">
                This action will change their role back to customer. They will no longer have seller privileges.
              </p>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={closeModal}
                  disabled={loading}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRemoveSeller}
                  disabled={loading}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'Removing...' : 'Remove Seller'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}