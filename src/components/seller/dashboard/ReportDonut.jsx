import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Text } from 'recharts';

const data = [
  { name: 'E-commerce', value: 23 },
  { name: 'Marline website', value: 23 },
  { name: 'Offline store', value: 67 }, // This slice will be rendered first
];

const COLORS = ['#A8A29E', '#78716C', '#3A2E1C'];

const ReportDonut = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-primary font-bold">Order Report</h3>
                <div className="flex bg-gray-200 rounded-full p-1 text-xs">
                    <button className="px-3 py-1 rounded-full">1W</button>
                    <button className="px-3 py-1 rounded-full">1M</button>
                    <button className="px-3 py-1 rounded-full bg-gray-800 text-white">1Y</button>
                </div>
            </div>
            <p className="text-3xl font-bold text-text-dark">190,567</p>
            <div className="flex items-center text-sm mt-1 text-danger">
                <span>↓ 0.2% vs last Year</span>
            </div>
            <div className="h-48 mt-4">
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            innerRadius="70%"
                            outerRadius="90%"
                            fill="#8884d8"
                            dataKey="value"
                            startAngle={90} // Start the chart at the top
                            endAngle={-270} // Make it a full circle
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
                <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#3A2E1C' }}></span>
                    <span className="text-sm text-text-light">E-commerce</span>
                </div>
                <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-stone-500 mr-2"></span>
                    <span className="text-sm text-text-light">Marline</span>
                </div>
                <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-stone-400 mr-2"></span>
                    <span className="text-sm text-text-light">Offline</span>
                </div>
            </div>
        </div>
    );
}

export default ReportDonut