import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Rocket,
  Heart,
  Users,
  Shield,
  Utensils,
  Zap,
  Bike,
  CheckCircle,
  Headphones,
  Sparkles,
  Star,
  Briefcase,
  Code,
  BarChart3,
  Smile
} from "lucide-react";
import Nav from "../components/Nav";

const AboutUs = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Utensils size={28} />,
      title: "Local Restaurants",
      description: "Partner with authentic local eateries to bring you the best food in your city",
      gradient: "from-brand to-brand-glow"
    },
    {
      icon: <Zap size={28} />,
      title: "Lightning Fast",
      description: "Real-time order tracking and optimized delivery routes for speed",
      gradient: "from-blue-500 to-cyan-400"
    },
    {
      icon: <Bike size={28} />,
      title: "Reliable Delivery",
      description: "Professional delivery partners ensuring your food arrives fresh and on time",
      gradient: "from-fuchsia-500 to-pink-500"
    },
    {
      icon: <Shield size={28} />,
      title: "Secure Payments",
      description: "Safe and encrypted payment processing for absolute peace of mind",
      gradient: "from-emerald-500 to-green-400"
    },
    {
      icon: <CheckCircle size={28} />,
      title: "Quality Assured",
      description: "Every restaurant is verified and food quality is our top priority",
      gradient: "from-amber-500 to-orange-400"
    },
    {
      icon: <Headphones size={28} />,
      title: "24/7 Support",
      description: "Our dedicated artisan support team is always here to help you",
      gradient: "from-indigo-500 to-purple-400"
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
      icon: <Briefcase size={32} />,
      gradient: "from-brand to-[#F05A67]",
      description: "10+ years in food tech industry"
    },
    {
      name: "Mike Chen",
      role: "Head of Operations",
      icon: <BarChart3 size={32} />,
      gradient: "from-violet-600 to-purple-600",
      description: "Expert in logistics & delivery"
    },
    {
      name: "Emily Rodriguez",
      role: "Customer Success",
      icon: <Smile size={32} />,
      gradient: "from-emerald-600 to-teal-500",
      description: "Passionate about customer experience"
    },
    {
      name: "David Kumar",
      role: "Tech Lead",
      icon: <Code size={32} />,
      gradient: "from-amber-500 to-orange-500",
      description: "Building scalable solutions"
    }
  ];

  return (
    <div className="min-h-screen bg-bg-secondary text-text-primary pb-10">
      <Nav />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-32 pb-32 px-4 border-b border-border">
        {/* Background food image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80"
            alt="Delicious food spread"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-bg-secondary/85 backdrop-blur-sm" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-bg-card rounded-full border border-border shadow-sm animate-in fade-in slide-in-from-top-4 duration-700">
              <Utensils size={20} className="text-brand" />
              <span className="text-[11px] font-black text-text-secondary uppercase tracking-[0.2em]">About Vingo</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <span className="block text-text-primary">
                Bringing Your
              </span>
              <span className="block text-brand mt-2">
                Favorite Food
              </span>
              <span className="block text-text-secondary mt-2">
                To Your Door
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed font-bold tracking-wide animate-in fade-in duration-1000 delay-300">
              We're on a mission to connect food lovers with the best local restaurants,
              creating memorable dining experiences one delivery at a time.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
              <button
                onClick={() => navigate("/")}
                className="w-full sm:w-auto primary-button px-12 py-5 rounded-2xl font-black text-[13px] uppercase tracking-widest shadow-md hover:-translate-y-1 active:scale-95 transition-all duration-300"
              >
                Order Now
              </button>
              <button
                onClick={() => navigate("/create-edit-shop")}
                className="w-full sm:w-auto px-12 py-5 bg-bg-card text-text-primary rounded-2xl font-black text-[13px] uppercase tracking-widest border border-border hover:bg-bg-secondary hover:border-brand/50 hover:-translate-y-1 active:scale-95 transition-all duration-300 shadow-md"
              >
                Partner With Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-24 px-4 bg-bg-secondary relative overflow-hidden border-b border-border">
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group shadow-sm p-6 rounded-2xl bg-bg-card border border-border"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-5xl md:text-6xl lg:text-7xl font-black text-text-primary group-hover:text-brand transition-all duration-500">
                  {stat.number}
                </div>
                <div className="text-brand font-black text-[11px] md:text-[13px] mt-4 uppercase tracking-[0.2em]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR MISSION */}
      <section className="py-32 px-4 relative overflow-hidden border-b border-border">
        {/* Decorative background orb */}
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-brand/10 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-brand/5 border border-brand/10 rounded-full shadow-sm">
                <Rocket className="text-brand" size={16} />
                <span className="text-brand uppercase tracking-[0.2em]">Our Mission</span>
              </div>

              <h2 className="text-5xl md:text-6xl font-black leading-tight text-text-primary tracking-tighter">
                Redefining Food <span className="text-brand">Delivery.</span>
              </h2>

              <div className="space-y-6 text-text-secondary text-lg leading-relaxed font-medium">
                <p>
                  Founded with a singular vision, Vingo bridges the gap between culinary excellence and your dining table, elevating the daily ritual of eating into a premium experience.
                </p>
                <p>
                  We champion local artisans and empower an elite fleet of delivery partners, forging a robust ecosystem where technology meets taste.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-5 pt-6">
                <div className="flex items-center gap-3 px-6 py-4 bg-bg-card border border-border rounded-2xl shadow-sm">
                  <Heart className="text-brand fill-brand" size={20} />
                  <span className="font-black text-text-primary text-xs uppercase tracking-widest">Crafted with Care</span>
                </div>
                <div className="flex items-center gap-3 px-6 py-4 bg-bg-card border border-border rounded-2xl shadow-sm">
                  <Users className="text-brand" size={20} />
                  <span className="font-black text-text-primary text-xs uppercase tracking-widest">Community Driven</span>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="aspect-square bg-bg-card rounded-[3rem] p-1 border border-border relative overflow-hidden shadow-md group-hover:border-brand/20 transition-colors duration-500">
                <div className="w-full h-full rounded-[2.8rem] relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80"
                    alt="Indian thali"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Floating badges */}
                  <div className="absolute top-8 left-8 flex items-center gap-2.5 px-4 py-2.5 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg">
                    <Heart size={16} className="text-brand fill-brand" />
                    <span className="text-[11px] font-black text-text-primary uppercase tracking-wider">Fresh & Hot</span>
                  </div>
                  <div className="absolute bottom-8 right-8 flex items-center gap-2.5 px-4 py-2.5 bg-brand rounded-2xl shadow-lg">
                    <Bike size={16} className="text-white" />
                    <span className="text-[11px] font-black text-white uppercase tracking-wider">30 min delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-32 px-4 relative border-b border-border">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-6 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 block">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-bg-card rounded-full border border-border shadow-sm">
              <Sparkles size={18} className="text-brand" />
              <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">The Vingo Standard</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-text-primary tracking-tighter">
              What Sets Us <span className="text-brand">Apart</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-bg-card rounded-[2rem] p-10 border border-border hover:border-brand/20 hover:shadow-lg transition-all duration-500 shadow-sm overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none ${feature.gradient}" />

                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white shadow-md mb-8 group-hover:scale-110 group-hover:rotate-[5deg] transition-all duration-500`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black text-text-primary tracking-wide mb-4 flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand group-hover:animate-ping shadow-sm" />
                  {feature.title}
                </h3>
                <p className="text-text-secondary leading-relaxed font-bold text-sm tracking-wide">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="py-32 px-4 bg-bg-secondary relative border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 mb-20">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-brand/5 rounded-full border border-brand/10 shadow-sm">
              <Users className="text-brand" size={16} />
              <span className="text-brand uppercase tracking-[0.2em]">Leadership</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-text-primary tracking-tighter">
              Meet The <span className="text-brand">Minds</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {team.map((member, index) => (
              <div
                key={index}
                className="group text-center bg-bg-card p-8 rounded-[2rem] border border-border hover:border-brand/20 transition-all duration-300 shadow-md"
              >
                <div className="relative mb-8">
                  <div className={`w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    {member.icon}
                  </div>
                </div>
                <h3 className="text-xl font-black text-text-primary tracking-tight mb-2">
                  {member.name}
                </h3>
                <p className="text-brand font-black text-[11px] mb-4 uppercase tracking-widest">
                  {member.role}
                </p>
                <p className="text-text-secondary text-xs font-bold leading-relaxed tracking-wide">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-32 px-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand/10 rounded-full blur-[150px] animate-pulse" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-10">
          <div className="text-7xl mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] animate-bounce">
            <Rocket size={70} className="text-brand" />
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-text-primary leading-[1.1] tracking-tighter">
            Ready to Experience
            <br />
            <span className="text-brand">
              Gastronomy Elevated?
            </span>
          </h2>
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed font-bold tracking-wide">
            Join the elite circle of connoisseurs who trust Vingo for their daily culinary adventures.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <button
              onClick={() => navigate("/")}
              className="w-full sm:w-auto primary-button px-12 py-5 rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-md hover:-translate-y-1 active:scale-95 transition-all duration-300"
            >
              Start Ordering
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="w-full sm:w-auto px-12 py-5 bg-bg-card border border-border text-text-primary rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-bg-secondary hover:border-brand/40 hover:-translate-y-1 active:scale-95 transition-all duration-300 shadow-md"
            >
              Create Account
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-bg-secondary text-text-muted py-16 px-4 border-t border-border relative z-10">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <h3 className="text-3xl font-black tracking-tighter text-text-primary">
            Vingo<span className="text-brand">.</span>
          </h3>
          <p className="text-[11px] font-black uppercase tracking-[0.3em]">
            Curated with <Heart size={12} className="inline text-brand fill-brand" /> for Gastronomes Everywhere
          </p>
          <p className="text-[10px] font-bold text-text-muted tracking-widest">
            © {new Date().getFullYear()} Vingo. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;