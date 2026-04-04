import axios from "axios";
import React, { useState } from "react";
import { ArrowLeft, Mail, Lock } from "lucide-react";
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
    <div className="min-h-screen w-full flex items-center justify-center bg-bg-secondary relative overflow-hidden px-4 sm:px-6 z-10 text-text-primary">
      {/* Back button */}
      <button
        onClick={() => navigate("/signin")}
        className="group absolute top-6 left-6 flex items-center gap-2 px-5 py-2.5 bg-bg-card border border-border rounded-full text-text-secondary text-[10px] font-black uppercase tracking-widest shadow-sm hover:border-brand hover:text-brand active:scale-95 transition-all duration-300 cursor-pointer z-20"
      >
        <ArrowLeft
          size={14}
        />
        <span>Back</span>
      </button>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-bg-card rounded-[2rem] p-8 sm:p-12 shadow-md border border-border relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent pointer-events-none" />

          {/* Logo */}
          <div className="text-center mb-10 relative z-10">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-text-primary">
              Vingo.
            </h1>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-3 mb-10 relative z-10">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${step === s ? 'w-10 bg-brand' : step > s ? 'w-3 bg-brand/30' : 'w-3 bg-border'
                    }`}
                />
                {s < 3 && <div className="w-3 h-[1px] bg-border mx-2" />}
              </div>
            ))}
          </div>

          <div className="text-center mb-8 relative z-10">
            <h3 className="text-2xl font-black text-text-primary tracking-tight">
              {step === 1 && "Reset Account."}
              {step === 2 && "Verification."}
              {step === 3 && "Secure Access."}
            </h3>
            <p className="text-[12px] font-bold text-text-secondary uppercase tracking-widest mt-2">
              {step === 1 && "We'll send a 6-digit code to verify your identity."}
              {step === 2 && `Enter the code sent to ${email}`}
              {step === 3 && "Your new password must be distinct."}
            </p>
          </div>

          <div className="space-y-6 relative z-10">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1 mb-2 block">
                    Email address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand transition-colors" size={18} />
                    <input
                      type="email"
                      className="w-full pl-14 pr-5 py-4 bg-bg-secondary border border-border focus:border-brand focus:bg-white rounded-xl text-sm font-bold text-text-primary transition-all outline-none placeholder:text-text-muted shadow-inner focus:shadow-md"
                      placeholder="rohit@email.com"
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      value={email}
                    />
                  </div>
                </div>
                <button
                  className="w-full primary-button py-4 rounded-xl font-black text-[12px] uppercase tracking-widest shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-300 disabled:opacity-50"
                  onClick={handleSendOtp}
                  disabled={loading}
                >
                  {loading ? <ClipLoader size={18} color="white" /> : "Send Code"}
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary text-center block mb-4">
                    6-Digit Authorization Code
                  </label>
                  <input
                    type="text"
                    className="w-full py-4 px-6 bg-bg-secondary border border-border focus:border-brand focus:bg-white rounded-xl text-center font-black tracking-[0.6em] text-2xl text-text-primary outline-none transition-all placeholder:text-text-muted shadow-inner focus:shadow-md"
                    placeholder="000000"
                    maxLength={6}
                    onChange={(e) => { setOtp(e.target.value); setError(""); }}
                    value={otp}
                  />
                </div>
                <button
                  className="w-full primary-button py-4 rounded-xl font-black text-[12px] uppercase tracking-widest shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-300 disabled:opacity-50"
                  onClick={handleVerifyOtp}
                  disabled={loading}
                >
                  {loading ? <ClipLoader size={18} color="white" /> : "Verify Identity"}
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-5">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1 mb-2 block">
                      New Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand transition-colors" size={18} />
                      <input
                        type="password"
                        className="w-full pl-14 pr-5 py-4 bg-bg-secondary border border-border focus:border-brand focus:bg-white rounded-xl text-sm font-bold text-text-primary transition-all outline-none placeholder:text-text-muted shadow-inner focus:shadow-md"
                        placeholder="••••••••"
                        onChange={(e) => { setNewPassword(e.target.value); setError(""); }}
                        value={newPassword}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1 mb-2 block">
                      Confirm Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand transition-colors" size={18} />
                      <input
                        type="password"
                        className="w-full pl-14 pr-5 py-4 bg-bg-secondary border border-border focus:border-brand focus:bg-white rounded-xl text-sm font-bold text-text-primary outline-none transition-all placeholder:text-text-muted shadow-inner focus:shadow-md"
                        placeholder="••••••••"
                        onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                        value={confirmPassword}
                      />
                    </div>
                  </div>
                </div>
                <button
                  className="w-full primary-button py-4 rounded-xl font-black text-[12px] uppercase tracking-widest shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-300 disabled:opacity-50"
                  onClick={handleResetPassword}
                  disabled={loading}
                >
                  {loading ? <ClipLoader size={18} color="white" /> : "Authorize & Reset"}
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-6 bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 relative z-10 shadow-sm">
              <p className="text-rose-400 text-[10px] font-black uppercase tracking-widest text-center animate-pulse">
                {error}
              </p>
            </div>
          )}

          <p className="text-center mt-10 text-[9px] font-black uppercase tracking-widest text-text-muted relative z-10 flex items-center justify-center gap-1.5">
            <Lock size={10} className="text-text-muted" />
            Secured with 256-Bit Military Encryption
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;