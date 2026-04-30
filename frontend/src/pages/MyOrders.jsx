import React, { useEffect, useState } from "react";
import { Receipt, ArrowLeft, Loader } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserOrderCard from "../components/UserOrderCard";
import OwnerOrderCard from "../components/OwnerOrderCard";
import Nav from "../components/Nav";
import { setMyOrders } from "../redux/userSlice";
import { OrderSkeleton } from "../components/Skeleton";

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

    const handleOtpSent = ({ message }) => {
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
    <div className="min-h-screen relative bg-bg-secondary text-text-primary overflow-hidden pb-20">
      <Nav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* ── HEADER ── */}
        <header className="mb-10">

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 h-10 px-5 bg-bg-card border border-border rounded-xl text-text-secondary font-bold text-[10px] uppercase tracking-widest hover:border-brand hover:text-brand shadow-sm active:scale-95 transition-all duration-300 mb-8"
          >
            <ArrowLeft
              size={14}
            />
            Go Back
          </button>

          {/* Title + badge */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-black text-brand uppercase tracking-[0.25em] mb-3">
                {isOwner ? "Shop Management" : "Order History"}
              </p>
              <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tighter leading-none">
                {isOwner ? "Shop" : "My"}{" "}
                <span className="text-brand">Orders.</span>
              </h1>
              <p className="text-text-secondary font-medium text-sm mt-3 tracking-wide">
                {isOwner
                  ? "Manage incoming orders and update status instantly"
                  : "Track your delicious orders in real-time"}
              </p>
            </div>

            {/* Live count badge */}
            {!loading && myOrders?.length > 0 && (
              <div className="flex items-center gap-2 bg-brand/5 border border-brand/10 px-4 py-2 rounded-xl shadow-sm">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
                </span>
                <span className="text-brand text-[10px] font-black uppercase tracking-widest">
                  {myOrders.length} {myOrders.length === 1 ? "Order" : "Orders"}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* ── CONTENT ── */}
        <main className="relative z-10">
          {/* Loading */}
          {loading ? (
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => (
                <OrderSkeleton key={i} />
              ))}
            </div>

          ) : !myOrders || myOrders.length === 0 ? (
            /* Empty state */
            <div className="bg-bg-card border border-border rounded-[2.5rem] py-24 px-8 flex flex-col items-center text-center shadow-sm">
              <div className="w-20 h-20 bg-bg-secondary rounded-2xl flex items-center justify-center mb-6 border border-border relative z-10 shadow-inner">
                <Receipt size={36} className="text-text-muted" />
              </div>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-3 relative z-10">
                {isOwner ? "No sales yet" : "Nothing here yet"}
              </p>
              <h2 className="text-2xl font-black text-text-primary tracking-tight mb-4 relative z-10">
                {isOwner ? "No orders received" : "You haven't ordered yet"}
              </h2>
              <p className="text-text-secondary text-[15px] font-medium mb-10 max-w-sm relative z-10 leading-relaxed">
                {isOwner
                  ? "Incoming orders from hungry customers will appear right here."
                  : "Explore the best local restaurants and place your first premium order!"}
              </p>
              <button
                className="primary-button px-10 py-4 rounded-xl font-black text-[12px] uppercase tracking-widest relative z-10"
                onClick={() => navigate("/")}
              >
                {isOwner ? "Check My Menu" : "Explore Menu"}
              </button>
            </div>

          ) : (
            /* Orders list */
            <div className="grid gap-6 auto-rows-max">
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
          <div className="mt-16 text-center">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.3em]">
              Vingo • Order Management System
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default MyOrders;