import React, { useState, useEffect, useRef } from "react";
import { Mail, Lock, Eye, EyeOff, User, Phone, Utensils, Store, Bike } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import gsap from "gsap";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const containerRef = useRef(null);

  const preSelectedRole = location.state?.preSelectedRole || "user";
  const [role, setRole] = useState(preSelectedRole);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.preSelectedRole) setRole(location.state.preSelectedRole);
  }, [location.state?.preSelectedRole]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(".auth-card", { y: 40, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power4.out" });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const getLocationWithFallback = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ latitude: 28.6139, longitude: 77.2090 }); // Default to Delhi
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Location error:", error.message);
          resolve({ latitude: 28.6139, longitude: 77.2090 });
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    });
  };

  const handleSignup = async () => {
    setLoading(true);
    setError("");
    if (!fullname || !email || !password || !mobile) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }
    if (!/^\d{10}$/.test(mobile.trim())) {
      setError("Mobile number must be exactly 10 digits.");
      setLoading(false);
      return;
    }
    
    try {
      const coords = await getLocationWithFallback();
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { fullname, email, password, mobile: mobile.trim(), role, lat: coords.latitude, lon: coords.longitude },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError("");

    // Validate phone number FIRST before opening Google popup
    if (!mobile || mobile.trim() === "") {
      setError("Please enter your 10-digit mobile number before signing up with Google.");
      setLoading(false);
      return;
    }
    if (!/^\d{10}$/.test(mobile.trim())) {
      setError("Mobile number must be exactly 10 digits.");
      setLoading(false);
      return;
    }

    try {
      // 1. Open Google Popup FIRST synchronously
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // 2. Then get location
      const coords = await getLocationWithFallback();
      
      // 3. Authenticate with backend
      const res = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        { 
          fullname: user.displayName, 
          email: user.email, 
          mobile: mobile.trim(), 
          role, 
          lat: coords.latitude, 
          lon: coords.longitude 
        },
        { withCredentials: true }
      );
      
      dispatch(setUserData(res.data.user));
      navigate("/");
    } catch (error) {
      console.error("Google auth error:", error);
      setError(error.response?.data?.message || error.message || "Google auth failed.");
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { id: "user", label: "Customer", desc: "Order food", icon: <Utensils size={20} /> },
    { id: "owner", label: "Restaurant", desc: "Sell food", icon: <Store size={20} /> },
    { id: "deliveryBoy", label: "Rider", desc: "Deliver food", icon: <Bike size={20} /> },
  ];

  return (
    <div ref={containerRef} className="min-h-screen w-full flex bg-bg-primary relative overflow-hidden">

      {/* ── LEFT: Visual Panel (desktop only) ── */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1553621042-f6e147245754?w=1200&q=80"
            alt="Fresh sushi platter"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center shadow-lg shadow-brand/30">
              <span className="text-white text-xl font-black">D</span>
            </div>
            <span className="text-white text-2xl font-black tracking-tight">
              DishDash<span className="text-brand">.</span>
            </span>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl xl:text-5xl font-black text-white tracking-tight leading-tight">
              Join the<br />
              <span className="text-brand">DishDash family.</span>
            </h2>
            <p className="text-white/60 text-[15px] font-medium max-w-sm leading-relaxed">
              Whether you're a foodie, a restaurant owner, or a delivery partner — there's a place for you here.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              {["Free Delivery", "Live Tracking", "24/7 Support", "Best Prices"].map((tag) => (
                <span key={tag} className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-[11px] font-bold text-white uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <p className="text-white/30 text-[11px] font-bold uppercase tracking-widest">
            © 2026 DishDash. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── RIGHT: Form Panel ── */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-8 bg-bg-secondary relative">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 25% 25%, #E23744 0%, transparent 50%), radial-gradient(circle at 75% 75%, #E23744 0%, transparent 50%)" }} />

        <div className="w-full max-w-lg relative z-10 auth-card">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8 cursor-pointer" onClick={() => navigate("/")}>
            <div className="inline-flex items-center justify-center w-14 h-14 bg-brand rounded-2xl mb-4 shadow-lg shadow-brand/30 hover:scale-105 transition-transform">
              <span className="text-white text-3xl font-black">D</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-text-primary">Create Account</h1>
            <p className="text-text-muted text-sm mt-1.5 font-medium">Join DishDash and start ordering</p>
          </div>

          {/* Desktop heading */}
          <div className="hidden lg:block mb-8">
            <h1 className="text-4xl font-black tracking-tight text-text-primary">Create Account</h1>
            <p className="text-text-muted text-sm mt-2 font-medium">Fill in your details to get started</p>
          </div>

          <div className="bg-bg-card rounded-3xl p-8 shadow-xl border border-border">
            {/* Role Selector */}
            <div className="mb-6">
              <label className="text-[12px] font-bold text-text-muted uppercase tracking-widest mb-3 block">I am joining as:</label>
              <div className="grid grid-cols-3 gap-3">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    disabled={loading}
                    className={`py-3.5 px-2 rounded-2xl text-center transition-all duration-300 border-2 ${
                      role === r.id
                        ? "border-brand bg-brand/5 text-brand shadow-sm shadow-brand/10"
                        : "border-border text-text-secondary hover:border-brand/40"
                    }`}
                  >
                    <div className="text-xl mb-1.5 flex justify-center">{r.icon}</div>
                    <div className="text-[11px] font-bold">{r.label}</div>
                    <div className="text-[10px] text-text-muted">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {/* Fullname */}
              <div>
                <label className="text-[12px] font-bold text-text-muted uppercase tracking-widest mb-2 block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  <input type="text" className="w-full bg-bg-secondary border border-border focus:border-brand focus:bg-bg-card pl-12 pr-5 py-4 rounded-xl text-sm font-bold text-text-primary outline-none transition-all placeholder:text-text-muted shadow-inner focus:shadow-md" placeholder="e.g. Rohit Sharma" onChange={(e) => setFullname(e.target.value)} value={fullname} disabled={loading} />
                </div>
              </div>

              {/* Email + Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[12px] font-bold text-text-muted uppercase tracking-widest mb-2 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input type="email" className="w-full bg-bg-secondary border border-border focus:border-brand focus:bg-bg-card pl-12 pr-5 py-4 rounded-xl text-sm font-bold text-text-primary outline-none transition-all placeholder:text-text-muted shadow-inner focus:shadow-md" placeholder="name@email.com" onChange={(e) => setEmail(e.target.value)} value={email} disabled={loading} />
                  </div>
                </div>
                <div>
                  <label className="text-[12px] font-bold text-text-muted uppercase tracking-widest mb-2 block">
                    Mobile No. <span className="text-brand">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      className={`w-full bg-bg-secondary border rounded-xl pl-12 pr-5 py-4 text-sm font-bold text-text-primary outline-none transition-all placeholder:text-text-muted shadow-inner focus:shadow-md ${
                        mobile && !/^\d{10}$/.test(mobile) ? "border-brand focus:border-brand" : "border-border focus:border-brand focus:bg-bg-card"
                      }`}
                      placeholder="98765 43210"
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setMobile(val);
                        if (error) setError("");
                      }}
                      value={mobile}
                      disabled={loading}
                    />
                  </div>
                  <p className="text-[10px] font-medium text-text-muted mt-1.5 ml-1">
                    {mobile && mobile.length > 0 && mobile.length < 10
                      ? `${10 - mobile.length} more digit${10 - mobile.length !== 1 ? "s" : ""} required`
                      : mobile.length === 10
                      ? ""
                      : "Required for Google signup — 10 digits only"}
                  </p>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-[12px] font-bold text-text-muted uppercase tracking-widest mb-2 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  <input type={showPassword ? "text" : "password"} className="w-full bg-bg-secondary border border-border focus:border-brand focus:bg-bg-card pl-12 pr-12 py-4 rounded-xl text-sm font-bold text-text-primary outline-none transition-all placeholder:text-text-muted shadow-inner focus:shadow-md" placeholder="Create a strong password" onChange={(e) => setPassword(e.target.value)} value={password} disabled={loading} />
                  <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-brand transition-colors" onClick={() => setShowPassword(!showPassword)} disabled={loading}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-4 bg-brand/5 border border-brand/20 rounded-xl p-3.5">
                <p className="text-brand text-[13px] font-semibold text-center">{error}</p>
              </div>
            )}

            <button
              className="w-full mt-6 primary-button py-4 rounded-2xl font-bold text-[15px] h-[52px] shadow-md shadow-brand/25 hover:shadow-lg hover:shadow-brand/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSignup}
              disabled={loading}
            >
              {loading ? <ClipLoader size={18} color="white" /> : "Create Account"}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-[12px] font-bold uppercase tracking-widest text-text-muted">
                <span className="px-4 bg-bg-card">or</span>
              </div>
            </div>

            <button
              className="w-full bg-bg-secondary border border-border text-text-primary py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-[14px] shadow-sm hover:shadow-md hover:border-brand/30 transition-all h-[52px] disabled:opacity-60"
              onClick={handleGoogleAuth}
              disabled={loading}
            >
              <FcGoogle size={22} />
              {loading ? "Signing up..." : "Continue with Google"}
            </button>

            <p className="text-center mt-6 text-[14px] font-medium text-text-secondary">
              Already have an account?{" "}
              <span className="text-brand font-bold cursor-pointer hover:underline" onClick={() => navigate("/signin")}>Sign in</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;