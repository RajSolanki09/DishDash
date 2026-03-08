import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import { TbArrowLeft, TbEdit, TbCheck, TbX } from "react-icons/tb";
import {
  IoPersonOutline,
  IoMailOutline,
  IoCallOutline,
  IoLocationOutline,
} from "react-icons/io5";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";

const Profile = () => {
  const { userData, city } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  const getRoleBadge = (role) => {
    const badges = {
      user: { label: "Customer", color: "bg-orange-50 text-orange-600 border-orange-200" },
      owner: { label: "Shop Owner", color: "bg-purple-50 text-purple-600 border-purple-200" },
      deliveryBoy: { label: "Delivery Partner", color: "bg-blue-50 text-blue-600 border-blue-200" },
    };
    return badges[role] || badges.user;
  };

  const roleBadge = getRoleBadge(userData?.role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50">
      <Nav />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">

        {/* ── HEADER ── */}
        <header className="mb-10">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 h-10 px-4 mb-8 bg-white border border-gray-200 rounded-2xl text-gray-600 font-bold text-[11px] uppercase tracking-wide shadow-sm hover:bg-orange-50 hover:border-[#ff4d2d]/30 hover:text-[#ff4d2d] hover:shadow-md active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <TbArrowLeft
              size={16}
              className="group-hover:-translate-x-0.5 transition-transform duration-200"
            />
            Back
          </button>

          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-black text-[#ff4d2d] uppercase tracking-[0.25em] mb-3">
                Account Settings
              </p>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-none">
                My <span className="text-[#ff4d2d]">Profile.</span>
              </h1>
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 h-11 px-5 bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4a] text-white rounded-2xl font-black text-[11px] uppercase tracking-wider shadow-lg shadow-orange-200 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <TbEdit size={16} />
                Edit
              </button>
            )}
          </div>
        </header>

        {/* ── PROFILE CARD ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-lg shadow-orange-100/40 overflow-hidden">
          
          {/* Header with Avatar */}
          <div className="bg-gradient-to-br from-orange-50 to-rose-50 px-8 py-10 border-b border-orange-100/60">
            <div className="flex flex-col md:flex-row items-center gap-6">
              
              {/* Avatar */}
              <div className="w-28 h-28 bg-gradient-to-br from-[#ff4d2d] to-[#ff8e6d] rounded-full flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-orange-200">
                {userData?.fullname?.charAt(0).toUpperCase() || "U"}
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-2">
                  {userData?.fullname || "User"}
                </h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <span className={`px-3 py-1 ${roleBadge.color} border rounded-full text-[10px] font-black uppercase tracking-widest`}>
                    {roleBadge.label}
                  </span>
                  {city && (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-[10px] font-bold text-gray-600">
                      <IoLocationOutline size={12} />
                      {city}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            
            {/* Success/Error Messages */}
            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl px-5 py-4 flex items-center gap-3">
                <TbCheck size={20} className="text-green-600 shrink-0" />
                <p className="text-sm font-bold text-green-700">{success}</p>
              </div>
            )}

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex items-center gap-3">
                <TbX size={20} className="text-red-600 shrink-0" />
                <p className="text-sm font-bold text-red-700">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              
              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  Full Name
                </label>
                <div className="relative group">
                  <IoPersonOutline
                    className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                      isEditing ? "text-gray-400 group-focus-within:text-[#ff4d2d]" : "text-gray-300"
                    } transition-colors`}
                    size={18}
                  />
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full pl-12 pr-4 py-4 rounded-2xl text-sm font-bold outline-none transition-all ${
                      isEditing
                        ? "bg-white border-2 border-gray-200 focus:border-[#ff4d2d]/40 focus:ring-2 focus:ring-[#ff4d2d]/10"
                        : "bg-gray-50 border-2 border-gray-100 text-gray-700 cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <IoMailOutline
                    className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                      isEditing ? "text-gray-400 group-focus-within:text-[#ff4d2d]" : "text-gray-300"
                    } transition-colors`}
                    size={18}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full pl-12 pr-4 py-4 rounded-2xl text-sm font-bold outline-none transition-all ${
                      isEditing
                        ? "bg-white border-2 border-gray-200 focus:border-[#ff4d2d]/40 focus:ring-2 focus:ring-[#ff4d2d]/10"
                        : "bg-gray-50 border-2 border-gray-100 text-gray-700 cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  Mobile Number
                </label>
                <div className="relative group">
                  <IoCallOutline
                    className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                      isEditing ? "text-gray-400 group-focus-within:text-[#ff4d2d]" : "text-gray-300"
                    } transition-colors`}
                    size={18}
                  />
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full pl-12 pr-4 py-4 rounded-2xl text-sm font-bold outline-none transition-all ${
                      isEditing
                        ? "bg-white border-2 border-gray-200 focus:border-[#ff4d2d]/40 focus:ring-2 focus:ring-[#ff4d2d]/10"
                        : "bg-gray-50 border-2 border-gray-100 text-gray-700 cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 h-12 bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4a] text-white rounded-2xl font-black text-[11px] uppercase tracking-wider shadow-lg shadow-orange-200 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <ClipLoader size={16} color="white" />
                    ) : (
                      <>
                        <TbCheck size={18} />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 h-12 bg-gray-100 border-2 border-gray-200 text-gray-700 rounded-2xl font-black text-[11px] uppercase tracking-wider hover:bg-gray-200 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <TbX size={18} />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Account Info Card */}
        <div className="mt-6 bg-white rounded-3xl border border-gray-100 shadow-md shadow-gray-100/40 p-6">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">
            Account Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Account ID</span>
              <span className="font-black text-gray-900 font-mono text-xs">
                {userData?._id?.slice(-8).toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Account Type</span>
              <span className="font-black text-gray-900">{roleBadge.label}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Member Since</span>
              <span className="font-black text-gray-900">
                {new Date(userData?.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;