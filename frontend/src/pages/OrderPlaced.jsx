import React, { useEffect, useState } from "react";
import { IoCheckmarkCircle, IoArrowForward, IoHomeOutline, IoReceiptOutline } from "react-icons/io5";
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <Nav />
      
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={400}
          colors={["#ff4d2d", "#111827", "#ffffff", "#ffbaad"]} // Vingo Brand Colors
        />
      )}

      {/* Main Container */}
      <div className="max-w-xl w-full flex flex-col items-center">
        
        {/* Animated Success Icon */}
        <div className="animate-bounce-in mb-10">
          <div className="relative">
            <div className="absolute inset-0 bg-[#ff4d2d]/20 rounded-full blur-3xl animate-pulse" />
            <IoCheckmarkCircle
              size={140}
              className="text-[#ff4d2d] relative z-10 drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center space-y-4 mb-12 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter">
            Order <span className="text-[#ff4d2d]">Placed!</span>
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
            Hang tight! Your food is being prepared.
          </p>
        </div>

        {/* Status Card */}
        <div className="w-full bg-white rounded-3xl border-2 border-gray-200/80 shadow-md shadow-gray-200/50 p-10 mb-10 animate-fade-in-up-delayed">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-8 border-b-2 border-gray-100 pb-4">
            Next Steps
          </h3>
          
          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center font-black shadow-md">1</div>
              <div>
                <p className="text-sm font-black text-gray-900 uppercase">Preparation</p>
                <p className="text-xs font-bold text-gray-400">The kitchen is working its magic.</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-orange-50 border-2 border-orange-200 text-[#ff4d2d] rounded-2xl flex items-center justify-center font-black">2</div>
              <div>
                <p className="text-sm font-black text-gray-900 uppercase">On the way</p>
                <p className="text-xs font-bold text-gray-400">Our rider will pick up your feast soon.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full animate-fade-in-up-delayed-2">
          <button
            onClick={() => navigate("/my-orders")}
            className="flex-1 bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4a] text-white py-6 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-md shadow-orange-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <IoReceiptOutline size={20} /> Track Order <IoArrowForward />
          </button>
          
          <button
            onClick={() => navigate("/")}
            className="flex-1 bg-white text-gray-900 py-6 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 border-2 border-gray-200 hover:bg-gray-50 hover:border-[#ff4d2d]/30 hover:text-[#ff4d2d] hover:shadow-md active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <IoHomeOutline size={20} /> Back to Home
          </button>
        </div>

        <p className="mt-12 text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
          Thank you for choosing Vingo
        </p>
      </div>

      <style jsx>{`
        @keyframes bounce-in {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fade-in-up {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out 0.2s both;
        }
        .animate-fade-in-up-delayed {
          animation: fade-in-up 0.8s ease-out 0.4s both;
        }
        .animate-fade-in-up-delayed-2 {
          animation: fade-in-up 0.8s ease-out 0.6s both;
        }
      `}</style>
    </div>
  );
};

export default OrderPlaced;