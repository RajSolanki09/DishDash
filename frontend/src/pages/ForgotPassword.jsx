import axios from "axios";
import React, { useState } from "react";
import {
  IoChevronBackCircleOutline,
  IoMailOutline,
  IoLockClosedOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ... (logic unchanged) ...

  const handleSendOtp = async () => {
    if (!email) return setError("Email is required");
    setLoading(true);
    try {
      await axios.post(`${serverUrl}/api/auth/send-otp`, { email }, { withCredentials: true });
      setError("");
      setStep(2);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send OTP");
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return setError("Please enter the OTP");
    setLoading(true);
    try {
      await axios.post(`${serverUrl}/api/auth/verify-otp`, { email, otp }, { withCredentials: true });
      setError("");
      setStep(3);
    } catch (error) {
      setError(error.response?.data?.message || "Invalid or expired OTP");
    } finally { setLoading(false); }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) return setError("All fields are required");
    if (newPassword !== confirmPassword) return setError("Passwords do not match");
    setLoading(true);
    try {
      await axios.post(`${serverUrl}/api/auth/reset-password`, { email, newPassword }, { withCredentials: true });
      setError("");
      navigate("/signin");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to reset password");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fcfcfc] px-4 py-8 relative">
      {/* Back button – matches Nav's back button style (pill, hover scale, orange icon slide) */}
      <button
        onClick={() => navigate("/signin")}
        className="group absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-2 px-4 py-2 bg-white border border-gray-200/80 rounded-full text-gray-700 text-xs font-semibold shadow-sm hover:shadow-md hover:border-gray-300 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
      >
        <IoChevronBackCircleOutline
          size={16}
          className="text-gray-500 group-hover:-translate-x-1 group-hover:text-[#ff4d2d] transition-all"
        />
        <span>Back</span>
      </button>

      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/80">
          
          {/* Logo – gradient like Nav */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-[#ff4d2d] to-[#ff8e6d] bg-clip-text text-transparent">
              Vingo<span className="text-[#ff4d2d]">.</span>
            </h1>
          </div>

          {/* Step indicator – minimal dots */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    step === s ? 'w-8 bg-[#ff4d2d]' : step > s ? 'w-2 bg-gray-400' : 'w-2 bg-gray-200'
                  }`}
                />
                {s < 3 && <div className="w-2 h-[2px] bg-gray-200 mx-1" />}
              </div>
            ))}
          </div>

          <div className="text-center mb-6">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">
              {step === 1 && "Forgot password?"}
              {step === 2 && "Check your email"}
              {step === 3 && "Create new password"}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {step === 1 && "We'll send a 6‑digit code to verify it's you."}
              {step === 2 && `Enter the code sent to ${email}`}
              {step === 3 && "Your new password must be different."}
            </p>
          </div>

          <div className="space-y-5">
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">
                    Email address
                  </label>
                  <div className="relative mt-1">
                    <IoMailOutline className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                    <input
                      type="email"
                      className="w-full pl-7 py-2.5 bg-transparent border-b border-gray-200 focus:border-[#ff4d2d] focus:outline-none text-sm font-medium text-gray-800 transition-colors placeholder:text-gray-300"
                      placeholder="rohit@email.com"
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      value={email}
                    />
                  </div>
                </div>
                <button
                  className="w-full bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4a] text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                  onClick={handleSendOtp}
                  disabled={loading}
                >
                  {loading ? <ClipLoader size={16} color="white" /> : "Send reset code"}
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 text-center block mb-2">
                    6‑digit code
                  </label>
                  <input
                    type="text"
                    className="w-full py-3 px-4 bg-gray-50 border border-gray-200/80 focus:border-[#ff4d2d]/40 focus:ring-2 focus:ring-[#ff4d2d]/10 rounded-xl text-center font-black tracking-[0.5em] text-lg text-gray-800 outline-none transition-all"
                    placeholder="000000"
                    maxLength={6}
                    onChange={(e) => { setOtp(e.target.value); setError(""); }}
                    value={otp}
                  />
                </div>
                <button
                  className="w-full bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4a] text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                  onClick={handleVerifyOtp}
                  disabled={loading}
                >
                  {loading ? <ClipLoader size={16} color="white" /> : "Verify code"}
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">
                      New password
                    </label>
                    <div className="relative mt-1">
                      <IoLockClosedOutline className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                      <input
                        type="password"
                        className="w-full pl-7 py-2.5 bg-transparent border-b border-gray-200 focus:border-[#ff4d2d] focus:outline-none text-sm font-medium text-gray-800 transition-colors placeholder:text-gray-300"
                        placeholder="Enter new password"
                        onChange={(e) => { setNewPassword(e.target.value); setError(""); }}
                        value={newPassword}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">
                      Confirm password
                    </label>
                    <div className="relative mt-1">
                      <IoLockClosedOutline className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                      <input
                        type="password"
                        className="w-full pl-7 py-2.5 bg-transparent border-b border-gray-200 focus:border-[#ff4d2d] focus:outline-none text-sm font-medium text-gray-800 transition-colors placeholder:text-gray-300"
                        placeholder="Re-enter new password"
                        onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                        value={confirmPassword}
                      />
                    </div>
                  </div>
                </div>
                <button
                  className="w-full bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4a] text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                  onClick={handleResetPassword}
                  disabled={loading}
                >
                  {loading ? <ClipLoader size={16} color="white" /> : "Reset password"}
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-5 bg-red-50 border border-red-200/60 rounded-lg p-3">
              <p className="text-red-600 text-[9px] font-black uppercase tracking-widest text-center">
                {error}
              </p>
            </div>
          )}

          <p className="text-center mt-6 text-[8px] font-black uppercase tracking-wider text-gray-400">
            🔒 Secured with 256‑bit encryption
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;