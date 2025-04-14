"use client"
import { useRef } from "react";

export function Headline() {
  const textRef = useRef(null);
 

  return (
    <div ref={textRef}>
      <h6 className=" text-xs md:text-lg text-center font tracking-[0.1rem] md:tracking-[0.3rem]">
      “Checking my email daily, because apparently chaos doesn’t send itself”
      </h6>
    </div>
  );
}
