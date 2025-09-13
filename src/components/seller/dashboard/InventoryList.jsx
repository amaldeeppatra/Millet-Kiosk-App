import React from 'react';

const inventoryItems = [
    'Samosa', 'Kachori', 'Cupcake', 'Foxnut Samosa', 'Cake', 'Cookies', 'Millet Special', 'Samosa'
];

const InventoryList = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md h-full">
            <h3 className="text-xl font-bold text-primary mb-4 border-b pb-2">Inventory</h3>
            <ul className="space-y-3 text-text-dark">
                {inventoryItems.map((item, index) => (
                    <li key={index} className="border-b last:border-0 pb-2">
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default InventoryList;