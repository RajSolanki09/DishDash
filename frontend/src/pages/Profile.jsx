import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import {
  ArrowLeft,
  Edit2,
  Check,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Clock,
  Fingerprint,
  Star,
  MessageSquare,
  Power,
  Zap
} from "lucide-react";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { setMyShopData } from "../redux/ownerSlice";
import useGetMyShop from "../hooks/useGetMyShop";
import gsap from "gsap";
import { ProfileSkeleton } from "../components/Skeleton";

const Profile = () => {
  useGetMyShop();
  const { userData, city } = useSelector((state) => state.user);
  const { myShopData } = useSelector((state) => state.owner);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isTogglingDuty, setIsTogglingDuty] = useState(false);

  const [formData, setFormData] = useState({
    fullname: userData?.fullname || "",
    email: userData?.email || "",
    mobile: userData?.mobile || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.put(
        `${serverUrl}/api/user/update-profile`,
        formData,
        { withCredentials: true }
      );

      dispatch(setUserData(response.data.user));
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullname: userData?.fullname || "",
      email: userData?.email || "",
      mobile: userData?.mobile || "",
    });
    setError("");
    setSuccess("");
  };

  const toggleShopStatus = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${serverUrl}/api/shop/toggle-status`, {}, { withCredentials: true });
      if (res.data.success) {
        dispatch(setMyShopData(res.data.shop));
        setSuccess(`Shop is now ${res.data.isOpen ? 'Open' : 'Closed'}`);
        gsap.fromTo(".shop-status-badge", { scale: 0.8 }, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.3)" });
      }
    } catch {
      setError("Failed to toggle shop status");
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      user: { label: "Customer", color: "bg-white/5 text-zinc-300 border-white/10 glow-border" },
      owner: { label: "Shop Owner", color: "bg-brand/10 text-brand border-brand/20 glow-border" },
      deliveryBoy: { label: "Delivery Partner", color: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20 glow-border" },
    };
    return badges[role] || badges.user;
  };


  const toggleDutyStatus = async () => {
    setIsTogglingDuty(true);
    try {
      const res = await axios.post(`${serverUrl}/api/user/toggle-duty`, {}, { withCredentials: true });
      if (res.data.success) {
        dispatch(setUserData({ ...userData, isDutyOn: res.data.isDutyOn }));
        toast.success(`Duty is now ${res.data.isDutyOn ? 'ON' : 'OFF'}`);
      }
    } catch (err) {
      toast.error("Failed to toggle duty status");
    } finally {
      setIsTogglingDuty(false);
    }
  };


  const roleBadge = getRoleBadge(userData?.role);
  
  if (!userData) {
    return (
      <div className="min-h-screen bg-bg-secondary">
        <Nav />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-bg-secondary text-text-primary pb-20">
      <Nav />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 relative z-10">

        {/* ── HEADER ── */}
        <header className="mb-10">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 h-10 px-5 bg-bg-card border border-border rounded-xl text-text-secondary font-bold text-[10px] uppercase tracking-widest hover:border-brand hover:text-brand shadow-sm active:scale-95 transition-all duration-300 mb-8"
          >
            <ArrowLeft
              size={14}
            />
            Go Back
          </button>

          <div className="flex flex-col md:flex-row items-center md:items-end md:justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-bg-card rounded-full border border-border mb-4 shadow-sm">
                <Shield size={12} className="text-brand" />
                <span className="text-[9px] font-black text-text-secondary uppercase tracking-[0.25em]">
                  Account Settings
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-text-primary tracking-tighter leading-none">
                My <span className="text-brand">Profile.</span>
              </h1>
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-3.5 primary-button rounded-2xl font-black text-[11px] uppercase tracking-widest hover:-translate-y-0.5 active:scale-95 transition-all duration-300 w-full md:w-auto justify-center"
              >
                <Edit2 size={14} />
                Edit Profile
              </button>
            )}
          </div>
        </header>

        {/* ── PROFILE CARD ── */}
        <div className="bg-bg-card border border-border rounded-[2.5rem] shadow-sm overflow-hidden relative">
          {/* Header with Avatar */}
          <div className="px-8 py-10 border-b border-border relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-brand/5 to-transparent pointer-events-none" />
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">

              {/* Avatar */}
              <div className="relative group cursor-default">
                <div className="w-32 h-32 bg-bg-secondary rounded-[2rem] border border-border shadow-inner flex items-center justify-center text-text-primary text-5xl font-black relative overflow-hidden group-hover:border-brand/30 transition-colors duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative z-10">
                    {userData?.fullname?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-brand flex items-center justify-center border-4 border-bg-card text-white shadow-md">
                  <Check size={14} />
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-black text-text-primary tracking-tighter mb-4">
                  {userData?.fullname || "User"}
                </h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <span className={`px-4 py-1.5 ${roleBadge.color} border rounded-full text-[10px] font-black uppercase tracking-widest relative overflow-hidden`}>
                    <span className="relative z-10">{roleBadge.label}</span>
                  </span>
                  {city && (
                    <span className="flex items-center gap-2 px-4 py-1.5 bg-bg-secondary border border-border rounded-full text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                      <MapPin size={12} className="text-text-muted" />
                      {city}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-8 md:p-12 relative z-10">

            {/* Success/Error Messages */}
            {success && (
              <div className="mb-8 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-6 py-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Check size={16} />
                </div>
                <p className="text-[13px] font-bold text-emerald-400 tracking-wide">{success}</p>
              </div>
            )}

            {error && (
              <div className="mb-8 bg-rose-500/10 border border-rose-500/20 rounded-2xl px-6 py-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                  <X size={16} />
                </div>
                <p className="text-[13px] font-bold text-rose-400 tracking-wide">{error}</p>
              </div>
            )}

            <div className="space-y-6">

              {/* Full Name */}
              <div>
                <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 flex items-center gap-2 ml-1">
                  <User size={12} className="text-text-muted" /> Full Name
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-6 py-4 rounded-xl text-sm font-bold outline-none transition-all shadow-inner focus:shadow-md ${isEditing
                        ? "bg-bg-secondary border border-border focus:border-brand focus:bg-bg-card text-text-primary placeholder:text-text-muted"
                        : "bg-bg-tertiary border border-border text-text-secondary cursor-not-allowed"
                      }`}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 flex items-center gap-2 ml-1">
                  <Mail size={12} className="text-text-muted" /> Email Address
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-6 py-4 rounded-xl text-sm font-bold outline-none transition-all shadow-inner focus:shadow-md ${isEditing
                        ? "bg-bg-secondary border border-border focus:border-brand focus:bg-bg-card text-text-primary placeholder:text-text-muted"
                        : "bg-bg-tertiary border border-border text-text-secondary cursor-not-allowed"
                      }`}
                  />
                </div>
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 flex items-center gap-2 ml-1">
                  <Phone size={12} className="text-text-muted" /> Mobile Number
                </label>
                <div className="relative group">
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-6 py-4 rounded-xl text-sm font-bold outline-none transition-all shadow-inner focus:shadow-md ${isEditing
                        ? "bg-bg-secondary border border-border focus:border-brand focus:bg-bg-card text-text-primary placeholder:text-text-muted"
                        : "bg-bg-tertiary border border-border text-text-secondary cursor-not-allowed"
                      }`}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex flex-col sm:flex-row gap-4 pt-6 animate-in fade-in zoom-in-95 duration-300">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-3 h-14 primary-button rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <ClipLoader size={18} color="white" />
                    ) : (
                      <>
                        <Check size={16} />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-3 h-14 bg-bg-card border border-border text-text-primary rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-bg-secondary active:scale-95 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                  >
                    <X size={16} className="text-text-muted" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── OWNER EXCLUSIVE: SHOP CONTROL ── */}
        {userData?.role === 'owner' && (
          <div className="space-y-8 mt-8">
            <div className="bg-bg-card border border-border rounded-[2.5rem] p-10 overflow-hidden relative group/shop shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent pointer-events-none" />

              {myShopData ? (
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-3xl overflow-hidden border border-border bg-bg-secondary shrink-0 shadow-inner">
                      <img src={myShopData.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-text-primary tracking-tight uppercase italic">{myShopData.name}</h3>
                      <div className={`mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border shop-status-badge ${myShopData.isOpen ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${myShopData.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{myShopData.isOpen ? 'Shop is Open' : 'Shop is Closed'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <button
                      onClick={() => navigate('/create-edit-shop')}
                      className="w-full sm:w-auto h-14 px-8 bg-bg-card border border-border rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-bg-secondary transition-all shadow-sm"
                    >
                      Manage Details
                    </button>
                    <button
                      onClick={toggleShopStatus}
                      className={`w-full sm:w-auto h-14 px-10 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all duration-500 ${myShopData.isOpen ? 'bg-text-primary text-white hover:bg-black' : 'primary-button shadow-lg'}`}
                    >
                      {myShopData.isOpen ? 'Close For Today' : 'Open Shop Now'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center relative z-10 py-6">
                  <h3 className="text-xl font-black text-text-primary mb-2">No Shop Registered</h3>
                  <p className="text-text-secondary text-sm font-medium mb-6">Create your shop first to manage open/close status.</p>
                  <button
                    onClick={() => navigate('/create-edit-shop')}
                    className="primary-button h-12 px-8 rounded-2xl font-bold text-[13px]"
                  >
                    Create Your Shop
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ── DELIVERY BOY EXCLUSIVE: DUTY CONTROL ── */}
        {userData?.role === 'deliveryBoy' && (
          <div className="mt-8 bg-bg-card border border-border rounded-[2.5rem] p-10 overflow-hidden relative group/duty shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-transparent pointer-events-none" />
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="flex items-center gap-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${userData?.isDutyOn ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-bg-secondary text-text-muted border border-border'}`}>
                  {userData?.isDutyOn ? <Zap size={28} className="animate-pulse" /> : <Power size={28} />}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-text-primary tracking-tight">Duty Status</h3>
                  <div className={`mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${userData?.isDutyOn ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-zinc-500/10 border-zinc-500/20 text-zinc-400'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${userData?.isDutyOn ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-500'}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{userData?.isDutyOn ? 'Active & Receiving Orders' : 'Offline / On Break'}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                <button
                  onClick={() => navigate('/delivery-dashboard')}
                  className="w-full sm:w-auto h-14 px-8 bg-bg-card border border-border rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-bg-secondary transition-all shadow-sm"
                >
                  View Dashboard
                </button>
                <button
                  onClick={toggleDutyStatus}
                  disabled={isTogglingDuty}
                  className={`w-full sm:w-auto h-14 px-10 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all duration-500 disabled:opacity-50 ${userData?.isDutyOn ? 'bg-text-primary text-white hover:bg-black' : 'primary-button shadow-lg'}`}
                >
                  {isTogglingDuty ? (
                    <ClipLoader size={18} color="currentColor" />
                  ) : (
                    userData?.isDutyOn ? 'Go Offline' : 'Start Duty Now'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;