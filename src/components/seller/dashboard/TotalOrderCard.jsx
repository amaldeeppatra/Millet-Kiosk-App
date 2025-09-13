import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { FiArrowDown } from 'react-icons/fi';

const data = [
    { value: 40 }, { value: 25 }, { value: 38 }, { value: 25 }, { value: 32 }, { value: 15 },
];

const TotalOrderCard = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-primary font-bold">Total Order</h3>
            <p className="text-3xl font-bold text-text-dark mt-2">12,980</p>
            <div className="flex items-center text-sm mt-1 text-danger">
                <FiArrowDown className="mr-1" />
                <span>0.7% vs last Month</span>
            </div>
            <div className="h-20 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorDanger" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#DC2626" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#DC2626" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="value" stroke="#DC2626" strokeWidth={2} fill="url(#colorDanger)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TotalOrderCard;