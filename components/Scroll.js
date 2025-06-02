"use client";
import { useRef } from "react";

export function Scroll() {
  return (
    <div className="px-[0rem]  z-50 ">
      <div className="bg-[red] w-full  overflow-hidden py-1">
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
        @media (min-width: 768px) {
          .animate-marquee {
            animation-duration: 30s;
          }
        }
      `}</style>
    </div>
  );
}
