"use client";
import { useRef } from "react";

export function Scroll() {
  return (
    <div className="px-[0rem] pt-[1.5rem] py-2 px-0 ">
      <div className="bg-black w-full overflow-hidden py-1">
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="text-[#F4F2EC] text-sm">
            Your daily scoop: summarized NEWS articles and a MEME or two to your mail. &nbsp;&nbsp;&nbsp;
          </span>
          <span className="text-[#F4F2EC] text-sm">
            Your daily scoop: summarized NEWS articles and a MEME or two to your mail. &nbsp;&nbsp;&nbsp;
          </span>
          <span className="text-[#F4F2EC] text-sm">
            Your daily scoop: summarized NEWS articles and a MEME or two to your mail. &nbsp;&nbsp;&nbsp;
          </span>
          <span className="text-[#F4F2EC] text-sm">
            Your daily scoop: summarized NEWS articles and a MEME or two to your mail. &nbsp;&nbsp;&nbsp;
          </span>
          <span className="text-[#F4F2EC] text-sm">
            Your daily scoop: summarized NEWS articles and a MEME or two to your mail. &nbsp;&nbsp;&nbsp;
          </span>
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          animation: marquee 10s linear infinite;
        }
        /* Mobile: slower scrolling (e.g., 15s) */
        @media (max-width: 767px) {
          .animate-marquee {
            animation-duration: 8s;
          }
        }
        /* Desktop: faster scrolling (e.g., 10s) */
        @media (min-width: 768px) {
          .animate-marquee {
            animation-duration: 20s;
          }
        }
      `}</style>
    </div>
  );
}
