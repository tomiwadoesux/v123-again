"use client";

import dynamic from "next/dynamic";
import { useCallback } from "react";
import { loadFull } from "tsparticles";

// Dynamically import Particles to disable SSR
const Particles = dynamic(() => import("@tsparticles/react"), {
  ssr: false,
});

// Particle configuration options
const options = {
  fullScreen: {
    enable: true,
    zIndex: -1,
  },
  fpsLimit: 120,
  particles: {
    number: {
      value: 0,
    },
    color: {
      value: "#fff",
    },
    life: {
      duration: {
        value: 5,
        sync: false,
      },
      count: 1,
    },
    opacity: {
      value: { min: 0.1, max: 1 },
      animation: {
        enable: true,
        speed: 3,
      },
    },
    size: {
      value: {
        min: 3,
        max: 6,
      },
    },
    move: {
      enable: true,
      speed: 3,
      random: false,
      size: true,
    },
  },
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: "trail",
      },
    },
    modes: {
      trail: {
        delay: 0.5,
        pauseOnStop: true,
        quantity: 4,
      },
    },
  },
  background: {
    color: "#000",
  },
};

export default function Bg() {
  // Initialize tsparticles
  const particlesInit = useCallback(async (engine) => {
    if (engine) {
      await loadFull(engine);
    }
  }, []);

  return (
    <section>
      <div className="relative">
        <h1>Welcome to my Next.js site with Particles!</h1>
      </div>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={options}
        className="absolute inset-0"
      />
    </section>
  );
}