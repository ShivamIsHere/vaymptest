import React from "react";
import { Link } from "react-router-dom";

const ShopCard = ({ shopName, image, shopId }) => {
  return (
    <Link to={`/shop/preview/${shopId}`}>
      <div className="max-w-sm mx-auto overflow-hidden shadow-lg rounded-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl bg-blue-50">
        <img
          className="w-full h-56 object-contain object-center transition-transform duration-300 ease-in-out hover:scale-110"
          src={image}
          alt={shopName}
        />
        <div className="relative px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-200 rounded-b-lg shadow-md">
          <h5 className="text-xl font-semibold text-center text-gray-800 truncate">{shopName}</h5>
          <div className="flex justify-center mt-2">
            <span className="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded-full uppercase font-bold tracking-wide shadow-sm">
              Open Now
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ShopCard;
