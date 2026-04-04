import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Utensils,
  Store,
  Bike,
  Zap,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Star,
  ChevronRight,
  MapPin,
  Clock,
  TrendingUp,
  Gift,
  Truck,
  Flame
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const heroRef = useRef(null);

  const services = [
    {
      icon: <Utensils size={28} />,
      title: "For Foodies",
      subtitle: "Order from 1000+ restaurants near you",
      features: ["Live Order Tracking", "30-min Delivery", "No-contact Delivery"],
      color: "bg-brand",
      lightColor: "bg-brand/10",
      textColor: "text-brand",
      gradient: "from-brand to-[#F05A67]",
    },
    {
      icon: <Store size={28} />,
      title: "For Restaurants",
      subtitle: "Grow your business with zero friction",
      features: ["Smart Dashboard", "More Orders", "Real-Time Analytics"],
      color: "bg-violet-600",
      lightColor: "bg-violet-500/10",
      textColor: "text-violet-500",
      gradient: "from-violet-600 to-purple-600",
    },
    {
      icon: <Bike size={28} />,
      title: "For Riders",
      subtitle: "Earn on your own schedule",
      features: ["Flexible Hours", "Daily Payouts", "Top Earnings"],
      color: "bg-emerald-600",
      lightColor: "bg-emerald-500/10",
      textColor: "text-emerald-500",
      gradient: "from-emerald-600 to-teal-500",
    },
  ];

  const stats = [
    { val: "500+", label: "Restaurants", icon: <Store size={20} /> },
    { val: "50K+", label: "Happy Orders", icon: <CheckCircle size={20} /> },
    { val: "30 min", label: "Avg. Delivery", icon: <Clock size={20} /> },
    { val: "4.8★", label: "User Rating", icon: <Star size={20} /> },
  ];

  const features = [
    { icon: <Zap size={24} className="text-amber-500" />, title: "Lightning Fast", desc: "Hot food at your door in 30 mins or less" },
    { icon: <ShieldCheck size={24} className="text-emerald-600" />, title: "100% Secure", desc: "Safe payments and verified restaurants" },
    { icon: <TrendingUp size={24} className="text-brand" />, title: "Best Deals", desc: "Exclusive offers and cashbacks daily" },
    { icon: <Gift size={24} className="text-violet-600" />, title: "Rewards", desc: "Earn Vingo points with every order" },
  ];

  const trendingDishes = [
    { name: "Butter Chicken", time: "25 min", price: "₹299", img: "/images/dishes/butter-chicken.jpg" },
    { name: "Hyderabadi Biryani", time: "30 min", price: "₹349", img: "/images/dishes/biryani.jpg" },
    { name: "Masala Dosa", time: "20 min", price: "₹149", img: "/images/dishes/masala-dosa.jpg" },
    { name: "Paneer Tikka", time: "20 min", price: "₹249", img: "/images/dishes/paneer-tikka.jpg" },
    { name: "Chole Bhature", time: "25 min", price: "₹179", img: "/images/dishes/chole-bhature.jpg" },
    { name: "Pav Bhaji", time: "15 min", price: "₹129", img: "/images/dishes/pav-bhaji.jpg" },
  ];

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(".hero-badge", { y: -20, opacity: 0, duration: 0.6, ease: "power3.out" })
        .from(".hero-title", { y: 60, opacity: 0, duration: 0.8, ease: "expo.out" }, "-=0.3")
        .from(".hero-subtitle", { y: 30, opacity: 0, duration: 0.7, ease: "power3.out" }, "-=0.5")
        .from(".hero-actions", { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
        .from(".hero-image", { x: 60, opacity: 0, duration: 1, ease: "power4.out" }, "-=0.8")
        .from(".hero-floating-card", { scale: 0.8, opacity: 0, duration: 0.5, ease: "back.out(1.7)" }, "-=0.3");

      gsap.utils.toArray(".reveal-section").forEach((section) => {
        gsap.from(section, {
          y: 60,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 88%", toggleActions: "play none none none" },
        });
      });

      gsap.to(".hero-float", { y: -12, duration: 2.5, repeat: -1, yoyo: true, ease: "power1.inOut" });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-bg-primary text-[var(--color-text-primary)] overflow-x-hidden">

      {/* ── NAVIGATION ── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] h-20 flex items-center px-6 lg:px-12 bg-bg-card/90 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-9 h-9 bg-brand rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md shadow-brand/30">V</div>
            <span className="text-2xl font-black tracking-tighter text-text-primary">Vingo<span className="text-brand">.</span></span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/signin")} className="hidden sm:flex h-11 px-6 items-center text-[14px] font-semibold text-text-secondary hover:text-brand transition-colors">
              Log in
            </button>
            <button onClick={() => navigate("/signup")} className="primary-button h-11 px-6 text-[14px] rounded-xl">
              Sign up free
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center px-6 lg:px-12 pt-20 overflow-hidden bg-bg-primary">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#FEF3F3] to-transparent pointer-events-none" />
        <div className="absolute -top-40 right-0 w-[600px] h-[600px] bg-brand/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 xl:gap-24 items-center py-20">
          <div className="relative z-10">
            <div className="hero-badge inline-flex items-center gap-2 bg-brand/10 border border-brand/20 rounded-full px-4 py-2 mb-8">
              <div className="w-2 h-2 bg-brand rounded-full animate-pulse" />
              <span className="text-[12px] font-bold text-brand uppercase tracking-widest">Now in 12 cities across India</span>
            </div>

            <h1 className="hero-title text-5xl sm:text-6xl xl:text-7xl font-black tracking-tight leading-[1.05] mb-6">
              Delicious food,<br />
              <span className="text-brand">delivered fast.</span>
            </h1>

            <p className="hero-subtitle text-text-secondary text-lg md:text-xl font-medium max-w-lg mb-10 leading-relaxed">
              Order from your favourite local restaurants. Track in real-time. Enjoy at home.
            </p>

            <div className="hero-actions flex flex-col sm:flex-row gap-4 max-w-xl">
              <div className="flex flex-1 items-center gap-3 bg-bg-card border-2 border-border rounded-2xl px-4 h-14 shadow-sm focus-within:border-brand transition-all">
                <MapPin size={18} className="text-brand shrink-0" />
                <input type="text" placeholder="Enter your delivery location..." className="flex-1 outline-none text-[15px] font-medium text-text-primary placeholder:text-text-muted bg-transparent" />
              </div>
              <button onClick={() => navigate("/signup")} className="primary-button h-14 px-8 text-[15px] rounded-2xl font-bold shrink-0 whitespace-nowrap shadow-lg shadow-brand/25">
                Find Food <ArrowRight size={18} />
              </button>
            </div>

            <div className="hero-actions flex flex-wrap items-center gap-6 mt-10">
              {["30min delivery", "500+ restaurants", "No surge pricing"].map((t, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-emerald-500" />
                  <span className="text-[13px] font-semibold text-text-secondary">{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hero-image hidden lg:block">
            <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80" alt="Delicious Indian food" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
            <div className="hero-floating-card hero-float absolute -left-8 bottom-16 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl shadow-black/15 border border-white/50 flex items-center gap-3 min-w-[200px] z-10">
              <div className="w-12 h-12 bg-amber-500/15 rounded-xl flex items-center justify-center text-amber-500 shrink-0">
                <Star size={24} className="fill-amber-500 text-amber-500" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-gray-900">Rated 4.8/5</p>
                <p className="text-[11px] text-gray-500 font-medium">by 50,000+ users</p>
              </div>
            </div>
            <div className="hero-floating-card hero-float absolute -right-6 top-20 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl shadow-black/15 border border-white/50 z-10" style={{ animationDelay: "1.2s" }}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">Live order</span>
              </div>
              <p className="text-[13px] font-black text-gray-900">Butter Chicken Thali</p>
              <p className="text-[12px] text-gray-500 font-semibold">arriving in 12 min <Truck size={14} className="inline text-brand" /></p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="py-16 px-6 lg:px-12 bg-bg-secondary border-y border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="reveal-section flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center text-brand mb-1">{s.icon}</div>
              <p className="text-3xl font-black text-text-primary">{s.val}</p>
              <p className="text-[13px] font-bold text-text-muted uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY VINGO ── */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="reveal-section text-center mb-16">
            <p className="text-[12px] font-black text-brand uppercase tracking-widest mb-3">Why Choose Us</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              Everything you love about<br />food delivery, <span className="text-brand">perfected.</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="reveal-section bg-bg-card rounded-3xl p-8 border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-bg-secondary rounded-2xl flex items-center justify-center mb-5">{f.icon}</div>
                <h3 className="text-[17px] font-black text-text-primary mb-2">{f.title}</h3>
                <p className="text-[14px] text-text-secondary font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRENDING DISHES ── */}
      <section className="py-24 px-6 lg:px-12 bg-bg-primary relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="reveal-section flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
            <div>
              <div className="inline-flex items-center gap-2 bg-brand/10 border border-brand/20 rounded-full px-4 py-2 mb-4">
                <Flame size={14} className="text-brand" />
                <span className="text-[11px] font-bold text-brand uppercase tracking-widest">Trending Now</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                Most loved <span className="text-brand">dishes.</span>
              </h2>
            </div>
            <button onClick={() => navigate("/signup")} className="text-[13px] font-bold text-brand hover:underline flex items-center gap-1 shrink-0">
              View all <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {trendingDishes.map((dish, i) => (
              <div
                key={i}
                className="reveal-section group cursor-pointer"
                style={{ animationDelay: `${i * 80}ms` }}
                onClick={() => navigate("/signup")}
              >
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-md group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-500 mb-3">
                  <img
                    src={dish.img}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  {/* Price badge */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-xl px-2.5 py-1 shadow-md">
                    <span className="text-[11px] font-black text-gray-900">{dish.price}</span>
                  </div>

                  {/* Bottom info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white font-black text-[13px] truncate">{dish.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Clock size={10} className="text-white/70" />
                      <span className="text-[10px] text-white/70 font-semibold">{dish.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROLE CARDS ── */}
      <section className="py-24 px-6 lg:px-12 bg-bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="reveal-section mb-16">
            <p className="text-[12px] font-black text-brand uppercase tracking-widest mb-3">Join the Ecosystem</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Who are you?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <div key={i} className="reveal-section bg-bg-card rounded-3xl p-8 border border-border shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${s.gradient}`} />
                <div className={`w-14 h-14 ${s.lightColor} rounded-2xl flex items-center justify-center ${s.textColor} mb-6`}>{s.icon}</div>
                <h3 className="text-2xl font-black text-text-primary mb-2">{s.title}</h3>
                <p className="text-text-secondary font-medium mb-6 leading-relaxed">{s.subtitle}</p>
                <ul className="space-y-2 mb-8">
                  {s.features.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-[14px] font-semibold text-text-secondary">
                      <div className={`w-1.5 h-1.5 rounded-full ${s.color}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate("/signup")}
                  className={`w-full h-12 bg-gradient-to-r ${s.gradient} text-white font-bold text-[14px] rounded-2xl shadow-sm transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2 group-hover:gap-3`}
                >
                  Get Started <ChevronRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-24 px-6 lg:px-12 bg-bg-primary">
        <div className="max-w-7xl mx-auto">
          <div className="reveal-section relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand to-[#C12A35] p-16 lg:p-24 text-center text-white shadow-2xl shadow-brand/30">
            <div className="absolute inset-0 opacity-10">
              <img src="https://images.unsplash.com/photo-1526367790999-0150786686a2?w=1200&q=80" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
            <div className="relative z-10">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6">Hungry? Let's fix that.</h2>
              <p className="text-white/80 text-lg font-medium max-w-xl mx-auto mb-12 leading-relaxed">
                Join over 50,000 foodies across India who order smarter with Vingo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => navigate("/signup")} className="h-14 px-10 bg-white text-brand font-black text-[15px] rounded-2xl hover:bg-bg-secondary transition-all shadow-lg active:scale-95">
                  Order Now — It's Free
                </button>
                <button onClick={() => navigate("/about")} className="h-14 px-10 bg-white/10 text-white font-bold text-[15px] rounded-2xl border border-white/30 hover:bg-white/20 transition-all">
                  Learn more
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-16 px-6 lg:px-12 border-t border-border bg-bg-secondary">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white font-black text-lg">V</div>
            <span className="text-2xl font-black tracking-tighter text-text-primary">Vingo<span className="text-brand">.</span></span>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {["Instagram", "Twitter", "LinkedIn", "Support"].map((l) => (
              <button key={l} className="text-[13px] font-bold text-text-muted hover:text-brand transition-colors">{l}</button>
            ))}
          </div>
          <p className="text-text-muted text-[12px] font-semibold">© 2026 Vingo. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;