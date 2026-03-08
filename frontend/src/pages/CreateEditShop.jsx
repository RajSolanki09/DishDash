import React, { useState } from "react";
import {
  IoStorefrontOutline,
  IoCloudUploadOutline,
  IoLocationOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setMyShopData } from "../redux/ownerSlice";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import { TbArrowLeft } from "react-icons/tb";

const CreateEditShop = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { myShopData } = useSelector((state) => state.owner);
  const { city, currentState, currentAddress } = useSelector(
    (state) => state.user,
  );
  const { location } = useSelector((state) => state.map);

  const [name, setName] = useState(myShopData?.name || "");
  const [address, setAddress] = useState(
    myShopData?.address || currentAddress || "",
  );
  const [cityValue, setCityValue] = useState(myShopData?.city || city || "");
  const [state, setState] = useState(myShopData?.state || currentState || "");
  const [frontendImage, setFrontendImage] = useState(myShopData?.image || null);
  const [backendImage, setBackendImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location?.lat || !location?.lon) {
      return toast.error("Location not found. Please refresh or enable GPS.");
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("address", address);
    formData.append("city", cityValue);
    formData.append("state", state);
    formData.append("lat", location.lat);
    formData.append("lon", location.lon);

    if (backendImage) {
      formData.append("image", backendImage);
    }

    try {
      const res = await axios.post(
        `${serverUrl}/api/shop/create-edit`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        },
      );

      dispatch(setMyShopData(res.data.shop));
      toast.success(res.data.message);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 h-10 px-4 bg-white border border-gray-200 rounded-2xl text-gray-600 font-bold text-[11px] uppercase tracking-wide shadow-sm hover:bg-orange-50 hover:border-[#ff4d2d]/30 hover:text-[#ff4d2d] hover:shadow-md active:scale-95 transition-all duration-200 cursor-pointer mb-7"
        >
          <TbArrowLeft
            size={16}
            className="group-hover:-translate-x-0.5 transition-transform duration-200"
          />
          Back
        </button>

        {/* Header */}
        <header className="mb-12 text-center md:text-left">
          <p className="text-[#ff4d2d] font-black text-[10px] uppercase tracking-[0.3em] mb-2">
            {myShopData ? "Manage Business" : "Shop Registration"}
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter">
            {myShopData ? "Edit your" : "Open your"}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d2d] to-[#ff8e6d]">
              {myShopData ? "Shop." : "Storefront."}
            </span>
          </h1>
        </header>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
        >
          {/* LEFT COLUMN – Image Upload Card (sticky) */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 bg-white rounded-3xl border-2 border-gray-200/80 shadow-md shadow-gray-200/50 p-6">
              <div className="relative group aspect-square">
                <input
                  type="file"
                  accept="image/*"
                  id="shopImage"
                  className="hidden"
                  onChange={handleImage}
                  disabled={loading}
                />
                <label
                  htmlFor="shopImage"
                  className={`
                    flex flex-col items-center justify-center w-full h-full
                    border-2 border-dashed rounded-2xl transition-all cursor-pointer overflow-hidden
                    ${
                      frontendImage
                        ? "border-transparent bg-gray-50"
                        : "border-gray-200/80 bg-gray-50/50 hover:border-[#ff4d2d]/30 hover:bg-orange-50/30"
                    }
                    ${loading ? "opacity-50 pointer-events-none" : ""}
                  `}
                >
                  {frontendImage ? (
                    <img
                      src={frontendImage}
                      alt="Shop preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400 group-hover:text-[#ff4d2d] transition-colors">
                      <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm mb-4 border-2 border-gray-200">
                        <IoCloudUploadOutline
                          size={32}
                          className="text-gray-400 group-hover:text-[#ff4d2d]"
                        />
                      </div>
                      <span className="font-black text-[10px] uppercase tracking-widest">
                        Upload shop cover
                      </span>
                      <span className="text-[8px] text-gray-400 mt-1">
                        PNG or JPG, up to 5MB
                      </span>
                    </div>
                  )}
                </label>
              </div>
              <p className="text-center mt-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                High‑quality images attract more customers
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN – Form Fields Card */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl border-2 border-gray-200/80 shadow-md shadow-gray-200/50 p-8 md:p-10 space-y-8">
              {/* Shop Name */}
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                  <IoStorefrontOutline size={12} />
                  Business name
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-50 border-2 border-gray-200/80 focus:border-[#ff4d2d] focus:ring-2 focus:ring-[#ff4d2d]/10 px-5 py-3.5 rounded-2xl text-sm font-bold outline-none transition-all placeholder:text-gray-400"
                  placeholder="THE ROYAL BAKERS"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              {/* City & State – read-only */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                    City
                  </label>
                  <input
                    type="text"
                    readOnly
                    className="w-full bg-gray-100 border-2 border-gray-200/80 px-5 py-3.5 rounded-2xl text-sm font-bold text-gray-600 cursor-default outline-none"
                    value={cityValue}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                    State
                  </label>
                  <input
                    type="text"
                    readOnly
                    className="w-full bg-gray-100 border-2 border-gray-200/80 px-5 py-3.5 rounded-2xl text-sm font-bold text-gray-600 cursor-default outline-none"
                    value={state}
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                  <IoLocationOutline size={12} />
                  Business address
                </label>
                <textarea
                  rows={3}
                  className="w-full bg-gray-50 border-2 border-gray-200/80 focus:border-[#ff4d2d] focus:ring-2 focus:ring-[#ff4d2d]/10 px-5 py-3.5 rounded-2xl text-sm font-bold outline-none transition-all placeholder:text-gray-400 resize-none"
                  placeholder="Street, area, landmark…"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={loading}
                  required
                />
                <p className="text-[8px] font-bold uppercase tracking-wider text-[#ff4d2d] mt-1 flex items-center gap-1">
                  <span>📍</span> GPS location synced from your profile
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4a] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-wider shadow-md shadow-orange-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <ClipLoader size={18} color="white" />
              ) : (
                <>
                  <IoStorefrontOutline size={18} />
                  {myShopData ? "Save Changes" : "Register Shop"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEditShop;
