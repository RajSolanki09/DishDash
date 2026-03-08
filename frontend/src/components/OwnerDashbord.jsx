import React from "react";
import Nav from "./Nav";
import { useSelector } from "react-redux";
import { FaUtensils, FaPlus, FaMapMarkerAlt, FaStore, FaPen, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useGetMyShop from "../hooks/useGetMyShop";
import OwnerItemCard from "./OwnerItemCard";

const OwnerDashbord = () => {
  useGetMyShop();
  const myShopData = useSelector((state) => state.owner?.myShopData);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50 selection:bg-[#ff4d2d]/10 selection:text-[#ff4d2d]">
      <Nav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* CASE 1: NO SHOP CREATED YET */}
        {!myShopData && (
          <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <div className="w-full max-w-xl bg-white rounded-3xl border-2 border-gray-200/80 shadow-md shadow-gray-200/50 p-10 text-center">
              <div className="bg-gradient-to-br from-[#ff4d2d] to-[#ff8e6d] w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
                <FaStore className="text-white w-8 h-8" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 tracking-tight">
                Start your <span className="text-[#ff4d2d]">journey</span>
              </h2>
              <p className="text-gray-500 mb-8 text-sm font-medium">
                Open your digital storefront and start serving thousands of happy customers today.
              </p>
              <button
                className="inline-flex items-center justify-center bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4a] text-white px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider shadow-md shadow-orange-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer"
                onClick={() => navigate("/create-edit-shop")}
              >
                Register Restaurant
              </button>
            </div>
          </div>
        )}

        {/* CASE 2: SHOP EXISTS */}
        {myShopData && (
          <div className="space-y-10">
            {/* WELCOME HEADER */}
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter">
                Welcome, <span className="text-[#ff4d2d]">{myShopData.name}</span>
              </h1>
              <p className="text-gray-400 font-bold uppercase tracking-wider text-xs mt-1">
                Merchant Dashboard
              </p>
            </div>

            {/* STORE HERO CARD – consistent with design system */}
            <div className="bg-white rounded-3xl border-2 border-gray-200/80 shadow-md shadow-gray-200/50 overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Image – subtle hover zoom */}
                <div className="md:w-5/12 h-56 md:h-64 overflow-hidden bg-gray-50">
                  <img
                    src={myShopData.image}
                    alt={myShopData.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                {/* Info */}
                <div className="md:w-7/12 p-6 md:p-8 flex flex-col justify-center relative">
                  <button
                    onClick={() => navigate("/create-edit-shop")}
                    className="absolute top-4 right-4 w-10 h-10 bg-white border-2 border-gray-200 rounded-2xl flex items-center justify-center text-gray-600 shadow-sm hover:bg-orange-50 hover:border-[#ff4d2d] hover:text-[#ff4d2d] hover:shadow-md active:scale-95 transition-all duration-200 cursor-pointer"
                  >
                    <FaPen size={14} />
                  </button>

                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-[10px] font-black uppercase tracking-wider w-fit mb-4 border-2 border-green-200">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Live & Accepting Orders
                  </div>

                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 tracking-tight">
                    {myShopData.name}
                  </h2>

                  <div className="flex items-start gap-3 text-gray-600">
                    <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0 text-[#ff4d2d] border border-orange-200">
                      <FaMapMarkerAlt size={14} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">
                        {myShopData.city}, {myShopData.state}
                      </p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {myShopData.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MENU SECTION */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-7 bg-gradient-to-b from-[#ff4d2d] to-[#ff8e6d] rounded-full" />
                  <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                    Your Menu
                  </h3>
                </div>

                {myShopData.items.length > 0 && (
                  <button
                    onClick={() => navigate("/add-item")}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4a] text-white px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-md shadow-orange-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer"
                  >
                    <FaPlus size={12} />
                    Add Dish
                  </button>
                )}
              </div>

              {/* EMPTY MENU STATE */}
              {myShopData.items.length === 0 && (
                <div className="w-full py-16 bg-white rounded-3xl border-2 border-gray-200/80 shadow-md shadow-gray-200/50 flex flex-col items-center text-center px-6">
                  <div className="bg-orange-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border-2 border-orange-200">
                    <FaUtensils className="text-[#ff4d2d] w-6 h-6" />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 mb-1">
                    Your menu is empty
                  </h2>
                  <p className="text-gray-500 text-sm mb-5 max-w-sm">
                    Add your first dish and start serving customers.
                  </p>
                  <button
                    className="bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4a] text-white px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-md shadow-orange-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer"
                    onClick={() => navigate("/add-item")}
                  >
                    Add Your First Dish
                  </button>
                </div>
              )}

              {/* ITEMS LIST */}
              {myShopData.items.length > 0 && (
                <div className="grid grid-cols-1 gap-4">
                  {myShopData.items.map((item, index) => (
                    <div
                      key={index}
                      className="transition-all duration-200 hover:translate-x-1"
                    >
                      <OwnerItemCard data={item} />
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <h3 className="text-2xl font-black bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">
            Vingo<span className="text-orange-400">.</span>
          </h3>
          <p className="text-sm font-medium">
            Made with ❤️ for food lovers everywhere
          </p>
          <p className="text-xs text-gray-500">
            © 2024 Vingo. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default OwnerDashbord;