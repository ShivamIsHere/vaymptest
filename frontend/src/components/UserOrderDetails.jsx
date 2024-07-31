
import React, { useEffect, useState } from "react";
import { BsFillBagFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/styles";
import { getAllOrdersOfUser } from "../redux/actions/order";
import { server } from "../server";
import { Button } from "@material-ui/core";
import { RxCross1 } from "react-icons/rx";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import { Oval } from 'react-loader-spinner';
import { Navigate } from "react-router-dom";

const UserOrderDetails = () => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(1);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [kuchvi, setkuchvi] = useState([]);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isReturnable, setIsReturnable] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [opn, setOpn] = useState(false);
  const [opens, setOpens] = useState(false);


  const { id } = useParams();
  useEffect(() => {
    axios
      .get(`${server}/kuchvi/get-all-admin-kuchvi-request`, {
        withCredentials: true,
      })
      .then((res) => {
        // console.log("jklllllllllll",res.data)

        setkuchvi(res.data.allKuchviRequest);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error.response);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!loading) {
      const updateRows = () => {
        const newRows = kuchvi
          .filter((val) => val.userId === user._id)
          .map((val, ind) => ({
            id: ind, // Ensure the unique ID for DataGrid is unique
            orderid: val.orderId,
            productid: val.productId,
            size: val.size,
            image: val.img,
            itemsQty: 1,
            total: "₹" + val.markedPrice,
            status: val.status,
            user: val.user,
            paymentInfo: val.paymentInfo,
            address: val.shippingAddress,
            userId: val.userId,
            shopId: val.shopId,
            delivered: val.delivered,
            cancel: val.cancel,

            markedPrice: val.markedPrice,
            productName: val.productName,
            product: val.product,
            discountPrice: val.discountPrice,
            shopPrice: val.shopPrice,
            kuchviId: val.kuchviId,
            return1: val.return1,
            refund: val.refund,
            reundStatus: val.refundStatus,
            deliveredAt: val.deliveredAt,
            returnedAt: val.returnedAt,
            createdAt: val.createdAt,
          }));
        setRows(newRows);
      };

      updateRows();
    }
  }, [kuchvi, user._id, loading]);

  const data = rows.find((item) => item.kuchviId === id);
  console.log("Data:", data);

  useEffect(() => {
    if (data?.delivered) {
      const deliveredAt = new Date(data.deliveredAt).getTime();
      const currentTime = Date.now();
      const returnPeriod = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds

      if (currentTime - deliveredAt < returnPeriod) {
        setIsReturnable(true);
        const remainingTime = returnPeriod - (currentTime - deliveredAt);
        startTimer(remainingTime);
      }
    }
  }, [data]);

  const startTimer = (remainingTime) => {
    setCountdown(remainingTime);
    const interval = setInterval(() => {
      setCountdown((prevTime) => {
        if (prevTime <= 1000) {
          clearInterval(interval);
          setIsReturnable(false);
          return 0;
        }
        return prevTime - 1000;
      });
    }, 1000);
    setTimerInterval(interval);
  };

  let active;
  if (data?.status === "processing") active = 1;
  if (data?.transferredToDeliveryPartner) active = 2;
  if (data?.delivered) active = 3;
  if (data?.return1) active = 4;
  if (data?.status === "Returned") active = 5;
  if (data?.status === "cancel Request") active = 6;
  if (loading) {
    return   <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Oval color="#00BFFF" height={80} width={80} />
  </div>; // Show a loading message while fetching data
  }
  if (!data) {
    return <div>No data found for this order.</div>;
  }

  console.log("selectedItem,,,,,,,,,,,,,,,,,,", data.orderid);
  const reviewHandler = async (e) => {
    await axios
      .put(
        `${server}/product/create-new-review`,
        {
          user,
          rating,
          comment,
          productId: data?.productid,
          kuchviId: data?.kuchviId,
          orderId: data?.orderId,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success(res.data.message);
        dispatch(getAllOrdersOfUser(user._id));
        setComment("");
        setRating(null);
        setOpen(false);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      console.log("selectedItem,,,,,,,,,,,,,,,,,,", data);
      const groupTitle = data?.kuchviId + " " + data?.productName;
      const userId = data.userId;
      const sellerId = data?.product.adminCreated;
      await axios
        .post(`${server}/conversation/create-new-conversation`, {
          groupTitle,
          userId,
          sellerId,
        })
        .then((res) => {
          navigate(`/inbox?${res.data.conversation._id}`);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } else {
      toast.error("Please login to create a conversation");
    }
  };
  const handleProductClick = () => {
    navigate(`/product/${data.productid}`);
    window.location.reload();
  };

  const handleCancelClick = async () => {
    try {
      console.log("================???????", data);
      const response = await axios.patch(
        `${server}/kuchvi/update-kuchvi/${data.kuchviId}`,
        {
          cancel: true,
          status: "cancel Request",
        }
      );

      if (response.status >= 200 && response.status < 300) {
        console.log("Stock updated successfully");
      } else {
        throw new Error(
          `Failed to update stock - Unexpected status code: ${response.status}`
        );
      }
      window.location.reload();
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };


  const handleReturnClick = async () => {
    try {
      console.log("================???????", data);
      const response = await axios.patch(
        `${server}/kuchvi/update-kuchvi/${data.kuchviId}`,
        {
          return1: true,
          returnedAt: Date.now(),
          status: "Return Request",
        }
      );

      if (response.status >= 200 && response.status < 300) {
        console.log("Stock updated successfully");
      } else {
        throw new Error(
          `Failed to update stock - Unexpected status code: ${response.status}`
        );
      }
      window.location.reload();
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };
  return (
    <div className={`py-4 min-h-0 ${styles.section}`}>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <BsFillBagFill size={30} color="crimson" />
          <h1 className="pl-2 text-[20px] font-semibold">Order Details</h1>
        </div>
      </div>

      <div className="w-full flex items-center justify-between py-3">
      <h5 className="text-[#00000084] text-sm font-semibold">
      Order ID #<span>{data?.kuchviId?.slice(11, 24)}</span>
      </h5>
      <h5 className="text-[#00000084] text-sm font-semibold ml-[70px]">
      Placed on <span>{new Date(data?.createdAt).toLocaleString()}</span>
      </h5>
      </div>

      {data ? (
        <div className="w-full flex flex-col sm:flex-row items-start mb-5 bg-white shadow rounded-lg p-4">
          <div style={{display:'flex',flexDirection:'row'}}>
          <img src={`${data.image}`} alt="" 
          className="w-[80px] h-[80px] sm:w-[110px] sm:h-[150px] object-contain cursor-pointer mb-3 sm:mb-0" 
          onClick={handleProductClick}
          />
          <div onClick={handleProductClick}
          className="ml-5">
          <h5 className="pl-3 text-[14px] hover:bg-blue-400 mb-2">{data.productName}</h5>
          <h5 className="pl-3 text-[15px] text-[#00000091]">Size:{data.size}</h5>
            <h5 className="pl-3 text-[15px] text-[#00000091]">Qty:{data.itemsQty}</h5>
            <h5 className="pl-3 font-bold text-[#000]">₹{data.discountPrice}</h5>
          </div>
          </div>
            {/* Progress Feature */}
            <div className="w-full"
            >
<div className="w-full">
  <div className="w-full flex flex-col items-center pt-5">
  <h2 className="text-[19px] font-Poppins">Order Progress</h2>
  <div className="w-full max-w-[600px] flex flex-col mb-4 items-start sm:items-center sm:flex-row sm:justify-between relative">
    {data.return1 ? (
        <>
          {data.status === "Return Request" ? (
            <div className="absolute sm:top-2 top-10 sm:left-[10%] left-2 sm:transform-none sm:right-[1%] flex sm:flex-row flex-col sm:justify-between sm:w-[70%] w-full sm:h-auto h-[70%]">
              {[1, 2, 3, 4].map((_, index) => (
                <div
                  key={index}
                  className={`flex-1 sm:h-0.5 h-full sm:w-full w-0.5 ${active ? 'bg-green-500' : 'bg-transparent'}`}
                ></div>
              ))}
            </div>
          ) : (
            <div className="absolute sm:top-2 top-10 sm:left-[10%] left-2 sm:transform-none sm:right-[1%] flex sm:flex-row flex-col sm:justify-between sm:w-[80%] w-full sm:h-auto h-[80%]">
              {[1, 2, 3, 4].map((_, index) => (
                <div
                  key={index}
                  className={`flex-1 sm:h-0.5 h-full sm:w-full w-0.5 ${active ? 'bg-green-500' : 'bg-transparent'}`}
                ></div>
              ))}
            </div>
          )}

          {['Processing', 'Shipped', 'Delivered', 'Return', 'Refund'].map((step, index) => (
            <div className="flex flex-row items-center sm:flex-col sm:items-center relative sm:flex-1 mb-2 h-16" key={index}>
              <div
                className={`w-4 h-4 rounded-full border-2 ${active > index ? 'bg-green-500 border-green-600' : 'border-gray-400'} flex items-center justify-center text-white`}
              ></div>
              <p className={`ml-2 sm:ml-0 mt-0 sm:mt-2 ${active > index ? 'text-green-500' : 'text-gray-400'}`}>{step}</p>
            </div>
          ))}
        </>
      ) : active === 1 ? (
        <>
          <div className="absolute sm:top-2 top-8 sm:left-[16%] left-2 sm:transform-none sm:right-[50%] flex sm:flex-row flex-col sm:justify-between sm:w-[15%] w-full sm:h-auto h-[20%]">
            <div
              className={`flex-1 sm:h-0.5 h-full sm:w-full w-0.5 ${active === 1 ? 'bg-green-500' : 'bg-transparent'}`}
            ></div>
          </div>
          {['Processing', 'Shipped', 'Delivered'].map((step, index) => (
            <div className="flex flex-row items-center sm:flex-col sm:items-center relative sm:flex-1 mb-2 h-20" key={index}>
              <div
                className={`w-4 h-4 rounded-full border-2 ${active > index ? 'bg-green-500 border-green-600' : 'border-gray-400'} flex items-center justify-center text-white`}
              ></div>
              <p className={`ml-2 sm:ml-0 mt-0 sm:mt-2 ${active > index ? 'text-green-500' : 'text-gray-400'}`}>{step}</p>
            </div>
          ))}
        </>
      ) : active === 6 ? (
        <>
          <div className="absolute sm:top-2 top-10 sm:left-[25%] left-2 sm:transform-none sm:right-[50%] flex sm:flex-row flex-col sm:justify-between sm:w-[50%] w-full sm:h-auto h-[50%]">
            <div
              className={`flex-1 sm:h-0.5 h-full sm:w-full w-0.5 ${active === 6 ? 'bg-red-500' : 'bg-transparent'}`}
            ></div>
          </div>
          {['Processing', 'Cancelled'].map((step, index) => (
            <div className="flex flex-row items-center sm:flex-col sm:items-center relative sm:flex-1 mb-2 h-20" key={index}>
              <div
                className={`w-4 h-4 rounded-full border-2 ${active === 6 ? 'bg-red-500 border-red-600' : 'border-gray-400'} flex items-center justify-center text-white`}
              ></div>
              <p className={`ml-2 sm:ml-0 mt-0 sm:mt-2 ${active === 6 ? 'text-red-500' : 'text-gray-400'}`}>{step}</p>
            </div>
          ))}
        </>
      ) : (
        <>
          <div className="absolute sm:top-2 top-8 sm:left-[16%] left-2 sm:transform-none sm:right-[50%] flex sm:flex-row flex-col sm:justify-between sm:w-[68%] w-full sm:h-auto h-[70%]">
            {[1].map((_, index) => (
              <div
                className={`flex-1 sm:h-0.5 h-full sm:w-full w-0.5 ${active ? 'bg-green-500' : 'bg-transparent'}`}
              ></div>
            ))}
          </div>
          {['Processing', 'Shipped', 'Delivered'].map((step, index) => (
            <div className="flex flex-row items-center sm:flex-col sm:items-center relative sm:flex-1 mb-2 h-20" key={index}>
              <div
                className={`w-4 h-4 rounded-full border-2 ${active > index ? 'bg-green-500 border-green-600' : 'border-gray-400'} flex items-center justify-center text-white`}
              ></div>
              <p className={`ml-2 sm:ml-0 mt-0 sm:mt-2 ${active > index ? 'text-green-500' : 'text-gray-400'}`}>{step}</p>
            </div>
          ))}
        </>
      )}
    </div>
    <br />
    <div className="border-t w-full text-center">
        <h5 className="pt-2 text-sm font-Poppins">
        {data.status === "Returned"
          ? "Your order is returned!"
          : data.status === "Transferred to delivery partner"
          ? "Your order is on the way!"
          : data.status === "Delivered"
          ? "Your order has been delivered!"
          : data.status === "Return Request"
          ? "Your return request is in process!"
          : data.status === "cancel Request"
          ? "Your order has been Cancelled!"
          : "Your order is processing in shop."}
      </h5>
    </div>
    {!data.isReviewed && (data.status === "Delivered" || data.status === "Transferred to delivery partner") ? (
            <div
        className={`${styles.button} text-black !bg-flipkart-yellow`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
          setSelectedItem(data); // Ensure selectedItem is set correctly
        }}
      >
        Write a review
      </div>
    ) : null}
  </div>
</div>
</div>
</div>

      ) : (
        <p>No data found for this order.</p>
      )}

{open && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg mx-4 md:mx-auto">
          <div className="flex justify-end">
            <RxCross1
              size={30}
              onClick={() => setOpen(false)}
              className="cursor-pointer"
            />
          </div>
          <h2 className="text-2xl font-semibold text-center mb-6">
            Give a Review
          </h2>
          <div className="flex items-start mb-6">
            <img
              src={`${data?.image}`}
              alt={data?.productName}
              className="w-24 h-24 object-cover rounded-md"
            />
            <div className="ml-5">
              <h4 className="text-lg font-medium">{data?.productName}</h4>
              <p className="text-sm text-gray-600">Size: {data?.size}</p>
              <p className="text-sm text-gray-600">Qty: {data?.itemsQty}</p>
              <p className="text-lg font-semibold">₹{data?.discountPrice}</p>
            </div>
          </div>
          <h5 className="text-lg font-medium mb-2">
            Give a Rating <span className="text-red-500">*</span>
          </h5>
          <div className="flex mb-6">
            {[1, 2, 3, 4, 5].map((i) =>
              rating >= i ? (
                <AiFillStar
                  key={i}
                  className="mr-1 cursor-pointer"
                  color="rgb(246,186,0)"
                  size={25}
                  onClick={() => setRating(i)}
                />
              ) : (
                <AiOutlineStar
                  key={i}
                  className="mr-1 cursor-pointer"
                  color="rgb(246,186,0)"
                  size={25}
                  onClick={() => setRating(i)}
                />
              )
            )}
          </div>
          <div className="mb-6">
            <label className="block text-lg font-medium mb-1">
              Write a comment
              <span className="ml-1 text-sm text-gray-500">(optional)</span>
            </label>
            <textarea
              name="comment"
              id="comment"
              cols="30"
              rows="5"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was your product? Write your expression about it!"
              className="w-full border rounded-md p-2 outline-none focus:ring focus:ring-flipkart-orange"
            ></textarea>
          </div>
          <div
            className={`${styles.button} bg-flipkart-orange text-white text-xl w-full py-2 text-center rounded-md cursor-pointer`}
            onClick={reviewHandler}
          >
            Submit
          </div>
        </div>
      </div>
    )}


      <div className="w-full 800px:flex items-center bg-white shadow rounded-lg p-4">
        <div className="w-full 800px:w-[60%]">
          <h4 className="pt-1 text-[16px] font-semibold">Shipping Address</h4>
          <h4 className="pt-1 text-[14px] font-semibold">
            {data?.address.userName}
          </h4>  
          <h4 className="pt-1 text-[14px]">
          {data?.address.address1 + ", " + data?.address.address2+ "," + data?.address.landmark}          </h4>
          <h4 className="text-[14px]">{data?.address.country}</h4>
          <h4 className="text-[14px]">{data?.address.city + ", " + data?.address.zipCode}</h4>

          <h4 className="text-[14px]">Phone Number: {data?.address.phoneNumber}{","}{data?.address.altphoneNumber}</h4>
          </div>
        <div className="w-full 800px:w-[40%] mb-11">
          <h4 className="pt-3 text-[16px] font-medium">Payment Info</h4>
          <h4>
            Status:{" "}
            {data?.paymentInfo[0]?.status ? data?.paymentInfo[0]?.status : "Not Paid"}
          </h4>
          <h4>
            Mode:{" "}
            {data?.paymentInfo[0]?.type ? data?.paymentInfo[0]?.type : ""}
          </h4>
        </div>
      </div>
      <br />
      {/* for mobile view */}
      <div className="relative" style={{ zIndex: 1 }}>
      <div className="fixed bottom-0 left-0 w-full bg-gray-800 shadow-lg p-1 lg:hidden" style={{ zIndex: 0 }}>
      <div className="flex justify-between items-center">
      <div
        className={`${styles.button} !bg-flipkart-blue rounded-[4px] h-11`}
        onClick={handleMessageSubmit}
      >
        <span className="font-medium text-sm flex items-center">SEND MESSAGE</span>
        </div>
      
      {data.status == "Delivered" ||
      data.status == "Returned" ||
      data.status == "Return Request" ? (
        <Button
        className={`${styles.button} !bg-flipkart-blue rounded-[10px] h-11`}
        variant="contained"
        style={{ backgroundColor: !isReturnable || data.status === "Returned" || data.return1 ? '#bfdbfe' : '#60a5fa', 
          color: !isReturnable || data.status === "Returned" || data.return1 ? '#a0aec0' : '#000',
          borderRadius: '12px'
        }}          
        disabled={
            !isReturnable || data.status == "Returned" ? true : data.return1
          }
          onClick={() => setOpens(true)}
        >
          {data.status === "Returned" || data.return1 ? 'Returned' : 'Return'}
        </Button>
      ) : (
        <Button
          className={`${styles.button} !bg-flipkart-blue rounded-[4px] h-11`}
          variant="contained"
          style={{
            backgroundColor: data.status === "cancel Request" || data.cancel ? '#bfdbfe' : '#60a5fa',
            color: data.status === "cancel Request" || data.cancel ? '#a0aec0' : '#000',
            borderRadius: '12px' // Change border radius to 20px
          }}
          disabled={data.status == "cancel Request" ? true : data.cancel}
          // disabled={data.cancel}
          onClick={() => setOpn(true)}
        >
          {data.status === "cancel Request" || data.cancel ? 'Cancelled' : 'Cancel'}        
        </Button>
      )}
      {opn && (
        <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen">
          <div className="w-[95%] 800px:w-[40%] min-h-[20vh] bg-white rounded shadow p-5">
            <div className="w-full flex justify-end cursor-pointer">
              <RxCross1 size={25} onClick={() => setOpn(false)} />
            </div>
            <h3 className="text-[25px] text-center py-5 font-Poppins text-[#000000cb]">
              Are you sure you wanna cancel this order?
            </h3>
            <div className="w-full flex items-center justify-center">
              <div
                className={`${styles.button} !bg-red-500 text-white text-[18px] !h-[42px] mr-4`}
                onClick={() => setOpn(false)}
              >
                No
              </div>
              <div
                className={`${styles.button} !bg-red-500 text-white text-[18px] !h-[42px] ml-4`}
                onClick={() => { setOpn(false); handleCancelClick();}}
              >
                Yes
              </div>
            </div>
          </div>
        </div>
      )}
      {opens && (
        <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen">
          <div className="w-[95%] 800px:w-[40%] min-h-[20vh] bg-white rounded shadow p-5">
            <div className="w-full flex justify-end cursor-pointer">
              <RxCross1 size={25} onClick={() => setOpens(false)} />
            </div>
            <h3 className="text-[25px] text-center py-5 font-Poppins text-[#000000cb]">
              Are you sure you wanna Return this Product?
            </h3>
            <div className="w-full flex items-center justify-center">
              <div
                className={`${styles.button} !bg-red-500 text-white text-[18px] !h-[42px] mr-4`}
                onClick={() => setOpens(false)}
              >
                No
              </div>
              <div
                className={`${styles.button} !bg-red-500 text-white text-[18px] !h-[42px] ml-4`}
                onClick={() => { setOpens(false); handleReturnClick();}}
              >
                Yes
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
      </div>
      </div>
      {/* for larger screen */}
      <div className="hidden lg:flex justify-between items-center">
      <div
        className={`${styles.button} !bg-flipkart-blue rounded-[4px] h-11`}
        onClick={handleMessageSubmit}
      >
        <span className="font-medium text-sm flex items-center">SEND MESSAGE</span>
      </div>

      {data.status === "Delivered" ||
      data.status === "Returned" ||
      data.status === "Return Request" ? (
        <Button
          className={`${styles.button} !bg-flipkart-blue rounded-[10px] h-11`}
          variant="contained"
          style={{
            backgroundColor: !isReturnable || data.status === "Returned" || data.return1 ? '#bfdbfe' : '#60a5fa',
            color: !isReturnable || data.status === "Returned" || data.return1 ? '#a0aec0' : '#000',
            borderRadius: '12px'
          }}
          disabled={!isReturnable || data.status === "Returned" ? true : data.return1}
          onClick={() => setOpens(true)}
        >
          {data.status === "Returned" || data.return1 ? 'Returned' : 'Return'}
        </Button>
        
      ) : (
        <Button
          className={`${styles.button} !bg-flipkart-blue rounded-[4px] h-11`}
          variant="contained"
          style={{
            backgroundColor: data.status === "cancel Request" || data.cancel ? '#bfdbfe' : '#60a5fa',
            color: data.status === "cancel Request" || data.cancel ? '#a0aec0' : '#000',
            borderRadius: '12px'
          }}
          disabled={data.status === "cancel Request" ? true : data.cancel}
          onClick={() => setOpn(true)}
        >
          {data.status === "cancel Request" || data.cancel ? 'Cancelled' : 'Cancel'}        
        </Button>
      )}

      {opn && (
        <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen">
          <div className="w-[95%] 800px:w-[40%] min-h-[20vh] bg-white rounded shadow p-5">
            <div className="w-full flex justify-end cursor-pointer">
              <RxCross1 size={25} onClick={() => setOpn(false)} />
            </div>
            <h3 className="text-[25px] text-center py-5 font-Poppins text-[#000000cb]">
              Are you sure you wanna cancel this order?
            </h3>
            <div className="w-full flex items-center justify-center">
              <div
                className={`${styles.button} !bg-red-500 text-white text-[18px] !h-[42px] mr-4`}
                onClick={() => setOpn(false)}
              >
                No
              </div>
              <div
                className={`${styles.button} !bg-red-500 text-white text-[18px] !h-[42px] ml-4`}
                onClick={() => { setOpn(false); handleCancelClick();}}
              >
                Yes
              </div>
            </div>
          </div>
        </div>
      )}
      {opens && (
        <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen">
          <div className="w-[95%] 800px:w-[40%] min-h-[20vh] bg-white rounded shadow p-5">
            <div className="w-full flex justify-end cursor-pointer">
              <RxCross1 size={25} onClick={() => setOpens(false)} />
            </div>
            <h3 className="text-[25px] text-center py-5 font-Poppins text-[#000000cb]">
              Are you sure you wanna Return this Product?
            </h3>
            <div className="w-full flex items-center justify-center">
              <div
                className={`${styles.button} !bg-red-500 text-white text-[18px] !h-[42px] mr-4`}
                onClick={() => setOpens(false)}
              >
                No
              </div>
              <div
                className={`${styles.button} !bg-red-500 text-white text-[18px] !h-[42px] ml-4`}
                onClick={() => { setOpens(false); handleReturnClick();}}
              >
                Yes
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
      <br />
    </div>
  );
};

export default UserOrderDetails;