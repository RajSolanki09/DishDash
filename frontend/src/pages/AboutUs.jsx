import React from "react";
import { useNavigate } from "react-router-dom";
import { FaRocket, FaHeart, FaUsers, FaShieldAlt } from "react-icons/fa";
import { IoRestaurantSharp, IoSpeedometer } from "react-icons/io5";
import { MdDeliveryDining, MdVerified } from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import Nav from "../components/Nav";

const AboutUs = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <IoRestaurantSharp size={28} />,
      title: "Local Restaurants",
      description: "Partner with authentic local eateries to bring you the best food in your city",
      gradient: "from-orange-400 to-red-500"
    },
    {
      icon: <IoSpeedometer size={28} />,
      title: "Lightning Fast",
      description: "Real-time order tracking and optimized delivery routes for speed",
      gradient: "from-blue-400 to-cyan-500"
    },
    {
      icon: <MdDeliveryDining size={28} />,
      title: "Reliable Delivery",
      description: "Professional delivery partners ensuring your food arrives fresh and on time",
      gradient: "from-purple-400 to-pink-500"
    },
    {
      icon: <FaShieldAlt size={28} />,
      title: "Secure Payments",
      description: "Safe and encrypted payment processing for peace of mind",
      gradient: "from-green-400 to-emerald-500"
    },
    {
      icon: <MdVerified size={28} />,
      title: "Quality Assured",
      description: "Every restaurant is verified and food quality is our top priority",
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      icon: <BiSupport size={28} />,
      title: "24/7 Support",
      description: "Our dedicated support team is always here to help you",
      gradient: "from-indigo-400 to-purple-500"
    }
  ];

  const stats = [
    { number: "10K+", label: "Happy Customers" },
    { number: "500+", label: "Partner Restaurants" },
    { number: "50K+", label: "Orders Delivered" },
    { number: "4.8★", label: "Average Rating" }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      emoji: "👩‍💼",
      description: "10+ years in food tech industry"
    },
    {
      name: "Mike Chen",
      role: "Head of Operations",
      emoji: "👨‍💻",
      description: "Expert in logistics & delivery"
    },
    {
      name: "Emily Rodriguez",
      role: "Customer Success",
      emoji: "👩‍🎤",
      description: "Passionate about customer experience"
    },
    {
      name: "David Kumar",
      role: "Tech Lead",
      emoji: "👨‍🔬",
      description: "Building scalable solutions"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-rose-50/40">
      <Nav />
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl animate-pulse delay-700" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-orange-100/20 to-pink-100/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full border border-orange-200/50 shadow-lg shadow-orange-100/50">
              <span className="text-2xl">🍕</span>
              <span className="text-sm font-black text-gray-700 uppercase tracking-wider">About Vingo</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight">
              <span className="block bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Bringing Your
              </span>
              <span className="block bg-gradient-to-r from-[#ff4d2d] via-[#ff6b4a] to-[#ff8e6d] bg-clip-text text-transparent mt-2">
                Favorite Food
              </span>
              <span className="block text-gray-900 mt-2">
                To Your Door
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
              We're on a mission to connect food lovers with the best local restaurants, 
              creating memorable dining experiences one delivery at a time.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => navigate("/")}
                className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4a] text-white rounded-2xl font-black text-sm uppercase tracking-[0.15em] shadow-2xl shadow-orange-300/50 hover:shadow-orange-400/60 hover:-translate-y-1 active:scale-95 transition-all duration-300"
              >
                Order Now
              </button>
              <button
                onClick={() => navigate("/create-edit-shop")}
                className="w-full sm:w-auto px-10 py-5 bg-white text-gray-900 rounded-2xl font-bold text-sm border-2 border-gray-200 hover:border-[#ff4d2d] hover:text-[#ff4d2d] hover:-translate-y-1 active:scale-95 transition-all duration-300 shadow-lg"
              >
                Partner With Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,77,45,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,77,45,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-orange-400 via-rose-400 to-pink-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-gray-400 font-bold text-sm md:text-base mt-3 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR MISSION */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full">
                <FaRocket className="text-[#ff4d2d]" size={16} />
                <span className="text-xs font-black text-[#ff4d2d] uppercase tracking-wider">Our Mission</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-black leading-tight text-gray-900">
                Redefining Food Delivery
              </h2>
              
              <p className="text-gray-600 text-lg leading-relaxed font-medium">
                Founded in 2024, Vingo was born from a simple idea: everyone deserves access to 
                delicious, quality food from their favorite local restaurants, delivered with care 
                and efficiency.
              </p>
              
              <p className="text-gray-600 text-lg leading-relaxed font-medium">
                We believe in supporting local businesses, empowering delivery partners, and 
                creating seamless experiences for food lovers. Our technology connects the dots 
                between hunger and happiness.
              </p>

              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-50 to-rose-50 rounded-xl border border-orange-100">
                  <FaHeart className="text-[#ff4d2d]" size={20} />
                  <span className="font-black text-gray-900 text-sm">Made with Love</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-50 to-rose-50 rounded-xl border border-orange-100">
                  <FaUsers className="text-[#ff4d2d]" size={20} />
                  <span className="font-black text-gray-900 text-sm">Community First</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-orange-100 via-rose-100 to-pink-100 rounded-[3rem] relative overflow-hidden shadow-2xl shadow-orange-200/40">
                {/* Decorative Elements */}
                <div className="absolute top-10 left-10 w-32 h-32 bg-white/60 backdrop-blur-sm rounded-3xl rotate-12 shadow-xl" />
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/60 backdrop-blur-sm rounded-3xl -rotate-12 shadow-xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl">
                  🍔
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-24 px-4 bg-gradient-to-br from-white to-orange-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-orange-200 shadow-lg shadow-orange-100/50">
              <span className="text-xl">✨</span>
              <span className="text-xs font-black text-gray-700 uppercase tracking-wider">Why Choose Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900">
              What Makes Us Different
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-lg shadow-gray-100/40 hover:shadow-2xl hover:shadow-orange-200/40 hover:-translate-y-2 transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full">
              <FaUsers className="text-[#ff4d2d]" size={16} />
              <span className="text-xs font-black text-[#ff4d2d] uppercase tracking-wider">Our Team</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900">
              Meet The Minds Behind Vingo
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="group text-center"
              >
                <div className="relative mb-6">
                  <div className="w-40 h-40 mx-auto rounded-3xl bg-gradient-to-br from-orange-100 via-rose-100 to-pink-100 flex items-center justify-center text-7xl border-4 border-white shadow-2xl shadow-orange-200/40 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                    {member.emoji}
                  </div>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-[#ff4d2d] font-bold text-sm mb-2 uppercase tracking-wider">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm font-medium">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,77,45,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,77,45,0.05)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
          <div className="text-7xl mb-6">🚀</div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
            Ready to Experience
            <br />
            <span className="bg-gradient-to-r from-orange-400 via-rose-400 to-pink-400 bg-clip-text text-transparent">
              Food Delivery Done Right?
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium">
            Join thousands of happy customers who trust Vingo for their daily food cravings
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <button
              onClick={() => navigate("/")}
              className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4a] text-white rounded-2xl font-black text-sm uppercase tracking-[0.15em] shadow-2xl shadow-orange-500/50 hover:shadow-orange-500/70 hover:-translate-y-1 active:scale-95 transition-all duration-300"
            >
              Start Ordering
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="w-full sm:w-auto px-12 py-5 bg-white/10 backdrop-blur-sm text-white rounded-2xl font-black text-sm uppercase tracking-[0.15em] border-2 border-white/20 hover:bg-white/20 hover:-translate-y-1 active:scale-95 transition-all duration-300"
            >
              Create Account
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
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

export default AboutUs;