"use client";
import ParticlesComponent from "components/particle2";
import Section1 from "components/sections/Section1";
import Section2 from "components/sections/Section2";
import Section3 from "components/sections/Section3";
import Section5 from "components/sections/Section5";

import LoveMastHead from "components/LoveMastHead";
import { useEffect, useRef } from "react";
import LocomotiveScroll from "locomotive-scroll";
import { Scroll } from "components/Scroll";
import { PutText } from "components/PutText";
import { Footer2 } from "components/Footer2";
import NavigationPrevious from "components/NavigationPrevious";

export default function Home() {
  const scrollRef = useRef(null);

  useEffect(() => {
    const scroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      smoothMobile: true,
      lerp: 0.05, 
    });

    return () => {
      scroll.destroy();
    };
  }, []);

  return (
    <section
      data-scroll-container
      ref={scrollRef}
      className="relative w-full bg-[#F4F2EC] overflow-hidden"
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <ParticlesComponent id="particles" />
      </div>
      <div className="fixed z-50 bottom-0 ">
        <Scroll />
      </div>
      <div className="relative z-10">
        <LoveMastHead />
        <Section3 />

        <Footer2 />
        {/* <NavigationPrevious /> */}
      </div>
    </section>
  );
}
