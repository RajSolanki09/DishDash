import React, { useState, useEffect, useRef } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import gsap from "gsap";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const containerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(
        ".auth-card",
        { y: 40, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power4.out" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleSignIn = async () => {
    setLoading(true);
    setError("");
    if (!email || !password) {
      setError("Credentials required.");
      setLoading(false);
      return;
    }
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data.user));
      if (result.data.user?.isOtpVerified === false) {
        navigate("/verify-otp");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setError(error.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const getLocationWithFallback = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ latitude: 28.6139, longitude: 77.2090 });
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

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError("");
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
          mobile: "0000000000", 
          role: "user", 
          lat: coords.latitude, 
          lon: coords.longitude 
        },
        { withCredentials: true }
      );

      dispatch(setUserData(res.data.user));
      navigate("/");
    } catch (error) {
      console.error("Google auth error:", error);
      setError(error.response?.data?.message || error.message || "Google authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen w-full flex bg-bg-primary relative overflow-hidden">

      {/* ── LEFT: Visual Panel (desktop only) ── */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&q=80"
            alt="Gourmet burger"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center shadow-lg shadow-brand/30">
              <span className="text-white text-xl font-black">V</span>
            </div>
            <span className="text-white text-2xl font-black tracking-tight">
              Vingo<span className="text-brand">.</span>
            </span>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl xl:text-5xl font-black text-white tracking-tight leading-tight">
              Craving something<br />
              <span className="text-brand">delicious?</span>
            </h2>
            <p className="text-white/60 text-[15px] font-medium max-w-sm leading-relaxed">
              Order from the best restaurants near you. Fast delivery, premium quality, and flavors that hit different.
            </p>
            <div className="flex items-center gap-6 pt-2">
              <div className="text-center">
                <p className="text-2xl font-black text-white">500+</p>
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Restaurants</p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="text-center">
                <p className="text-2xl font-black text-white">50K+</p>
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Happy Users</p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="text-center">
                <p className="text-2xl font-black text-white">4.8</p>
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Rating</p>
              </div>
            </div>
          </div>

          <p className="text-white/30 text-[11px] font-bold uppercase tracking-widest">
            © 2026 Vingo. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── RIGHT: Form Panel ── */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-8 bg-bg-secondary relative">
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 25% 25%, #E23744 0%, transparent 50%), radial-gradient(circle at 75% 75%, #E23744 0%, transparent 50%)" }} />

        <div className="w-full max-w-md relative z-10 auth-card">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8 cursor-pointer" onClick={() => navigate("/")}>
            <div className="inline-flex items-center justify-center w-14 h-14 bg-brand rounded-2xl mb-4 shadow-lg shadow-brand/30 hover:scale-105 transition-transform">
              <span className="text-white text-3xl font-black">V</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-text-primary">Welcome back</h1>
            <p className="text-text-muted text-sm mt-1.5 font-medium">Sign in to your Vingo account</p>
          </div>

          {/* Desktop heading */}
          <div className="hidden lg:block mb-8">
            <h1 className="text-4xl font-black tracking-tight text-text-primary">Sign In</h1>
            <p className="text-text-muted text-sm mt-2 font-medium">Welcome back! Enter your details below</p>
          </div>

          <div className="bg-bg-card rounded-3xl p-8 shadow-xl border border-border">
            <div className="space-y-5">
              {/* Email */}
              <div>
                <label className="text-[12px] font-bold text-text-muted uppercase tracking-widest mb-2 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  <input
                    type="email"
                    className="w-full bg-bg-secondary border border-border focus:border-brand focus:bg-bg-card pl-12 pr-5 py-4 rounded-xl text-sm font-bold text-text-primary outline-none transition-all placeholder:text-text-muted shadow-inner focus:shadow-md"
                    placeholder="name@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[12px] font-bold text-text-muted uppercase tracking-widest">Password</label>
                  <button onClick={() => navigate("/forgot-password")} className="text-[12px] font-bold text-brand hover:underline" disabled={loading}>
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-bg-secondary border border-border focus:border-brand focus:bg-bg-card pl-12 pr-12 py-4 rounded-xl text-sm font-bold text-text-primary outline-none transition-all placeholder:text-text-muted shadow-inner focus:shadow-md"
                    placeholder="••••••••"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    disabled={loading}
                  />
                  <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-brand transition-colors" onClick={() => setShowPassword(!showPassword)} disabled={loading}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-5 bg-brand/5 border border-brand/20 rounded-xl p-3.5">
                <p className="text-brand text-[13px] font-semibold text-center">{error}</p>
              </div>
            )}

            <button
              className="w-full mt-6 primary-button py-4 rounded-2xl font-bold text-[15px] h-[52px] shadow-md shadow-brand/25 hover:shadow-lg hover:shadow-brand/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSignIn}
              disabled={loading}
            >
              {loading ? <ClipLoader size={18} color="white" /> : "Sign In"}
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
              {loading ? "Signing in..." : "Continue with Google"}
            </button>

            <p className="text-center mt-6 text-[14px] font-medium text-text-secondary">
              New to Vingo?{" "}
              <span className="text-brand font-bold cursor-pointer hover:underline" onClick={() => navigate("/signup")}>
                Create account
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;