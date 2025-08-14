import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  // Auth
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState(Cookies.get("token"));

  // UI state
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products");

  // Notification system
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [lastCheckedTime, setLastCheckedTime] = useState(null);

  // Products CRUD
  const [products, setProducts] = useState([]);
  const [prodForm, setProdForm] = useState({
    prodId: "",
    prodName: "",
    prodImg: "",
    prodDesc: "",
    category: "",
    price: "",
    stock: "",
    prodIngredients: "",
    prodNutrients: "",
  });
  const [editingProdId, setEditingProdId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageError, setImageError] = useState("");

  // Sellers management
  const [sellers, setSellers] = useState([]);
  const [newSellerId, setNewSellerId] = useState("");

  // Success/Error messages
  const [message, setMessage] = useState({ type: "", text: "" });

  // Show message helper
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  // Validate image URL
  const validateImageUrl = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  // Check for new notifications
  const checkForNewNotifications = (fetchedNotifications) => {
    if (!lastCheckedTime) {
      setLastCheckedTime(new Date());
      return;
    }
    const newNotifs = fetchedNotifications.filter(
      (notif) => new Date(notif.createdAt) > lastCheckedTime
    );
    if (newNotifs.length > 0) {
      setHasNewNotifications(true);
    }
  };

  // Mark notifications as read
  const markNotificationsAsRead = () => {
    setHasNewNotifications(false);
    setLastCheckedTime(new Date());
  };

  // Initial data fetch and auth
  useEffect(() => {
    const userToken = Cookies.get("token");
    if (userToken) {
      try {
        const decoded = ParseJwt(userToken);
        setUserInfo(decoded);
        setToken(userToken);
      } catch (e) {
        Cookies.remove("token");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
    setTimeout(() => setLoading(false), 800);
  }, [navigate]);

  // Fetch data
  useEffect(() => {
    if (!loading && token) {
      fetchProducts();
      fetchSellers();
      fetchNotifications();
      const notificationInterval = setInterval(() => {
        fetchNotifications();
      }, 30000);
      return () => clearInterval(notificationInterval);
    }
  }, [loading, token]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products`);
      if (Array.isArray(res.data)) {
        setProducts(res.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error(
        "Error fetching products:",
        error.response || error.message
      );
      showMessage("error", `Failed to fetch products: ${error.message}`);
    }
  };

  const fetchSellers = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/sellers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSellers(res.data.sellers || []);
    } catch (error) {
      console.error("Error fetching sellers:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetchedNotifications = res.data.notifications || [];
      setNotifications(fetchedNotifications);
      checkForNewNotifications(fetchedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Product form change
  const handleProdFormChange = async (e) => {
    const { name, value } = e.target;
    setProdForm({ ...prodForm, [name]: value });

    if (name === "prodImg" && value) {
      setImageError("Validating image...");
      const isValid = await validateImageUrl(value);
      if (isValid) {
        setImageError("");
      } else {
        setImageError("Invalid image URL. Please provide a valid image link.");
      }
    } else if (name === "prodImg" && !value) {
      setImageError("");
    }
  };

  // Create product
  const handleProdSubmit = async (e) => {
    e.preventDefault();
    if (
      !prodForm.prodId ||
      !prodForm.prodName ||
      !prodForm.prodImg ||
      !prodForm.prodDesc ||
      !prodForm.category ||
      !prodForm.price ||
      !prodForm.stock
    ) {
      showMessage("error", "Please fill all required fields");
      return;
    }

    if (imageError) {
      showMessage("error", "Please provide a valid image URL");
      return;
    }

    try {
      const productData = {
        prodId: prodForm.prodId,
        prodName: prodForm.prodName,
        prodImg: prodForm.prodImg,
        prodDesc: prodForm.prodDesc,
        category: prodForm.category,
        price: parseFloat(prodForm.price),
        stock: parseInt(prodForm.stock),
        rating: 0,
        prodIngredients: prodForm.prodIngredients || "Not Available",
        prodNutrients: prodForm.prodNutrients || "Not Available",
      };

      await axios.post(`${API_URL}/product/new`, productData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProdForm({
        prodId: "",
        prodName: "",
        prodImg: "",
        prodDesc: "",
        category: "",
        price: "",
        stock: "",
        prodIngredients: "",
        prodNutrients: "",
      });
      setImageError("");
      fetchProducts();
      showMessage("success", "Product created successfully!");
    } catch (error) {
      console.error("Error creating product:", error.response || error);
      if (error.response && error.response.status === 409) {
        showMessage(
          "error",
          `Product with ID '${prodForm.prodId}' already exists.`
        );
      } else {
        showMessage("error", "An error occurred while creating the product.");
      }
    }
  };

  // Start inline editing
  const handleEditStart = (prod) => {
    setEditingProdId(prod._id);
    setEditingProduct({
      ...prod,
      price: prod.price?.$numberDecimal || prod.price,
      rating: prod.rating?.$numberDecimal || prod.rating,
    });
  };

  // Save inline edit
  const handleEditSave = async () => {
    if (!editingProduct) return;

    try {
      const updateData = {
        prodName: editingProduct.prodName,
        prodImg: editingProduct.prodImg,
        prodDesc: editingProduct.prodDesc,
        category: editingProduct.category,
        prodIngredients: editingProduct.prodIngredients,
        prodNutrients: editingProduct.prodNutrients,
        price: parseFloat(editingProduct.price),
        stock: parseInt(editingProduct.stock, 10),
      };

      await axios.patch(
        `${API_URL}/product/update/${editingProduct.prodId}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEditingProdId(null);
      setEditingProduct(null);
      fetchProducts();
      showMessage("success", "Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error.response?.data || error.message);
      showMessage("error", `Update failed: ${error.response?.data?.message || 'Check console for details.'}`);
    }
  };

  // Cancel inline edit
  const handleEditCancel = () => {
    setEditingProdId(null);
    setEditingProduct(null);
  };

  // Delete product
  const handleDeleteProd = async (customProdId, mongoId) => {
    if (!confirm(`Are you sure you want to delete product: ${customProdId}?`))
      return;

    try {
      await axios.delete(`${API_URL}/product/delete/${customProdId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p._id !== mongoId));
      showMessage("success", "Product deleted successfully!");
    } catch (error) {
      console.error(
        "Error deleting product:",
        error.response || error.message
      );
      showMessage("error", "Error deleting product");
    }
  };

  // Seller management
  const handleAddSeller = async () => {
    if (!newSellerId.trim()) {
      showMessage("error", "Please enter a seller ID");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/admin/sellers`,
        { sellerId: newSellerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSellers();
      setNewSellerId("");
      showMessage("success", "Seller added successfully!");
    } catch (error) {
      showMessage("error", "Error adding seller");
    }
  };

  const handleRemoveSeller = async (sid) => {
    if (!confirm("Are you sure you want to remove this seller?")) return;

    try {
      await axios.delete(`${API_URL}/admin/sellers/${sid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSellers(sellers.filter((s) => s !== sid));
      showMessage("success", "Seller removed successfully!");
    } catch (error) {
      showMessage("error", "Error removing seller");
    }
  };

  // Handle notification bell click
  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      markNotificationsAsRead();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[url('./resources/homepage/Homepage.png')] bg-cover bg-center p-4">
        <Skeleton variant="rectangular" width="100%" height={400} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('./resources/homepage/Homepage.png')] bg-cover bg-center">
      {/* Header */}
      <header className="bg-white/30 backdrop-blur-lg p-4 shadow-lg relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-[#291C08]">
              Admin Dashboard
            </h1>
          </div>

          <div className="flex items-center space-x-4 relative">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={handleNotificationClick}
                className={`p-2 rounded-full text-white relative transition-all duration-300 ${
                  hasNewNotifications
                    ? "bg-red-500 hover:bg-red-600 animate-pulse"
                    : "bg-[#291C08] hover:bg-[#291C08]/80"
                }`}
              >
                <FaBell
                  className={hasNewNotifications ? "animate-bounce" : ""}
                />
                {notifications.length > 0 && (
                  <span
                    className={`absolute -top-1 -right-1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ${
                      hasNewNotifications ? "bg-yellow-400" : "bg-red-500"
                    }`}
                  >
                    {notifications.length}
                  </span>
                )}
                {hasNewNotifications && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping"></span>
                )}
              </button>
            </div>

            <span className="text-[#291C08] font-medium">
              {userInfo?.user?.name || "Admin"}
            </span>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              onClick={() => {
                Cookies.remove("token");
                navigate("/login");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Notification Dropdown */}
      {showNotifications && (
        <div className="fixed top-16 right-4 z-[9999]">
          <div className="w-80 bg-white rounded-lg shadow-2xl max-h-96 overflow-y-auto border border-gray-200">
            <div className="p-4 border-b bg-gray-50 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[#291C08]">Notifications</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            {notifications.length > 0 ? (
              notifications.map((notif, idx) => (
                <div
                  key={idx}
                  className="p-3 border-b last:border-b-0 hover:bg-gray-50 bg-white"
                >
                  <p className="text-sm text-gray-800">{notif.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notif.createdAt).toLocaleString()}
                  </p>
                  {lastCheckedTime &&
                    new Date(notif.createdAt) > lastCheckedTime && (
                      <span className="inline-block mt-1 px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
                        New
                      </span>
                    )}
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 bg-white rounded-b-lg">
                No notifications
              </div>
            )}
          </div>
        </div>
      )}

      {/* Backdrop for closing dropdown */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-[9998]"
          onClick={() => setShowNotifications(false)}
        />
      )}

      {/* Success/Error Message */}
      {message.text && (
        <div
          className={`mx-4 mt-4 p-3 rounded-lg ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex space-x-2 p-4">
        {["products", "sellers", "notifications"].map((tab) => (
          <button
            key={tab}
            className={`py-2 px-6 rounded-lg font-medium capitalize transition-colors ${
              activeTab === tab
                ? "bg-[#291C08] text-white"
                : "bg-white/30 backdrop-blur-lg text-[#291C08] hover:bg-white/50"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "notifications" && <FaBell className="inline mr-2" />}
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === "products" && (
          <div className="space-y-6">
            {/* Add Product Form */}
            <div className="bg-white/30 backdrop-blur-lg rounded-3xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-[#291C08] mb-4">
                Add New Product
              </h2>
              <form
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                onSubmit={handleProdSubmit}
              >
                <input
                  name="prodId"
                  className="px-4 py-3 bg-white/50 backdrop-blur-md border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#291C08]"
                  value={prodForm.prodId}
                  onChange={handleProdFormChange}
                  placeholder="Product ID *"
                  required
                />
                <input
                  name="prodName"
                  className="px-4 py-3 bg-white/50 backdrop-blur-md border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#291C08]"
                  value={prodForm.prodName}
                  onChange={handleProdFormChange}
                  placeholder="Product Name *"
                  required
                />
                <div>
                  <input
                    name="prodImg"
                    className={`px-4 py-3 bg-white/50 backdrop-blur-md border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#291C08] w-full ${
                      imageError ? "border-red-400" : "border-white/40"
                    }`}
                    value={prodForm.prodImg}
                    onChange={handleProdFormChange}
                    placeholder="Product Image URL *"
                    required
                  />
                  {imageError && (
                    <p className="text-red-500 text-xs mt-1">{imageError}</p>
                  )}
                  {prodForm.prodImg && !imageError && (
                    <p className="text-green-500 text-xs mt-1">
                      ✓ Valid image URL
                    </p>
                  )}
                </div>
                <textarea
                  name="prodDesc"
                  className="px-4 py-3 bg-white/50 backdrop-blur-md border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#291C08]"
                  value={prodForm.prodDesc}
                  onChange={handleProdFormChange}
                  placeholder="Product Description *"
                  rows="2"
                  required
                />
                <select
                  name="category"
                  className="px-4 py-3 bg-white/50 backdrop-blur-md border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#291C08]"
                  value={prodForm.category}
                  onChange={handleProdFormChange}
                  required
                >
                  <option value="">Select Category *</option>
                  <option value="Millet">Millet</option>
                  <option value="Beverage">Beverage</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Fast Food">Fast Food</option>
                </select>
                <input
                  name="price"
                  className="px-4 py-3 bg-white/50 backdrop-blur-md border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#291C08]"
                  type="number"
                  min="0"
                  step="0.01"
                  value={prodForm.price}
                  onChange={handleProdFormChange}
                  placeholder="Price *"
                  required
                />
                <input
                  name="stock"
                  className="px-4 py-3 bg-white/50 backdrop-blur-md border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#291C08]"
                  type="number"
                  min="0"
                  value={prodForm.stock}
                  onChange={handleProdFormChange}
                  placeholder="Stock Quantity *"
                  required
                />
                <textarea
                  name="prodIngredients"
                  className="px-4 py-3 bg-white/50 backdrop-blur-md border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#291C08]"
                  value={prodForm.prodIngredients}
                  onChange={handleProdFormChange}
                  placeholder="Ingredients (Optional)"
                  rows="2"
                />
                <textarea
                  name="prodNutrients"
                  className="px-4 py-3 bg-white/50 backdrop-blur-md border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#291C08]"
                  value={prodForm.prodNutrients}
                  onChange={handleProdFormChange}
                  placeholder="Nutritional Information (Optional)"
                  rows="2"
                />
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="bg-[#291C08] text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-[#291C08]/90 transition-colors disabled:opacity-50"
                    disabled={!!imageError}
                  >
                    <FaPlus /> Add Product
                  </button>
                </div>
              </form>
            </div>

            {/* Products Table */}
            <div className="bg-white/30 backdrop-blur-lg rounded-3xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-[#291C08] mb-4">
                Products ({products.length})
              </h2>
              
              {products.length === 0 && !loading ? (
                <div className="text-center py-8 text-[#291C08]/70">
                  <FaImage className="mx-auto text-4xl mb-4 opacity-50" />
                  <p>No products found. Add your first product above!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full bg-white/40 rounded-xl overflow-hidden">
                    <thead className="bg-[#291C08] text-white">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Image</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Product ID</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Price</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Stock</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Rating</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((prod, index) => (
                        <tr key={prod._id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white/20' : 'bg-white/10'} hover:bg-white/30 transition-colors`}>
                          {editingProdId === prod._id ? (
                            // Inline Edit Row
                            <>
                              <td className="px-4 py-3">
                                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                                  {editingProduct.prodImg ? (
                                    <img
                                      src={editingProduct.prodImg}
                                      alt="Preview"
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <FaImage className="text-gray-400" />
                                  )}
                                </div>
                                <input
                                  className="mt-1 w-full px-2 py-1 text-xs rounded border"
                                  value={editingProduct.prodImg}
                                  onChange={(e) =>
                                    setEditingProduct({
                                      ...editingProduct,
                                      prodImg: e.target.value,
                                    })
                                  }
                                  placeholder="Image URL"
                                />
                              </td>
                              <td className="px-4 py-3 text-sm font-medium text-[#291C08]">
                                {editingProduct.prodId}
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  className="w-full px-2 py-1 text-sm rounded border"
                                  value={editingProduct.prodName}
                                  onChange={(e) =>
                                    setEditingProduct({
                                      ...editingProduct,
                                      prodName: e.target.value,
                                    })
                                  }
                                />
                                <textarea
                                  className="mt-1 w-full px-2 py-1 text-xs rounded border"
                                  value={editingProduct.prodDesc}
                                  onChange={(e) =>
                                    setEditingProduct({
                                      ...editingProduct,
                                      prodDesc: e.target.value,
                                    })
                                  }
                                  rows="2"
                                  placeholder="Description"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <select
                                  className="w-full px-2 py-1 text-sm rounded border"
                                  value={editingProduct.category}
                                  onChange={(e) =>
                                    setEditingProduct({
                                      ...editingProduct,
                                      category: e.target.value,
                                    })
                                  }
                                >
                                  <option value="Millet">Millet</option>
                                  <option value="Beverage">Beverage</option>
                                  <option value="Snacks">Snacks</option>
                                  <option value="Dessert">Dessert</option>
                                  <option value="Fast Food">Fast Food</option>
                                </select>
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  className="w-full px-2 py-1 text-sm rounded border"
                                  type="number"
                                  value={editingProduct.price}
                                  onChange={(e) =>
                                    setEditingProduct({
                                      ...editingProduct,
                                      price: e.target.value,
                                    })
                                  }
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  className="w-full px-2 py-1 text-sm rounded border"
                                  type="number"
                                  value={editingProduct.stock}
                                  onChange={(e) =>
                                    setEditingProduct({
                                      ...editingProduct,
                                      stock: e.target.value,
                                    })
                                  }
                                />
                              </td>
                              <td className="px-4 py-3 text-sm text-[#291C08]">
                                {parseFloat(editingProduct.rating || 0).toFixed(1)}⭐
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex gap-1 justify-center">
                                  <button
                                    onClick={handleEditSave}
                                    className="bg-green-500 text-white p-1 rounded hover:bg-green-600 transition-colors"
                                    title="Save"
                                  >
                                    <FaCheck className="text-xs" />
                                  </button>
                                  <button
                                    onClick={handleEditCancel}
                                    className="bg-gray-500 text-white p-1 rounded hover:bg-gray-600 transition-colors"
                                    title="Cancel"
                                  >
                                    <FaTimes className="text-xs" />
                                  </button>
                                </div>
                              </td>
                            </>
                          ) : (
                            // Display Row
                            <>
                              <td className="px-4 py-3">
                                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                                  {prod.prodImg ? (
                                    <img
                                      src={prod.prodImg}
                                      alt={prod.prodName}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <FaImage className="text-gray-400" />
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm font-medium text-[#291C08]">
                                {prod.prodId}
                              </td>
                              <td className="px-4 py-3">
                                <div className="text-sm font-semibold text-[#291C08]">
                                  {prod.prodName}
                                </div>
                                <div className="text-xs text-[#291C08]/70 mt-1 line-clamp-2">
                                  {prod.prodDesc}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-[#291C08]">
                                <span className="bg-[#291C08]/20 px-2 py-1 rounded-full text-xs">
                                  {prod.category}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm font-semibold text-[#291C08]">
                                ₹{prod.price?.$numberDecimal || prod.price}
                              </td>
                              <td className="px-4 py-3 text-sm text-[#291C08]">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  prod.stock > 15 ? 'bg-green-100 text-green-700' : 
                                  prod.stock > 10 ? 'bg-yellow-100 text-yellow-700' : 
                                  prod.stock > 0 ? 'bg-red-100 text-red-700' : 
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {prod.stock}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-[#291C08]">
                                {parseFloat(prod.rating?.$numberDecimal || prod.rating).toFixed(1)}⭐
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex gap-1 justify-center">
                                  <button
                                    onClick={() => handleEditStart(prod)}
                                    className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600 transition-colors"
                                    title="Edit"
                                  >
                                    <FaEdit className="text-xs" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProd(prod.prodId, prod._id)}
                                    className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-colors"
                                    title="Delete"
                                  >
                                    <FaTrash className="text-xs" />
                                  </button>
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "sellers" && (
          <div className="space-y-6">
            {/* Add Seller */}
            <div className="bg-white/30 backdrop-blur-lg rounded-3xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-[#291C08] mb-4">
                Add New Seller
              </h2>
              <div className="flex gap-3">
                <input
                  className="flex-1 px-4 py-3 bg-white/50 backdrop-blur-md border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#291C08]"
                  value={newSellerId}
                  onChange={(e) => setNewSellerId(e.target.value)}
                  placeholder="Enter seller ID or email"
                />
                <button
                  className="bg-[#291C08] text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-[#291C08]/90 transition-colors"
                  onClick={handleAddSeller}
                >
                  <FaPlus /> Add Seller
                </button>
              </div>
            </div>

            {/* Sellers List */}
            <div className="bg-white/30 backdrop-blur-lg rounded-3xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-[#291C08] mb-4">
                Active Sellers ({sellers.length})
              </h2>
              <div className="space-y-3">
                {sellers.map((sid) => (
                  <div
                    key={sid}
                    className="bg-white/40 rounded-xl p-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-[#291C08]">{sid}</p>
                      <p className="text-sm text-[#291C08]/70">Active Seller</p>
                    </div>
                    <button
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                      onClick={() => handleRemoveSeller(sid)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                {sellers.length === 0 && (
                  <div className="text-center py-8 text-[#291C08]/70">
                    <p>No sellers added yet. Add your first seller above!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-6">
            {/* Notification History */}
            <div className="bg-white/30 backdrop-blur-lg rounded-3xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-[#291C08] mb-4">
                Notification History
              </h2>
              <div className="space-y-3">
                {notifications.map((notif, idx) => (
                  <div key={idx} className="bg-white/40 rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-[#291C08]">{notif.message}</p>
                        <p className="text-sm text-[#291C08]/70 mt-2">
                          Received: {new Date(notif.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {lastCheckedTime &&
                        new Date(notif.createdAt) > lastCheckedTime && (
                          <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
                            New
                          </span>
                        )}
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <div className="text-center py-8 text-[#291C08]/70">
                    <p>No notifications received yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
