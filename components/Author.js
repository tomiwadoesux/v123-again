"use client"
import { useRef } from "react";

export function Author({ author, from, color = "#333", variant = "heading", className = "" }) {
  // If variant is "heading", use an inline h4; otherwise, default to span.
  const Tag = variant === "heading" ? "h4" : "span";

  return (
    <Tag
      style={{ color }}
      className={`text-xs font-extralight italic inline font-sans ${className}`}
    >
     {from}  ~ {author}
    </Tag>
  );
}
