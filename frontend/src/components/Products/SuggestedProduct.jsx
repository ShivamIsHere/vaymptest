import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../../styles/styles";
import ProductCard from "../Route/ProductCard/ProductCard";

const SuggestedProduct = ({ data }) => {
  const { allProducts } = useSelector((state) => state.products);
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    let filteredData = [];
    
    if (data.subCategory) {
      filteredData = allProducts.filter(
        (product) =>
          product.listing !== "Event" &&
          product.subCategory === data.subCategory
      );
    } else if (data.footwearSubCategories) {
      filteredData = allProducts.filter(
        (product) =>
          product.listing !== "Event" &&
          product.footwearSubCategories === data.footwearSubCategories
      );
    }

    setProductData(filteredData.slice(0, 10));
  }, [allProducts, data.subCategory, data.footwearSubCategories]);

  console.log("11111111", data);

  return (
    <div>
      {data ? (
        <div className={`p-3`}>
          <h2 className={`${styles.heading} text-[25px] font-[500] border-b mb-5`}>
            Related Products
          </h2>
          <div className="grid grid-cols-2 gap-1 sm:mx-0 md:mx-0 md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
            {productData &&
              productData.map((i, index) => (
                <ProductCard data={i} key={index} />
              ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SuggestedProduct;