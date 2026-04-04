import React, { useEffect, useState } from "react";
import { CheckCircle, ArrowRight, Home, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import Nav from "../components/Nav";

const OrderPlaced = () => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    const timer = setTimeout(() => setShowConfetti(false), 6000);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-bg-secondary text-text-primary flex flex-col relative overflow-hidden">
      <Nav />

      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={400}
          colors={["#ff4d2d", "#ff8c7a", "#ffffff", "#333333"]} // Vingo Dark Theme Colors
        />
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pt-10 pb-20 max-w-xl mx-auto w-full z-10">

        {/* Animated Success Icon */}
        <div className="animate-bounce-in mb-10">
          <div className="w-32 h-32 bg-bg-card rounded-full flex items-center justify-center shadow-lg relative z-10">
            <CheckCircle
              size={70}
              className="text-brand"
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center space-y-4 mb-12 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-black text-text-primary tracking-tighter">
            Order <span className="text-brand">Placed!</span>
          </h1>
          <p className="text-text-secondary font-bold uppercase tracking-widest text-[11px]">
            Hang tight! Your premium meal is being prepared.
          </p>
        </div>

        {/* Status Card */}
        <div className="w-full bg-bg-card border border-border rounded-[2.5rem] p-8 sm:p-10 mb-12 animate-fade-in-up-delayed shadow-md relative overflow-hidden">
          <h3 className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em] mb-8 border-b border-border pb-4 relative z-10 flex items-center gap-3">
            <div className="w-1.5 h-4 bg-brand rounded-full" />
            Next Steps
          </h3>

          <div className="space-y-8 relative z-10">
            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 bg-bg-secondary border border-border text-text-primary rounded-2xl flex items-center justify-center font-black shadow-inner text-lg transition-transform group-hover:scale-105">
                1
              </div>
              <div>
                <p className="text-sm font-black text-text-primary uppercase tracking-wider mb-1">Preparation Phase</p>
                <p className="text-xs font-bold text-text-secondary tracking-wide">The master chef is working their magic.</p>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 bg-brand/5 border border-brand/10 text-brand rounded-2xl flex items-center justify-center font-black shadow-inner text-lg transition-transform group-hover:scale-105">
                2
              </div>
              <div>
                <p className="text-sm font-black text-text-primary uppercase tracking-wider mb-1">Dispatched Soon</p>
                <p className="text-xs font-bold text-text-secondary tracking-wide">Our premium rider will pick up your feast.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 w-full animate-fade-in-up-delayed-2">
          <button
            onClick={() => navigate("/my-orders")}
            className="flex-1 primary-button py-5 rounded-2xl font-black text-[12px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-md active:scale-95 transition-all duration-300 cursor-pointer"
          >
            TRACK ORDER <ArrowRight size={18} className="text-white ml-2" />
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex-1 bg-bg-card text-text-primary py-5 rounded-2xl font-black text-[12px] uppercase tracking-widest flex items-center justify-center gap-3 border border-border hover:bg-bg-secondary shadow-md active:scale-95 transition-all duration-300 cursor-pointer"
          >
            <Home size={18} className="text-text-muted" /> Back to Home
          </button>
        </div>

        <p className="mt-14 text-[9px] font-black text-text-muted uppercase tracking-[0.4em] text-center">
          Thank you for choosing Vingo
        </p>
      </div>

      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0.8); opacity: 0; }
          60% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fade-in-up {
          0% { transform: translateY(40px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
        }
        .animate-fade-in-up-delayed {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
        }
        .animate-fade-in-up-delayed-2 {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both;
        }
      `}</style>
    </div>
  );
};

export default OrderPlaced;