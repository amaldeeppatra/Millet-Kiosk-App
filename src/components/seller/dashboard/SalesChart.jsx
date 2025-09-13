import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const salesData = [
  { name: 'Jan', 'Last Year': 4000, 'Running Year': 2400 },
  { name: 'Feb', 'Last Year': 3000, 'Running Year': 1398 },
  { name: 'Mar', 'Last Year': 2000, 'Running Year': 9800 },
  { name: 'Apr', 'Last Year': 2780, 'Running Year': 3908 },
  { name: 'May', 'Last Year': 1890, 'Running Year': 4800 },
  { name: 'Jun', 'Last Year': 2390, 'Running Year': 3800 },
  { name: 'Jul', 'Last Year': 3490, 'Running Year': 4300 },
];

const SalesChart = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-primary">Overall Sales</h3>
            <div className="flex items-center gap-2 text-sm">
                <span className="text-success flex items-center">↑ 1.1%</span>
                <span className="text-text-light">vs last Year</span>
                {/* Time range buttons can be made functional with state */}
                <div className="flex bg-gray-200 rounded-full p-1 ml-4">
                    <button className="px-3 py-1 rounded-full text-xs">1W</button>
                    <button className="px-3 py-1 rounded-full text-xs">1M</button>
                    <button className="px-3 py-1 rounded-full text-xs bg-gray-800 text-white">6M</button>
                    <button className="px-3 py-1 rounded-full text-xs">1Y</button>
                </div>
            </div>
        </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={salesData}>
          <XAxis dataKey="name" stroke="#7E7261" />
          <YAxis stroke="#7E7261" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Last Year" stroke="#34D399" strokeWidth={2} />
          <Line type="monotone" dataKey="Running Year" stroke="#3B82F6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;