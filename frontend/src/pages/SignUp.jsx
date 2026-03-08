import React, { useState, useEffect } from "react";
import {
  IoEyeOutline,
  IoEyeOffOutline,
  IoMailOutline,
  IoLockClosedOutline,
  IoPersonOutline,
  IoCallOutline,
} from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // ═══════════════════════════════════════════════════════════════════
  // GET PRE-SELECTED ROLE FROM LANDING PAGE (if any)
  // ═══════════════════════════════════════════════════════════════════
  const preSelectedRole = location.state?.preSelectedRole || "user";
  
  const [role, setRole] = useState(preSelectedRole);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Update role if pre-selected role changes
  useEffect(() => {
    if (location.state?.preSelectedRole) {
      setRole(location.state.preSelectedRole);
    }
  }, [location.state?.preSelectedRole]);

  const handleSignup = async () => {
    setLoading(true);
    setError("");
    if (!fullname || !email || !password || !mobile) {
      setError("Fields required.");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          await axios.post(
            `${serverUrl}/api/auth/signup`,
            { fullname, email, password, mobile, role, lat: latitude, lon: longitude },
            { withCredentials: true }
          );
          navigate("/signin");
        } catch (err) {
          setError(err.response?.data?.message || "Signup failed");
        } finally {
          setLoading(false);
        }
      },
      (geoError) => {
        setLoading(false);
        setError("Location access required for signup. Please enable it.");
      }
    );
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);
          const user = result.user;
          const res = await axios.post(
            `${serverUrl}/api/auth/google-auth`,
            {
              fullname: user.displayName,
              email: user.email,
              mobile: mobile || "0000000000",
              role: role,
              lat: latitude,
              lon: longitude,
            },
            { withCredentials: true }
          );
          dispatch(setUserData(res.data.user));
          navigate("/");
        } catch (error) {
          setError(error.response?.data?.message || "Google auth failed.");
        } finally {
          setLoading(false);
        }
      },
      (geoError) => {
        setLoading(false);
        setError("Please enable location to sign up with Google.");
      }
    );
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fcfcfc] px-4 py-8">
      <div className="w-full max-w-md">
        {/* Card – clean, subtle, like Nav */}
        <div className="bg-white rounded-2xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/80">
          
          {/* Logo – gradient text, exactly like Nav */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-gradient-to-r from-[#ff4d2d] to-[#ff8e6d] bg-clip-text text-transparent">
              Vingo<span className="text-[#ff4d2d]">.</span>
            </h1>
          </div>

          {/* Form fields – clean border-bottom, brand orange focus */}
          <div className="space-y-5">
            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">
                Full name
              </label>
              <div className="relative mt-1">
                <IoPersonOutline className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input
                  type="text"
                  className="w-full pl-7 py-2.5 bg-transparent border-b border-gray-200 focus:border-[#ff4d2d] focus:outline-none text-sm font-medium text-gray-800 transition-colors placeholder:text-gray-300"
                  placeholder="Rohit Sharma"
                  onChange={(e) => setFullname(e.target.value)}
                  value={fullname}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
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
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">
                  Mobile
                </label>
                <div className="relative mt-1">
                  <IoCallOutline className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input
                    type="text"
                    className="w-full pl-7 py-2.5 bg-transparent border-b border-gray-200 focus:border-[#ff4d2d] focus:outline-none text-sm font-medium text-gray-800 transition-colors placeholder:text-gray-300"
                    placeholder="+91 98765 43210"
                    onChange={(e) => setMobile(e.target.value)}
                    value={mobile}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">
                Password
              </label>
              <div className="relative mt-1">
                <IoLockClosedOutline className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-7 pr-10 py-2.5 bg-transparent border-b border-gray-200 focus:border-[#ff4d2d] focus:outline-none text-sm font-medium text-gray-800 transition-colors placeholder:text-gray-300"
                  placeholder="Create password"
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

          {/* Role selector – clean pills, hover states like Nav buttons */}
          <div className="mt-6">
            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 block mb-2">
              I am joining as
            </label>
            <div className="flex gap-2">
              {[
                { id: "user", label: "Customer" },
                { id: "owner", label: "Shop Owner" },
                { id: "deliveryBoy", label: "Delivery" },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  disabled={loading}
                  className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all duration-200 cursor-pointer border ${
                    role === r.id
                      ? "bg-[#ff4d2d] border-[#ff4d2d] text-white shadow-sm"
                      : "bg-white border-gray-200 text-gray-500 hover:border-[#ff4d2d]/50 hover:text-[#ff4d2d]"
                  } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Error message – clean red pill */}
          {error && (
            <div className="mt-5 bg-red-50 border border-red-200/60 rounded-lg p-3">
              <p className="text-red-600 text-[9px] font-black uppercase tracking-widest text-center">
                {error}
              </p>
            </div>
          )}

          {/* Primary button – gradient, hover scale, exactly like Nav's Add Item button */}
          <button
            className="w-full mt-6 bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4a] text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? <ClipLoader size={16} color="white" /> : "Create Account"}
          </button>

          {/* Divider – subtle */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200/80" />
            </div>
            <div className="relative flex justify-center text-[8px] uppercase tracking-widest">
              <span className="px-2 bg-white text-gray-400 font-black">or</span>
            </div>
          </div>

          {/* Google button – subtle border, hover brand orange border */}
          <button
            className="w-full bg-white border border-gray-200/80 py-2.5 rounded-xl flex items-center justify-center gap-2 font-black text-[9px] uppercase tracking-wider text-gray-600 shadow-sm hover:shadow-md hover:border-[#ff4d2d]/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleGoogleAuth}
            disabled={loading}
          >
            <FcGoogle size={16} />
            {loading ? "Signing up..." : "Continue with Google"}
          </button>

          {/* Sign in link – brand orange */}
          <p className="text-center mt-6 text-[9px] font-black uppercase tracking-wider text-gray-400">
            Already have an account?{" "}
            <span
              className="text-[#ff4d2d] cursor-pointer hover:underline"
              onClick={() => navigate("/signin")}
            >
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;