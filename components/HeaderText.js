"use client"
import { useRef } from "react";

export function HeaderText({ content, color = "#333", variant = "heading", className = "" }) {
  const textRef = useRef(null);
  // When the variant is "heading", use an h1 element; otherwise, default to a paragraph.
  const Tag = variant === "heading" ? "h1" : "p";

  return (
    <div ref={textRef}>
      <Tag
        style={{ color }}
        className={` text-xl md:text-3xl  ${className}`}
      >
        {content}
      </Tag>
    </div>
  );
}
