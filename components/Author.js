"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";

export function Author({
  author,
  from,
  color = "#DC2625",
  variant = "heading",
  className = "",
}) {
  const textRef = useRef(null);
  const containerRef = useRef(null);
  const shineRef = useRef(null);

  useEffect(() => {
    if (!textRef.current || !author || !from) return;

    const fullText = `${from} - ${author}`;
    const textElement = textRef.current;

    // Reset
    textElement.innerHTML = "";

    // Build spans
    fullText.split("").forEach((char, i) => {
      const span = document.createElement("span");
      span.textContent = char === " " ? "\u00A0" : char;
      span.style.opacity = "0";
      span.setAttribute("data-char", i.toString());
      textElement.appendChild(span);
    });

    const chars = textElement.querySelectorAll("span");

    const tl = gsap.timeline();

    // Typewriter
    tl.to(chars, {
      opacity: 1,
      duration: 0.05,
      stagger: 0.05,
      ease: "none",
    });

    // Shine
    tl.to(
      shineRef.current,
      {
        x: "100%",
        duration: 1.7,
        ease: "power2.inOut",
      },
      "+=0.5"
    )
      .set(shineRef.current, { x: "-100%" })
      .to(shineRef.current, {
        x: "100%",
        duration: 1.7,
        ease: "power2.inOut",
        repeat: -1,
        repeatDelay: 3.2,
      });

    return () => {
      tl.kill();
      textElement.innerHTML = "";
    };
  }, [author, from]);

  const Tag = variant === "heading" ? "h4" : "span";

  return (
    <div className="flex items-center flex-row" ref={containerRef}>
      <div className="relative inline-block overflow-hidden">
        <Tag
          ref={textRef}
          style={{ color }}
          className={`text-xs font-extralight italic w-fit font-sans ${className}`}
        />
        <div
          ref={shineRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.6) 50%, transparent 70%)",
            transform: "translateX(-100%)",
            zIndex: 1,
          }}
        />
      </div>
    </div>
  );
}
