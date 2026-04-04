import React, { useEffect, useRef } from "react";
import Nav from "./Nav";
import { useSelector } from "react-redux";
import { Utensils, Plus, MapPin, Store, Pencil, Sparkles, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useGetMyShop from "../hooks/useGetMyShop";
import OwnerItemCard from "./OwnerItemCard";
import AnalyticsDashboard from "./AnalyticsDashboard";
import axios from "axios";
import { serverUrl } from "../App";
import gsap from "gsap";

const OwnerDashboard = () => {
  useGetMyShop();
  const myShopData = useSelector((state) => state.owner?.myShopData);
  const navigate = useNavigate();
  const containerRef = useRef(null);
  
  const [activeTab, setActiveTab] = React.useState("menu");
  const [analytics, setAnalytics] = React.useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = React.useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (activeTab === "analytics" && !analytics) {
        setLoadingAnalytics(true);
        try {
          const res = await axios.get(`${serverUrl}/api/shop/analytics`, { withCredentials: true });
          if (res.data.success) {
            setAnalytics(res.data.analytics);
          }
        } catch (error) {
          console.error("Failed to fetch analytics:", error);
        } finally {
          setLoadingAnalytics(false);
        }
      }
    };
    fetchAnalytics();
  }, [activeTab, analytics]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(".header-anim", { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 })
        .fromTo(".card-anim", { opacity: 0, scale: 0.95, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(1.2)" }, "-=0.6")
        .fromTo(".menu-item-anim", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, "-=0.4");
    }, containerRef);
    return () => ctx.revert();
  }, [myShopData]);

  return (
    <div className="min-h-screen bg-bg-primary" ref={containerRef}>
      <Nav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        {/* CASE 1: NO SHOP CREATED YET */}
        {!myShopData && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] card-anim">
            <div className="w-full max-w-xl premium-card p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 blur-[80px] rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-glow/10 blur-[80px] rounded-full pointer-events-none" />
              
              <div className="relative z-10 w-24 h-24 rounded-[2rem] bg-bg-secondary border border-border flex items-center justify-center mx-auto mb-8 shadow-xl">
                <Store className="text-brand w-10 h-10" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-text-primary mb-4 tracking-tighter">
                Start your <span className="text-gradient">journey.</span>
              </h2>
              <p className="text-text-secondary mb-10 text-[15px] font-medium leading-relaxed max-w-sm mx-auto">
                Open your digital storefront and offer premium culinary experiences to thousands of happy customers.
              </p>
              <button
                className="primary-button px-10 py-4 text-[13px] font-bold uppercase tracking-widest"
                onClick={() => navigate("/create-edit-shop")}
              >
                Register Restaurant
              </button>
            </div>
          </div>
        )}

        {/* CASE 2: SHOP EXISTS */}
        {myShopData && (
          <div className="space-y-12 relative z-10">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 blur-[150px] rounded-full pointer-events-none -z-10" />

            {/* WELCOME HEADER */}
            <div className="text-center pt-6 header-anim">
              <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tighter">
                Welcome, <span className="text-gradient">{myShopData.name}</span>
              </h1>
              
              <div className="flex justify-center gap-6 mt-10">
                 <button 
                  onClick={() => setActiveTab("menu")}
                  className={`text-[11px] font-black uppercase tracking-[0.2em] pb-2 transition-all border-b-2 ${activeTab === 'menu' ? 'border-brand text-brand' : 'border-transparent text-text-muted hover:text-text-secondary'}`}
                 >
                   Inventory
                 </button>
                 <button 
                  onClick={() => setActiveTab("analytics")}
                  className={`text-[11px] font-black uppercase tracking-[0.2em] pb-2 transition-all border-b-2 ${activeTab === 'analytics' ? 'border-brand text-brand' : 'border-transparent text-text-muted hover:text-text-secondary'}`}
                 >
                   Sales Insights
                 </button>
              </div>
            </div>

            {/* TAB CONTENT: ANALYTICS */}
            {activeTab === "analytics" && (
              <div className="card-anim">
                {loadingAnalytics ? (
                  <div className="flex flex-col items-center justify-center py-32 space-y-4">
                     <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin" />
                     <p className="text-text-muted text-[10px] uppercase font-black tracking-widest">Calculating your success...</p>
                  </div>
                ) : analytics ? (
                  <AnalyticsDashboard data={analytics} />
                ) : (
                  <div className="text-center py-20 text-text-muted font-bold uppercase tracking-widest">
                    No analytics available yet.
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: MENU */}
            {activeTab === "menu" && (
              <>
                {/* STORE HERO CARD */}
                <div className="card-anim premium-card overflow-hidden">
                  <div className="flex flex-col md:flex-row h-full">
                    <div className="md:w-[45%] h-64 md:h-auto overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-10" />
                      <img src={myShopData.image} alt="" className="w-full h-full object-cover" />
                      <div className={`absolute top-6 left-6 z-20 flex items-center gap-2.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md ${
                        myShopData.isOpen
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : "bg-red-500/10 text-red-600 border border-red-500/20"
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${myShopData.isOpen ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}></span>
                        {myShopData.isOpen ? "Live & Accepting Orders" : "Currently Closed"}
                      </div>
                    </div>
                    <div className="md:w-[55%] p-8 md:p-12 flex flex-col justify-center relative bg-bg-card">
                      <button onClick={() => navigate("/create-edit-shop")} className="absolute top-8 right-8 w-12 h-12 bg-bg-secondary border border-border rounded-2xl flex items-center justify-center text-text-muted hover:text-brand hover:border-brand transition-all">
                        <Pencil size={18} />
                      </button>
                      <h2 className="text-3xl md:text-4xl font-black text-text-primary mb-6 tracking-tight">{myShopData.name}</h2>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-brand/10 flex flex-shrink-0 items-center justify-center text-brand border border-brand/20"><MapPin size={18} /></div>
                        <div><p className="font-bold text-text-primary text-[15px] mb-1">{myShopData.city}, {myShopData.state}</p><p className="text-text-secondary text-[13px]">{myShopData.address}</p></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* MENU SECTION */}
                <section className="space-y-8 pt-4">
                  <div className="flex items-center justify-between header-anim">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-gradient-to-b from-brand to-brand-glow rounded-full" />
                      <h3 className="text-2xl md:text-3xl font-black text-text-primary tracking-tight">Your <span className="text-gradient">Menu</span></h3>
                    </div>
                    {myShopData.items.length > 0 && (
                      <button onClick={() => navigate("/add-item")} className="primary-button px-6 py-3.5 rounded-xl font-bold text-[12px] uppercase tracking-widest">
                        <Plus size={16} /><span className="hidden sm:inline">Add Dish</span>
                      </button>
                    )}
                  </div>
                  {myShopData.items.length === 0 ? (
                     <div className="w-full py-24 premium-card flex flex-col items-center text-center px-6 relative overflow-hidden menu-item-anim">
                        <div className="relative z-10">
                          <div className="bg-bg-secondary w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-border">
                            <Utensils className="text-text-muted w-8 h-8" />
                          </div>
                          <h2 className="text-2xl font-black text-text-primary mb-2">Your menu is empty</h2>
                          <p className="text-text-secondary text-[14px] mb-8 font-medium">Curate your first dish and set the standard for luxury dining.</p>
                          <button className="primary-button px-8 py-4 rounded-xl font-bold text-[13px] uppercase tracking-widest" onClick={() => navigate("/add-item")}>Add Your First Dish</button>
                        </div>
                     </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {myShopData.items.map((item, index) => (
                        <div key={index} className="menu-item-anim"><OwnerItemCard data={item} /></div>
                      ))}
                    </div>
                  )}
                </section>
              </>
            )}
          </div>
        )}
      </main>
      
      <footer className="bg-bg-secondary border-t border-border py-12 px-4 mt-20">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <h3 className="text-3xl font-black text-gradient">
            Vingo<span className="text-text-primary">.</span>
          </h3>
          <p className="text-[13px] font-medium text-text-secondary tracking-wide">
            Made with <Heart size={14} className="inline text-brand fill-brand" /> for luxury dining experiences
          </p>
          <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest pt-4">
            © 2026 Vingo. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default OwnerDashboard;
