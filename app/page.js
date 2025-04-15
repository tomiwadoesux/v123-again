'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

import MastHead from "components/MastHead";
import ParticlesComponent from "components/particle";
import Section1 from "components/sections/Section1";
import Section2 from "components/sections/Section2";
import Section4 from "components/sections/Section4";
import Section5 from "components/sections/Section5";
import { Footer } from 'components/Footer';

export default function Home() {
  const scrollRef = useRef(null);
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    const scroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      smoothMobile: true,
      lerp: 0.07,
    });

    return () => {
      scroll.destroy();
    };
  }, [router]);

  return (
    <section
      data-scroll-container
      ref={scrollRef}
      className="relative w-full bg-[#FFFq] overflow-hidden"
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <ParticlesComponent id="particles" />
      </div>

      <div className="relative z-10">
        <MastHead />
        <Section1 />
        <Section5 />
        <Section2 />
        <Footer/>


      </div>
    </section>
  );
}
