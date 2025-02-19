import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaInfoCircle } from 'react-icons/fa';
import notFound from '../resources/searchpage/Group 50.png'

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState(query);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`https://millet-kiosk-app-backend.onrender.com/search?query=${encodeURIComponent(query)}`)
      .then((res) => {
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Response is not JSON");
        }
        return res.json();
      })
      .then((data) => {
        setResults(data);
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [query]);

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-[url('./resources/homepage/Homepage.png')] bg-cover bg-center">
      {/* Top Bar with Search Input */}
      <div className="flex items-center p-4">
        <button onClick={() => navigate(-1)} className="text-xl font-semibold mr-2">
          <FaChevronLeft />
        </button>
        <input
          type="text"
          placeholder="Search..."
          autoFocus
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none"
        />
        <button onClick={handleSearch} className="ml-2 bg-[#291C08] text-white px-4 py-2 rounded-full">
          Search
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-xl">Loading...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h1 className="text-xl font-bold mb-4">Error</h1>
          <p>{error}</p>
        </div>
      )}

      {/* Search Results */}
      {!loading && !error && (
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold mb-4">Matches</h1>
          {results.length === 0 ? (
            // <p>No results found for <strong>{query}</strong>.</p>
            <div className="flex flex-col items-center justify-center">
              <img 
                src={notFound}  // Change this to the correct path of your image
                alt="No results found"
                className=""
              />
              <p className="text-lg font-semibold mt-4">No results found for <strong>{query}</strong>. <br />Nice try diddy!!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {results.map((product) => (
                <button 
                  key={product.id}
                  onClick={() => navigate(`/product/${product.prodId}`)}
                  className="relative w-full max-w-md mx-auto rounded-xl overflow-hidden shadow-lg transition-transform transform hover:scale-105"
                  aria-label={`View details for ${product.prodName}`}
                >
                  <img src={product.prodImg} alt={product.prodName} className="w-full h-48 object-cover" />
                  <div className="absolute bottom-0 w-full flex items-center justify-between bg-black/50 text-white p-3">
                    <div>
                      <h2 className="text-lg font-semibold">{product.prodName}</h2>
                      <p className="text-sm">Rs. {product.price.$numberDecimal}</p>
                    </div>
                    <FaInfoCircle className="w-5 h-5" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default SearchResultsPage;