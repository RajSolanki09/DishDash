import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  IoRestaurantOutline, 
  IoStorefrontOutline, 
  IoBicycleOutline,
  IoRocketOutline,
  IoFlashOutline,
  IoShieldCheckmarkOutline,
  IoCheckmarkCircle,
  IoChevronForward,
} from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa6";

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);

  const services = [
    {
      icon: <IoRestaurantOutline size={32} />,
      role: "user",
      title: "Customers",
      subtitle: "Crave it. Order it. Love it.",
      features: ["1000+ Restaurants", "Live Tracking", "Fast Delivery"],
      gradient: "from-orange-500 to-red-500",
      image: "🍕"
    },
    {
      icon: <IoStorefrontOutline size={32} />,
      role: "owner",
      title: "Restaurants",
      subtitle: "Grow your business online",
      features: ["Easy Dashboard", "More Orders", "Zero Setup"],
      gradient: "from-purple-500 to-pink-500",
      image: "🏪"
    },
    {
      icon: <IoBicycleOutline size={32} />,
      role: "deliveryBoy",
      title: "Riders",
      subtitle: "Earn money on your time",
      features: ["Flexible Hours", "Daily Payouts", "Top Earnings"],
      gradient: "from-blue-500 to-cyan-500",
      image: "🚴"
    },
  ];

  const features = [
    { icon: <IoFlashOutline />, text: "30-Min Delivery" },
    { icon: <IoShieldCheckmarkOutline />, text: "100% Safe" },
    { icon: <IoCheckmarkCircle />, text: "Top Rated" },
  ];

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      
      {/* ═══════════════════════════════════════════════════════════
          NAVIGATION
      ═══════════════════════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-gradient-to-br from-[#ff4d2d] to-[#ff8e6d] rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform">
              V
            </div>
            <span className="text-2xl font-black tracking-tight text-gray-900">
              Vingo
            </span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/signin")}
              className="px-6 py-2.5 text-sm font-bold text-gray-700 hover:text-[#ff4d2d] transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-6 py-2.5 bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4a] text-white rounded-xl font-black text-sm shadow-lg shadow-orange-200 hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section className="pt-32 pb-20 px-6 lg:px-8 relative overflow-hidden">
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-orange-100 to-rose-100 rounded-full blur-3xl opacity-30 -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full blur-3xl opacity-30 -z-10" />

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Content */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-full mb-6">
                <IoRocketOutline size={16} className="text-[#ff4d2d]" />
                <span className="text-xs font-black text-[#ff4d2d] uppercase tracking-wider">
                  #1 Food Delivery in India
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl lg:text-7xl font-black text-gray-900 tracking-tight leading-[1.1] mb-6">
                Food that flies
                <br />
                <span className="bg-gradient-to-r from-[#ff4d2d] to-[#ff8e6d] bg-clip-text text-transparent">
                  to your door
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl text-gray-500 font-medium mb-8 leading-relaxed">
                Hot meals from 1000+ restaurants delivered in 30 minutes. Or earn money delivering on your schedule.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-10">
                <button
                  onClick={() => navigate("/signup")}
                  className="px-8 py-4 bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4a] text-white rounded-2xl font-black text-base shadow-2xl shadow-orange-300 hover:-translate-y-1 transition-all flex items-center gap-2 group"
                >
                  Order Now
                  <IoChevronForward className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-900 rounded-2xl font-black text-base hover:border-[#ff4d2d]/30 hover:bg-orange-50/50 transition-all"
                >
                  Become a Partner
                </button>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-6">
                {features.map((feature, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 transition-all ${
                      activeFeature === idx ? 'text-[#ff4d2d] scale-110' : 'text-gray-400'
                    }`}
                  >
                    <span className="text-xl">{feature.icon}</span>
                    <span className="text-sm font-bold">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Visual */}
            <div className="relative">
              {/* Main image placeholder */}
              <div className="relative bg-gradient-to-br from-orange-100 to-rose-100 rounded-3xl overflow-hidden shadow-2xl aspect-square">
                {/* Floating food emojis */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[200px] opacity-20">🍔</span>
                </div>
                
                {/* Floating cards */}
                <div className="absolute top-8 right-8 bg-white rounded-2xl p-4 shadow-xl animate-bounce">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🚴</span>
                    <div>
                      <p className="text-xs font-bold text-gray-500">Delivery</p>
                      <p className="text-lg font-black text-[#ff4d2d]">12 min</p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-8 left-8 bg-white rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">⭐</span>
                    <div>
                      <p className="text-xs font-bold text-gray-500">Rating</p>
                      <p className="text-lg font-black text-gray-900">4.8/5</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          STATS BAR
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { num: "10K+", label: "Happy Users" },
              { num: "500+", label: "Restaurants" },
              { num: "1K+", label: "Riders" },
              { num: "50K+", label: "Deliveries" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-4xl lg:text-5xl font-black text-[#ff4d2d] mb-2">
                  {stat.num}
                </p>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SERVICES - 3 CARDS
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-sm font-black text-[#ff4d2d] uppercase tracking-[0.25em] mb-3">
              Three Ways to Join
            </p>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
              Pick Your Path
            </h2>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <div
                key={idx}
                className="group relative bg-white rounded-3xl border-2 border-gray-100 p-8 hover:border-transparent hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center text-gray-600 mb-6 group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-black text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-500 font-medium mb-6">
                    {service.subtitle}
                  </p>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-600">
                        <IoCheckmarkCircle size={18} className="text-[#ff4d2d]" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Button */}
                  <button
                    onClick={() => navigate('/signup', { state: { preSelectedRole: service.role } })}
                    className={`w-full py-4 bg-gradient-to-r ${service.gradient} text-white rounded-2xl font-black text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group/btn`}
                  >
                    Get Started
                    <FaArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Large emoji background */}
                <div className="absolute bottom-4 right-4 text-8xl opacity-5 group-hover:opacity-10 transition-opacity">
                  {service.image}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 lg:px-8 bg-gradient-to-br from-orange-50 to-rose-50">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-500 font-medium">
              Get your food in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { num: "1", title: "Choose", desc: "Browse 1000+ restaurants", emoji: "🍽️" },
              { num: "2", title: "Order", desc: "Quick & secure checkout", emoji: "📱" },
              { num: "3", title: "Enjoy", desc: "Delivered hot in 30 min", emoji: "🎉" },
            ].map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#ff4d2d] to-[#ff6b4a] rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-orange-300 text-white text-4xl font-black">
                  {step.num}
                </div>
                <span className="text-5xl block mb-4">{step.emoji}</span>
                <h3 className="text-2xl font-black text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-500 font-medium">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4a] rounded-3xl p-12 lg:p-16 text-center shadow-2xl shadow-orange-300 relative overflow-hidden">
            
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-white/5 rounded-full" />
            
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
                Hungry? We've Got You.
              </h2>
              <p className="text-xl text-orange-100 font-medium mb-10 max-w-2xl mx-auto">
                Join 10,000+ happy customers ordering daily. Sign up free in 60 seconds.
              </p>
              <button
                onClick={() => navigate("/signup")}
                className="px-12 py-5 bg-white text-[#ff4d2d] rounded-2xl font-black text-lg shadow-2xl hover:scale-105 transition-transform flex items-center justify-center gap-2 mx-auto group"
              >
                Start Ordering Now
                <FaArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════ */}
      <footer className="bg-gray-900 text-white py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#ff4d2d] to-[#ff8e6d] rounded-2xl flex items-center justify-center text-white text-xl font-black">
              V
            </div>
            <span className="text-2xl font-black">Vingo</span>
          </div>
          <p className="text-gray-400 font-medium mb-6">
            Fast. Fresh. Delivered.
          </p>
          <p className="text-gray-500 text-sm">
            © 2026 Vingo. All rights reserved. Made with ❤️ in India.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;