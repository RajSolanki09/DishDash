import React, { useEffect, useState } from "react";
import {
  IoReceiptOutline,
} from "react-icons/io5";
import { TbArrowLeft } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserOrderCard from "../components/UserOrderCard";
import OwnerOrderCard from "../components/OwnerOrderCard";
import { ClipLoader } from "react-spinners";
import Nav from "../components/Nav";
import { setMyOrders } from "../redux/userSlice";

function MyOrders() {
  const { userData, myOrders, socket } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewOrder = (data) => {
      console.log("🔔 New order received:", data);
      if (
        data.shopOrder?.owner === userData._id ||
        data.shopOrder?.owner?._id === userData._id
      ) {
        dispatch(setMyOrders([data, ...myOrders]));
      }
    };

    const handleStatusUpdate = ({ orderId, shopId, status, userId }) => {
      console.log("🔄 Status update received:", { orderId, shopId, status, userId });
      if (userId === userData._id || userData.role === "owner") {
        const updatedOrders = myOrders.map((order) => {
          if (order._id === orderId) {
            const updatedShopOrders = order.shopOrders.map((shopOrder) => {
              if (shopOrder.shop?._id === shopId || shopOrder.shop === shopId) {
                return { ...shopOrder, status };
              }
              return shopOrder;
            });
            return { ...order, shopOrders: updatedShopOrders };
          }
          return order;
        });
        dispatch(setMyOrders(updatedOrders));
      }
    };

    const handleDeliveryBoyAssigned = ({ orderId, shopId, deliveryBoy }) => {
      console.log("🚴 Delivery boy assigned:", deliveryBoy);
      const updatedOrders = myOrders.map((order) => {
        if (order._id === orderId) {
          const updatedShopOrders = order.shopOrders.map((shopOrder) => {
            if (shopOrder.shop?._id === shopId || shopOrder.shop === shopId) {
              return { ...shopOrder, assignedDeliveryBoy: deliveryBoy };
            }
            return shopOrder;
          });
          return { ...order, shopOrders: updatedShopOrders };
        }
        return order;
      });
      dispatch(setMyOrders(updatedOrders));
    };

    const handleOtpSent = ({ orderId, message }) => {
      console.log("📧 OTP sent:", message);
    };

    socket.on("newOrder", handleNewOrder);
    socket.on("update-status", handleStatusUpdate);
    socket.on("delivery-boy-assigned", handleDeliveryBoyAssigned);
    socket.on("delivery-otp-sent", handleOtpSent);

    return () => {
      socket.off("newOrder", handleNewOrder);
      socket.off("update-status", handleStatusUpdate);
      socket.off("delivery-boy-assigned", handleDeliveryBoyAssigned);
      socket.off("delivery-otp-sent", handleOtpSent);
    };
  }, [socket, userData, myOrders, dispatch]);

  const isOwner = userData?.role === "owner";

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50">
      <Nav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">

        {/* ── HEADER ── */}
        <header className="mb-10">

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 h-10 px-4 mb-7 bg-white border border-gray-200 rounded-2xl text-gray-600 font-bold text-[11px] uppercase tracking-wide shadow-sm hover:bg-orange-50 hover:border-[#ff4d2d]/30 hover:text-[#ff4d2d] hover:shadow-md active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <TbArrowLeft
              size={16}
              className="group-hover:-translate-x-0.5 transition-transform duration-200"
            />
            Back
          </button>

          {/* Title + badge */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-black text-[#ff4d2d] uppercase tracking-[0.25em] mb-2">
                {isOwner ? "Shop Management" : "Order Tracking"}
              </p>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter leading-none">
                {isOwner ? "Shop" : "My"}{" "}
                <span className="text-[#ff4d2d]">Orders.</span>
              </h1>
              <p className="text-gray-400 font-medium text-sm mt-2">
                {isOwner
                  ? "Manage incoming orders and update status"
                  : "Track your delicious orders in real-time"}
              </p>
            </div>

            {/* Live count badge */}
            {!loading && myOrders?.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4a] rounded-2xl shadow-md shadow-orange-200">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
                <span className="text-white text-[10px] font-black uppercase tracking-widest">
                  {myOrders.length} {myOrders.length === 1 ? "Order" : "Orders"}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* ── CONTENT ── */}
        <main>
          {/* Loading */}
          {loading ? (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-md shadow-gray-100/40 py-28 flex flex-col items-center justify-center">
              <ClipLoader size={40} color="#ff4d2d" speedMultiplier={0.7} />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mt-6">
                Fetching your orders
              </p>
              <p className="text-[10px] text-gray-300 font-medium mt-1.5">
                Just a moment...
              </p>
            </div>

          ) : !myOrders || myOrders.length === 0 ? (
            /* Empty state */
            <div className="bg-white rounded-3xl border border-gray-100 shadow-md shadow-gray-100/40 py-20 px-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-5">
                <IoReceiptOutline size={28} className="text-[#ff4d2d]" />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                {isOwner ? "No sales yet" : "Nothing here yet"}
              </p>
              <h2 className="text-xl font-black text-gray-900 tracking-tight mb-2">
                {isOwner ? "No orders received" : "You haven't ordered yet"}
              </h2>
              <p className="text-gray-400 text-sm font-medium mb-8 max-w-xs">
                {isOwner
                  ? "Your incoming orders will appear here once customers start ordering."
                  : "Explore restaurants and place your first order!"}
              </p>
              <button
                className="px-8 py-3.5 bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4a] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                onClick={() => navigate("/")}
              >
                {isOwner ? "Check My Menu" : "Browse Food"}
              </button>
            </div>

          ) : (
            /* Orders list */
            <div className="grid gap-5">
              {myOrders.map((order) => {
                if (!isOwner) {
                  return <UserOrderCard key={order._id} data={order} />;
                } else {
                  return order.shopOrders?.map((shopOrder, idx) => (
                    <OwnerOrderCard
                      key={`${order._id}-${idx}`}
                      data={{
                        _id: order._id,
                        user: order.user,
                        deliveryAddress: order.deliveryAddress,
                        paymentMethod: order.paymentMethod,
                        payment: order.payment,
                        createdAt: order.createdAt,
                        shopOrder: shopOrder,
                      }}
                    />
                  ));
                }
              })}
            </div>
          )}
        </main>

        {/* Footer label */}
        {!loading && myOrders?.length > 0 && (
          <div className="mt-14 text-center">
            <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.3em]">
              Vingo • Order Management
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default MyOrders;