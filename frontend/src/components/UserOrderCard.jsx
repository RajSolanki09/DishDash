// File: UserOrderCard.jsx (updated)
import React, { useState } from "react";
import axios from "axios";
import {
  IoLocationOutline,
  IoTimeOutline,
  IoChevronForwardCircleOutline,
  IoCardOutline,
  IoCashOutline,
} from "react-icons/io5";
import { FaCircle, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";

const UserOrderCard = ({ data }) => {
  const navigate = useNavigate();

  // Debug logs (keep for now, remove later if you want)
  console.log("UserOrderCard received data:", data);
  console.log("shopOrders:", data?.shopOrders);

  // Safety guard: no data
  if (!data) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 mb-10 shadow-md shadow-gray-100/40 p-8 text-center">
        <p className="text-red-600 font-bold text-lg">No order data received</p>
      </div>
    );
  }

  // Safety guard: no shopOrders
  if (!data.shopOrders || !Array.isArray(data.shopOrders) || data.shopOrders.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 mb-10 shadow-md shadow-gray-100/40 p-8 text-center">
        <p className="text-orange-600 font-bold text-lg">No shops/orders found</p>
      </div>
    );
  }

  // Rating state
  const buildInitialRatings = () => {
    const initial = {};
    data?.shopOrders?.forEach((shopOrder) => {
      shopOrder?.shopOrderItems?.forEach((item) => {
        const itemId = item.item?._id || item.item;
        if (item.item?.rating?.average) {
          initial[itemId] = Math.round(item.item.rating.average);
        }
      });
    });
    return initial;
  };

  const [selectedRating, setSelectedRating] = useState(buildInitialRatings());
  const [hoveredRating, setHoveredRating] = useState({});
  const [isRating, setIsRating] = useState(null);
  const [justRated, setJustRated] = useState({});

  const statusConfig = {
    pending: { color: "#F59E0B", light: "#FFFBEB", label: "Pending" },
    preparing: { color: "#3B82F6", light: "#EFF6FF", label: "In Kitchen" },
    "out of delivery": {
      color: "#8B5CF6",
      light: "#F5F3FF",
      label: "On the Way",
    },
    delivered: { color: "#10B981", light: "#ECFDF5", label: "Delivered" },
  };

  const handleRating = async (itemId, rating) => {
    if (isRating === itemId) return;

    setIsRating(itemId);
    try {
      await axios.post(
        `${serverUrl}/api/item/rating`,
        { itemId, rating },
        { withCredentials: true }
      );

      setSelectedRating((prev) => ({ ...prev, [itemId]: rating }));
      setJustRated((prev) => ({ ...prev, [itemId]: true }));
    } catch (error) {
      console.error("Rating Error:", error);
    } finally {
      setIsRating(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 mb-10 shadow-md shadow-gray-100/40 overflow-hidden">
      {data.shopOrders?.map((shopOrder, idx) => {
        const currentStatus = shopOrder.status || "pending";
        const theme = statusConfig[currentStatus] || statusConfig.pending;

        const shopImage = shopOrder.shop?.image;
        const shopName = shopOrder.shop?.name || "Restaurant";

        return (
          <div key={idx} className="group border-b last:border-b-0 border-gray-50">
            {/* Header: Shop Image + Name + Status */}
            <div className="px-6 sm:px-8 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-50/50">
              <div className="flex items-center gap-4">
                {/* Shop Image */}
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50 border border-gray-200">
                  {shopImage ? (
                    <img
                      src={shopImage}
                      alt={shopName}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/64?text=Shop";
                      }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                      Shop
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-black text-gray-900 text-lg tracking-tight leading-none mb-1">
                    {shopName}
                  </h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Receipt ID:{" "}
                    <span className="text-gray-900">#{data._id.slice(-6)}</span>
                  </p>
                </div>
              </div>

              <div
                className="px-5 py-2 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-sm"
                style={{
                  borderColor: theme.color,
                  color: theme.color,
                  backgroundColor: "white",
                }}
              >
                <FaCircle
                  size={6}
                  className={
                    currentStatus !== "delivered" ? "animate-pulse" : ""
                  }
                />
                {theme.label}
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {/* Delivery Destination */}
              <div className="mb-8 flex items-start gap-4 bg-gray-50/50 p-5 rounded-2xl border border-gray-100/50">
                <div className="mt-1 text-[#ff4d2d]">
                  <IoLocationOutline size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Destination
                  </p>
                  <p className="text-gray-900 font-bold text-sm leading-snug">
                    {data.deliveryAddress?.text}
                  </p>
                </div>
              </div>

              {/* Items List with Rating */}
              <div className="flex flex-wrap gap-4 mb-8">
                {shopOrder.shopOrderItems?.map((item, itemIdx) => {
                  const itemId = item.item?._id || item.item;
                  const currentHover = hoveredRating[itemId] || 0;
                  const currentSelected = selectedRating[itemId] || 0;
                  const displayStars = currentHover || currentSelected;
                  const alreadyRated = justRated[itemId];
                  const loading = isRating === itemId;

                  return (
                    <div
                      key={itemIdx}
                      className="flex items-center gap-4 p-2 pr-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Item Image */}
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50">
                        {item.item?.image && (
                          <img
                            src={item.item.image}
                            alt={item.item?.name || ""}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>

                      <div>
                        <p className="font-black text-gray-900 text-[11px] uppercase tracking-tight leading-none mb-1">
                          {item.item?.name || item.name}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">
                          Qty:{" "}
                          <span className="text-[#ff4d2d]">{item.quantity}</span>{" "}
                          • ₹{item.price}
                        </p>

                        {/* Average rating count from DB */}
                        {item.item?.rating?.count > 0 && (
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">
                            ⭐ {item.item.rating.average} ({item.item.rating.count}{" "}
                            {item.item.rating.count === 1 ? "rating" : "ratings"})
                          </p>
                        )}

                        {/* Rating stars — only for delivered */}
                        {currentStatus === "delivered" && (
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  disabled={loading}
                                  onClick={() => handleRating(itemId, star)}
                                  onMouseEnter={() =>
                                    setHoveredRating((prev) => ({
                                      ...prev,
                                      [itemId]: star,
                                    }))
                                  }
                                  onMouseLeave={() =>
                                    setHoveredRating((prev) => ({
                                      ...prev,
                                      [itemId]: 0,
                                    }))
                                  }
                                  className={`text-sm transition-all duration-150 ${
                                    loading
                                      ? "opacity-40 cursor-wait"
                                      : "hover:scale-125 cursor-pointer"
                                  } ${
                                    displayStars >= star
                                      ? "text-yellow-400"
                                      : "text-gray-200"
                                  }`}
                                  title={`Rate ${star} star${star > 1 ? "s" : ""}`}
                                >
                                  <FaStar />
                                </button>
                              ))}

                              {loading && (
                                <span className="ml-1 text-[9px] text-gray-400 font-bold uppercase tracking-widest animate-pulse">
                                  Saving...
                                </span>
                              )}
                            </div>

                            {alreadyRated && !loading && (
                              <p className="text-[9px] text-green-500 font-black uppercase tracking-widest">
                                ✓ Thanks for rating!
                              </p>
                            )}

                            {!alreadyRated && !loading && currentSelected === 0 && (
                              <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest">
                                Tap to rate
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer: Tracking, Payment & Total */}
              <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-gray-50 gap-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <button
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-[#ff4d2d] transition-all active:scale-95 shadow-lg shadow-gray-200 cursor-pointer"
                    onClick={() => navigate(`/track-order/${data._id}`)}
                  >
                    Track Your Feast{" "}
                    <IoChevronForwardCircleOutline size={18} />
                  </button>

                  {/* Payment Status Badge */}
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
                      data.paymentMethod === "cod"
                        ? "border-blue-100 bg-blue-50 text-blue-600"
                        : data.payment
                        ? "border-green-100 bg-green-50 text-green-600"
                        : "border-red-100 bg-red-50 text-red-600"
                    }`}
                  >
                    {data.paymentMethod === "cod" ? (
                      <IoCashOutline size={14} />
                    ) : (
                      <IoCardOutline size={14} />
                    )}
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {data.paymentMethod === "cod"
                        ? "Cash on Delivery"
                        : data.payment
                        ? "Paid Online"
                        : "Payment Pending"}
                    </span>
                  </div>
                </div>

                <div className="text-right w-full sm:w-auto">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-3">
                    {data.payment ? "Amount Paid" : "Amount to Pay"}
                  </span>
                  <span className="text-4xl font-black text-gray-900 tracking-tighter">
                    ₹{shopOrder.subTotal}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserOrderCard;