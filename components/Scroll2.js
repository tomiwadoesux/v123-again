"use client";
import { useRef } from "react";

export function Scroll2() {
  const text =
  " THIS WEBSITE IS STILL IN CONSTRUCTION ";

  return (
    <div className="px-[0rem]  z-50 ">
      <div className="bg-[#EB8E41] w-[100vw]  overflow-hidden py-1">
        <div className="flex whitespace-nowrap w-full animate-marquee">
          <span className="text-black text-sm">{text } </span>
          <span className="text-black text-sm">{text } </span>
          <span className="text-black text-sm">{text } </span>

          <span className="text-black text-sm">{text } </span>

          <span className="text-black text-sm">{text } </span>

          <span className="text-black text-sm">{text } </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          animation: marquee 18s linear infinite;
        }
        @media (max-width: 767px) {
          .animate-marquee {
            animation-duration: 12s;
          }
        }
        @media (min-width: 768px) {
          .animate-marquee {
            animation-duration: 30s;
          }
        }
      `}</style>
    </div>
  );
}
