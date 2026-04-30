import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';
import Nav from '../components/Nav';
import {
  Bike,
  Clock,
  IndianRupee,
  Package,
  TrendingUp,
  Calendar,
  BarChart3,
  Power,
  Zap
} from 'lucide-react';
import DeliveryBoyTraking from '../components/DeliveryBoyTraking';
import { setUserData } from '../redux/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import gsap from 'gsap';

const DeliveryDashboard = () => {
  const { userData } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [todayStats, setTodayStats] = useState(null);
  const [allTimeStats, setAllTimeStats] = useState(null);
  const [isToggling, setIsToggling] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!loading) {
      let ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.fromTo(".header-anim", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 1, stagger: 0.1 })
          .fromTo(".stat-card-anim", { opacity: 0, y: 30, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.12 }, "-=0.6")
          .fromTo(".chart-card-anim", { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.8 }, "-=0.4")
          .fromTo(".history-card-anim", { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.8 }, "-=0.8");
      }, containerRef);
      return () => ctx.revert();
    }
  }, [loading]);

  const fetchTodayDeliveries = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/order/get-today-deliveries`, { withCredentials: true });
      setTodayStats(res.data);
    } catch (error) {
      console.error('Error fetching today deliveries:', error);
    }
  };

  const fetchAllTimeEarnings = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/order/get-all-time-earnings`, { withCredentials: true });
      setAllTimeStats(res.data);
    } catch (error) {
      console.error('Error fetching all-time earnings:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchTodayDeliveries(), fetchAllTimeEarnings()]);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <Nav />
        <div className="flex items-center justify-center h-[calc(100vh-72px)]">
          <div className="text-center space-y-4">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 border-t-2 border-brand rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-r-2 border-brand-glow rounded-full animate-spin reverse"></div>
            </div>
            <p className="text-text-muted font-bold uppercase tracking-widest text-[10px]">Loading Dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary relative overflow-x-hidden pb-20" ref={containerRef}>
      <Nav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 relative z-10">
        {/* Page Header */}
        <div className="mb-10 text-center md:text-left header-anim">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 premium-card rounded-full mb-4 mx-auto md:mx-0">
            <Bike size={12} className="text-brand" />
            <span className="text-caption text-text-secondary">
              Partner Portal
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter">
            Delivery <span className="text-gradient">Dashboard.</span>
          </h1>
          <div className="flex flex-col md:flex-row items-center md:items-end md:justify-between gap-8 mt-3">
            <p className="text-text-secondary font-bold text-sm tracking-wide">
              Track your deliveries, routes, and earnings in real-time.
            </p>

            {/* Duty Toggle */}
            <div className="flex items-center gap-4 bg-bg-secondary p-2 rounded-2xl border border-border">
              <div className={`p-4 rounded-xl flex items-center gap-3 transition-all duration-500 ${userData?.isDutyOn ? 'bg-emerald-500/10 text-emerald-600' : 'bg-bg-tertiary text-text-muted'}`}>
                {userData?.isDutyOn ? <Zap size={18} className="animate-pulse" /> : <Power size={18} />}
                <span className="text-caption">{userData?.isDutyOn ? 'Receiving Orders' : 'Offline'}</span>
              </div>
              <button
                disabled={isToggling}
                onClick={async () => {
                  setIsToggling(true);
                  try {
                    const res = await axios.post(`${serverUrl}/api/user/toggle-duty`, {}, { withCredentials: true });
                    if (res.data.success) {
                      dispatch(setUserData({ ...userData, isDutyOn: res.data.isDutyOn }));
                      toast.success(`Duty is now ${res.data.isDutyOn ? 'ON' : 'OFF'}`);
                    }
                  } catch (e) {
                    console.error(e);
                    toast.error("Failed to update status");
                  } finally {
                    setIsToggling(false);
                  }
                }}
                className={`h-14 px-8 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all duration-300 ${userData?.isDutyOn ? 'bg-bg-primary text-text-primary hover:bg-bg-tertiary border border-border' : 'primary-button'}`}
              >
                {userData?.isDutyOn ? 'Go Offline' : 'Start Duty'}
              </button>
            </div>
          </div>
        </div>

        {/* Today's Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Today's Earnings */}
          <div className="premium-card p-8 relative overflow-hidden group stat-card-anim">
            <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="w-14 h-14 bg-brand/10 border border-brand/20 rounded-2xl flex items-center justify-center text-brand">
                <IndianRupee size={24} />
              </div>
              <span className="text-caption text-brand bg-brand/10 border border-brand/20 px-4 py-1.5 rounded-full">
                Today
              </span>
            </div>
            <div className="relative z-10">
              <p className="text-caption text-text-muted mb-2">Today's Earnings</p>
              <p className="text-5xl font-black text-text-primary tracking-tighter">₹{todayStats?.totalEarnings || 0}</p>
              <p className="text-xs font-bold text-brand mt-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                {todayStats?.totalDeliveries || 0} deliveries × ₹{todayStats?.ratePerDelivery || 40}
              </p>
            </div>
          </div>

          {/* Today's Deliveries */}
          <div className="premium-card p-8 relative overflow-hidden group stat-card-anim">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500">
                <Package size={24} />
              </div>
              <span className="text-caption text-blue-500 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full">
                Today
              </span>
            </div>
            <div className="relative z-10">
              <p className="text-caption text-text-muted mb-2">Deliveries Completed</p>
              <p className="text-5xl font-black text-text-primary tracking-tighter">{todayStats?.totalDeliveries || 0}</p>
              <p className="text-xs font-bold text-blue-500 mt-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Successfully completed today
              </p>
            </div>
          </div>

          {/* All-Time Earnings */}
          <div className="premium-card p-8 relative overflow-hidden group stat-card-anim">
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="w-14 h-14 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-2xl flex items-center justify-center text-fuchsia-500">
                <TrendingUp size={24} />
              </div>
              <span className="text-caption text-fuchsia-500 bg-fuchsia-500/10 border border-fuchsia-500/20 px-4 py-1.5 rounded-full">
                All Time
              </span>
            </div>
            <div className="relative z-10">
              <p className="text-caption text-text-muted mb-2">Total Earnings</p>
              <p className="text-5xl font-black text-gradient tracking-tighter">₹{allTimeStats?.totalEarnings || 0}</p>
              <p className="text-xs font-bold text-fuchsia-500 mt-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500" />
                {allTimeStats?.totalDeliveries || 0} total deliveries processed
              </p>
            </div>
          </div>
        </div>

        {/* Hourly Stats */}
        {todayStats?.hourlyStats && todayStats.hourlyStats.length > 0 && (
          <div className="premium-card overflow-hidden mb-12 chart-card-anim">
            <div className="px-8 py-6 border-b border-border bg-bg-secondary flex items-center gap-4">
              <div className="w-10 h-10 bg-brand/10 border border-brand/20 rounded-xl flex items-center justify-center">
                <BarChart3 size={20} className="text-brand" />
              </div>
              <h3 className="font-black text-text-primary text-xl tracking-tight">Today's Heatmap</h3>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {todayStats.hourlyStats.map((stat) => (
                  <div key={stat.hour} className="bg-bg-secondary border border-border rounded-2xl p-5 hover:bg-bg-tertiary hover:border-brand/30 transition-all duration-300 group">
                    <div className="flex items-center gap-2 mb-4 bg-bg-primary w-max px-3 py-1.5 rounded-lg border border-border relative z-10">
                      <Clock size={12} className="text-brand" />
                      <span className="text-caption text-text-secondary">
                        {stat.hour}:00
                      </span>
                    </div>
                    <p className="text-3xl font-black text-text-primary tracking-tighter mb-1 relative z-10 group-hover:text-brand transition-colors duration-300">{stat.count}</p>
                    <p className="text-caption text-text-muted relative z-10 flex items-center gap-1.5"><IndianRupee size={10} />{stat.earning}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Delivery History */}
        {allTimeStats?.dailyHistory && allTimeStats.dailyHistory.length > 0 && (
          <div className="premium-card overflow-hidden history-card-anim">
            <div className="px-8 py-6 border-b border-border bg-bg-secondary flex items-center gap-4">
              <div className="w-10 h-10 bg-brand/10 border border-brand/20 rounded-xl flex items-center justify-center">
                <Calendar size={20} className="text-brand" />
              </div>
              <h3 className="font-black text-text-primary text-xl tracking-tight">Financial Ledger</h3>
            </div>
            <div className="p-8">
              <div className="space-y-4">
                {allTimeStats.dailyHistory.slice(0, 10).map((day) => (
                  <div key={day.date} className="flex items-center justify-between p-5 bg-bg-secondary rounded-2xl border border-border hover:bg-brand/5 hover:border-brand/20 transition-all duration-300 group">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-bg-primary rounded-xl flex items-center justify-center border border-border group-hover:border-brand/30 transition-colors duration-300">
                        <Package size={20} className="text-text-muted group-hover:text-brand transition-colors duration-300" />
                      </div>
                      <div>
                        <p className="font-black text-text-primary text-[15px] tracking-wide">
                          {new Date(day.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                        <p className="text-caption text-text-muted mt-1">
                          {day.count} Deployments
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-gradient text-2xl tracking-tighter">₹{day.earnings}</p>
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
