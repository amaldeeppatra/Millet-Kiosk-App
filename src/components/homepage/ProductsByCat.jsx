import React from 'react';
import { AiOutlinePlus } from "react-icons/ai";
import banner1 from '../../resources/homepage/banner1.png';
import banner2 from '../../resources/homepage/ShaktiSaathi.png';

const ProductsByCat = ({ title, products }) => {
  // Use the passed products prop or fallback to default products
  const localProducts = products || [
    { id: 1, title: "Product 1", image: banner1 },
    { id: 2, title: "Product 2", image: banner2 },
    { id: 3, title: "Product 3", image: banner1 },
    { id: 4, title: "Product 4", image: banner2 },
    { id: 5, title: "Product 5", image: banner1 },
  ];

  return (
    <div className="mt-8 px-7">
      {/* Header with horizontal line and custom title */}
      <div className="flex items-center mb-4">
        <h3 className="text-2xl font-semibold text-[#783A0D] mr-4">{title}</h3>
        <div className="flex-grow border-b-2 border-[#783A0D]"></div>
        <button className="ml-4 text-[#783A0D] font-semibold">See All</button>
      </div>

      {/* Products Scrollable Section */}
      <div className="flex flex-nowrap space-x-7 overflow-x-auto pb-4 scrollbar-hide">
        {localProducts.map((product) => (
          <div key={product.id} className="flex-none w-[20%]">
            <div className="aspect-square rounded-[26px] overflow-hidden relative bg-gray-100">
              <img
                src={product.image}
                alt={product.title}
                className="w-[50px] h-full object-cover"
              />
              {/* Plus Button for adding item to cart */}
              <button className="absolute top-1 right-1 bg-white text-[#783A0D] text-3xl rounded-full border-4 border-[#783A0D] w-8 h-8 flex items-center justify-center">
                <AiOutlinePlus />
              </button>
            </div>
            <p className="mt-2 text-center text-sm font-semibold text-[#783A0D]">
              {product.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsByCat;