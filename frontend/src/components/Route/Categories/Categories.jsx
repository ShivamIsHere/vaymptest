import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { brandingData, categoriesData } from "../../../static/data";
import Header from "../../Layout/Header";
import styles from "../../../styles/styles";
import BottomNav from "../../Layout/BottomNav";

const Categories = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if location.pathname is '/categories'
  if (location.pathname === '/categories') {
    return (
      <>
  <Header />
  <div className={`${styles.section} hidden sm:block`}>
    <div className={`branding my-12 flex justify-between w-full shadow-sm bg-white p-5 rounded-md`}>
      {brandingData &&
        brandingData.map((i, index) => (
          <div className="flex items-start" key={index}>
            {i.icon}
            <div className="px-3">
              <h3 className="font-bold text-sm md:text-base">{i.title}</h3>
              <p className="text-xs md:text-sm">{i.Description}</p>
            </div>
          </div>
        ))}
    </div>
  </div>

  <div className={`${styles.section} bg-white p-6 rounded-lg mb-12`} id="categories">
    <div className="flex flex-wrap justify-between gap-5 md:gap-10 lg:gap-20 xl:gap-30">
      {categoriesData &&
        categoriesData.map((i) => {
          const handleSubmit = () => {
            console.log("i.title",i.title)
            if(i.title==="Cloths"){
            navigate(`/search/cloths?page=1`);
          }else if(i.title==="Shoes"){
            navigate(`/search/shoes?page=1`);
          }else if(i.title==="Accessories"){
            navigate(`/coming-soon`);

          }
          };
          return (
            <div className="w-full md:w-2/5 lg:w-1/4 xl:w-1/5 cursor-pointer" key={i.id} onClick={handleSubmit}>
              <div className="overflow-hidden relative">
                <h5 className="leading-1.3 text-center font-bold text-black shadow p-4" style={{ fontSize: "24px", position: "relative", zIndex: "1" }}>{i.title}</h5>
                <div className="shadow overflow-hidden relative flex justify-center items-center mt-8">
                  <img
                    src={i.image_Url}
                    className="w-full h-auto max-w-[14rem] rounded-full" 
                    alt={i.title}
                  />
                </div>
              </div>
            </div>
          );
        })}
    </div>
  </div>
  <BottomNav/>
</>

    );
  } else {
    return (
      <>
        <div className={`${styles.section} hidden sm:block`}>
          <div className={`branding my-12 flex justify-between w-full shadow-sm bg-white p-5 rounded-md`}>
            {brandingData &&
              brandingData.map((item, index) => (
                <div className="flex items-start" key={index}>
                  {item.icon}
                  <div className="px-3">
                    <h3 className="font-bold text-sm md:text-base">{item.title}</h3>
                    <p className="text-xs md:text-sm">{item.Description}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className={`${styles.section} bg-white pt-0 pb-6 rounded-lg mb-12`} id="categories">
          <div className="flex flex-wrap justify-between gap-5 md:gap-10 lg:gap-20 xl:gap-30">
            {categoriesData &&
              categoriesData.map((item) => (
                <div className="w-1/4 md:w-1/4 lg:w-1/4 xl:w-1/5 cursor-pointer" key={item.id} onClick={() => {if(item.title==="Cloths"){
                  navigate(`/search/cloths?page=1`);
                }else if(item.title==="Shoes"){
                  navigate(`/search/shoes?page=1`);
                }else if(item.title==="Accessories"){
                  navigate(`/coming-soon`);
      
                }}}>
                  <div className="overflow-hidden relative">
                    <h5 className="leading-1.3 absolute top-10 left-0 right-0 text-center font-bold text-black shadow text-[13px] sm:text-[15px] md:text-[24px]">{item.title}</h5>
                    <img
                      src={item.image_Url}
                   className="w-full h-auto mt-20 lg:mt-24 rounded-full w-80% border border-gray-300"
                      alt={item.title}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </>
    );
  }
};

export default Categories;
