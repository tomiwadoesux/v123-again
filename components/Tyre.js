"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Tyre() {
  const svgRef = useRef(null);

  useEffect(() => {
    gsap.to("#tyre", {
      rotation: 2340, // ~6.5 full spins
      transformOrigin: "center",
      ease: "none",
      scrollTrigger: {
        trigger: "#tyre",
        start: "top bottom",        // when tyre enters viewport
        end: "top top-=1000",       // rotate over 1000px of scroll
        scrub: true,                // ties rotation to scroll
      },
    });
  }, []);
  

  return (
 
      <svg
        width="15%"
        height="auto"
        viewBox="0 0 49 49"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="tyre">
          <g id="Group 68">
            <g id="Group 77">
              <circle
                id="Ellipse 26"
                cx="23.4844"
                cy="33.5637"
                r="9.5"
                transform="rotate(-90 23.4844 33.5637)"
                fill="#FB5B58"
              />
              <circle
                id="Ellipse 28"
                cx="9.5"
                cy="9.5"
                r="9.5"
                transform="matrix(-4.37114e-08 -1 -1 4.37114e-08 32.9844 24.0637)"
                fill="#6D6D6D"
              />
              <circle
                id="Ellipse 27"
                cx="33.4844"
                cy="24.5637"
                r="9.5"
                transform="rotate(180 33.4844 24.5637)"
                fill="white"
              />
              <circle
                id="Ellipse 29"
                cx="9.5"
                cy="9.5"
                r="9.5"
                transform="matrix(-1 4.37114e-08 4.37114e-08 1 23.9844 15.0637)"
                fill="black"
              />
            </g>
            <g id="Group 25">
              <circle
                id="Ellipse 33"
                cx="31.9862"
                cy="20.0627"
                r="8.57454"
                transform="rotate(-30 31.9862 20.0627)"
                stroke="#6D6D6D"
                strokeWidth="0.4"
              />
              <circle
                id="Ellipse 31"
                cx="19.5974"
                cy="16.4467"
                r="8.57454"
                transform="rotate(-120 19.5974 16.4467)"
                stroke="black"
                strokeWidth="0.4"
              />
              <circle
                id="Ellipse 32"
                cx="8.77454"
                cy="8.77454"
                r="8.57454"
                transform="matrix(0.866025 -0.5 -0.5 -0.866025 13.1689 40.4379)"
                stroke="#FB5B58"
                strokeWidth="0.4"
              />
              <circle
                id="Ellipse 30"
                cx="8.77454"
                cy="8.77454"
                r="8.57454"
                transform="matrix(-0.5 -0.866025 -0.866025 0.5 40.3721 34.8802)"
                stroke="white"
                strokeWidth="0.4"
              />
            </g>
          </g>
        </g>
      </svg>
 
  );
}
