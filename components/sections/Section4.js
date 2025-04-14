"use client"
import { useEffect, useRef } from 'react';

export default function Section4({ onHalfway }) {
  const sectionRef = useRef(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered.current) {
          hasTriggered.current = true;
          onHalfway();
        }
      },
      {
        root: null,
        threshold: 0.5,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [onHalfway]);

  return (
    <section ref={sectionRef} className="relative w-full h-[100vh]">
      {/* Content here */}
    </section>
  );
}
