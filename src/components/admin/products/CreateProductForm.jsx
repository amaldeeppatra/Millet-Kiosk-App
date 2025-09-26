import React, { useState } from 'react';
import axios from 'axios';

// Assume your API URL is stored in an environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CreateProductForm = () => {
    const [formData, setFormData] = useState({
        prodId: '',
        prodName: '',
        prodImg: '',
        prodDesc: '',
        category: '',
        price: '',
        stock: '',
        // These fields are in the form but not in the provided backend controller.
        // You might need to add them to your backend schema and controller.
        ingredients: '',
        nutritionalValue: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverMessage, setServerMessage] = useState({ type: '', content: '' });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.prodId) newErrors.prodId = 'Product ID is required.';
        if (!formData.prodName) newErrors.prodName = 'Product Name is required.';
        if (!formData.prodImg) newErrors.prodImg = 'Product Image URL is required.';
        if (!formData.prodDesc) newErrors.prodDesc = 'Product Description is required.';
        if (!formData.price) newErrors.price = 'Price is required.';
        if (!formData.stock) newErrors.stock = 'Stock Quantity is required.';
        // Optional fields, but if you want them required, uncomment below
        // if (!formData.category) newErrors.category = 'Category is required.';
        // if (!formData.ingredients) newErrors.ingredients = 'Ingredients are required.';
        // if (!formData.nutritionalValue) newErrors.nutritionalValue = 'Nutritional Value is required.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerMessage({ type: '', content: '' });

        if (!validateForm()) {
            return; // Stop submission if validation fails
        }

        setLoading(true);

        // Your backend expects 'rating', which is not in the form.
        // I'm adding a default value of 0. Adjust as needed.
        const payload = { ...formData, rating: 0 };

        try {
            const response = await axios.post(`${API_URL}/product/new`, payload);
            setServerMessage({ type: 'success', content: `Product "${response.data.prodName}" created successfully!` });
            
            // Optionally, reset the form after successful submission
            setFormData({
                prodId: '', prodName: '', prodImg: '', prodDesc: '',
                category: '', price: '', stock: '',
                ingredients: '', nutritionalValue: ''
            });
            setErrors({});

        } catch (error) {
            const message = error.response?.data?.message || "An error occurred. Please try again.";
            setServerMessage({ type: 'error', content: message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-background rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-text-dark mb-6">Add New Product</h2>
            
            {/* Server Message Display */}
            {serverMessage.content && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${
                    serverMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {serverMessage.content}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Product ID */}
                <div>
                    <label htmlFor="prodId" className="block text-sm font-medium text-text-dark mb-1">Product ID*</label>
                    <input
                        type="text"
                        id="prodId"
                        value={formData.prodId}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.prodId ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-accent-light'}`}
                        placeholder="P00X"
                    />
                    {errors.prodId && <p className="text-red-500 text-xs mt-1">{errors.prodId}</p>}
                </div>

                {/* Product Name */}
                <div>
                    <label htmlFor="prodName" className="block text-sm font-medium text-text-dark mb-1">Product Name*</label>
                    <input
                        type="text"
                        id="prodName"
                        value={formData.prodName}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.prodName ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-accent-light'}`}
                        placeholder="Product Name"
                    />
                    {errors.prodName && <p className="text-red-500 text-xs mt-1">{errors.prodName}</p>}
                </div>

                {/* Product Image URL */}
                <div>
                    <label htmlFor="prodImg" className="block text-sm font-medium text-text-dark mb-1">Product Image URL*</label>
                    <input
                        type="text"
                        id="prodImg"
                        value={formData.prodImg}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.prodImg ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-accent-light'}`}
                        placeholder="https://example.com/image.jpg"
                    />
                    {errors.prodImg && <p className="text-red-500 text-xs mt-1">{errors.prodImg}</p>}
                </div>

                {/* Product Description */}
                <div>
                    <label htmlFor="prodDesc" className="block text-sm font-medium text-text-dark mb-1">Product Description*</label>
                    <textarea
                        id="prodDesc"
                        rows="3"
                        value={formData.prodDesc}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 resize-y ${errors.prodDesc ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-accent-light'}`}
                        placeholder="Brief description of the product"
                    ></textarea>
                    {errors.prodDesc && <p className="text-red-500 text-xs mt-1">{errors.prodDesc}</p>}
                </div>

                {/* Select Category */}
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-text-dark mb-1">Select Category</label>
                    <select
                        id="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-light"
                    >
                        <option value="">Select Category</option>
                        <option value="Snacks">Snacks</option>
                        <option value="Beverages">Beverages</option>
                        <option value="Fast Food">Fast Food</option>
                        <option value="Dessert">Dessert</option>
                    </select>
                </div>

                {/* Price */}
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-text-dark mb-1">Price*</label>
                    <input
                        type="number"
                        id="price"
                        value={formData.price}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.price ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-accent-light'}`}
                        placeholder="0.00"
                        step="0.01"
                    />
                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                </div>

                {/* Stock Quantity */}
                <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-text-dark mb-1">Stock Quantity*</label>
                    <input
                        type="number"
                        id="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.stock ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-accent-light'}`}
                        placeholder="0"
                    />
                    {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
                </div>

                {/* Ingredients (Not in backend controller) */}
                <div>
                    <label htmlFor="ingredients" className="block text-sm font-medium text-text-dark mb-1">Ingredients</label>
                    <textarea
                        id="ingredients"
                        rows="3"
                        value={formData.ingredients}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-light resize-y"
                        placeholder="List of ingredients"
                    ></textarea>
                </div>

                {/* Nutritional Value (Not in backend controller) */}
                <div className="md:col-span-2">
                    <label htmlFor="nutritionalValue" className="block text-sm font-medium text-text-dark mb-1">Nutritional Value</label>
                    <textarea
                        id="nutritionalValue"
                        rows="3"
                        value={formData.nutritionalValue}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-light resize-y"
                        placeholder="Detailed nutritional information"
                    ></textarea>
                </div>

                {/* Submit Button */}
                <div className="md:col-span-2 flex justify-end mt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-accent text-primary font-semibold px-6 py-2 rounded-lg hover:bg-accent-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Adding Product...' : 'Add Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateProductForm;