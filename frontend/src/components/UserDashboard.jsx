import React, { useEffect, useState, useRef } from "react";
import Nav from "./Nav.jsx";
import { categories } from "../category.js";
import { useSelector } from "react-redux";
import { ChevronLeft, ChevronRight, Sparkles, Star, SearchX, Store, Utensils, MapPin, Smile } from "lucide-react";
import FoodCart from "./FoodCart.jsx";
import CategoryCard from "./CategoryCard.jsx";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

const UserDashboard = () => {
  const cateScrollRef = useRef();
  const dishesRef = useRef(null);
  const containerRef = useRef(null);

  const { city, shopsInMyCity, itemsInMyCity, searchResults, userData } = useSelector((state) => state.user);

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  const allCategory = categories.find((cat) => cat.category === "All") || {
    category: "All",
    image: "https://via.placeholder.com/144?text=All",
  };
  const displayCategories = [...categories.filter((cat) => cat.category !== "All"), allCategory];

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

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.fromTo(".hero-anim", { opacity: 0, y: 40, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 1, stagger: 0.12 })
        .fromTo(".cate-anim", { opacity: 0, x: -15 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.04 }, "-=0.7")
        .fromTo(".shop-card-anim", { opacity: 0, y: 25, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.08 }, "-=0.4")
        .fromTo(".dish-anim", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.04 }, "-=0.5");
    }, containerRef);
    return () => ctx.revert();
  }, [itemsInMyCity, isSearchActive, selectedCategory, shopsInMyCity]);

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
  } else if (itemsInMyCity) {
    displayItems = itemsInMyCity.filter((item) => (selectedCategory === "All" ? true : item.category === selectedCategory));
  }

  return (
    <div className="min-h-screen bg-bg-secondary pb-20 overflow-hidden" ref={containerRef}>
      <Nav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 pt-6">

        {/* ── HERO / GREETING ── */}
        {!isSearchActive && (
          <header className="pt-10 hero-anim">
            <div className="relative rounded-3xl bg-gradient-to-br from-brand to-[#C12A35] p-8 md:p-12 overflow-hidden text-white shadow-xl shadow-brand/20">
              {/* Dotted pattern */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              {/* Background image subtle */}
              <div className="absolute inset-0 opacity-10">
                <img src="/hero_food_premium_1774269301507.png" alt="" className="w-full h-full object-cover object-center" />
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-3 py-1.5 mb-5">
                  <MapPin size={12} className="text-white" />
                  <span className="text-[12px] font-bold text-white uppercase tracking-widest">{city || "Your City"}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight mb-3">
                  What are we craving,<br />
                  <span className="text-white/90">{userData?.fullname?.split(" ")[0]}? <Smile size={28} className="inline ml-1" /></span>
                </h1>
                <p className="text-white/75 font-medium text-lg">
                  {shopsInMyCity?.length || 0} restaurants ready to deliver near you.
                </p>
              </div>
            </div>
          </header>
        )}

        {/* ── SEARCH RESULTS HEADER ── */}
        {isSearchActive && (
          <div className="pt-10 hero-anim">
            <h1 className="text-3xl font-black text-text-primary tracking-tight">
              Search Results <span className="text-brand">({searchResults.length})</span>
            </h1>
          </div>
        )}

        {/* ── CATEGORY SLIDER ── */}
        {!isSearchActive && (
          <section className="bg-bg-card rounded-3xl p-6 border border-border shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-text-primary">What's on your mind?</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => slide("left")}
                  className={`p-2.5 rounded-full border transition-all duration-300 ${
                    showLeftArrow
                      ? "bg-brand text-white border-brand shadow-md shadow-brand/20 hover:shadow-lg hover:shadow-brand/30 hover:scale-105 active:scale-95"
                      : "bg-bg-secondary border-border text-text-muted cursor-not-allowed opacity-50"
                  }`}
                  disabled={!showLeftArrow}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => slide("right")}
                  className={`p-2.5 rounded-full border transition-all duration-300 ${
                    showRightArrow
                      ? "bg-brand text-white border-brand shadow-md shadow-brand/20 hover:shadow-lg hover:shadow-brand/30 hover:scale-105 active:scale-95"
                      : "bg-bg-secondary border-border text-text-muted cursor-not-allowed opacity-50"
                  }`}
                  disabled={!showRightArrow}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Scroll Container with Fade Edges */}
            <div className="relative">
              {/* Left Fade */}
              {showLeftArrow && (
                <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-bg-card to-transparent z-10 pointer-events-none rounded-l-2xl" />
              )}

              {/* Right Fade */}
              {showRightArrow && (
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-bg-card to-transparent z-10 pointer-events-none rounded-r-2xl" />
              )}

              <div
                ref={cateScrollRef}
                className="flex gap-4 sm:gap-5 overflow-x-auto pb-3 no-scrollbar scroll-smooth snap-x snap-mandatory px-1"
              >
                {displayCategories.map((cat, idx) => (
                  <div key={idx} className="cate-anim shrink-0 snap-start">
                    <CategoryCard data={cat} isActive={selectedCategory === cat.category} onClick={() => handleCategoryClick(cat.category)} />
                  </div>
                ))}
              </div>
            </div>

          </section>
        )}

        {/* ── NEARBY RESTAURANTS ── */}
        {!isSearchActive && (
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-7 bg-brand rounded-full" />
              <h2 className="text-2xl font-black text-text-primary">Restaurants Near You</h2>
            </div>

            {!shopsInMyCity || shopsInMyCity.length === 0 ? (
              <div className="w-full py-20 bg-bg-card rounded-3xl border border-border flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-bg-secondary rounded-2xl flex items-center justify-center border border-border">
                  <Store className="text-text-muted" size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary">No shops in {city || "your area"}</h3>
                  <p className="text-text-muted text-sm mt-1">We're expanding fast, stay tuned!</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {shopsInMyCity.map((shop, idx) => (
                  <div
                    key={idx}
                    onClick={() => navigate(`/shop/${shop._id}`)}
                    className="shop-card-anim group cursor-pointer bg-bg-card rounded-2xl overflow-hidden hover:-translate-y-1.5 transition-all duration-400 border border-border shadow-sm hover:shadow-lg"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-bg-secondary">
                      <img src={shop.image} alt={shop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 right-3 bg-emerald-600 px-2 py-1 rounded-lg flex items-center gap-1 shadow-md">
                        <span className="text-[12px] font-black text-white">4.5</span>
                        <Star size={10} className="text-white fill-white" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-[16px] font-black text-text-primary group-hover:text-brand transition-colors line-clamp-1">{shop.name}</h3>
                      <p className="text-text-muted text-sm font-medium mt-1 line-clamp-1">{shop.address}</p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <div className={`w-2 h-2 rounded-full ${shop.isOpen ? "bg-emerald-500" : "bg-red-500"}`} />
                        <span className={`text-[12px] font-bold ${shop.isOpen ? "text-emerald-600" : "text-red-500"}`}>
                          {shop.isOpen ? "Open Now" : "Closed"}
                        </span>
                        <span className="text-text-muted text-[12px] font-medium ml-auto">~25-35 min</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── DISHES ── */}
        <section ref={dishesRef} className="space-y-6 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-1 h-7 bg-brand rounded-full" />
            <h2 className="text-2xl font-black text-text-primary">
              {isSearchActive ? "Search Results" : `${selectedCategory === "All" ? "All" : selectedCategory}`}
              <span className="text-brand"> Dishes</span>
            </h2>
          </div>

          {!displayItems || displayItems.length === 0 ? (
            <div className="w-full py-20 text-center bg-bg-card rounded-3xl border border-border">
              <SearchX className="mx-auto text-text-muted mb-4" size={40} />
              <p className="text-text-secondary font-bold uppercase tracking-widest text-sm">No matching dishes found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {displayItems.map((item, idx) => (
                <div key={idx} className="dish-anim h-full">
                  <FoodCart data={item} />
                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="mt-24 pt-12 pb-8 border-t border-border bg-bg-card">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand rounded-xl flex items-center justify-center font-black text-white text-lg">V</div>
            <span className="text-xl font-black tracking-tighter text-text-primary">Vingo<span className="text-brand">.</span></span>
          </div>
          <div className="flex gap-8">
            {["About", "Privacy", "Terms", "Support"].map((l) => (
              <button key={l} className="text-[13px] font-bold text-text-muted hover:text-brand transition-colors">{l}</button>
            ))}
          </div>
          <p className="text-text-muted text-[12px] font-semibold">© 2026 Vingo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default UserDashboard;