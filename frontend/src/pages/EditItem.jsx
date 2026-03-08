import React, { useEffect, useState } from "react";
import {
  IoFastFoodOutline,
  IoCameraOutline,
  IoChevronDown,
} from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setMyShopData } from "../redux/ownerSlice";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import { TbArrowLeft } from "react-icons/tb";

const EditItem = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { itemId } = useParams();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frontendImage, setFrontendImage] = useState("");
  const [backendImage, setBackendImage] = useState(null);
  const [category, setCategory] = useState("");
  const [foodType, setFoodType] = useState("veg");
  const [fetchLoading, setFetchLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const categories = [
    "Snacks", "Main Course", "Dessert", "Pizza", "Burger",
    "Sandwiches", "North Indian", "South Indian", "Chinese",
    "Fast Food", "Others"
  ];

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setFetchLoading(true);
        const res = await axios.get(`${serverUrl}/api/item/get-item-by-id/${itemId}`, {
          withCredentials: true,
        });
        const item = res.data;
        setName(item.name || "");
        setPrice(item.price || "");
        setFrontendImage(item.image || "");
        setCategory(item.category || "");
        setFoodType(item.foodType || "veg");
      } catch (error) {
        console.error("Error fetching item:", error);
        toast.error("Failed to load item");
      } finally {
        setFetchLoading(false);
      }
    };
    if (itemId) fetchItem();
  }, [itemId]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category) {
      toast.error("Please select a category");
      return;
    }

    setSubmitLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("foodType", foodType);
    formData.append("price", Number(price));
    if (backendImage) {
      formData.append("image", backendImage);
    }

    try {
      const res = await axios.put(
        `${serverUrl}/api/item/edit-item/${itemId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      dispatch(setMyShopData(res.data.shop));
      toast.success("Item updated successfully");
      navigate("/");
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error(error.response?.data?.message || "Failed to update item");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50 flex items-center justify-center">
        <ClipLoader size={40} color="#ff4d2d" />
      </div>
    );
  }

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
            Menu Management
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter">
            Edit your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d2d] to-[#ff8e6d]">
              Dish.
            </span>
          </h1>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left - Image Upload (sticky) */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 bg-white rounded-3xl border-2 border-gray-200/80 shadow-md shadow-gray-200/50 p-6">
              <div className="relative group aspect-square">
                <input
                  type="file"
                  accept="image/*"
                  id="itemImage"
                  className="hidden"
                  onChange={handleImage}
                  disabled={submitLoading}
                />
                <label
                  htmlFor="itemImage"
                  className={`
                    flex flex-col items-center justify-center w-full h-full
                    border-2 border-dashed rounded-2xl transition-all cursor-pointer overflow-hidden
                    ${
                      frontendImage
                        ? "border-transparent bg-gray-50"
                        : "border-gray-200/80 bg-gray-50/50 hover:border-[#ff4d2d]/30 hover:bg-orange-50/30"
                    }
                    ${submitLoading ? "opacity-50 pointer-events-none" : ""}
                  `}
                >
                  {frontendImage ? (
                    <img src={frontendImage} alt="Dish preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400 group-hover:text-[#ff4d2d] transition-colors">
                      <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm mb-4 border-2 border-gray-200">
                        <IoCameraOutline size={32} className="text-gray-400 group-hover:text-[#ff4d2d]" />
                      </div>
                      <span className="font-black text-[10px] uppercase tracking-widest">Upload dish photo</span>
                      <span className="text-[8px] text-gray-400 mt-1">PNG or JPG, up to 5MB</span>
                    </div>
                  )}
                </label>
              </div>
              <p className="text-center mt-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                High‑quality images increase orders by 30%
              </p>
            </div>
          </div>

          {/* Right - Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl border-2 border-gray-200/80 shadow-md shadow-gray-200/50 p-8 md:p-10 space-y-8">
              {/* Dish Title */}
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                  <IoFastFoodOutline size={12} />
                  Dish title
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-50 border-2 border-gray-200/80 focus:border-[#ff4d2d] focus:ring-2 focus:ring-[#ff4d2d]/10 px-5 py-3.5 rounded-2xl text-sm font-bold outline-none transition-all placeholder:text-gray-400"
                  placeholder="SPICY TIKKA BURGER"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={submitLoading}
                  required
                />
              </div>

              {/* Price & Dietary */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Price (₹)</label>
                  <input
                    type="number"
                    className="w-full bg-gray-50 border-2 border-gray-200/80 focus:border-[#ff4d2d] focus:ring-2 focus:ring-[#ff4d2d]/10 px-5 py-3.5 rounded-2xl text-sm font-bold outline-none transition-all placeholder:text-gray-400"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    disabled={submitLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Dietary</label>
                  <div className="relative">
                    <select
                      className="w-full bg-gray-50 border-2 border-gray-200/80 focus:border-[#ff4d2d] focus:ring-2 focus:ring-[#ff4d2d]/10 px-5 py-3.5 rounded-2xl text-sm font-bold outline-none appearance-none transition-all cursor-pointer"
                      value={foodType}
                      onChange={(e) => setFoodType(e.target.value)}
                      disabled={submitLoading}
                    >
                      <option value="veg">VEG</option>
                      <option value="non-veg">NON-VEG</option>
                    </select>
                    <IoChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Category</label>
                <div className="relative">
                  <select
                    className="w-full bg-gray-50 border-2 border-gray-200/80 focus:border-[#ff4d2d] focus:ring-2 focus:ring-[#ff4d2d]/10 px-5 py-3.5 rounded-2xl text-sm font-bold outline-none appearance-none transition-all cursor-pointer"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    disabled={submitLoading}
                  >
                    <option value="">SELECT CATEGORY</option>
                    {categories.map((cate, i) => (
                      <option key={i} value={cate}>{cate.toUpperCase()}</option>
                    ))}
                  </select>
                  <IoChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitLoading}
              className="w-full bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4a] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-wider shadow-md shadow-orange-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {submitLoading ? (
                <ClipLoader size={18} color="white" />
              ) : (
                <>
                  <IoFastFoodOutline size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItem;