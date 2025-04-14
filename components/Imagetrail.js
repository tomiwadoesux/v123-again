"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";

const ImageTrail = ({ imageSrc }) => {
  const containerRef = useRef(null);
  const trailRefs = useRef([]); // Store active trail images
  const lastSpawnTime = useRef(0);
  const [isHovering, setIsHovering] = useState(false); // Track hover state

  // Define trail images
  const trailImages = [
    "/images/hovers/12.jpeg",
    "/images/hovers/13.jpeg",
    "/images/hovers/14.jpeg",
    "/images/hovers/15.jpeg",
    "/images/hovers/16.jpeg",
    "/images/hovers/17.jpeg",
    "/images/hovers/18.jpeg",
    "/images/hovers/19.jpeg",
    "/images/hovers/20.jpeg",
    "/images/hovers/21.jpeg",
    "/images/hovers/22.jpeg",
    "/images/hovers/23.jpeg",
    "/images/hovers/24.jpeg",
    "/images/hovers/25.jpeg",
    "/images/hovers/26.jpeg",
    "/images/hovers/27.jpeg",
    "/images/hovers/28.jpeg",
    "/images/hovers/29.jpeg",
    "/images/hovers/30.jpeg",
    "/images/hovers/31.jpeg",
    "/images/hovers/32.jpeg",
    "/images/hovers/33.jpeg",
    "/images/hovers/34.jpeg",
    "/images/hovers/35.jpeg",
    "/images/hovers/36.jpeg",
    "/images/hovers/37.jpeg",
    "/images/hovers/38.jpeg",
    "/images/hovers/39.jpeg",
    "/images/hovers/40.jpeg",
  ];





  const maxTrailImages = 10;
  const minSpawnInterval = 50;

  const handleMouseMove = (e) => {
    if (!isHovering) return; // Only trigger when hovering over the image
    const now = Date.now();
    if (now - lastSpawnTime.current < minSpawnInterval) return;
    lastSpawnTime.current = now;

    if (trailRefs.current.length >= maxTrailImages) {
      const oldImg = trailRefs.current.shift();
      gsap.to(oldImg, {
        opacity: 0,
        scale: 0.5,
        duration: 3,
        onComplete: () => oldImg.remove(),
      });
    }

    const randomIndex = Math.floor(Math.random() * trailImages.length);
    const trailSrc = trailImages[randomIndex];

    const trailImg = document.createElement("img");
    trailImg.src = trailSrc;
    trailImg.className = "absolute pointer-events-none";
    containerRef.current.appendChild(trailImg); // Append to container, not body
    trailRefs.current.push(trailImg);

    const offsetX = (Math.random() - 0.5) * 3;
    const offsetY = (Math.random() - 0.5) * 3;

    gsap.set(trailImg, {
      position: "absolute",
      width: `${Math.random() * 20 + 40}px`,
      height: "auto",
      left: e.nativeEvent.offsetX + offsetX, // Restrict to image space
      top: e.nativeEvent.offsetY + offsetY,
      opacity: 0,
    });

    const moveX = gsap.quickTo(trailImg, "left", { duration: 2.5, ease: "power2.out" });
    const moveY = gsap.quickTo(trailImg, "top", { duration: 2.5, ease: "power2.out" });

    moveX(e.nativeEvent.offsetX + offsetX);
    moveY(e.nativeEvent.offsetY + offsetY);

    gsap.to(trailImg, {
      opacity: 1,
      scale: 0.6,
      duration: 0.2,
      ease: "power2.out",
    });

    gsap.to(trailImg, {
      opacity: 0,
      scale: 0.8,
      duration: 0.9,
      delay: 0.2,
      onComplete: () => {
        trailRefs.current = trailRefs.current.filter((img) => img !== trailImg);
        trailImg.remove();
      },
    });
  };

  useEffect(() => {
    return () => {
      trailRefs.current.forEach((img) => img.remove());
      trailRefs.current = [];
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <img src={imageSrc} alt=" Imagez" className="w-full h-full object-cover" />
    </div>
  );
};

export default ImageTrail;
