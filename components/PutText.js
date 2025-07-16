"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { Button } from "../components/Button";

export function PutText({
  content,
  color = "#333",
  variant = "base",
  className = "",
}) {
  const textRef = useRef(null);


  return (
    <div className="px-[2.5rem] pt-[0.7rem] md:px-[4.15rem] flex flex-col md:flex-row gap-6">
      <div className="hidden md:block flex-1 italic text-sm" style={{ color }}>
        <h4 className="text-nowrap">
          <div>Choose an article topic.</div>
          <div>Summarized with AI.</div>
          <div>
            Sent to your mail <Button text="Subscribe Here" color="black" />
          </div>
        </h4>
      </div>

      <div className="flex-2 w-full">
        <div

          className="w-[100%] h-20 relative overflow-hidden md:overflow-hidden md:px-[4.15rem] px-[2.5rem]"
        >
          <div ref={textRef} className="absolute">
            <h1 className="text-xs md:text-base text-justify italic font-sans dropcap">
              The rest of this website is going to showcase{" "}
              <span className="text-red text-bold">
                Quotes from Books I’ve read
              </span>{" "}
            and some <span className="text-red">Poems</span>, maybe{" "}
              <span className="text-red">Movies</span> too.
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
