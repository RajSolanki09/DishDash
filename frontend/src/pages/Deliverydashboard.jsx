import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import { TbBike, TbClock, TbCurrencyRupee, TbPackage, TbTrendingUp } from 'react-icons/tb';
import { IoCalendarOutline, IoStatsChart } from 'react-icons/io5';
import { FaRoute } from 'react-icons/fa';
import DeliveryBoyTraking from '../components/DeliveryBoyTraking';

const DeliveryDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [todayStats, setTodayStats] = useState(null);
  const [allTimeStats, setAllTimeStats] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  
  // Fetch Today's Deliveries
  const fetchTodayDeliveries = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/order/get-today-deliveries`, {
        withCredentials: true
      });
      setTodayStats(res.data);
    } catch (error) {
      console.error('Error fetching today deliveries:', error);
    }
  };

  // Fetch All-Time Earnings
  const fetchAllTimeEarnings = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/order/get-all-time-earnings`, {
        withCredentials: true
      });
      setAllTimeStats(res.data);
    } catch (error) {
      console.error('Error fetching all-time earnings:', error);
    }
  };

  // Fetch Current Active Order
  const fetchCurrentOrder = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/order/get-current-order`, {
        withCredentials: true
      });
      setCurrentOrder(res.data);
    } catch (error) {
      // No active order is fine, don't show error
      if (error.response?.status !== 404) {
        console.error('Error fetching current order:', error);
      }
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchTodayDeliveries(),
        fetchAllTimeEarnings(),
        fetchCurrentOrder()
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50">
        <Nav />
        <div className="flex items-center justify-center h-[calc(100vh-72px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#ff4d2d] border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50">
      <Nav />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
        
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-10 bg-gradient-to-b from-[#ff4d2d] to-[#ff8e6d] rounded-full" />
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              Delivery <span className="text-[#ff4d2d]">Dashboard</span>
            </h1>
          </div>
          <p className="text-gray-500 font-medium text-sm ml-4">
            Track your deliveries and earnings
          </p>
        </div>

        {/* Today's Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Today's Earnings */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-6 shadow-lg shadow-green-200 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <TbCurrencyRupee size={24} />
              </div>
              <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider">
                Today
              </span>
            </div>
            <p className="text-sm font-semibold mb-1 opacity-90">Today's Earnings</p>
            <p className="text-4xl font-black">₹{todayStats?.totalEarnings || 0}</p>
            <p className="text-xs mt-2 opacity-75">
              {todayStats?.totalDeliveries || 0} deliveries × ₹{todayStats?.ratePerDelivery || 50}
            </p>
          </div>

          {/* Today's Deliveries */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 shadow-lg shadow-blue-200 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <TbPackage size={24} />
              </div>
              <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider">
                Today
              </span>
            </div>
            <p className="text-sm font-semibold mb-1 opacity-90">Deliveries</p>
            <p className="text-4xl font-black">{todayStats?.totalDeliveries || 0}</p>
            <p className="text-xs mt-2 opacity-75">
              Completed today
            </p>
          </div>

          {/* All-Time Earnings */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl p-6 shadow-lg shadow-purple-200 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <TbTrendingUp size={24} />
              </div>
              <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider">
                All Time
              </span>
            </div>
            <p className="text-sm font-semibold mb-1 opacity-90">Total Earnings</p>
            <p className="text-4xl font-black">₹{allTimeStats?.totalEarnings || 0}</p>
            <p className="text-xs mt-2 opacity-75">
              {allTimeStats?.totalDeliveries || 0} total deliveries
            </p>
          </div>
        </div>

        {/* Current Active Order */}
        {currentOrder && (
          <div className="bg-white rounded-3xl border-2 border-orange-200 shadow-xl shadow-orange-100 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <FaRoute size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-black text-lg">Active Delivery</h3>
                <p className="text-white/80 text-xs font-semibold">Order #{currentOrder.id?.slice(-6)}</p>
              </div>
              <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-white text-xs font-black uppercase tracking-wider">Live</span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Customer</p>
                <p className="font-bold text-gray-900">{currentOrder.user?.fullname || 'Customer'}</p>
                <p className="text-sm text-gray-600 mt-1">{currentOrder.user?.mobile}</p>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  📍 {currentOrder.deliveryAddress?.text}
                </p>
              </div>

              {/* Items */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">Items</p>
                <div className="space-y-2">
                  {currentOrder.shopOrder?.shopOrderItems?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="font-bold text-gray-700">
                        {item.item?.name || item.name} <span className="text-gray-400">x{item.quantity}</span>
                      </span>
                      <span className="font-black text-gray-900">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t-2 border-gray-200 mt-3 pt-3 flex justify-between">
                  <span className="text-xs font-black text-gray-500 uppercase">Total</span>
                  <span className="font-black text-gray-900">₹{currentOrder.shopOrder?.subTotal}</span>
                </div>
              </div>

              {/* Live Map */}
              {currentOrder.deliveryBoyLocation && currentOrder.customerLocation && (
                <div className="relative">
                  <div className="absolute top-4 left-4 z-10 bg-white px-3 py-2 rounded-xl shadow-lg flex items-center gap-2 border border-gray-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-black text-green-700 uppercase tracking-wider">Live Route</span>
                  </div>
                  <div className="h-[300px] rounded-2xl overflow-hidden border-2 border-gray-200">
                    <DeliveryBoyTraking
                      data={{
                        deliveryBoyLocation: currentOrder.deliveryBoyLocation,
                        customerLocation: currentOrder.customerLocation
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={() => navigate(`/track-order/${currentOrder.id}`)}
                className="w-full h-12 bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4a] text-white rounded-2xl font-bold text-sm shadow-lg shadow-orange-200 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-200"
              >
                View Full Details
              </button>
            </div>
          </div>
        )}

        {/* No Active Order Message */}
        {!currentOrder && (
          <div className="bg-white rounded-3xl border-2 border-gray-200 p-8 text-center mb-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TbBike size={32} className="text-gray-400" />
            </div>
            <h3 className="font-black text-gray-900 text-lg mb-2">No Active Deliveries</h3>
            <p className="text-gray-500 text-sm">You're all caught up! New orders will appear here.</p>
          </div>
        )}

        {/* Hourly Stats (Today) */}
        {todayStats?.hourlyStats && todayStats.hourlyStats.length > 0 && (
          <div className="bg-white rounded-3xl border-2 border-gray-200 shadow-md overflow-hidden mb-8">
            <div className="px-6 py-4 border-b-2 border-gray-100 flex items-center gap-3">
              <IoStatsChart size={24} className="text-[#ff4d2d]" />
              <h3 className="font-black text-gray-900 text-lg">Today's Hourly Performance</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {todayStats.hourlyStats.map((stat) => (
                  <div key={stat.hour} className="bg-gradient-to-br from-gray-50 to-orange-50 rounded-2xl p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <TbClock size={16} className="text-[#ff4d2d]" />
                      <span className="text-xs font-black text-gray-600">
                        {stat.hour}:00
                      </span>
                    </div>
                    <p className="text-2xl font-black text-gray-900 mb-1">{stat.count}</p>
                    <p className="text-xs text-gray-600 font-semibold">₹{stat.earning}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Delivery History */}
        {allTimeStats?.dailyHistory && allTimeStats.dailyHistory.length > 0 && (
          <div className="bg-white rounded-3xl border-2 border-gray-200 shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b-2 border-gray-100 flex items-center gap-3">
              <IoCalendarOutline size={24} className="text-[#ff4d2d]" />
              <h3 className="font-black text-gray-900 text-lg">Delivery History</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {allTimeStats.dailyHistory.slice(0, 10).map((day) => (
                  <div key={day.date} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200 hover:bg-orange-50 hover:border-orange-200 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-200">
                        <TbPackage size={20} className="text-[#ff4d2d]" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">
                          {new Date(day.date).toLocaleDateString('en-IN', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </p>
                        <p className="text-xs text-gray-500 font-semibold">
                          {day.count} deliveries
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-gray-900 text-lg">₹{day.earnings}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default DeliveryDashboard;