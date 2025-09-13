// import React from 'react';
// import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

// // ... formatCurrency and StatusBadge helpers remain the same ...
// const formatCurrency = (amount) => { const n = Number(amount); if(isNaN(n)) return '₹0.00'; return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n); };
// const StatusBadge = ({ status }) => { if (status === 'COMPLETED') return <span className="text-xs font-semibold text-green-700 italic">Completed</span>; if (status === 'CANCELLED') return <span className="text-xs font-semibold text-red-700 italic">Cancelled</span>; return <span className="text-xs font-semibold text-gray-500 italic">No actions</span>;};

// const OrdersTable = ({ orders, onAccept, onReject, onSort, sortConfig }) => {
//     const renderSortArrow = (columnKey) => {
//         if (sortConfig.key !== columnKey) return null;
//         if (sortConfig.direction === 'ascending') return <FiArrowUp className="inline ml-1" />;
//         return <FiArrowDown className="inline ml-1" />;
//     };

//     return (
//         // The container now manages the height and scrolling
//         <div className="flex flex-col h-full">
//             {/* Table Header (Not scrollable) */}
//             <div className="flex-shrink-0">
//                 <table className="min-w-full table-fixed">
//                     <thead className="bg-accent">
//                         <tr className='rounded-2xl'>
//                             <th className="px-6 py-3 w-12"><input type="checkbox" className="rounded" /></th>
//                             <th onClick={() => onSort('productName')} className="px-6 py-3 text-left text-xs font-bold text-primary uppercase tracking-wider cursor-pointer w-2/6">Orders {renderSortArrow('productName')}</th>
//                             <th onClick={() => onSort('customerName')} className="px-6 py-3 text-left text-xs font-bold text-primary uppercase tracking-wider cursor-pointer w-1/6">Customer {renderSortArrow('customerName')}</th>
//                             <th onClick={() => onSort('amount')} className="px-6 py-3 text-left text-xs font-bold text-primary uppercase tracking-wider cursor-pointer w-1/6">Amount {renderSortArrow('amount')}</th>
//                             <th onClick={() => onSort('date')} className="px-6 py-3 text-left text-xs font-bold text-primary uppercase tracking-wider cursor-pointer w-1/6">Date {renderSortArrow('date')}</th>
//                             <th className="px-6 py-3 text-left text-xs font-bold text-primary uppercase tracking-wider w-1/6">Action</th>
//                         </tr>
//                     </thead>
//                 </table>
//             </div>

//             {/* Table Body (Scrollable) */}
//             <div className="flex-grow overflow-y-auto">
//                 <table className="min-w-full table-fixed">
//                     <tbody className="bg-background divide-y divide-gray-200">
//                         {orders.length > 0 ? (
//                             orders.map((order) => (
//                                 <tr key={order.orderId} className="hover:bg-gray-50">
//                                     <td className="px-6 py-4 w-12"><input type="checkbox" className="rounded" /></td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-text-dark w-2/6">{order.items?.[0]?.prodName ?? 'Order Items'}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-text-dark w-1/6">{order.userId?.name ?? 'Guest User'}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-text-dark w-1/6">{formatCurrency(order.totalPrice?.$numberDecimal ?? order.totalPrice ?? 0)}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light w-1/6">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium w-1/6">
//                                         {order.orderStatus === 'PLACED' ? (  
//                                             <>
//                                                 <button onClick={() => onAccept(order.orderId)} className="bg-green-100 text-green-700 hover:bg-green-200 px-4 py-1 rounded-md text-xs font-semibold mr-2">Accept</button>
//                                                 <button onClick={() => onReject(order.orderId)} className="bg-red-100 text-red-700 hover:bg-red-200 px-4 py-1 rounded-md text-xs">Reject</button>
//                                             </>
//                                         ) : (
//                                             <StatusBadge status={order.orderStatus} />
//                                         )}
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="6" className="text-center py-10 text-text-light">No orders found.</td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default OrdersTable;