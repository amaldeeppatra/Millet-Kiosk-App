import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaStar } from 'react-icons/fa'; 

const ProductPage = () => {
  const params = useParams();
  let productId = params;
  productId = productId.prodId;
//   console.log(productId);
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`https://millet-kiosk-app-backend.onrender.com/products/id/${productId}`)
      .then((res) => {
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Response is not JSON");
        }
        return res.json();
      })
      .then((data) => {
        // console.log(data);
        setProduct(data);
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [productId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-xl font-bold mb-4">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('./resources/homepage/Homepage.png')] bg-cover bg-center px-4 py-6">
      {/* write your code here */}
      {/* <h1>{product[0].prodName}</h1>   example of displaying fetched data */}
      <button onClick={() => navigate(-1)} className="mb-4">
        <FaChevronLeft /> Back
      </button>
      <img src={product[0].prodImg} alt={product[0].prodName} className="mb-4"/>
      <h1 className="text-3xl font-bold mb-4">{product[0].prodName}</h1>
      <p className="text-lg mb-2">{product[0].prodDesc}</p> 
      <div className="flex justify-between items-center mb-2">
      <p className="text-lg">Price: Rs.{product[0].price}</p>
      <div className="flex flex-col items-end">
          <div className="flex items-center px-2 py-1 bg-brown-500 text-white rounded">
            <FaStar className="text-yellow-500 mr-1" />
            <p className="text-lg">{product[0].rating}</p>
          </div>
          <button className="mt-2 px-4 py-2 bg-brown-500 text-white rounded">
            ADD
          </button>
        </div>
      </div>
  
    </div>
  );
};

export default ProductPage;