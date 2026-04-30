import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Ghost } from "lucide-react";
import gsap from "gsap";

const NotFound = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(".ghost-anim", 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.5, ease: "back.out(1.7)" }
      )
      .fromTo(".text-anim", 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 }, 
        "-=0.8"
      )
      .fromTo(".btn-anim", 
        { scale: 0.8, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.5, stagger: 0.1 }, 
        "-=0.4"
      );

      // Floating ghost animation
      gsap.to(".ghost-anim", {
        y: -20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-6 relative overflow-hidden"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-glow/5 blur-[120px] rounded-full" />

      <div className="relative z-10 text-center">
        <div className="ghost-anim mb-8 inline-block">
          <div className="w-24 h-24 bg-bg-secondary border border-border rounded-[2.5rem] flex items-center justify-center shadow-2xl relative">
             <Ghost size={48} className="text-brand" />
             <div className="absolute -top-2 -right-2 bg-brand text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg">404</div>
          </div>
        </div>

        <h1 className="text-anim text-6xl md:text-8xl font-black text-text-primary tracking-tighter mb-4">
          Lost in <span className="text-gradient">Space.</span>
        </h1>
        
        <p className="text-anim text-text-secondary text-lg md:text-xl font-medium max-w-md mx-auto mb-10 leading-relaxed">
          The page you're looking for has vanished into the digital void. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="btn-anim primary-button px-8 py-4 rounded-2xl font-bold text-[13px] uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-brand/20"
          >
            <Home size={18} />
            Back to Home
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="btn-anim flex items-center gap-3 px-8 py-4 bg-bg-secondary border border-border rounded-2xl font-bold text-[13px] uppercase tracking-widest text-text-primary hover:border-brand hover:text-brand transition-all active:scale-95 shadow-lg"
          >
            <ArrowLeft size={18} />
            Previous Page
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 text-text-muted font-bold text-[10px] uppercase tracking-[0.4em] opacity-30">
        DishDash Premium Experience
      </div>
    </div>
  );
};

export default NotFound;
