"use client"
import { useRef } from "react";

export function BigLetter({ content, color = "black", variant = "heading", className = "" }) {
  const textRef = useRef(null);
  // Use h1 for a "heading" variant; otherwise, default to p.
  const Tag = variant === "heading" ? "h1" : "p";

  return (
    <div ref={textRef}>
      <Tag
        style={{ color }}
        className={`text-2xl font-bold ${className}`}
      >
        {content}
      </Tag>
    </div>
  );
}
