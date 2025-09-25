import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { FiSearch, FiFilter, FiDownload } from 'react-icons/fi';
import Table from '../../Table';
import Pagination from '../../Pagination';
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

// A reusable status badge for restock requests
const RestockStatusBadge = ({ status }) => {
    switch (status?.toUpperCase()) {
        case 'PENDING':
            return <span className="px-2 py-1 text-xs font-semibold text-yellow-700 bg-yellow-100 rounded-full">Pending</span>;
        case 'APPROVED':
            return <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">Approved</span>;
        case 'REJECTED':
            return <span className="px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">Rejected</span>;
        default:
            return <span className="px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full">{status}</span>;
    }
};

const Restocks = () => {
    const [restockRequests, setRestockRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'descending' });
    const [searchTerm, setSearchTerm] = useState('');
    const [sellerId, setSellerId] = useState(null);

    useEffect(() => {
        const token = Cookies.get('token');
        const decoded = token ? ParseJwt(token) : null;
        if (decoded?.user?._id) {
            setSellerId(decoded.user._id);
        }
    }, []);

    const fetchRestockRequests = useCallback(async () => {
        if (!sellerId) return;
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/request/getAllRequests/${sellerId}`);
            console.log("Fetched restock requests:", response.data.requests);
            const data = response.data.requests || [];
            setRestockRequests(data);
        } catch (err) {
            console.error("Failed to fetch restock requests:", err);
            setError("Could not load restock data. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [sellerId]);

    useEffect(() => {
        fetchRestockRequests();
    }, [fetchRestockRequests]);

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending'
        }));
    };

    // Column Configuration for the Dynamic Table
    const columns = useMemo(() => [
        {
            header: <input type="checkbox" className="rounded" />,
            key: 'checkbox',
            width: '5%',
            render: (row) => <input type="checkbox" className="rounded" />,
        },
        {
            header: 'Product',
            key: 'productName',
            width: '30%',
            isSortable: true,
            render: (row) => {
                // Handle different possible data structures
                const productName = row.prodId?.prodName || row.product?.prodName || 'N/A';
                return productName;
            },
        },
        {
            header: 'Order ID',
            key: 'requestId',
            width: '15%',
            isSortable: true,
            render: (row) => `#${row.requestId || row._id}`,
        },
        {
            header: 'Category',
            key: 'category',
            width: '20%',
            isSortable: true,
            render: (row) => {
                // Handle different possible data structures
                const category = row.prodId?.category || row.product?.category || 'N/A';
                return category;
            },
        },
        {
            header: 'No. of Items',
            key: 'quantity',
            width: '15%',
            isSortable: true,
            render: (row) => row.quantity || 'N/A',
        },
        {
            header: 'Status',
            key: 'status',
            width: '15%',
            isSortable: true,
            render: (row) => <RestockStatusBadge status={row.status} />,
        },
    ], []);

    // Memoized processing for filtering and sorting
    const processedData = useMemo(() => {
        let filteredItems = [...restockRequests];
        
        if (searchTerm) {
            const lowercasedFilter = searchTerm.toLowerCase();
            filteredItems = filteredItems.filter(r => {
                const productName = r.prodId?.prodName || r.product?.prodName || '';
                const requestId = r.requestId?.toString() || r._id?.toString() || '';
                const category = r.prodId?.category || r.product?.category || '';
                
                return (
                    productName.toLowerCase().includes(lowercasedFilter) ||
                    requestId.includes(lowercasedFilter) ||
                    category.toLowerCase().includes(lowercasedFilter)
                );
            });
        }
        
        if (sortConfig.key) {
            filteredItems.sort((a, b) => {
                let aValue, bValue;
                
                // Handle nested properties for sorting
                switch (sortConfig.key) {
                    case 'productName':
                        aValue = a.prodId?.prodName || a.product?.prodName || '';
                        bValue = b.prodId?.prodName || b.product?.prodName || '';
                        break;
                    case 'category':
                        aValue = a.prodId?.category || a.product?.category || '';
                        bValue = b.prodId?.category || b.product?.category || '';
                        break;
                    case 'quantity':
                        aValue = a.quantity || a.qty || 0;
                        bValue = b.quantity || b.qty || 0;
                        break;
                    default:
                        aValue = a[sortConfig.key];
                        bValue = b[sortConfig.key];
                }
                
                if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        
        return filteredItems;
    }, [restockRequests, searchTerm, sortConfig]);

    // Calculate pagination
    useEffect(() => {
        setTotalItems(processedData.length);
        setTotalPages(Math.ceil(processedData.length / ITEMS_PER_PAGE));
        // Reset to first page if current page exceeds total pages
        if (currentPage > Math.ceil(processedData.length / ITEMS_PER_PAGE) && processedData.length > 0) {
            setCurrentPage(1);
        }
    }, [processedData.length, currentPage]);

    // Get paginated data
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return processedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [processedData, currentPage]);

    return (
        <div className="space-y-4">
            {/* Page header and controls */}
            <div>
                <p className="text-sm text-text-light">Dashboard ▸ Restocks</p>
                <h1 className="text-3xl font-bold text-text-dark mt-1">Restocks</h1>
            </div>
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

            {/* The main table card */}
            <div className="bg-background rounded-xl shadow-md flex flex-col" style={{ height: 'calc(100vh - 15rem)' }}>
                <div className="flex-grow">
                    {loading ? (
                        <TableSkeleton />
                    ) : error ? (
                        <div className="text-center py-10 text-danger">{error}</div>
                    ) : (
                        <Table
                            data={paginatedData}
                            columns={columns}
                            onSort={handleSort}
                            sortConfig={sortConfig}
                        />
                    )}
                </div>

                {!loading && !error && restockRequests.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        itemsPerPage={ITEMS_PER_PAGE}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>
        </div>
    );
};

export default Restocks;