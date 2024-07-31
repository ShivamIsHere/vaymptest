import React from 'react'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'
import DashboardSideBar from '../../components/Shop/Layout/DashboardSideBar'
import AllRefundOrders from "../../components/Shop/AllRefundOrders";
import { SuccessfulRefunds } from '../../routes/Routes';

const ShopSuccessfulRefunds = () => {
  return (
    <div>
    <DashboardHeader />
    <div className="flex justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSideBar active={12} />
        </div>
        <div className="w-full justify-center flex">
           <SuccessfulRefunds />
        </div>
      </div>
</div>
  )
}

export default ShopSuccessfulRefunds;