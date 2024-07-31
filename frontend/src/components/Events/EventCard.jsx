
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addTocart, updateTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import { FaArrowDownLong } from "react-icons/fa6";
import CountDown from "./CountDown";
import styles from "../../styles/styles";

const EventCard = ({ active, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState("");
  const [count, setCount] = useState(1);

  const addToCartHandler2 = async (data, selectedSize, count) => {
    const selectedProduct = data.stock.find((item) => item.size === selectedSize);
    if (!selectedProduct) {
      toast.error("Please select a size!",{
        autoClose:1000, // Duration in milliseconds
        });
      return;
    }
    if (selectedProduct.quantity < count) {
      toast.error("Insufficient quantity available for the selected size!",{
        autoClose:2000, // Duration in milliseconds
        });
      return;
    }

    const isItemExists = cart.find((i) => i._id === data._id);
    if (isItemExists) {
      let newData = JSON.parse(JSON.stringify(isItemExists));
      const isExists = newData.stock.some(
        (val) => val.size === selectedSize && val.isSelected === true
      );

      if (isExists) {
        toast.error("Item already in cart!",{
          autoClose:1000, // Duration in milliseconds
          });
        return;
      }

      newData.stock.forEach((val) => {
        if (val.size === selectedSize) {
          val.isSelected = true;
          val.qty = count;
        }
      });

      let newCart = [...cart];
      const itemIndex = newCart.findIndex((item) => item._id === isItemExists._id);
      if (itemIndex !== -1) {
        newCart[itemIndex] = newData;
      }

      try {
        dispatch(updateTocart(newCart));
        toast.success("Item updated in cart successfully!",{
          autoClose:1000, // Duration in milliseconds
          });
      } catch (error) {
        console.error("Error updating cart:", error.message);
        toast.error("Failed to update item in cart!",{
          autoClose:1000, // Duration in milliseconds
          });
      }
    } else {
      let newData = JSON.parse(JSON.stringify(data));
      newData.stock.forEach((val) => {
        if (val.size === selectedSize) {
          val.isSelected = true;
          val.qty = count;
        } else {
          val.isSelected = false;
          val.qty = 0;
        }
      });

      try {
        dispatch(addTocart(newData));
        toast.success("Item added to cart successfully!",{
          autoClose:1000, // Duration in milliseconds
          });
      } catch (error) {
        console.error("Error adding to cart:", error.message);
        toast.error("Failed to add item to cart!",{
          autoClose:1000, // Duration in milliseconds
          });
      }
    }
  };

  return (
    <div className={`w-full block bg-white rounded-lg shadow-lg ${active ? 'unset' : 'mb-12'} lg:flex p-4`}>
      <div className="w-full lg:w-[40%] flex items-center justify-center">
        <img
          src={data.images[0]?.url}
          alt={data.name}
          className="rounded-lg object-contain w-full h-48"
        />
      </div>
      <div className="w-full lg:w-[60%] flex flex-col justify-center p-4">
        <h2 className={`${styles.productTitle} text-xl font-bold mb-2 truncate`} title={data.name}>
          {data.name}
        </h2>
        <p className="text-blue-700 font-semibold mb-2 text-xl underline">
          {data.eventDescription}
        </p>
        <div className="md:hidden">
          <p className="text-gray-600 mb-2">{data.description.length > 27 ? data.description.slice(0, 27) + "..." : data.description}</p>
        </div>
        <div className="hidden md:block lg:hidden">
          <p className="text-gray-600 mb-2">{data.description.length > 27 ? data.description.slice(0, 27) + "..." : data.description}</p>
        </div>
        <div className="hidden lg:block">
          <p className="text-gray-600 mb-2">{data.description.length > 30 ? data.description.slice(0, 35) + "..." : data.description}</p>
        </div>
        <div className="flex items-center py-1 justify-between">
          <div className="flex items-center">
            <span className="flex items-center text-sm text-blue-500 font-bold mr-2">
              <FaArrowDownLong className="text-blue-500" />
              <span className="ml-1">{Math.round(((data.originalPrice - data.discountPrice) / data.originalPrice) * 100)}%</span>
            </span>
            <h5 className="text-red-500 font-medium text-lg line-through mr-3">
              ₹{data.originalPrice}
            </h5>
            <h5 className="text-gray-900 font-bold text-xl">
              ₹{data.discountPrice}
            </h5>
          </div>
        </div>
        <CountDown data={data} />
        <div className="mt-4">
          <Link to={`/product/${data._id}?isEvent=true`}>
            <div className="bg-flipkart-blue text-white py-2 px-4 rounded-lg shadow-md">
              See Details
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;