"use client";
import Image from "next/image";
import { useRef } from "react";

export function Images({ height, alt, img, className = "" }) {
  const textRef = useRef(null);
  return (
    <div ref={textRef}>
      <Image
        src={{img}}
        alt={{alt}}
        style={{ height }}
        className={`w-full  ${className}`}
      />
    </div>
  );
}
