import React from 'react';
import styles from '../../styles/styles';
import { BiMenuAltLeft } from 'react-icons/bi';
import { IoIosArrowDown } from 'react-icons/io';

const ShimmerContainer = () => {
  return (
    <div>
    <div className="w-full h-[320px] bg-blue-600">
      <div className="fixed top-0 left-0 w-full z-10 bg-blact h-[80px] pb-2">
        <div className={`${styles.section} flex justify-between items-center py-1`}>
          <div className="hidden 800px:flex items-center justify-between w-full">
            {/* vaymp logo shimmer */}
            <div className="w-28 h-8 pt-4 bg-gray-400 rounded animate-pulse"></div>
            
            {/* search bar shimmer */}
            <div className="w-[50%] relative">
              <div className="w-full h-[40px] pb-2 bg-gray-400 rounded animate-pulse"></div>
            </div>

            {/* Go to Dashboard button shimmer */}
            <div className="w-[155px] h-12 pb-2 bg-gray-400 rounded animate-pulse"></div>
          </div>
        </div>

        <div className={`transition hidden 800px:flex items-center justify-between w-full bg-blue-300 h-[60px] py-2`}>
          <div className={`${styles.section} relative ${styles.noramlFlex} justify-between`}>
            {/* categories shimmer */}
            <div className="relative mt-[1px] h-[50px] w-[270px] hidden 1000px:block">
              <div className="w-full h-full bg-gray-400 rounded-t-md animate-pulse flex items-center justify-between pl-10 pr-2">
                {/* <BiMenuAltLeft size={30} className="text-gray-400" />
                <IoIosArrowDown size={20} className="text-gray-400" /> */}
              </div>
            </div>
            
            {/* nav items shimmer */}
            <div className={`${styles.noramlFlex}`}>
              <div className="w-32 h-6 bg-gray-400 rounded animate-pulse"></div>
            </div>

            {/* right side icons shimmer */}
            <div className="flex">
              <div className="w-10 h-10 bg-gray-400 rounded-full animate-pulse mr-4"></div>
              <div className="w-10 h-10 bg-gray-400 rounded-full animate-pulse mr-4"></div>
              <div className="w-10 h-10 bg-gray-400 rounded-full animate-pulse mr-4"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Product card shimmer */}
      <div className="mt-28">
      <div className=" w-full h-[560px]">
        <div className="w-[340px] h-[360px] bg-black rounded-lg shadow-sm p-3 relative cursor-pointer animate-pulse mt-2">
          <div className="w-[240px] h-[190px] bg-orange-600 rounded"></div>
          <div className="mt-1 h-4 bg-red-400 rounded w-3/4"></div>
          <div className="mt-1 h-4 bg-red-400 rounded w-3/4"></div>
          <div className="mt-1 h-4 bg-indigo-900 rounded w-1/2"></div>
          <div className="py-0 flex items-center justify-between mt-4">
            <div className="flex items-center">
              <span className="flex items-center text-sm text-blue-800 font-bold -ml-2 mr-1">
                <span className="ml-0 mr-1 bg-green-400 h-4 w-8 rounded"></span>
              </span>
              <h5 className="text-base bg-yellow-400 h-4 w-16 rounded"></h5>
              <div className="flex items-center ml-2">
                <h4 className="text-sm bg-purple-400 h-4 w-12 rounded line-through"></h4>
              </div>
            </div>
          </div>
          <div className="absolute right-2 top-5">
            {/* Placeholder for heart icon */}
            <div className="w-8 h-8 bg-sky-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
      </div>
    </div>
</div>
  );
};

const ProductShimmer = () => {
  return (
    <div className="hidden lg:grid lg:grid-cols-5 gap-8 w-full px-14 pt-2">
      {Array.from({ length: 40 }).map((_, index) => (
        <ShimmerContainer key={index} />
      ))}
    </div>
  );
};

export default ProductShimmer;
