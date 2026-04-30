import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const PageRouteLoader = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Noodle pull animation
      gsap.to(".noodle", {
        y: -40,
        scaleY: 1.5,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.1
      });

      // Chopsticks movement
      gsap.to(".chopsticks", {
        y: -15,
        rotation: -5,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Steam animation
      gsap.to(".steam", {
        y: -30,
        opacity: 0,
        stagger: 0.2,
        duration: 2,
        repeat: -1,
        ease: "power1.out"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-bg-primary overflow-hidden"
    >
      {/* Atmosphere */}
      <div className="absolute w-[500px] h-[500px] bg-brand/5 rounded-full blur-[100px]" />
      
      <div className="relative flex flex-col items-center">
        
        {/* Noodle Container */}
        <div className="relative h-64 w-64 flex items-center justify-center">
          
          {/* Steam */}
          <div className="absolute top-12 flex gap-3">
             {[1, 2, 3].map(i => (
               <div key={i} className="steam w-1.5 h-12 bg-gradient-to-t from-white/20 to-transparent rounded-full" />
             ))}
          </div>

          {/* Chopsticks */}
          <div className="chopsticks absolute z-30 top-16 -right-4 origin-bottom-left transform -rotate-12">
            <div className="w-1.5 h-48 bg-[#5C4033] rounded-full shadow-lg" />
            <div className="w-1.5 h-48 bg-[#5C4033] rounded-full shadow-lg ml-4 mt-2" />
          </div>

          {/* Noodles */}
          <div className="absolute z-20 top-28 flex gap-1">
             {[1, 2, 3, 4, 5].map(i => (
               <div key={i} className="noodle w-2 h-24 bg-amber-200 rounded-full shadow-inner border border-amber-300/30" />
             ))}
          </div>

          {/* Bowl */}
          <div className="absolute z-10 bottom-12 w-48 h-24 bg-red-600 rounded-b-full border-t-8 border-red-700 shadow-2xl overflow-hidden">
             <div className="absolute top-4 left-1/2 -translate-x-1/2 w-40 h-2 bg-white/10 rounded-full" />
             <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-red-700/50 rounded-full" />
          </div>

          {/* Shadow */}
          <div className="absolute bottom-6 w-32 h-4 bg-black/20 rounded-[100%] blur-md" />
        </div>

        <div className="text-center mt-4">
          <div className="flex items-center justify-center gap-1">
            <span className="text-4xl font-black text-text-primary tracking-tighter">DishDash</span>
            <span className="text-4xl font-black text-brand tracking-tighter">.</span>
          </div>
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-brand opacity-60">
            Slurping in progress
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageRouteLoader;
