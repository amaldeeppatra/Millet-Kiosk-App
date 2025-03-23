import React, { useState, useEffect } from "react";

// Stock Item Component
const StockItem = ({ product }) => {
  // Determine color based on stock level
  const getStockColor = (quantity) => {
    return quantity <= 5 ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700";
  };

  return (
    <div className={`p-3 rounded-md mb-2 ${getStockColor(product.stock)}`}>
      <div className="font-medium">{product.prodName}</div>
      <div className="flex justify-between items-center">
        <span>Stock: {product.stock}</span>
        <span className="text-xs">ID: {product.prodId}</span>
      </div>
    </div>
  );
};

const OrderCard = ({ order, onAccept }) => {
  // Helper function to convert totalPrice if it's returned as a Decimal128 object
  const getTotalPrice = (price) => {
    if (price && typeof price === "object" && price.$numberDecimal) {
      return parseFloat(price.$numberDecimal);
    }
    return parseFloat(price);
  };

  const handleAccept = () => {
    // Call the API to update the order status
    fetch(`http://localhost:5000/order/complete/${order.orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update order");
        }
        return response.json();
      })
      .then((data) => {
        console.log(`Order ${order.orderId} accepted`);
        // Remove this order from the UI
        onAccept(order.orderId);
      })
      .catch((err) => {
        console.error("Error updating order:", err);
      });
  };

  const handleDecline = () => {
    console.log(`Order ${order.orderId} declined`);
    // You can implement decline logic similarly if needed.
  };

  return (
    <div className="flex flex-col justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md mb-4 w-full">
      {/* Order Details */}
      <div className="flex flex-wrap gap-4 items-center w-full">
        <span className="text-sm font-medium text-gray-700">
          Order ID: {order.orderId}
        </span>
        <span className="text-sm text-gray-600">
          Items: {order.items.map((item) => `${item.prodName} (${item.quantity})`).join(", ")}
        </span>
        <span className="text-sm font-semibold text-gray-800">
          Total: ₹{getTotalPrice(order.totalPrice)}
        </span>
        <span className="text-sm text-gray-600">User ID: {order.userId}</span>
        <span className="text-sm text-gray-500 mr-4">
          Status: {order.orderStatus}
        </span>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-4 w-full justify-end">
        <button
          onClick={handleAccept}
          className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition"
        >
          Accept
        </button>
        <button
          onClick={handleDecline}
          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
        >
          Decline
        </button>
      </div>
    </div>
  );
};

const LiveOrders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch orders
    const fetchOrders = fetch("http://localhost:5000/order/get-placed")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        return response.json();
      });

    // Fetch all products to get their stock information
    const fetchProducts = fetch("http://localhost:5000/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        return response.json();
      });

    // Wait for both requests to complete
    Promise.all([fetchOrders, fetchProducts])
      .then(([ordersData, productsData]) => {
        setOrders(ordersData);
        setProducts(productsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Callback to remove order from the UI after it's accepted
  const handleOrderAccepted = (orderId) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.orderId !== orderId));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Dashboard</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Live Orders Section - Left Side */}
        <div className="w-full md:w-2/3">
          <h2 className="text-xl font-bold mb-4">Live Orders</h2>
          <div className="bg-white p-4 rounded-lg shadow">
            {orders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No active orders at the moment</p>
            ) : (
              orders.map((order) => (
                <OrderCard key={order.orderId} order={order} onAccept={handleOrderAccepted} />
              ))
            )}
          </div>
        </div>
        
        {/* Stock Information - Right Side */}
        <div className="w-full md:w-1/3">
          <h2 className="text-xl font-bold mb-4">Inventory Stock</h2>
          <div className="bg-white p-4 rounded-lg shadow max-h-[80vh] overflow-y-auto">
            {products.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No product information available</p>
            ) : (
              products.map((product) => (
                <StockItem key={product.prodId} product={product} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveOrders;
