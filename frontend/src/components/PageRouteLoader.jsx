import React from "react";

const PageRouteLoader = () => {
  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-bg-primary transition-all duration-500">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand/10 rounded-full blur-[100px] animate-pulse" />
      </div>

      {/* Logo container */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Animated icon */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand border-r-brand animate-[spin_1s_linear_infinite]" />
          
          {/* Inner ring */}
          <div className="absolute inset-2 rounded-full border border-transparent border-b-brand/40 border-l-brand/40 animate-[spin_0.7s_linear_infinite_reverse]" />
          
          {/* Center icon */}
          <div className="relative w-9 h-9 bg-gradient-to-br from-brand to-brand-glow rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(226,55,68,0.4)] animate-pulse">
            <span className="text-white text-lg font-black">V</span>
          </div>
        </div>

        {/* Brand text */}
        <div className="flex items-baseline gap-0.5">
          <span className="text-text-primary text-2xl font-black tracking-tighter">Vingo</span>
          <span className="text-brand text-2xl font-black tracking-tighter animate-pulse">.</span>
        </div>

        {/* Loading dots */}
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-brand rounded-full animate-[bounce_1.4s_infinite_0s]" />
          <div className="w-1.5 h-1.5 bg-brand rounded-full animate-[bounce_1.4s_infinite_0.2s]" />
          <div className="w-1.5 h-1.5 bg-brand rounded-full animate-[bounce_1.4s_infinite_0.4s]" />
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default PageRouteLoader;
