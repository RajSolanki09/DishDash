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
import { Bike, MapPin, ShoppingBag, IndianRupee, WifiOff, Fingerprint, Store, Zap, ShieldAlert, Sparkles, Hand, Heart } from "lucide-react";

const RATE = 40;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="premium-card p-4 shadow-xl">
        <p className="text-caption text-brand mb-1">
          {label}:00 – {label + 1}:00
        </p>
        <p className="text-text-primary text-lg font-black">{payload[0].value} deliveries</p>
        <p className="text-brand text-sm font-bold">₹{payload[0].value * RATE} earned</p>
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
      setTimeout(() => setEarningToast(null), 4000);
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
        <div className="min-h-screen flex items-center justify-center">
          <div className="premium-card p-8 rounded-[2rem] text-center">
            <p className="text-brand font-bold text-lg">Access Denied</p>
            <p className="text-text-secondary text-sm mt-2">You don't have permission to view this page.</p>
          </div>
        </div>
      </>
    );
  }

  const maxCount = Math.max(...(earningsData.hourlyStats.map((s) => s.count) || [1]), 1);

  return (
    <div className="min-h-screen bg-bg-primary">
      <Nav />

      {/* Earning Toast */}
      {earningToast && (
        <div className="fixed top-[100px] left-1/2 -translate-x-1/2 z-[9999] animate-scale-in">
          <div className="primary-button px-8 py-4 rounded-2xl shadow-xl flex items-center gap-4">
            <IndianRupee size={24} className="animate-pulse text-white" />
            <span className="font-black text-lg tracking-tight text-white">{earningToast}</span>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 relative z-10">
        
        {/* PAGE HEADER */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-caption text-brand mb-1">
              Delivery Operations
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-text-primary tracking-tighter leading-none">
              Hey, {userData?.fullname?.split(" ")[0]} <Hand size={24} className="inline text-brand" />
            </h2>
          </div>
          {deliveryBoyLocation.lat ? (
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-xl">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-caption text-emerald-600">Live</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-bg-secondary border border-border px-4 py-2 rounded-xl">
              <WifiOff size={14} className="text-text-muted" />
              <span className="text-caption text-text-muted">Offline</span>
            </div>
          )}
        </div>

        {/* EARNINGS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Today's earnings */}
          <div className="premium-card p-8 relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-brand/10 blur-xl rounded-full" />
            <div className="relative z-10">
              <IndianRupee size={24} className="text-brand mb-4" />
              <p className="text-caption text-text-muted mb-2">
                Today's Earnings
              </p>
              {earningsLoading ? (
                <div className="h-10 w-32 shimmer-loading rounded-xl" />
              ) : (
                <p className="text-5xl font-black text-text-primary tracking-tighter">
                  ₹{earningsData.totalEarnings}
                </p>
              )}
            </div>
          </div>

          {/* Deliveries count */}
          <div className="premium-card p-8 relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-brand/10 blur-xl rounded-full" />
            <div className="relative z-10">
              <ShoppingBag size={24} className="text-brand mb-4" />
              <p className="text-caption text-text-muted mb-2">
                Deliveries
              </p>
              {earningsLoading ? (
                <div className="h-10 w-24 shimmer-loading rounded-xl" />
              ) : (
                <div className="flex items-baseline gap-4">
                  <p className="text-5xl font-black text-text-primary tracking-tighter">
                    {earningsData.totalDeliveries}
                  </p>
                  <p className="text-caption text-brand bg-brand/10 px-3 py-1 rounded-lg">₹{RATE} / drop</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hourly chart */}
        <div className="premium-card p-6 mb-10">
          <p className="text-caption text-text-muted mb-6 px-2">
            Hourly Activity Analysis
          </p>

          {earningsLoading ? (
            <div className="h-32 shimmer-loading rounded-2xl" />
          ) : earningsData.hourlyStats.length === 0 ? (
            <div className="h-32 bg-bg-secondary rounded-2xl flex flex-col items-center justify-center gap-3 border border-dashed border-border">
              <Bike size={28} className="text-text-muted" />
              <p className="text-caption text-text-muted">
                No deliveries yet today
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={earningsData.hourlyStats} barSize={20} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="hour"
                  tickFormatter={(h) => `${h}:00`}
                  tick={{ fill: "var(--color-text-muted)", fontSize: 11, fontWeight: 700 }}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis hide allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--color-bg-secondary)" }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {earningsData.hourlyStats.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.count === maxCount ? "#E23744" : "var(--color-border)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* ACTIVE DELIVERY */}
        {currentOrder && (
          <div className="premium-card p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-brand to-brand-glow" />
            <div className="flex items-center gap-3 mb-8">
              <div className="w-3 h-3 bg-brand rounded-full animate-pulse" />
              <h3 className="font-black text-text-primary text-lg uppercase tracking-widest">
                Active Assignment
              </h3>
            </div>

            <div className="rounded-2xl overflow-hidden border border-border bg-bg-secondary mb-8 aspect-video sm:aspect-auto sm:h-80 relative z-10">
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
            </div>

            {!showOtpBox ? (
              <button
                onClick={handleSendOtp}
                disabled={otpLoading}
                className="w-full primary-button py-5 rounded-2xl font-bold text-[13px] uppercase tracking-widest disabled:opacity-50 flex justify-center items-center gap-3"
              >
                {otpLoading ? (
                  "Sending Verification..."
                ) : (
                  <>
                    <Fingerprint size={20} />
                    Mark as Delivered
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-5 bg-bg-secondary p-8 rounded-2xl border border-brand/30">
                <p className="text-caption text-brand text-center">
                  Verification Required
                </p>
                <div className="relative max-w-sm mx-auto">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/, ""))}
                    placeholder="ENTER OTP"
                    maxLength={4}
                    className="w-full bg-bg-primary border-2 border-border focus:border-brand focus:ring-4 focus:ring-brand/20 text-text-primary text-center text-3xl font-black tracking-[0.5em] px-6 py-5 rounded-2xl focus:outline-none transition-all placeholder:text-text-muted placeholder:tracking-widest"
                  />
                </div>
                <button
                  onClick={handleVerifyOtp}
                  disabled={otpLoading || otp.length !== 4}
                  className="w-full max-w-sm mx-auto block primary-button py-5 rounded-2xl font-bold text-[13px] uppercase tracking-widest disabled:opacity-30"
                >
                  {otpLoading ? "Verifying..." : "Confirm Delivery"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* AVAILABLE ORDERS */}
        {!currentOrder && availableOrders.length > 0 && (
          <div className="space-y-6">
            <p className="text-caption text-brand mb-2 pl-2">
              Requests Nearby
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {availableOrders.map((order, idx) => (
                <div
                  key={order.assignmentId}
                  className="premium-card p-6 relative overflow-hidden animate-in"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-brand to-brand-glow" />

                  <div className="pl-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="text-caption text-text-muted mb-1.5 flex items-center gap-2">
                          <Store size={12} className="text-text-secondary" />
                          Pickup Status
                        </p>
                        <p className="font-black text-text-primary text-xl leading-tight truncate">{order.shopName}</p>
                      </div>
                      <div className="text-right shrink-0 bg-brand/10 border border-brand/20 rounded-xl px-4 py-2">
                        <p className="text-caption text-brand mb-0.5">Payout</p>
                        <p className="text-text-primary font-black text-2xl leading-none">₹{RATE}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-bg-secondary border border-border rounded-2xl px-4 py-3.5">
                        <p className="text-caption text-text-muted mb-1 flex items-center gap-1.5">
                          <Fingerprint size={10} className="text-brand" />
                          Customer
                        </p>
                        <p className="text-text-primary text-[13px] font-bold leading-tight truncate">{order.customerName}</p>
                      </div>
                      <div className="bg-bg-secondary border border-border rounded-2xl px-4 py-3.5">
                        <p className="text-caption text-text-muted mb-1 flex items-center gap-1.5">
                          <MapPin size={10} className="text-brand" />
                          Drop
                        </p>
                        <p className="text-text-secondary text-[12px] font-medium line-clamp-2 leading-tight">{order.deliveryAddress}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAcceptOrder(order.assignmentId)}
                      disabled={loading}
                      className="w-full primary-button border-none py-4 rounded-xl font-bold text-[12px] uppercase tracking-widest disabled:opacity-50"
                    >
                      {loading ? "Assigning..." : "Accept Route"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {!currentOrder && availableOrders.length === 0 && (
          <div className="premium-card py-24 flex flex-col items-center text-center px-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-bg-secondary pointer-events-none" />
            <div className="relative z-10">
              <div className="w-24 h-24 bg-bg-secondary rounded-full flex items-center justify-center mb-6 border border-border mx-auto">
                <Bike size={36} className="text-text-muted" />
              </div>
              <p className="font-black text-text-primary text-xl tracking-tight mb-2">
                No routes available
              </p>
              <p className="text-text-secondary text-sm font-medium">
                Scanning area for new requests automatically...
              </p>
            </div>
          </div>
        )}

      </main>
      
      <footer className="bg-bg-secondary border-t border-border py-12 px-4 mt-10">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <h3 className="text-3xl font-black text-gradient">
            Vingo<span className="text-text-primary">.</span>
          </h3>
          <p className="text-[13px] font-medium text-text-secondary tracking-wide">
            Made with <Heart size={14} className="inline text-brand fill-brand" /> for premium delivery partners
          </p>
          <p className="text-caption text-text-muted pt-4">
            © 2026 Vingo. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DeliveryBoy;
