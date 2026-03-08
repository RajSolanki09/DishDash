import React, { useEffect, useState, useRef } from "react";
import Nav from "./Nav.jsx";
import { categories } from "../category.js";
import { useSelector } from "react-redux";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import FoodCart from "./FoodCart.jsx";
import { IoSparkles } from "react-icons/io5";
import CategoryCard from "./CategoryCard.jsx";
import { useNavigate } from "react-router-dom";
import { HiOutlineStar } from "react-icons/hi";
import { TbMoodEmpty } from "react-icons/tb";

const UserDashboard = () => {
  const cateScrollRef = useRef();
  const dishesRef = useRef(null);

  const { city, shopsInMyCity, itemsInMyCity, searchResults } = useSelector(
    (state) => state.user
  );

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  const allCategory = categories.find((cat) => cat.category === "All") || {
    category: "All",
    image: "https://via.placeholder.com/144?text=All",
  };
  const displayCategories = [
    ...categories.filter((cat) => cat.category !== "All"),
    allCategory,
  ];

  const isSearchActive = searchResults && searchResults.length > 0;

  const handleScroll = () => {
    if (cateScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = cateScrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const scrollContainer = cateScrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const slide = (direction) => {
    const offset = direction === "left" ? -400 : 400;
    cateScrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    setTimeout(() => {
      dishesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  let displayItems = [];
  if (isSearchActive) {
    displayItems = searchResults;
  } else {
    displayItems = itemsInMyCity?.filter((item) => {
      if (selectedCategory === "All") return true;
      return item.category === selectedCategory;
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50 selection:bg-[#ff4d2d]/10 selection:text-[#ff4d2d]">
      <Nav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">

        {/* ── HERO GREETING ── */}
        {!isSearchActive && (
          <section className="mb-12">
            <div className="bg-gradient-to-r from-[#ff4d2d] to-[#ff8e6d] rounded-3xl px-8 py-10 md:px-12 md:py-12 relative overflow-hidden shadow-xl shadow-orange-200/60 border border-orange-300/20">
              {/* Decorative circles */}
              <div className="absolute -right-10 -top-10 w-52 h-52 bg-white/10 rounded-full pointer-events-none" />
              <div className="absolute -right-4 -bottom-14 w-40 h-40 bg-white/5 rounded-full pointer-events-none" />
              <div className="absolute right-32 top-4 w-16 h-16 bg-white/5 rounded-full pointer-events-none" />

              <div className="relative z-10 max-w-xl">
                <div className="flex items-center gap-2 mb-3">
                  <IoSparkles size={14} className="text-orange-200 animate-pulse" />
                  <span className="text-[10px] font-black text-orange-200 uppercase tracking-[0.25em]">
                    {city ? `Delivering in ${city}` : "Food Delivery"}
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-tight mb-2">
                  Hungry? <br className="hidden sm:block" />
                  We've got you <span className="text-orange-200">covered.</span>
                </h1>
                <p className="text-orange-100/80 text-sm font-medium mt-3">
                  Order from the best restaurants around you — fast & fresh.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ── CATEGORY SLIDER ── */}
        {!isSearchActive && (
          <section className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                  What's on your{" "}
                  <span className="text-[#ff4d2d]">mind?</span>
                </h2>
                <div className="h-[3px] w-8 bg-gradient-to-r from-[#ff4d2d] to-[#ff8e6d] rounded-full mt-1.5" />
              </div>

              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => slide("left")}
                  disabled={!showLeftArrow}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 border-2 font-bold text-sm ${
                    showLeftArrow
                      ? "bg-white border-gray-300 text-gray-700 shadow-md hover:bg-orange-50 hover:border-[#ff4d2d] hover:text-[#ff4d2d] hover:shadow-lg active:scale-95 cursor-pointer"
                      : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <FaChevronLeft size={13} />
                </button>
                <button
                  onClick={() => slide("right")}
                  disabled={!showRightArrow}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 border-2 font-bold text-sm ${
                    showRightArrow
                      ? "bg-white border-gray-300 text-gray-700 shadow-md hover:bg-orange-50 hover:border-[#ff4d2d] hover:text-[#ff4d2d] hover:shadow-lg active:scale-95 cursor-pointer"
                      : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <FaChevronRight size={13} />
                </button>
              </div>
            </div>

            <div className="relative">
              <div
                ref={cateScrollRef}
                className="flex gap-5 md:gap-7 overflow-x-auto no-scrollbar scroll-smooth py-3"
              >
                {displayCategories.map((category, index) => (
                  <div key={index} className="flex-shrink-0">
                    <CategoryCard
                      data={category}
                      isActive={selectedCategory === category.category}
                      onClick={() => handleCategoryClick(category.category)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── TOP RESTAURANTS ── */}
        {!isSearchActive && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full shadow-sm">
                    <IoSparkles size={11} className="text-[#ff4d2d] animate-pulse" />
                    <span className="text-[10px] font-black text-[#ff4d2d] uppercase tracking-wider">
                      Top Picks
                    </span>
                  </div>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                  Best restaurants in{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d2d] to-[#ff8e6d]">
                    {city || "Your City"}
                  </span>
                </h2>
                <div className="h-[3px] w-8 bg-gradient-to-r from-[#ff4d2d] to-[#ff8e6d] rounded-full mt-1.5" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {shopsInMyCity?.map((shop) => (
                <div
                  key={shop._id}
                  onClick={() => navigate(`/shop/${shop._id}`)}
                  className="group cursor-pointer bg-white rounded-3xl border-2 border-gray-200/80 shadow-md shadow-gray-200/50 overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-200/60 hover:border-[#ff4d2d]/30 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img
                      src={shop.image}
                      alt={shop.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Rating badge */}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-md border border-gray-200">
                      <HiOutlineStar size={12} className="text-[#ffb300] fill-[#ffb300]" />
                      <span className="text-xs font-black text-gray-900">4.2</span>
                    </div>
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Info */}
                  <div className="px-4 py-3.5">
                    <h3 className="text-sm font-black text-gray-900 group-hover:text-[#ff4d2d] transition-colors duration-200 line-clamp-1 mb-0.5">
                      {shop.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium line-clamp-1">
                      {shop.address}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── DISHES / SEARCH RESULTS ── */}
        <section ref={dishesRef} className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-1 h-7 bg-gradient-to-b from-[#ff4d2d] to-[#ff8e6d] rounded-full" />
            <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
              {isSearchActive ? (
                <>
                  <span className="text-[#ff4d2d]">Search Results</span>
                  <span className="text-gray-400 font-semibold text-base ml-2.5">
                    ({displayItems?.length} found)
                  </span>
                </>
              ) : (
                <>
                  {selectedCategory === "All" ? "Popular" : selectedCategory}{" "}
                  <span className="text-[#ff4d2d]">Dishes</span>
                </>
              )}
            </h2>
          </div>

          {displayItems && displayItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayItems.map((item, index) => (
                <div
                  key={item._id || index}
                  className="hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <FoodCart data={item} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border-2 border-gray-200/80 shadow-md shadow-gray-100/50 py-16 flex flex-col items-center justify-center text-center px-6">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4 border border-orange-200">
                <TbMoodEmpty size={30} className="text-[#ff4d2d]" />
              </div>
              <p className="text-gray-900 font-black text-sm uppercase tracking-widest mb-1">
                {isSearchActive ? "No items found" : "No dishes available"}
              </p>
              <p className="text-gray-500 text-xs font-medium">
                {isSearchActive
                  ? "Try searching with different keywords"
                  : "Check back later for new items"}
              </p>
            </div>
          )}
        </section>

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

export default UserDashboard;