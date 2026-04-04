import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;

    const onMouseMove = (e) => {
      const { clientX: x, clientY: y } = e;
      
      gsap.to(cursor, {
        x: x,
        y: y,
        duration: 0.1,
        ease: 'none'
      });

      gsap.to(follower, {
        x: x,
        y: y,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const onMouseEnter = () => {
      gsap.to([cursor, follower], { opacity: 1, duration: 0.3 });
    };

    const onMouseLeave = () => {
      gsap.to([cursor, follower], { opacity: 0, duration: 0.3 });
    };

    // Magnetic effect for elements with data-magnetic
    const onHover = (e) => {
      if (e.target.closest('a, button, [data-magnetic]')) {
        gsap.to(follower, {
          scale: 2.5,
          backgroundColor: 'rgba(255, 77, 45, 0.1)',
          borderColor: 'rgba(255, 77, 45, 0.5)',
          duration: 0.3
        });
        gsap.to(cursor, {
          scale: 0.5,
          duration: 0.3
        });
      } else {
        gsap.to(follower, {
          scale: 1,
          backgroundColor: 'transparent',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          duration: 0.3
        });
        gsap.to(cursor, {
          scale: 1,
          duration: 0.3
        });
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseenter', onMouseEnter);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('mouseover', onHover);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mouseover', onHover);
    };
  }, []);

  return (
    <>
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-2 h-2 bg-brand rounded-full pointer-events-none z-[9999] opacity-0 mix-blend-difference"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      <div 
        ref={followerRef} 
        className="fixed top-0 left-0 w-8 h-8 border border-white/20 rounded-full pointer-events-none z-[9998] opacity-0"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
    </>
  );
};

export default CustomCursor;
