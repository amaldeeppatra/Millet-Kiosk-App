import React, { useState, useEffect } from "react";

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
    <div className="flex flex-col md:flex-row justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md mb-4">
      {/* Order Details */}
      <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
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
      <div className="flex gap-2 mt-4 md:mt-0">
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/order/get-placed")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        return response.json();
      })
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-xl font-bold mb-6">Live Orders</h1>
      {orders.map((order) => (
        <OrderCard key={order.orderId} order={order} onAccept={handleOrderAccepted} />
      ))}
    </div>
  );
};

export default LiveOrders;
