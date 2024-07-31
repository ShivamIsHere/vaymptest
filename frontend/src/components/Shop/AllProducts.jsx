import React, { useEffect, useState } from "react";
import { Button, FormControl, MenuItem, Select } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllProductsShop, deleteProduct, updateProductStock } from "../../redux/actions/product";
import Loader from "../Layout/Loader";

const AllProducts = () => {
  const { products, isLoading } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(seller._id));
  }, [dispatch, seller._id]);

  // Filter products where listing is not equal to "Event"
  const filteredProducts = products && products.filter((product) => product.listing !== "Event");

  // Define state for selected size and quantity
  const [selectedSize, setSelectedSize] = useState({});
  const [selectedQuantity, setSelectedQuantity] = useState({});

  // Event handler for size change
  const handleSizeChange = (productId, size) => {
    setSelectedSize((prevSize) => ({ ...prevSize, [productId]: size }));
    // Update selected quantity based on selected size
    const product = products.find((item) => item._id === productId);
    if (product && product.stock && product.stock.length > 0) {
      const stockItem = product.stock.find((stock) => stock.size === size);
      setSelectedQuantity((prevQuantity) => ({
        ...prevQuantity,
        [productId]: stockItem ? stockItem.quantity : 0,
      }));
    }
  };

  // Event handler for quantity change
  const handleQuantityChange = (productId, quantity) => {
    setSelectedQuantity((prevQuantity) => ({
      ...prevQuantity,
      [productId]: quantity,
    }));
  };

  // Event handler for quantity increment
  const handleQuantityIncrement = (productId) => {
    setSelectedQuantity((prevQuantity) => ({
      ...prevQuantity,
      [productId]: (prevQuantity[productId] || 0) + 1,
    }));
  };

  // Event handler for quantity decrement
  const handleQuantityDecrement = (productId) => {
    const currentQuantity = selectedQuantity[productId] || 0;
    if (currentQuantity > 0) {
      setSelectedQuantity((prevQuantity) => ({
        ...prevQuantity,
        [productId]: currentQuantity - 1,
      }));
    }
  };

  // Event handler for updating product stock
  const handleUpdate = async (productId) => {
    const quantityToUpdate = selectedQuantity[productId];
    const sizeToUpdate = selectedSize[productId];

    if (quantityToUpdate !== undefined && sizeToUpdate) {
      try {
        await dispatch(updateProductStock(productId, sizeToUpdate, quantityToUpdate));
        console.log(`Successfully updated quantity for size ${sizeToUpdate} of product ${productId}`);
      } catch (error) {
        console.error(`Error updating quantity for size ${sizeToUpdate} of product ${productId}:`, error);
      }
    } else {
      console.error(`Quantity or size for product ${productId} is missing.`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <Loader />
        ) : (
          !filteredProducts || filteredProducts.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 text-lg">No products found.</div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                className="relative bg-gradient-to-r from-blue-50 to-blue-50 border border-gray-300 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl p-4"
              >
                <Link to={`/product/${product._id}`}>
                  <div className="w-full h-48 relative overflow-hidden rounded-t-lg">
                    <img
                      src={product.images[0]?.url}
                      alt={product.name}
                      className="w-full h-full object-contain transition-transform duration-300 ease-in-out hover:scale-110"
                    />
                  </div>
                </Link>
                
                <div className="p-2 flex flex-col h-full">
                  <Link
                    to={`/product/${product._id}`}
                    className="text-md font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-300 block truncate"
                  >
                    {product.name}
                  </Link>
                  <p className="text-gray-600 text-sm mt-1">Price: ₹{product.ShopPrice}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <select
                      className="flex-shrink border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500 w-24 sm:w-28"
                      value={selectedSize[product._id] || ""}
                      onChange={(e) => handleSizeChange(product._id, e.target.value)}
                    >
                      <option value="">Select Size</option>
                      {product.stock.map((stockItem, index) => (
                        <option key={`${stockItem.size}-${index}`} value={stockItem.size}>
                          {stockItem.size}
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        className="bg-blue-500 text-white text-sm px-2 py-1 rounded-md shadow-sm hover:bg-blue-600 transition-colors duration-300"
                        onClick={() => handleQuantityDecrement(product._id)}
                        disabled={selectedQuantity[product._id] === 0}
                      >
                        &#x2212;
                      </button>
                      <input
                        type="number"
                        className="border border-gray-300 text-center text-sm w-12 px-1 py-0.5 rounded-md"
                        value={selectedQuantity[product._id] || ""}
                        onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                      />
                      <button
                        className="bg-blue-500 text-white text-sm px-2 py-1 rounded-md shadow-sm hover:bg-blue-600 transition-colors duration-300"
                        onClick={() => handleQuantityIncrement(product._id)}
                      >
                        &#x002B;
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <button
                      className="bg-green-500 text-white text-sm px-3 py-1 rounded-md shadow-md hover:bg-green-600 transition-colors duration-300"
                      onClick={() => handleUpdate(product._id)}
                    >
                      Update
                    </button>
                    <Link to={`/product/${product._id}`}>
                      <button className="text-blue-500 text-sm hover:text-blue-700 transition-colors duration-300">
                        <AiOutlineEye size={18} />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
};

export default AllProducts;
