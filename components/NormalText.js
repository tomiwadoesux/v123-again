"use client"
import { useRef } from "react";
import ImageTrail from "./ImageTrail";

export function NormalText({ content, color = "#333", variant = "base", className = "" }) {
  const textRef = useRef(null);
  // Use <h4> for a "heading" variant; for base text, use <p>.
  const Tag = variant === "heading" ? "h4" : "p";

  return (
    <div ref={textRef}>
      <Tag
        style={{ color }}
        className={`text-xs md:text-[0.85rem] lg:text-base text-justify  font-sans dropcap ${className}`}
      >
        {content}
      </Tag>
    </div>
  );
}
