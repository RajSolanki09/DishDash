import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaCircle, FaUserCircle, FaUtensils } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { updateOrderStatus } from "../redux/userSlice";
import DeliveryBoyTraking from "./DeliveryBoyTraking";

const OwnerOrderCard = ({ data }) => {
  const dispatch = useDispatch();
  const [updating, setUpdating] = useState(false);
  const [availableBoys, setAvailableBoys] = useState([]);
  const [showMap, setShowMap] = useState(false);

  if (!data || !data.shopOrder) {
    return <div className="p-4 bg-white rounded-xl">Loading order details...</div>;
  }

  const shopOrder = data.shopOrder;
  const currentStatus = shopOrder.status || "pending";

  // Helper to get full image URL
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/')) return `${serverUrl}${imagePath}`;
    return `${serverUrl}/${imagePath}`;
  };

  useEffect(() => {
    const loadDeliveryBoys = async () => {
      if (shopOrder.assignedDeliveryBoy) {
        try {
          const res = await axios.get(
            `${serverUrl}/api/user/${shopOrder.assignedDeliveryBoy._id || shopOrder.assignedDeliveryBoy}`,
            { withCredentials: true }
          );
          setAvailableBoys([{
            id: res.data._id,
            fullname: res.data.fullname,
            mobile: res.data.mobile,
            assigned: true
          }]);
        } catch (error) {
          console.error("Failed to load assigned delivery boy:", error);
        }
      } else if (currentStatus === 'out of delivery' && shopOrder.assignment) {
        try {
          const res = await axios.post(
            `${serverUrl}/api/order/update-status/${data._id}/${shopOrder.shop._id}`,
            { status: currentStatus },
            { withCredentials: true }
          );
          if (res.data.availableBoys && res.data.availableBoys.length > 0) {
            setAvailableBoys(res.data.availableBoys);
          }
        } catch (error) {
          console.error("Failed to load delivery boys:", error);
        }
      }
    };
    loadDeliveryBoys();
  }, [shopOrder.assignedDeliveryBoy, shopOrder.assignment, currentStatus, data._id, shopOrder.shop?._id]);

  useEffect(() => {
    if (
      shopOrder.status === "out of delivery" &&
      shopOrder.assignment
    ) {
      axios
        .get(
          `${serverUrl}/api/order/debug-assignment/${shopOrder.assignment}`,
          { withCredentials: true }
        )
        .then((res) => {
          if (res.data?.assignment?.broadcastedTo) {
            setAvailableBoys(
              res.data.assignment.broadcastedTo.map((b) => ({
                id: b._id,
                fullname: b.fullname,
                mobile: b.mobile,
                assigned: false,
              }))
            );
          }
        })
        .catch(() => {});
    }
  }, [shopOrder.status, shopOrder.assignment]);

  const handleStatusChange = async (newStatus) => {
    if (!shopOrder.shop?._id) return;
    try {
      setUpdating(true);
      const result = await axios.post(
        `${serverUrl}/api/order/update-status/${data._id}/${shopOrder.shop._id}`,
        { status: newStatus },
        { withCredentials: true }
      );

      dispatch(updateOrderStatus({
        orderId: data._id,
        shopId: shopOrder.shop._id,
        status: newStatus,
      }));

      if (result.data && result.data.availableBoys) {
        setAvailableBoys(result.data.availableBoys);
        console.log('✅ Available delivery boys:', result.data.availableBoys);
      } else if (newStatus === 'out of delivery') {
        console.log('⚠️ No delivery boys available nearby');
        setAvailableBoys([]);
      }
    } catch (error) {
      console.error("❌ Status update failed:", error);
      alert(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const statusConfig = {
    pending: { color: "#F59E0B", light: "#FFFBEB" },
    preparing: { color: "#3B82F6", light: "#EFF6FF" },
    "out of delivery": { color: "#8B5CF6", light: "#F5F3FF" },
    delivered: { color: "#10B981", light: "#ECFDF5" },
  };

  const theme = statusConfig[currentStatus] || statusConfig.pending;

  return (
    <div className="bg-white rounded-3xl border-2 border-gray-200/80 shadow-md shadow-gray-200/50 mb-6 overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="px-6 sm:px-8 py-5 flex flex-wrap items-center justify-between gap-4 border-b-2 border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-50 border-2 border-gray-200 flex items-center justify-center text-gray-500">
            <FaUserCircle size={22} />
          </div>
          <div>
            <h3 className="font-black text-gray-900 text-base tracking-tight">
              {data.user?.fullname || data.user?.fullName || "Customer"}
            </h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              ORDER #{data._id.slice(-6)}
            </p>
          </div>
        </div>
        <div
          className="px-4 py-1.5 rounded-2xl border-2 font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 bg-white shadow-sm"
          style={{ borderColor: theme.color, color: theme.color }}
        >
          <FaCircle size={5} className={currentStatus !== 'delivered' ? 'animate-pulse' : ''} />
          {currentStatus}
        </div>
      </div>

      {/* Body */}
      <div className="p-6 sm:p-8">
        {/* Customer Contact & Address */}
        <div className="flex flex-col lg:flex-row justify-between gap-6 mb-8">
          <div className="space-y-4 flex-1">
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-600">
              <span className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">
                <FaEnvelope className="text-gray-400" size={12} />
                {data.user?.email}
              </span>
              <span className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">
                <FaPhone className="text-gray-400" size={12} />
                {data.user?.mobile}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full text-[10px] font-black uppercase tracking-wider text-gray-600 border-2 border-gray-200">
                {data.paymentMethod === 'online' 
                  ? (data.payment ? 'Paid Online' : 'Payment Pending') 
                  : 'Cash on Delivery'}
              </span>
            </div>

            {/* Address Card */}
            <div className="bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center flex-shrink-0 text-[#ff4d2d]">
                  <FaMapMarkerAlt size={14} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Delivery Address
                  </p>
                  <p className="text-sm font-bold text-gray-900 leading-relaxed">
                    {data.deliveryAddress?.text}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowMap(!showMap)}
                className="mt-3 text-[11px] font-black text-[#ff4d2d] hover:text-[#ff8e6d] transition-colors cursor-pointer flex items-center gap-1 uppercase tracking-wider"
              >
                {showMap ? '− Hide Map' : '+ Show Location on Map'}
              </button>
              {showMap && data.deliveryAddress?.latitude && data.deliveryAddress?.longitude && (
                <div className="mt-4">
                  <DeliveryBoyTraking
                    data={{
                      customerLocation: {
                        lat: data.deliveryAddress.latitude,
                        lon: data.deliveryAddress.longitude
                      }
                    }}
                  />
                  <p className="text-[10px] text-gray-400 font-bold text-center mt-2 uppercase tracking-widest">
                    📍 Customer delivery location
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Total */}
          <div className="lg:text-right flex lg:block items-center justify-between gap-4">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
              Total payout
            </p>
            <p className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
              ₹{shopOrder.subTotal}
            </p>
          </div>
        </div>

        {/* Order Items – Fixed Image Display with Full URL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {shopOrder.shopOrderItems?.map((item, idx) => {
            // Get image URL from multiple possible paths
            const rawImage = item.item?.image || item.image;
            const fullImageUrl = getFullImageUrl(rawImage);
            
            return (
              <div
                key={idx}
                className="flex gap-3 p-3 rounded-2xl border-2 border-gray-200/80 bg-white/50 hover:bg-white hover:shadow-md transition-all group"
              >
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center border border-gray-200">
                  {fullImageUrl ? (
                    <img
                      src={fullImageUrl}
                      alt={item.item?.name || item.name || "Food item"}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        console.log(`❌ Image failed to load: ${fullImageUrl}`);
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.style.display = 'none';
                        // Show fallback icon
                        e.target.parentElement.innerHTML = `<div class="h-full w-full flex items-center justify-center bg-gray-200 text-gray-500"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M11 9h2v2h-2V9zm0 4h2v2h-2v-2zm0-8h2v2h-2V5zm0 12h2v2h-2v-2zm8-12v16H5V5h14zm0-2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg></div>`;
                      }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-500">
                      <FaUtensils size={20} />
                    </div>
                  )}
                  <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[8px] px-1.5 py-0.5 rounded-md font-black">
                    {item.quantity}
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="font-black text-gray-800 text-xs leading-tight mb-1 line-clamp-1">
                    {item.item?.name || item.name || "Unknown Item"}
                  </p>
                  <p className="text-xs font-black text-[#ff4d2d]">₹{item.price}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer – Status Update & Delivery Boys */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-5 border-t-2 border-gray-100">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
              Update status:
            </span>
            <div className="relative">
              <select
                value={currentStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updating}
                className="appearance-none bg-transparent border-b-2 border-gray-200 focus:border-[#ff4d2d] py-2 pr-8 pl-2 text-xs font-bold text-gray-700 cursor-pointer focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="pending">PENDING</option>
                <option value="preparing">PREPARING</option>
                <option value="out of delivery">OUT FOR DELIVERY</option>
                <option value="delivered">DELIVERED</option>
              </select>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Delivery Boys Info */}
          {(currentStatus === 'out of delivery' || currentStatus === 'delivered') && (
            <div className="flex-1 md:text-right">
              {availableBoys.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                    {shopOrder.assignedDeliveryBoy ? 'Assigned partner' : `Available partners (${availableBoys.length})`}
                  </p>
                  <div className="flex flex-wrap md:justify-end gap-2">
                    {availableBoys.map((b, index) => (
                      <div
                        key={b.id || index}
                        className={`
                          inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-black border-2
                          ${b.assigned 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                          }
                        `}
                      >
                        <span>{b.fullname.split(' ')[0]}</span>
                        <span className="text-[10px] opacity-70">{b.mobile.slice(-4)}</span>
                        {b.assigned && (
                          <span className="ml-1 text-green-700">✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                !updating && currentStatus === 'out of delivery' && (
                  <div className="bg-amber-50/50 border-2 border-amber-200 rounded-2xl px-4 py-2.5">
                    <p className="text-amber-700 text-xs font-black flex items-center gap-1.5 uppercase tracking-wider">
                      <span>⚠️</span> No delivery partners available
                    </p>
                    <p className="text-amber-600 text-[10px] mt-0.5 font-medium">
                      Please wait or check back later
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerOrderCard;