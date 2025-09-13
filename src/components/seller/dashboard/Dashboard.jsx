import React from 'react';
import StatCard from '../dashboard/StatCard';
import SalesChart from '../dashboard/SalesChart';
import OrdersTable from '../dashboard/OrdersTable';
import TotalSalesCard from '../dashboard/TotalSalesCard';
import TotalOrderCard from '../dashboard/TotalOrderCard';
import CustomerReportCard from '../dashboard/CustomerReportCard';
import InventoryList from '../dashboard/InventoryList';
import ReportDonut from '../dashboard/ReportDonut';

import { FiUsers, FiClipboard, FiPackage, FiRefreshCw } from "react-icons/fi";

const Dashboard = () => {
    return (
        <>
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Items" value="250" icon={<FiPackage />} trend="12 more than last quarter" trendDirection="up" iconBgColor="bg-orange-100" />
                <StatCard title="Recent Orders" value="100" icon={<FiClipboard />} trend="0.2% lower than last quarter" trendDirection="down" iconBgColor="bg-blue-100" />
                <StatCard title="Bulk Orders" value="10" icon={<FiUsers />} trend="2% more than last quarter" trendDirection="up" iconBgColor="bg-green-100" />
                <StatCard title="Restock" value="10" icon={<FiRefreshCw />} trend="" trendDirection="up" iconBgColor="bg-red-100" />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TotalSalesCard />
                        <TotalOrderCard />
                    </div>
                    <SalesChart />
                </div>
                <div className="col-span-1 flex flex-col gap-6">
                    <CustomerReportCard />
                    <InventoryList />
                </div>
                <div className="col-span-1">
                    <ReportDonut />
                </div>
                <div className="lg:col-span-2">
                    <OrdersTable />
                </div>
            </div>
        </>
    );
};

export default Dashboard;