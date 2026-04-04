import React, { useState } from "react";
import {
  Store,
  UploadCloud,
  MapPin,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setMyShopData } from "../redux/ownerSlice";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";

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
  const cityValue = myShopData?.city || city || "";
  const state = myShopData?.state || currentState || "";
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
    <div className="min-h-screen relative bg-bg-secondary text-text-primary overflow-hidden pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 relative z-10">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 h-10 px-5 bg-bg-card border border-border rounded-xl text-text-secondary font-bold text-[10px] uppercase tracking-widest hover:border-brand hover:text-brand shadow-sm active:scale-95 transition-all duration-300 mb-8"
        >
          <ArrowLeft
            size={14}
          />
          Go Back
        </button>

        {/* Header */}
        <header className="mb-12">
          <p className="text-brand font-black text-[10px] uppercase tracking-[0.3em] mb-2">
            {myShopData ? "Manage Business" : "Shop Registration"}
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter">
            {myShopData ? "Edit your" : "Open your"}{" "}
            <span className="text-brand">{myShopData ? "Shop." : "Storefront."}</span>
          </h1>
        </header>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
        >
          {/* LEFT COLUMN – Image Upload Card (sticky) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-bg-card rounded-[2rem] border border-border shadow-sm p-6 md:p-8">
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
                    border-2 border-dashed rounded-[1.5rem] transition-all cursor-pointer overflow-hidden shadow-inner
                    ${frontendImage
                      ? "border-transparent bg-bg-secondary"
                      : "border-border bg-bg-card hover:border-brand/50 hover:bg-brand/5 shadow-inner"
                    }
                    ${loading ? "opacity-50 pointer-events-none" : ""}
                  `}
                >
                  {frontendImage ? (
                    <img
                      src={frontendImage}
                      alt="Shop preview"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-text-muted group-hover:text-brand transition-colors">
                      <div className="w-16 h-16 bg-bg-secondary rounded-2xl flex items-center justify-center shadow-inner mb-4 border border-border group-hover:border-brand/30 transition-colors">
                        <UploadCloud
                          size={32}
                          className="text-text-muted group-hover:text-brand"
                        />
                      </div>
                      <span className="font-black text-[10px] uppercase tracking-widest text-text-secondary group-hover:text-brand">
                        Upload Cover
                      </span>
                      <span className="text-[9px] text-text-muted font-bold mt-2 uppercase tracking-wide">
                        PNG or JPG, up to 5MB
                      </span>
                    </div>
                  )}
                </label>
              </div>
              <p className="text-center mt-6 text-[9px] font-bold text-text-muted uppercase tracking-widest flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                High-quality images attract more customers
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN – Form Fields Card */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-bg-card rounded-[2.5rem] border border-border shadow-sm p-8 md:p-10 space-y-8 relative overflow-hidden">
              {/* Shop Name */}
              <div className="space-y-3 relative z-10">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted flex items-center gap-2 ml-1">
                  <Store size={14} className="text-text-muted" />
                  Business Name
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    className="w-full bg-bg-secondary border border-border focus:border-brand focus:bg-white px-6 py-4 rounded-xl text-sm font-bold text-text-primary outline-none transition-all placeholder:text-text-muted shadow-inner focus:shadow-md"
                    placeholder="THE ROYAL BAKERS"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* City & State – read-only */}
              <div className="grid grid-cols-2 gap-6 relative z-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">
                    City
                  </label>
                  <input
                    type="text"
                    readOnly
                    className="w-full bg-bg-tertiary border border-border px-6 py-4 rounded-xl text-sm font-bold text-text-muted cursor-not-allowed outline-none focus:border-border"
                    value={cityValue}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">
                    State
                  </label>
                  <input
                    type="text"
                    readOnly
                    className="w-full bg-bg-tertiary border border-border px-6 py-4 rounded-xl text-sm font-bold text-text-muted cursor-not-allowed outline-none focus:border-border"
                    value={state}
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-3 relative z-10">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted flex items-center gap-2 ml-1">
                  <MapPin size={14} className="text-text-muted" />
                  Business Address
                </label>
                <textarea
                  rows={3}
                  className="w-full bg-bg-tertiary border border-border focus:border-brand focus:ring-1 focus:ring-brand px-6 py-4 rounded-xl text-sm font-bold text-text-primary outline-none transition-all placeholder:text-text-muted resize-none"
                  placeholder="Street, area, landmark…"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={loading}
                  required
                />
                <p className="text-[9px] font-bold uppercase tracking-widest text-brand mt-2 flex items-center gap-1.5 px-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-glow animate-pulse" />
                  GPS location automatically synced from profile
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full primary-button py-5 rounded-2xl font-black text-[13px] uppercase tracking-[0.15em] shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative z-10"
            >
              {loading ? (
                <Px size={20} color="white" />
              ) : (
                <>
                  <Store size={20} />
                  {myShopData ? "Save Config" : "Register Storefront"}
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
