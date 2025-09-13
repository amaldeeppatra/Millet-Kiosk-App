import React from 'react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

const StatCard = ({ title, value, icon, trend, trendDirection, iconBgColor }) => {
    const TrendIcon = trendDirection === 'up' ? FiArrowUp : FiArrowDown;
    const trendColor = trendDirection === 'up' ? 'text-success' : 'text-danger';

    return (
        <div className="bg-white p-5 rounded-xl shadow-md flex justify-between items-center">
            <div>
                <p className="text-3xl font-bold text-text-dark">{value}</p>
                <p className="text-text-light">{title}</p>
                <div className={`flex items-center text-sm mt-2 ${trendColor}`}>
                    <TrendIcon className="mr-1" />
                    <span>{trend}</span>
                </div>
            </div>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${iconBgColor}`}>
                <span className="text-2xl text-primary">{icon}</span>
            </div>
        </div>
    );
};

export default StatCard;