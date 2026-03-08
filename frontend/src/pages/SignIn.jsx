import React, { useState } from "react";
import {
  IoEyeOutline,
  IoEyeOffOutline,
  IoMailOutline,
  IoLockClosedOutline,
} from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError("");
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await axios.post(
              `${serverUrl}/api/auth/google-auth`,
              {
                fullname: user.displayName,
                email: user.email,
                mobile: "0000000000",
                role: "user",
                lat: latitude,
                lon: longitude,
              },
              { withCredentials: true }
            );
            dispatch(setUserData(res.data.user));
            navigate("/");
          } catch (error) {
            console.error("Backend error:", error);
            setError(error.response?.data?.message || "Google authentication failed");
            setLoading(false);
          }
        },
        (geoError) => {
          console.error("Location error:", geoError);
          setLoading(false);
          setError("Location access is required. Please enable location permissions.");
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } catch (error) {
      console.error("Google sign-in error:", error);
      setLoading(false);
      setError("Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fcfcfc] px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/80">
          
          {/* Logo – gradient like Nav */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-gradient-to-r from-[#ff4d2d] to-[#ff8e6d] bg-clip-text text-transparent">
              Vingo<span className="text-[#ff4d2d]">.</span>
            </h1>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">
                Email
              </label>
              <div className="relative mt-1">
                <IoMailOutline className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input
                  type="email"
                  className="w-full pl-7 py-2.5 bg-transparent border-b border-gray-200 focus:border-[#ff4d2d] focus:outline-none text-sm font-medium text-gray-800 transition-colors placeholder:text-gray-300"
                  placeholder="rohit@email.com"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center pr-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">
                  Password
                </label>
                <button
                  onClick={() => navigate("/forgot-password")}
                  className="text-[9px] font-black text-[#ff4d2d] uppercase transition-colors hover:text-[#ff8e6d] cursor-pointer"
                  disabled={loading}
                >
                  Forgot?
                </button>
              </div>
              <div className="relative mt-1">
                <IoLockClosedOutline className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-7 pr-10 py-2.5 bg-transparent border-b border-gray-200 focus:border-[#ff4d2d] focus:outline-none text-sm font-medium text-gray-800 transition-colors placeholder:text-gray-300"
                  placeholder="Enter password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#ff4d2d] transition-colors cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <IoEyeOffOutline size={16} /> : <IoEyeOutline size={16} />}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-5 bg-red-50 border border-red-200/60 rounded-lg p-3">
              <p className="text-red-600 text-[9px] font-black uppercase tracking-widest text-center">
                {error}
              </p>
            </div>
          )}

          <button
            className="w-full mt-6 bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4a] text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            onClick={handleSignIn}
            disabled={loading}
          >
            {loading ? <ClipLoader size={16} color="white" /> : "Sign In"}
          </button>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200/80" />
            </div>
            <div className="relative flex justify-center text-[8px] uppercase tracking-widest">
              <span className="px-2 bg-white text-gray-400 font-black">or</span>
            </div>
          </div>

          <button
            className="w-full bg-white border border-gray-200/80 py-2.5 rounded-xl flex items-center justify-center gap-2 font-black text-[9px] uppercase tracking-wider text-gray-600 shadow-sm hover:shadow-md hover:border-[#ff4d2d]/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            onClick={handleGoogleAuth}
            disabled={loading}
          >
            <FcGoogle size={16} />
            {loading ? "Signing in..." : "Continue with Google"}
          </button>

          <p className="text-center mt-6 text-[9px] font-black uppercase tracking-wider text-gray-400">
            New here?{" "}
            <span
              className="text-[#ff4d2d] cursor-pointer hover:underline"
              onClick={() => navigate("/signup")}
            >
              Create account
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;