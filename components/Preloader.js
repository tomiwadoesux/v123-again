'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Preloader({ onComplete }) {
  const loaderRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => onComplete(),
    });

    tl.to(loaderRef.current, {
      opacity: 0,
      duration: 1,
      delay: 1.8,
      ease: 'power2.out',
    });
  }, [onComplete]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 bg-black text-white flex items-center justify-center z-50"
    >
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="white"
          strokeWidth="4"
          fill="none"
          strokeDasharray="251.2"
          strokeDashoffset="251.2"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="251.2;0"
            dur="1.5s"
            repeatCount="1"
            fill="freeze"
          />
        </circle>
      </svg>
    </div>
  );
}
