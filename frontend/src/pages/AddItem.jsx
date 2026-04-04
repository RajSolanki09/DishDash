import React, { useState } from "react";
import {
  Utensils,
  Camera,
  ChevronDown,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setMyShopData } from "../redux/ownerSlice";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";

const AddItem = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [category, setCategory] = useState("");
  const [foodType, setFoodType] = useState("veg");
  const [loading, setLoading] = useState(false);

  const categories = [
    "Snacks", "Main Course", "Dessert", "Pizza", "Burger",
    "Sandwiches", "North Indian", "South Indian", "Chinese",
    "Fast Food", "Others"
  ];

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category) return toast.error("Please select a category");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("foodType", foodType);
      formData.append("price", Number(price));

      if (backendImage) {
        formData.append("image", backendImage);
      }

      const result = await axios.post(
        `${serverUrl}/api/item/add-item`,
        formData,
        { withCredentials: true }
      );

      dispatch(setMyShopData(result.data.shop));
      toast.success("Item added successfully");
      navigate("/");
    } catch (error) {
      console.error("Error:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Failed to add item");
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
            Inventory Management
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter">
            Add New{" "}
            <span className="text-brand">Dish.</span>
          </h1>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* LEFT COLUMN – Image Upload Card (sticky) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-bg-card rounded-[2rem] border border-border shadow-sm p-6 md:p-8">
              <div className="relative group aspect-square">
                <input
                  type="file"
                  accept="image/*"
                  id="itemImage"
                  className="hidden"
                  onChange={handleImage}
                  disabled={loading}
                />
                <label
                  htmlFor="itemImage"
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
                      alt="Dish preview"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-text-muted group-hover:text-brand-glow transition-colors">
                      <div className="w-16 h-16 bg-bg-secondary rounded-2xl flex items-center justify-center shadow-inner mb-4 border border-border group-hover:border-brand/30 transition-colors">
                        <Camera size={32} className="text-text-muted group-hover:text-brand" />
                      </div>
                      <span className="font-black text-[10px] uppercase tracking-widest text-text-secondary group-hover:text-brand-glow">
                        Upload Photo
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
                High-quality images increase orders by 30%
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN – Form Fields Card */}
          <div className="lg:col-span-8 space-y-6">
            <div className="glass-panel rounded-[2.5rem] border border-border shadow-[0_20px_40px_rgba(0,0,0,0.5)] p-8 md:p-10 space-y-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-bg-card/[0.02] pointer-events-none" />
              {/* Dish Name */}
              <div className="space-y-3 relative z-10">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted flex items-center gap-2 ml-1">
                  <Utensils size={14} className="text-text-muted" />
                  Dish Title
                </label>
                <input
                  type="text"
                  className="w-full bg-bg-tertiary border border-border focus:border-brand focus:ring-1 focus:ring-brand px-6 py-4 rounded-xl text-sm font-bold text-text-primary outline-none transition-all placeholder:text-text-muted"
                  placeholder="SPICY TIKKA BURGER"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  disabled={loading}
                  required
                />
              </div>

              {/* Price & Dietary Type */}
              <div className="grid grid-cols-2 gap-6 relative z-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    className="w-full bg-bg-tertiary border border-border focus:border-brand focus:ring-1 focus:ring-brand px-6 py-4 rounded-xl text-sm font-bold text-text-primary outline-none transition-all placeholder:text-text-muted"
                    placeholder="0.00"
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">
                    Dietary
                  </label>
                  <div className="relative">
                    <select
                      className="w-full bg-bg-tertiary border border-border focus:border-brand focus:ring-1 focus:ring-brand px-6 py-4 rounded-xl text-sm font-bold text-text-primary outline-none appearance-none transition-all cursor-pointer"
                      onChange={(e) => setFoodType(e.target.value)}
                      value={foodType}
                      disabled={loading}
                    >
                      <option value="veg" className="bg-bg-tertiary text-text-primary">VEG</option>
                      <option value="non-veg" className="bg-bg-tertiary text-text-primary">NON-VEG</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={16} />
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-3 relative z-10">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">
                  Category
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-bg-tertiary border border-border focus:border-brand focus:ring-1 focus:ring-brand px-6 py-4 rounded-xl text-sm font-bold text-text-primary outline-none appearance-none transition-all cursor-pointer"
                    onChange={(e) => setCategory(e.target.value)}
                    value={category}
                    required
                    disabled={loading}
                  >
                    <option value="" className="bg-bg-tertiary text-text-muted">SELECT CATEGORY</option>
                    {categories.map((cate, i) => (
                      <option key={i} value={cate} className="bg-bg-tertiary text-text-primary">{cate.toUpperCase()}</option>
                    ))}
                  </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={16} />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full glow-button py-5 rounded-2xl font-black text-[13px] uppercase tracking-[0.15em] shadow-lg hover:shadow-[0_15px_40px_rgba(255,77,45,0.4)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative z-10"
            >
              {loading ? (
                <ClipLoader size={20} color="white" />
              ) : (
                <>
                  <Utensils size={20} />
                  Add to Menu
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItem;