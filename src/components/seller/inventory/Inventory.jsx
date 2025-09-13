import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { FiSearch, FiFilter, FiDownload, FiEdit, FiTrash2 } from 'react-icons/fi';
import Table from '../../Table'; // Renamed from DataTable as requested
import Pagination from '../../Pagination'; // We can reuse the pagination component
import Skeleton from '@mui/material/Skeleton';
import Cookies from 'js-cookie';
import ParseJwt from '../../../utils/ParseJWT';

const API_URL = import.meta.env.VITE_API_URL;
const ITEMS_PER_PAGE = 8;

// Skeleton loader for the table
const TableSkeleton = () => (
    <div className="p-6">
        {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={40} className="mb-2" />
        ))}
    </div>
);

// A reusable status badge for inventory
const StockStatusBadge = ({ stock }) => {
    if (stock <= 0) {
        return <span className="px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">Out of Stock</span>;
    }
    if (stock <= 10) {
        return <span className="px-2 py-1 text-xs font-semibold text-yellow-700 bg-yellow-100 rounded-full">Low Stock</span>;
    }
    return <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">In Stock</span>;
};

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
    const [sortConfig, setSortConfig] = useState({ key: 'stock', direction: 'ascending' });
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState({});
    const [userInfo, setUserInfo] = useState(null);
    const [sellerId, setSellerId] = useState(null);

    const handleMessageChange = (prodId, message) => {
        setMessage(prev => ({
            ...prev,
            [prodId]: message
        }));
        console.log(message);
    };

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // The API endpoint to fetch all products
            const response = await axios.get(`${API_URL}/products`);
            const productsData = response.data.products || response.data || [];
            setProducts(productsData);
        } catch (err) {
            console.error("Failed to fetch products:", err);
            setError("Could not load inventory data. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending'
        }));
    };

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            try {
                const decoded = ParseJwt(token); // ✅ decode
                setUserInfo(decoded);
                const idFromToken = decoded?.user?._id || decoded?.id; // adjust based on payload
                setSellerId(idFromToken); // ✅ set sellerId
                console.log("Decoded token:", decoded);
                console.log("SellerId from token:", idFromToken);
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, []);

    const sendRequest = async (prodId) => {
        try{
            console.log("Sending request for product ID:", prodId, "with message:", message[prodId] || '');
            const response = await axios.post(`${API_URL}/request/${sellerId}`, {
            prodId,
            message: message[prodId] || ''
        });
        console.log("Response from server:", response.data);
        } catch (error) {
            console.error("Error sending request:", error);
        }
    }

    // Define the columns for the inventory table
    const columns = useMemo(() => [
        {
            header: <input type="checkbox" className="rounded" />,
            key: 'checkbox',
            width: '5%',
            render: (row) => <input type="checkbox" className="rounded" />,
        },
        {
            header: 'Items',
            key: 'prodName',
            width: '25%',
            isSortable: true,
            render: (row) => (
                <div className="flex items-center gap-3">
                    <img src={row.prodImg} alt={row.prodName} className="w-10 h-10 object-cover rounded-md" />
                    <span className="font-medium">{row.prodName}</span>
                </div>
            ),
        },
        {
            header: 'Category',
            key: 'category',
            width: '10%',
            isSortable: true,
            render: (row) => row.category,
        },
        {
            header: 'Status',
            key: 'status', // Key for sorting (can be same as stock)
            width: '10%',
            isSortable: true,
            render: (row) => <StockStatusBadge stock={row.stock} />,
        },
        {
            header: 'Qty in Stock',
            key: 'stock',
            width: '10%',
            isSortable: true,
            render: (row) => row.stock,
        },
        {
            header: 'Action',
            key: 'action',
            width: '15%',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <button className="bg-accent px-4 py-2 rounded-md hover:bg-secondary" onClick={()=>sendRequest(row.prodId)}>Send Request</button>
                </div>
            ),
        },
        {
            header: 'Message',
            key: 'message',
            width: '15%',
            render: (row) => (<textarea
                rows="2"
                placeholder='Write a message...'
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                value={message[row.prodId] || ''}
                onChange={(e) => handleMessageChange(row.prodId, e.target.value)}
            />),
        },
    ], [message]);

    // Memoized processing for filtering, sorting, and pagination
    const processedData = useMemo(() => {
        let filteredItems = [...products];
        if (searchTerm) {
            const lowercasedFilter = searchTerm.toLowerCase();
            filteredItems = filteredItems.filter(p =>
                (p.prodName?.toLowerCase().includes(lowercasedFilter)) ||
                (p.category?.toLowerCase().includes(lowercasedFilter)) ||
                (p.prodId?.toLowerCase().includes(lowercasedFilter))
            );
        }
        if (sortConfig.key) {
            filteredItems.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];
                if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        setPagination(prev => ({ ...prev, totalItems: filteredItems.length, totalPages: Math.ceil(filteredItems.length / ITEMS_PER_PAGE) }));
        const startIndex = (pagination.currentPage - 1) * ITEMS_PER_PAGE;
        return filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [products, searchTerm, sortConfig, pagination.currentPage]);

    return (
        <div className="space-y-4">
            {/* Top control bar */}
            <div className="flex justify-between items-center">
                <div className="relative w-1/3">
                    <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search for id, name, product"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50"><FiFilter /> Filter</button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50"><FiDownload /> Export</button>
                </div>
            </div>

            {/* Main table card */}
            <div className="bg-background rounded-xl shadow-md flex flex-col" style={{ height: 'calc(100vh - 12rem)' }}>
                <div className="flex-grow">
                    {loading ? (
                        <TableSkeleton />
                    ) : error ? (
                        <div className="text-center py-10 text-danger">{error}</div>
                    ) : (
                        <Table
                            data={processedData}
                            columns={columns}
                            onSort={handleSort}
                            sortConfig={sortConfig}
                        />
                    )}
                </div>

                {!loading && !error && products.length > 0 && (
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        totalItems={pagination.totalItems}
                        itemsPerPage={ITEMS_PER_PAGE}
                        onPageChange={(page) => setPagination(p => ({ ...p, currentPage: page }))}
                    />
                )}
            </div>
        </div>
    );
};

export default Inventory;