import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { FiArrowUp } from 'react-icons/fi';

const data = [
    { value: 10 }, { value: 25 }, { value: 18 }, { value: 35 }, { value: 30 }, { value: 50 },
];

const TotalSalesCard = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-primary font-bold">Total Sales</h3>
            <p className="text-3xl font-bold text-text-dark mt-2">$30,412</p>
            <div className="flex items-center text-sm mt-1 text-success">
                <FiArrowUp className="mr-1" />
                <span>1.5% vs last Month</span>
            </div>
            <div className="h-20 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#16A34A" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#16A34A" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="value" stroke="#16A34A" strokeWidth={2} fill="url(#colorSuccess)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TotalSalesCard;