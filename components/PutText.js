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
  const containerRef = useRef(null);

  useEffect(() => {
    if (!textRef.current || !containerRef.current) return;

    // Use container's actual dimensions.
    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;

    // Get element (ball) dimensions.
    const elementWidth = textRef.current.offsetWidth;
    const elementHeight = textRef.current.offsetHeight;

    console.log("Container:", containerWidth, containerHeight);
    console.log("Element:", elementWidth, elementHeight);

    // Warn if the element is larger than the container.
    if (elementWidth > containerWidth || elementHeight > containerHeight) {
      console.warn(
        "Element is larger than container. Adjust sizes so the element fits."
      );
    }

    // Boundaries so the element stays fully inside.
    const minX = 0;
    const minY = 0;
    const maxX = containerWidth - elementWidth;
    const maxY = containerHeight - elementHeight;

    // Set an initial random position.
    gsap.set(textRef.current, {
      x: maxX > 0 ? Math.random() * maxX : 0,
      y: maxY > 0 ? Math.random() * maxY : 0,
    });

    // Choose an initial random angle (in radians) and a constant speed (pixels per second).
    let angle = Math.random() * Math.PI * 2;
    const speed = 100; // adjust speed as needed

    function bounce() {
      const currentX = gsap.getProperty(textRef.current, "x");
      const currentY = gsap.getProperty(textRef.current, "y");

      // Velocity components.
      const dx = Math.cos(angle) * speed;
      const dy = Math.sin(angle) * speed;

      // Time to hit vertical walls.
      let timeToX;
      if (dx > 0) {
        timeToX = (maxX - currentX) / dx;
      } else if (dx < 0) {
        timeToX = (currentX - minX) / -dx;
      } else {
        timeToX = Infinity;
      }

      // Time to hit horizontal walls.
      let timeToY;
      if (dy > 0) {
        timeToY = (maxY - currentY) / dy;
      } else if (dy < 0) {
        timeToY = (currentY - minY) / -dy;
      } else {
        timeToY = Infinity;
      }

      // Determine which wall is hit first.
      const time = Math.min(timeToX, timeToY);

      // New position at collision.
      const newX = currentX + dx * time;
      const newY = currentY + dy * time;

      gsap.to(textRef.current, {
        duration: time,
        x: newX,
        y: newY,
        ease: "none",
        onComplete: () => {
          // Reflect angle upon collision.
          if (timeToX < timeToY) {
            angle = Math.PI - angle; // vertical wall hit: reverse horizontal component.
          } else {
            angle = -angle; // horizontal wall hit: reverse vertical component.
          }
          // Normalize angle.
          angle = angle % (Math.PI * 2);
          bounce();
        },
      });
    }

    bounce();
  }, []);

  return (
    <div className="px-[2.5rem] pt-[0.7rem] md:px-[4.15rem] flex flex-col md:flex-row gap-16">
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
        ref={containerRef}
        className="w-full h-20 relative overflow-hidden md:overflow-hidden md:px-[4.15rem] px-[2.5rem]"
      >
        <div ref={textRef} className="absolute">
          <h1 className="text-xs md:text-base text-justify italic font-sans dropcap">
            The rest of this website is going to showcase{" "}
            <span className="text-red-600 text-bold">Quotes from Books I’ve read</span>{" "}
            and some <span className="text-red-600">Poems</span>, maybe{" "}
            <span className="text-red-600">Movies</span> too.
          </h1>
        </div>
      </div>
    </div>
  </div>
  );
}
