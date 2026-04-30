import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import Nav from "../components/Nav";
import FoodCart from "../components/FoodCart";
import { MapPin, Star, ArrowLeft, Ghost, Clock, ChefHat, Store } from "lucide-react";
import { ClipLoader } from "react-spinners";
import gsap from "gsap";
import ReviewList from "../components/ReviewList";
import { ShopSkeleton } from "../components/Skeleton";

const Shop = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({ shop: null, items: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("menu");
  const { socket } = useSelector((state) => state.user);
  const containerRef = useRef(null);

  useEffect(() => {
    if (socket) {
      const handleStatusChange = ({ shopId: updatedShopId, isOpen }) => {
        if (updatedShopId === shopId) {
          setData((prev) => ({
            ...prev,
            shop: { ...prev.shop, isOpen },
          }));
        }
      };

      socket.on("shopStatusChanged", handleStatusChange);
      return () => socket.off("shopStatusChanged", handleStatusChange);
    }
  }, [socket, shopId]);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/shop/get-shop-details/${shopId}`, { withCredentials: true });
        setData(res.data);
      } catch (err) {
        console.log("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, [shopId]);

  useEffect(() => {
    if (!loading && data.items?.length > 0) {
      let ctx = gsap.context(() => {
        gsap.fromTo(".food-card-anim", { y: 25, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: "power3.out" });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [loading, data]);

  if (loading) {
    return <ShopSkeleton />;
  }

  if (!data.shop) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-secondary p-6">
        <div className="bg-bg-card rounded-3xl py-16 px-10 text-center max-w-md border border-border shadow-lg">
          <Ghost size={56} className="text-text-muted mx-auto mb-6" />
          <h2 className="text-2xl font-black text-text-primary mb-3">Restaurant not found</h2>
          <p className="text-text-secondary mb-8 text-sm font-medium">This establishment may have been removed or is unavailable right now.</p>
          <button onClick={() => navigate("/")} className="primary-button h-12 px-8 rounded-2xl font-bold text-[15px]">
            Browse Other Restaurants
          </button>
        </div>
      </div>
    );
  }

  // Group items by category
  const categories = data.items?.reduce((acc, item) => {
    const cat = item.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const categoryKeys = Object.keys(categories || {});

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 140; // Sticky header offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen bg-bg-secondary" ref={containerRef}>
      <Nav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 h-10 px-5 bg-bg-card border border-border rounded-xl text-text-secondary font-bold text-[13px] hover:border-brand hover:text-brand active:scale-95 transition-all duration-300 mb-8 shadow-sm"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Go Back
        </button>

        {/* Shop Header */}
        <section className="mb-10 bg-bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
          {/* Shop Image */}
          <div className="h-48 sm:h-72 md:h-80 overflow-hidden relative">
            <img
              src={data.shop?.image}
              alt={data.shop?.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2.5s] ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            {/* Stats overlay at bottom */}
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex flex-wrap items-center gap-2 sm:gap-3">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] sm:text-[12px] font-bold text-white shadow-md ${data.shop?.isOpen ? "bg-emerald-600" : "bg-red-600"}`}>
                <span className={`w-1.5 h-1.5 bg-white rounded-full ${data.shop?.isOpen ? "animate-pulse" : ""}`} />
                {data.shop?.isOpen ? "Open Now" : "Closed"}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-bg-card/90 backdrop-blur-sm px-2.5 py-1.5 rounded-lg text-[10px] sm:text-[12px] font-bold text-text-primary shadow-md">
                <Star size={10} className="text-amber-500 fill-amber-500" />
                {data.shop?.rating?.average > 0
                  ? `${data.shop.rating.average.toFixed(1)} (${data.shop.rating.count || 0})`
                  : "New"}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-bg-card/90 backdrop-blur-sm px-2.5 py-1.5 rounded-lg text-[10px] sm:text-[12px] font-bold text-text-primary shadow-md">
                <Clock size={10} className="text-brand" />
                25—35 min
              </span>
            </div>
          </div>

          {/* Shop Info */}
          <div className="p-5 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div>
                <h1 className="text-2xl md:text-4xl font-black tracking-tight text-text-primary mb-2">{data.shop?.name}</h1>
                <div className="flex items-center gap-2 text-text-secondary text-[13px] sm:text-[15px] font-medium">
                  <MapPin size={14} className="text-brand shrink-0" />
                  {data.shop?.address}, <span className="text-text-primary font-semibold">{data.shop?.city}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-brand/10 border border-brand/20 rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3 text-center min-w-[80px]">
                  <p className="text-xl sm:text-2xl font-black text-brand">
                    {data.shop?.rating?.average > 0 ? data.shop.rating.average.toFixed(1) : "New"}
                  </p>
                  <p className="text-[10px] font-bold text-brand/70 uppercase tracking-widest">
                    Rating
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Closed Shop Banner */}
        {!data.shop?.isOpen && (
          <div className="mb-8 flex items-center gap-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 rounded-2xl px-5 py-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
              <Store size={18} className="text-red-600" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-red-700 dark:text-red-400">This restaurant is currently closed</p>
              <p className="text-[12px] text-red-500 dark:text-red-400/70 font-medium">Orders are not being accepted right now. Check back later!</p>
            </div>
          </div>
        )}

        {/* Tabs and Sticky Category Nav */}
        <div className="sticky top-20 z-40 bg-bg-secondary/80 backdrop-blur-md py-4 mb-8 border-b border-border/50">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-1 bg-bg-card rounded-2xl p-1.5 border border-border shadow-sm w-fit">
              {[
                { key: "menu", label: "Menu", icon: <ChefHat size={15} /> },
                { key: "reviews", label: "Reviews", icon: <Star size={15} /> },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[14px] font-bold transition-all duration-200 ${activeTab === tab.key
                      ? "bg-brand text-white shadow-sm"
                      : "text-text-secondary hover:text-text-primary"
                    }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "menu" && categoryKeys.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {categoryKeys.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => scrollToSection(`cat-${cat}`)}
                    className="flex-shrink-0 px-4 py-2 bg-bg-card border border-border rounded-xl text-[11px] font-black uppercase tracking-widest text-text-secondary hover:border-brand hover:text-brand transition-all shadow-sm active:scale-95"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Menu Tab */}
        {activeTab === "menu" ? (
          <section className="space-y-12">
            {data.items?.length > 0 ? (
              categoryKeys.map((cat) => (
                <div key={cat} id={`cat-${cat}`} className="space-y-6 scroll-mt-40">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-brand rounded-full" />
                    <h2 className="text-2xl font-black text-text-primary tracking-tight">
                      {cat} <span className="text-text-muted text-sm ml-2 font-bold uppercase tracking-widest">({categories[cat].length})</span>
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categories[cat].map((item) => (
                      <div key={item._id} className="food-card-anim h-full">
                        <FoodCart data={item} />
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-bg-card rounded-3xl border border-border py-20 flex flex-col items-center text-center px-6">
                <div className="w-16 h-16 bg-bg-secondary rounded-2xl flex items-center justify-center mb-5 border border-border">
                  <Ghost size={28} className="text-text-muted" />
                </div>
                <h3 className="text-xl font-black text-text-primary mb-2">No items yet</h3>
                <p className="text-text-secondary text-sm font-medium max-w-sm mb-8">
                  This restaurant is still setting up their menu. Check back soon!
                </p>
                <button onClick={() => navigate("/")} className="primary-button h-12 px-8 rounded-2xl font-bold text-[15px]">
                  Explore More
                </button>
              </div>
            )}
          </section>
        ) : (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-7 bg-brand rounded-full" />
              <h2 className="text-2xl font-black text-text-primary">Customer Reviews</h2>
            </div>
            <ReviewList shopId={shopId} />
          </section>
        )}
      </main>
    </div>
  );
};

export default Shop;