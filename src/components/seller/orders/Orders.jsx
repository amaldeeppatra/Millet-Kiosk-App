import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { FiSearch, FiFilter, FiDownload } from 'react-icons/fi';
import Tabs from './Tabs';
// import OrdersTable from './OrdersTable';
import Pagination from '../../Pagination';
import Skeleton from '@mui/material/Skeleton';
import Table from '../../Table';

const API_URL = import.meta.env.VITE_API_URL;
const ITEMS_PER_PAGE = 10;

const TableSkeleton = () => (
    <div className="p-6">
        {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={40} className="mb-2" />
        ))}
    </div>
);

const formatCurrency = (amount) => { const n = Number(amount); if (isNaN(n)) return '₹0.00'; return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n); };
const StatusBadge = ({ status }) => { if (status === 'COMPLETED') return <span className="text-xs font-semibold text-green-700 italic">Completed</span>; if (status === 'CANCELLED') return <span className="text-xs font-semibold text-red-700 italic">Cancelled</span>; return <span className="text-xs font-semibold text-gray-500 italic">No actions</span>; };

const Orders = () => {
    // All state hooks and functions (fetchOrders, handleAccept, etc.) remain exactly the same as before.
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('recent');
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
    const [searchTerm, setSearchTerm] = useState('');

    const tabs = [
        { name: 'Recent Orders', key: 'recent' },
        { name: 'All Orders', key: 'all' },
        { name: 'Placed', key: 'placed' },
        { name: 'Completed', key: 'completed' },
    ];

    const tabEndpointMap = {
        recent: '/orders',
        all: '/orders',
        placed: '/order/get-placed',
        completed: '/order/get-completed',
    };

    const columns = useMemo(() => [
        {
            header: <input type="checkbox" className="rounded" />,
            key: 'checkbox',
            width: '5%',
            render: (row) => <input type="checkbox" className="rounded" />,
        },
        {
            header: 'Orders',
            key: 'productName',
            width: '35%',
            isSortable: true,
            render: (row) => row.items?.[0]?.prodName ?? 'Order Items',
        },
        {
            header: 'Customer',
            key: 'customerName',
            width: '15%',
            isSortable: true,
            render: (row) => row.userId?.name ?? 'Guest User',
        },
        {
            header: 'Amount',
            key: 'amount',
            width: '15%',
            isSortable: true,
            render: (row) => formatCurrency(row.totalPrice?.$numberDecimal ?? row.totalPrice ?? 0),
        },
        {
            header: 'Date',
            key: 'date',
            width: '15%',
            isSortable: true,
            render: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A',
        },
        {
            header: 'Action',
            key: 'action',
            width: '15%',
            render: (row) => (
                row.orderStatus === 'PLACED' ? (
                    <>
                        <button onClick={() => handleAccept(row.orderId)} className="bg-green-100 text-green-700 hover:bg-green-200 px-4 py-1 rounded-md text-xs font-semibold mr-2">Accept</button>
                        <button onClick={() => handleReject(row.orderId)} className="bg-red-100 text-red-700 hover:bg-red-200 px-4 py-1 rounded-md text-xs">Reject</button>
                    </>
                ) : (
                    <StatusBadge status={row.orderStatus} />
                )
            ),
        },
    ], []);

    // All functions (fetchOrders, handleAccept, processedOrders, handleSort) are unchanged.
    const fetchOrders = useCallback(async () => { setLoading(true); setError(null); try { const endpoint = tabEndpointMap[activeTab]; const response = await axios.get(`${API_URL}${endpoint}`); const ordersData = response.data.orders || response.data || []; setOrders(ordersData); } catch (err) { console.error(`Failed to fetch orders from ${activeTab} tab:`, err); setError("Could not load order data. Please try again."); } finally { setLoading(false); } }, [activeTab]);
    useEffect(() => { fetchOrders(); }, [fetchOrders]);
    const handleAccept = async (orderId) => { try { await axios.patch(`${API_URL}/order/complete/${orderId}`); fetchOrders(); } catch (err) { console.error(`Error accepting order ${orderId}:`, err); } };
    const handleReject = (orderId) => { console.log(`Rejecting order ${orderId}`); };
    const handleSort = (key) => { setSortConfig(prev => ({ key, direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending' })); };
    const processedOrders = useMemo(() => { let filteredItems = [...orders]; if (searchTerm) { const lowercasedFilter = searchTerm.toLowerCase(); filteredItems = filteredItems.filter(order => (order.userId?.name?.toLowerCase().includes(lowercasedFilter)) || (order.items?.[0]?.prodName?.toLowerCase().includes(lowercasedFilter)) || (order.orderId?.toLowerCase().includes(lowercasedFilter))); } if (sortConfig.key) { filteredItems.sort((a, b) => { let aValue, bValue; switch (sortConfig.key) { case 'customerName': aValue = a.userId?.name?.toLowerCase() ?? ''; bValue = b.userId?.name?.toLowerCase() ?? ''; break; case 'productName': aValue = a.items?.[0]?.prodName?.toLowerCase() ?? ''; bValue = b.items?.[0]?.prodName?.toLowerCase() ?? ''; break; case 'amount': aValue = parseFloat(a.totalPrice?.$numberDecimal ?? a.totalPrice ?? 0); bValue = parseFloat(b.totalPrice?.$numberDecimal ?? b.totalPrice ?? 0); break; case 'date': aValue = a.createdAt ?? ''; bValue = b.createdAt ?? ''; break; default: return 0; } if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1; if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1; return 0; }); } setPagination(prev => ({ ...prev, totalItems: filteredItems.length, totalPages: Math.ceil(filteredItems.length / ITEMS_PER_PAGE), })); const startIndex = (pagination.currentPage - 1) * ITEMS_PER_PAGE; const endIndex = startIndex + ITEMS_PER_PAGE; return filteredItems.slice(startIndex, endIndex); }, [orders, searchTerm, sortConfig, pagination.currentPage]);

    return (
        <div className="space-y-4 px-3 bg-background">
            <div>
                <p className="text-sm text-text-light">Dashboard ▸ Recent Orders</p>
                <h1 className="text-3xl font-bold text-text-dark mt-1">Orders</h1>
            </div>

            {/* ======================= LAYOUT CHANGE STARTS HERE ======================== */}

            {/* --- Section 1: Search, Filter, and Tabs --- */}
            <div className="rounded-xl ">
                {/* This container now stacks on mobile and is a row on desktop */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                    {/* Search bar now takes full width on mobile */}
                    <div className="relative w-full md:w-2/5">
                        <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-text-light" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search for id, name, product"
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-semibold hover:bg-gray-50"><FiFilter /> Filter</button>
                        <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-semibold hover:bg-gray-50"><FiDownload /> Export</button>
                    </div>
                </div>
                <Tabs tabs={tabs} activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />
            </div>

            {/* --- Section 2: The Table and Pagination Card --- */}
            <div className="bg-background rounded-xl shadow-md flex flex-col" style={{ height: 'calc(100vh - 20rem)' }}>
                {/* The flex-grow container ensures the table takes available space */}
                <div className="flex-grow">
                    {loading ? (
                        <TableSkeleton />
                    ) : error ? (
                        <div className="text-center py-10 text-danger">{error}</div>
                    ) : (
                        <Table
                            data={processedOrders}
                            columns={columns}
                            onSort={handleSort}
                            sortConfig={sortConfig}
                        />
                    )}
                </div>

                {/* Pagination is now at the bottom of the table card */}
                {!loading && !error && orders.length > 0 && (
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        totalItems={pagination.totalItems}
                        itemsPerPage={ITEMS_PER_PAGE}
                        onPageChange={(page) => setPagination(p => ({ ...p, currentPage: page }))}
                    />
                )}
            </div>

            {/* ======================== LAYOUT CHANGE ENDS HERE ========================= */}

        </div>
    );
};

export default Orders;