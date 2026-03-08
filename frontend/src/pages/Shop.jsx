import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import Nav from "../components/Nav";
import FoodCart from "../components/FoodCart";
import { IoLocationSharp, IoStar } from "react-icons/io5";
import { TbArrowLeft } from "react-icons/tb";
import { ClipLoader } from "react-spinners";
import { TbMoodEmpty } from "react-icons/tb";

const Shop = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({ shop: null, items: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/shop/get-shop-details/${shopId}`,
          { withCredentials: true }
        );
        setData(res.data);
      } catch (err) {
        console.log("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, [shopId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50 flex flex-col items-center justify-center">
        <ClipLoader size={44} color="#ff4d2d" speedMultiplier={0.7} />
        <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.25em] mt-6">
          Loading restaurant...
        </p>
      </div>
    );
  }

  if (!data.shop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50 flex flex-col items-center justify-center">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-orange-100/60 py-16 px-10 text-center max-w-md">
          <TbMoodEmpty size={64} className="text-[#ff4d2d] mx-auto mb-6" />
          <h2 className="text-2xl font-black text-gray-900 mb-3">
            Restaurant not found
          </h2>
          <p className="text-gray-500 mb-8">
            This shop may have been removed or is unavailable right now.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-4 bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4a] text-white rounded-3xl font-black text-sm uppercase tracking-[0.12em] shadow-xl shadow-orange-200 hover:shadow-2xl hover:shadow-orange-200 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            Browse Other Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50">
      <Nav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">

        {/* Optimized Back Button – smaller & consistent */}
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

       

        {/* Shop Header – Premium Glass Card */}
        <section className="mb-12 bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-orange-100/60 overflow-hidden">
          <div className="relative">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10" />

            {/* Shop Image */}
            <div className="h-64 md:h-80 overflow-hidden">
              <img
                src={data.shop?.image}
                alt={data.shop?.name}
                className="w-full h-full object-cover brightness-90"
              />
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 z-20 flex items-end p-6 md:p-10">
              <div className="w-full text-white">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-4 py-1.5 bg-white/90 backdrop-blur-sm text-[#ff4d2d] rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
                    Open Now
                  </span>
                  <span className="px-4 py-1.5 bg-white/90 backdrop-blur-sm text-gray-800 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                    <IoStar className="text-yellow-400" size={14} />
                    4.2 <span className="text-gray-600">(500+)</span>
                  </span>
                </div>

                <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none drop-shadow-lg">
                  {data.shop?.name}
                </h1>

                <div className="flex items-center gap-2 mt-3 text-white/90 text-sm md:text-base font-medium drop-shadow">
                  <IoLocationSharp size={18} className="text-[#ff4d2d]" />
                  {data.shop?.address}, {data.shop?.city}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Menu Items */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-1.5 h-8 bg-gradient-to-b from-[#ff4d2d] to-[#ff8e6d] rounded-full" />
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter">
              Menu <span className="text-[#ff4d2d]">Items</span>
            </h2>
          </div>

          {data.items?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {data.items.map((item, index) => (
                <div
                  key={item._id}
                  className="hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <FoodCart data={item} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-orange-100/60 py-20 px-8 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-orange-50 rounded-3xl flex items-center justify-center mb-8">
                <TbMoodEmpty size={52} className="text-[#ff4d2d]" />
              </div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.25em] mb-4">
                Nothing here yet
              </p>
              <h3 className="text-3xl font-black text-gray-900 tracking-tighter mb-4">
                No menu items available
              </h3>
              <p className="text-gray-500 text-base font-medium max-w-md mb-10">
                This restaurant hasn't added any dishes yet. Check back soon!
              </p>
              <button
                onClick={() => navigate("/")}
                className="px-10 py-4 bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4a] text-white rounded-3xl font-black text-sm uppercase tracking-[0.12em] shadow-xl shadow-orange-200 hover:shadow-2xl hover:shadow-orange-200 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                Browse Other Restaurants
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Shop;