import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { FiSearch, FiFilter, FiDownload } from 'react-icons/fi';
import Table from '../../Table';
import Pagination from '../../Pagination';
import Skeleton from '@mui/material/Skeleton';

const API_URL = import.meta.env.VITE_API_URL;
const ITEMS_PER_PAGE = 8; // The design shows 8 items per page
const DUMMY_RESTOCK_DATA = [
  { _id: "restock001", requestId: "63758", product: { _id: "prod001", prodName: "Samosa", category: "Snacks" }, quantity: 50, status: "PENDING", createdAt: "2023-10-27T10:00:00Z" },
  { _id: "restock002", requestId: "82794", product: { _id: "prod002", prodName: "Millet Coffee", category: "Beverages" }, quantity: 100, status: "APPROVED", createdAt: "2023-10-26T12:00:00Z" },
  { _id: "restock003", requestId: "75829", product: { _id: "prod003", prodName: "Chicken Sandwich", category: "Fast Food" }, quantity: 30, status: "PENDING", createdAt: "2023-10-25T09:30:00Z" },
  { _id: "restock004", requestId: "21438", product: { _id: "prod004", prodName: "Barnyard Brownie", category: "Dessert" }, quantity: 75, status: "REJECTED", createdAt: "2023-10-24T15:00:00Z" },
  { _id: "restock005", requestId: "03829", product: { _id: "prod005", prodName: "Kodo Momo", category: "Snacks" }, quantity: 120, status: "APPROVED", createdAt: "2023-10-23T11:00:00Z" },
  { _id: "restock006", requestId: "78743", product: { _id: "prod006", prodName: "Millet Pancakes", category: "Millet" }, quantity: 60, status: "PENDING", createdAt: "2023-10-22T18:00:00Z" },
  { _id: "restock007", requestId: "68302", product: { _id: "prod007", prodName: "Iced Tea", category: "Beverages" }, quantity: 200, status: "APPROVED", createdAt: "2023-10-21T14:00:00Z" },
  { _id: "restock008", requestId: "78292", product: { _id: "prod008", prodName: "Millet Special Thali", category: "Millet" }, quantity: 40, status: "PENDING", createdAt: "2023-10-20T10:00:00Z" },
  { _id: "restock009", requestId: "91234", product: { _id: "prod009", prodName: "Vegetable Cutlet", category: "Snacks" }, quantity: 80, status: "REJECTED", createdAt: "2023-10-19T16:00:00Z" }
];

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
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'descending' });
    const [searchTerm, setSearchTerm] = useState('');

    // --- Data Fetching ---
    // NOTE: You will need to create this API endpoint on your backend.
    const fetchRestockRequests = useCallback(async () => {
        setLoading(true);
        setError(null);

        // This simulates a network request delay of 1 second
        setTimeout(() => {
            try {
                // Set the state with our dummy data
                setRestockRequests(DUMMY_RESTOCK_DATA);
            } catch (err) {
                setError("Failed to load dummy data.");
            } finally {
                setLoading(false);
            }
        }, 1000);

        /* 
        // WHEN YOU WANT TO USE THE REAL API AGAIN, DELETE THE setTimeout BLOCK ABOVE
        // AND UNCOMMENT THIS BLOCK:

        try {
            const response = await axios.get(`${API_URL}/restocks`);
            const data = response.data.requests || response.data || [];
            setRestockRequests(data); 
        } catch (err) {
            console.error("Failed to fetch restock requests:", err);
            setError("Could not load restock data. Please try again.");
        } finally {
            setLoading(false);
        }
        */
    }, []);

    useEffect(() => {
        fetchRestockRequests();
    }, [fetchRestockRequests]);

    const handleSort = (key) => {
        setSortConfig(prev => ({ 
            key, 
            direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending' 
        }));
    };

    // --- Column Configuration for the Dynamic Table ---
    // This is the "blueprint" for our restock table.
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
            // Assuming the product details are populated from the backend
            render: (row) => row.product?.prodName ?? 'N/A',
        },
        {
            header: 'Order ID',
            key: 'requestId', // Use a unique ID for the restock request
            width: '15%',
            isSortable: true,
            render: (row) => `#${row.requestId}`,
        },
        {
            header: 'Category',
            key: 'category',
            width: '20%',
            isSortable: true,
            render: (row) => row.product?.category ?? 'N/A',
        },
        {
            header: 'No. of Items',
            key: 'quantity',
            width: '15%',
            isSortable: true,
            render: (row) => row.quantity,
        },
        {
            header: 'Status',
            key: 'status',
            width: '15%',
            isSortable: true,
            render: (row) => <RestockStatusBadge status={row.status} />,
        },
    ], []);

    // Memoized processing for filtering, sorting, and pagination
    const processedData = useMemo(() => {
        let filteredItems = [...restockRequests];
        if (searchTerm) {
            const lowercasedFilter = searchTerm.toLowerCase();
            filteredItems = filteredItems.filter(r => 
                (r.product?.prodName?.toLowerCase().includes(lowercasedFilter)) ||
                (r.requestId?.toString().includes(lowercasedFilter)) ||
                (r.product?.category?.toLowerCase().includes(lowercasedFilter))
            );
        }
        if (sortConfig.key) {
            // Add sorting logic here as needed
            filteredItems.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        setPagination(prev => ({ ...prev, totalItems: filteredItems.length, totalPages: Math.ceil(filteredItems.length / ITEMS_PER_PAGE) }));
        const startIndex = (pagination.currentPage - 1) * ITEMS_PER_PAGE;
        return filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [restockRequests, searchTerm, sortConfig, pagination.currentPage]);

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
            <div className="bg-background rounded-xl shadow-md flex flex-col" style={{ height: 'calc(100vh - 15rem)'}}>
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
                
                {!loading && !error && restockRequests.length > 0 && (
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        totalItems={pagination.totalItems}
                        itemsPerPage={ITEMS_PER_PAGE}
                        onPageChange={(page) => setPagination(p => ({...p, currentPage: page}))}
                    />
                )}
            </div>
        </div>
    );
};

export default Restocks;