import React, { useEffect, useState, useCallback } from "react";
import Nav from "./Nav";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import DeliveryBoyTraking from "./DeliveryBoyTraking";
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { TbBike } from "react-icons/tb";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { IoBagCheckOutline } from "react-icons/io5";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { MdOutlineWifiOff } from "react-icons/md";

const RATE = 50;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border-2 border-gray-200 rounded-2xl px-4 py-3 shadow-xl shadow-gray-200/60">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
          {label}:00 – {label + 1}:00
        </p>
        <p className="text-gray-900 text-base font-black">{payload[0].value} deliveries</p>
        <p className="text-[#ff4d2d] text-sm font-bold">₹{payload[0].value * RATE} earned</p>
      </div>
    );
  }
  return null;
};

const DeliveryBoy = () => {
  const { userData, socket } = useSelector((state) => state.user);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState({});

  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  const [earningsData, setEarningsData] = useState({
    totalEarnings: 0,
    totalDeliveries: 0,
    ratePerDelivery: RATE,
    hourlyStats: [],
  });
  const [earningsLoading, setEarningsLoading] = useState(true);
  const [earningToast, setEarningToast] = useState(null);

  useEffect(() => {
    if (!socket || userData?.role !== "deliveryBoy") return;
    let watchId;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setDeliveryBoyLocation({ lat: latitude, lon: longitude });
          socket.emit("updateLocation", { userId: userData._id, latitude, longitude });
        },
        (error) => console.error("❌ Location error:", error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
    return () => { if (watchId) navigator.geolocation.clearWatch(watchId); };
  }, [socket, userData]);

  const getCurrentOrder = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/order/get-current-order`, { withCredentials: true });
      setCurrentOrder(res.data || null);
    } catch { setCurrentOrder(null); }
  };

  const getAvailableOrders = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/order/get-assignment`, { withCredentials: true });
      setAvailableOrders(res.data || []);
    } catch { setAvailableOrders([]); }
  };

  const fetchTodayEarnings = useCallback(async () => {
    try {
      setEarningsLoading(true);
      const res = await axios.get(`${serverUrl}/api/order/get-today-deliveries`, { withCredentials: true });
      setEarningsData(res.data);
    } catch (err) {
      console.error("Failed to fetch earnings:", err);
    } finally {
      setEarningsLoading(false);
    }
  }, []);

  const handleAcceptOrder = async (assignmentId) => {
    if (loading) return;
    try {
      setLoading(true);
      await axios.post(`${serverUrl}/api/order/accept-order/${assignmentId}`, {}, { withCredentials: true });
      await getCurrentOrder();
      await getAvailableOrders();
    } catch { alert("❌ Failed to accept order"); }
    finally { setLoading(false); }
  };

  const handleSendOtp = async () => {
    try {
      setOtpLoading(true);
      await axios.post(
        `${serverUrl}/api/order/send-delivery-otp`,
        { orderId: currentOrder.id, shopOrderId: currentOrder.shopOrder._id },
        { withCredentials: true }
      );
      setShowOtpBox(true);
    } catch { alert("❌ Failed to send OTP"); }
    finally { setOtpLoading(false); }
  };

  const handleVerifyOtp = async () => {
    try {
      setOtpLoading(true);
      await axios.post(
        `${serverUrl}/api/order/verify-delivery-otp`,
        { orderId: currentOrder.id, shopOrderId: currentOrder.shopOrder._id, otp },
        { withCredentials: true }
      );
      setShowOtpBox(false);
      setOtp("");
      setCurrentOrder(null);
      getAvailableOrders();
    } catch { alert("❌ Invalid OTP"); }
    finally { setOtpLoading(false); }
  };

  useEffect(() => {
    if (!socket || !userData) return;

    const handleNewAssignment = (data) => {
      if (data.sentTo === userData._id) setAvailableOrders((prev) => [...prev, data]);
    };

    const handleStatusUpdate = ({ orderId, status }) => {
      if (currentOrder && currentOrder.id === orderId && status === "delivered") {
        setCurrentOrder(null);
        setShowOtpBox(false);
        setOtp("");
        getAvailableOrders();
      }
    };

    const handleEarningUpdated = (data) => {
      fetchTodayEarnings();
      setEarningToast(data.message || `+₹${RATE} earned!`);
      setTimeout(() => setEarningToast(null), 3500);
    };

    socket.on("newAssignment", handleNewAssignment);
    socket.on("update-status", handleStatusUpdate);
    socket.on("earning-updated", handleEarningUpdated);

    return () => {
      socket.off("newAssignment", handleNewAssignment);
      socket.off("update-status", handleStatusUpdate);
      socket.off("earning-updated", handleEarningUpdated);
    };
  }, [socket, userData, currentOrder, fetchTodayEarnings]);

  useEffect(() => {
    if (userData?.role === "deliveryBoy") {
      getCurrentOrder();
      getAvailableOrders();
      fetchTodayEarnings();

      const interval = setInterval(() => {
        if (!currentOrder) getAvailableOrders();
        getCurrentOrder();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [userData]);

  if (userData?.role !== "deliveryBoy") {
    return (
      <>
        <Nav />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50 flex items-center justify-center">
          <p className="text-gray-400 font-semibold">Access denied</p>
        </div>
      </>
    );
  }

  const maxCount = Math.max(...(earningsData.hourlyStats.map((s) => s.count) || [1]), 1);

  return (
    <>
      <Nav />

      {/* Earning Toast */}
      {earningToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4a] text-white px-7 py-3.5 rounded-2xl shadow-xl shadow-orange-300/40 flex items-center gap-3">
            <RiMoneyRupeeCircleLine size={22} />
            <span className="font-black text-base tracking-tight">{earningToast}</span>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">

        

          {/* ── PAGE HEADER ── */}
          <div className="flex items-center justify-between mb-7">
            <div>
              <p className="text-[10px] font-black text-[#ff4d2d] uppercase tracking-[0.25em] mb-1">
                Delivery Dashboard
              </p>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none">
                Hey, {userData?.fullname?.split(" ")[0]} 👋
              </h2>
            </div>
            {deliveryBoyLocation.lat ? (
              <div className="flex items-center gap-1.5 bg-green-50 border-2 border-green-200 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-green-600 uppercase tracking-wider">Live</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-gray-100 border-2 border-gray-200 px-3 py-1.5 rounded-full">
                <MdOutlineWifiOff size={12} className="text-gray-400" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Offline</span>
              </div>
            )}
          </div>

          {/* ── EARNINGS CARD ── */}
          <div className="bg-white rounded-3xl border-2 border-gray-200/80 shadow-md shadow-gray-200/50 p-6 mb-5">

            {/* Stat row */}
            <div className="grid grid-cols-2 gap-4 mb-6">

              {/* Today's earnings */}
              <div className="bg-gradient-to-br from-[#ff4d2d] to-[#ff6b4a] rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute -right-5 -top-5 w-24 h-24 bg-white/10 rounded-full" />
                <div className="absolute -right-2 -bottom-8 w-20 h-20 bg-white/5 rounded-full" />
                <div className="relative z-10">
                  <RiMoneyRupeeCircleLine size={18} className="text-orange-200 mb-2" />
                  <p className="text-[9px] font-black text-orange-100 uppercase tracking-widest mb-1">
                    Today's Earnings
                  </p>
                  {earningsLoading ? (
                    <div className="h-9 w-20 bg-white/20 rounded-xl animate-pulse" />
                  ) : (
                    <p className="text-3xl font-black text-white tracking-tighter leading-none">
                      ₹{earningsData.totalEarnings}
                    </p>
                  )}
                </div>
              </div>

              {/* Deliveries count */}
              <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute -right-5 -top-5 w-24 h-24 bg-orange-500/5 rounded-full" />
                <div className="relative z-10">
                  <IoBagCheckOutline size={18} className="text-gray-400 mb-2" />
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Deliveries
                  </p>
                  {earningsLoading ? (
                    <div className="h-9 w-12 bg-gray-200 rounded-xl animate-pulse" />
                  ) : (
                    <p className="text-3xl font-black text-gray-900 tracking-tighter leading-none">
                      {earningsData.totalDeliveries}
                    </p>
                  )}
                  <p className="text-[9px] text-gray-400 font-bold mt-1.5">₹{RATE} per drop</p>
                </div>
              </div>
            </div>

            {/* Hourly chart */}
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
                Hourly Activity
              </p>

              {earningsLoading ? (
                <div className="h-28 bg-gray-50 rounded-2xl animate-pulse" />
              ) : earningsData.hourlyStats.length === 0 ? (
                <div className="h-28 bg-gray-50 rounded-2xl flex flex-col items-center justify-center gap-2">
                  <TbBike size={22} className="text-gray-300" />
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                    No deliveries yet today
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={110}>
                  <BarChart data={earningsData.hourlyStats} barSize={16}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                    <XAxis
                      dataKey="hour"
                      tickFormatter={(h) => `${h}h`}
                      tick={{ fill: "#d1d5db", fontSize: 9, fontWeight: 900 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,77,45,0.04)" }} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {earningsData.hourlyStats.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={entry.count === maxCount ? "#ff4d2d" : "#f3f4f6"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* ── ACTIVE DELIVERY ── */}
          {currentOrder && (
            <div className="bg-white rounded-3xl border-2 border-orange-200/80 shadow-md shadow-orange-100/50 p-5 mb-5">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 bg-[#ff4d2d] rounded-full animate-pulse" />
                <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest">
                  Active Delivery
                </h3>
              </div>

              <DeliveryBoyTraking
                data={{
                  deliveryBoyLocation: deliveryBoyLocation.lat
                    ? deliveryBoyLocation
                    : {
                        lat: userData.location?.coordinates?.[1],
                        lon: userData.location?.coordinates?.[0],
                      },
                  customerLocation: {
                    lat: currentOrder.deliveryAddress?.latitude,
                    lon: currentOrder.deliveryAddress?.longitude,
                  },
                }}
              />

              {!showOtpBox ? (
                <button
                  onClick={handleSendOtp}
                  disabled={otpLoading}
                  className="w-full mt-5 bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4a] text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] shadow-md shadow-orange-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 cursor-pointer"
                >
                  {otpLoading ? "Sending OTP..." : "📩 Mark as Delivered"}
                </button>
              ) : (
                <div className="mt-5 space-y-3">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Enter OTP from customer
                  </p>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/, ""))}
                    placeholder="• • • •"
                    maxLength={4}
                    className="w-full bg-gray-50 border-2 border-gray-200 focus:border-[#ff4d2d] focus:ring-2 focus:ring-[#ff4d2d]/10 text-gray-900 text-center text-2xl font-black tracking-[0.5em] px-4 py-4 rounded-2xl focus:outline-none transition-all placeholder:text-gray-300 placeholder:tracking-widest"
                  />
                  <button
                    onClick={handleVerifyOtp}
                    disabled={otpLoading || otp.length !== 4}
                    className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 disabled:opacity-30 cursor-pointer"
                  >
                    {otpLoading ? "Verifying..." : "✓ Confirm Delivery"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── AVAILABLE ORDERS ── */}
          {!currentOrder && availableOrders.length > 0 && (
            <div className="space-y-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-1">
                Requests Nearby
              </p>
              {availableOrders.map((order) => (
                <div
                  key={order.assignmentId}
                  className="bg-white rounded-3xl border-2 border-gray-200/80 shadow-md shadow-gray-200/50 p-5 relative overflow-hidden"
                >
                  {/* Brand left accent */}
                  <div className="absolute left-0 top-5 bottom-5 w-1 bg-gradient-to-b from-[#ff4d2d] to-[#ff8e6d] rounded-full" />

                  <div className="pl-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Shop</p>
                        <p className="font-black text-gray-900 text-base leading-tight">{order.shopName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Payout</p>
                        <p className="text-[#ff4d2d] font-black text-2xl leading-none">₹{RATE}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl px-3.5 py-3">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Customer</p>
                        <p className="text-gray-800 text-sm font-bold leading-tight">{order.customerName}</p>
                      </div>
                      <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl px-3.5 py-3">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Drop</p>
                        <p className="text-gray-600 text-xs font-medium line-clamp-2 leading-tight">{order.deliveryAddress}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAcceptOrder(order.assignmentId)}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4a] text-white font-black py-3.5 rounded-2xl text-[11px] uppercase tracking-[0.15em] shadow-md shadow-orange-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? "Accepting..." : "Accept Order"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── EMPTY STATE ── */}
          {!currentOrder && availableOrders.length === 0 && (
            <div className="bg-white rounded-3xl border-2 border-gray-200/80 shadow-md shadow-gray-200/50 p-12 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4 border-2 border-orange-200">
                <TbBike size={30} className="text-[#ff4d2d]" />
              </div>
              <p className="font-black text-gray-800 text-sm uppercase tracking-widest mb-1">
                No orders nearby
              </p>
              <p className="text-gray-500 text-xs font-medium">
                New requests will appear here automatically
              </p>
            </div>
          )}

        </div>
        <footer className="bg-gray-900 text-gray-400 py-12 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <h3 className="text-2xl font-black bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">
            Vingo<span className="text-orange-400">.</span>
          </h3>
          <p className="text-sm font-medium">
            Made with ❤️ for food lovers everywhere
          </p>
          <p className="text-xs text-gray-500">
            © 2024 Vingo. All rights reserved.
          </p>
        </div>
      </footer>
      </div>
    </>
  );
};

export default DeliveryBoy;