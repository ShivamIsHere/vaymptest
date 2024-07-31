import React from 'react'
import styles from '../../styles/styles'

const CheckoutSteps = ({active}) => {
    console.log(active);
  return (
    <div className='w-full flex justify-center'>
        <div className="w-[90%] 800px:w-[50%] flex items-center">
               <div className={`${styles.noramlFlex}`}>
                <div className={`${styles.cart_button} !bg-flipkart-blue`}>
                       <span className={`${styles.cart_button_text}`}>Shipping</span>
                </div>
                <div className={`${
                    active > 1 ? "w-[30px] 800px:w-[70px] h-[4px] !bg-flipkart-blue"
                    : "w-[15px] 800px:w-[70px] h-[4px] !bg-sky-100"
                }`} />
               </div>

               <div className={`${styles.noramlFlex}`}>
                <div className={`${active > 1 ? `${styles.cart_button} !bg-flipkart-blue` : `${styles.cart_button} !bg-sky-100`}`}>
                    <span className={`${active > 1 ? `${styles.cart_button_text}` : `${styles.cart_button_text} !text-flipkart-blue`}`}>
                        Payment
                    </span>
                </div>
               </div>

               <div className={`${styles.noramlFlex}`}>
               <div className={`${
                    active > 3 ? "w-[30px] 800px:w-[70px] h-[4px] !bg-flipkart-blue"
                    : "w-[15px] 800px:w-[70px] h-[4px]  !bg-sky-100"
                }`} />
                <div className={`${active > 2 ? `${styles.cart_button}!bg-flipkart-blue` : `${styles.cart_button} !bg-sky-100`}`}>
                    <span className={`${active > 2 ? `${styles.cart_button_text}` : `${styles.cart_button_text} !text-flipkart-blue`}`}>
                        Success
                    </span>
                </div>
               </div>
        </div>
    </div>
  )
}

export default CheckoutSteps;