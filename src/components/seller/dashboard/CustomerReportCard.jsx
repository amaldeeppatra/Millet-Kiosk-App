import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { FiArrowUp } from 'react-icons/fi';

const data = [
  { name: 'New Customer', value: 400 },
  { name: 'Loyal Customer', value: 2353 },
];

const COLORS = ['#A8A29E', '#3A2E1C']; // stone-400, custom text-dark

const CustomerReportCard = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-primary font-bold">Total Customer</h3>
            <p className="text-3xl font-bold text-text-dark mt-2">2,753</p>
            <div className="flex items-center text-sm mt-1 text-success">
                <FiArrowUp className="mr-1" />
                <span>114 new customer vs last Month</span>
            </div>
            <div className="flex items-center mt-4">
                <div className="w-1/2 h-24">
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius="60%"
                                outerRadius="80%"
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="w-1/2 flex flex-col gap-2 pl-4">
                    <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-stone-400 mr-2"></span>
                        <span className="text-sm text-text-light">New Customer</span>
                    </div>
                    <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full" style={{backgroundColor: '#3A2E1C'}}></span>
                        <span className="text-sm text-text-light ml-2">Loyal Customer</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerReportCard;