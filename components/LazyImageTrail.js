
"use client";

import { useState, Suspense, lazy } from "react";
import { useInView } from "react-intersection-observer";


const Imagetrail = lazy(() => import("./Imagetrail"));

function LazyImageTrail({ imageSrc }) {
  const { ref, inView } = useInView({
    triggerOnce: true, // Load only once when entering viewport
    threshold: 0.1, // Trigger when 10% of the component is visible
  });

  return (
    <div ref={ref} className="min-h-[200px]">
      {inView ? (
        <Suspense
          fallback={<div className="w-full h-full flex items-center justify-center bg-gray-100">
            <p className="text-gray-500">Loading...</p>
          </div>}
        >
          <Imagetrail imageSrc={imageSrc} />
        </Suspense>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <p className="text-gray-500">Placeholder</p>
        </div>
      )}
    </div>
  );
}

export default LazyImageTrail;
