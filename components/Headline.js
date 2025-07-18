"use client"
import { useRef } from "react";

export function Headline() {
  const textRef = useRef(null);
 

  return (
    <div ref={textRef}>
      <h6 className=" text-xs md:text-lg text-center font tracking-[0.1rem] md:tracking-[0.3rem]">
      “Art Will Save Us”
      </h6>
    </div>
  );
}
