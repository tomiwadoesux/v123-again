'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

import MastHead from "components/MastHead";
import ParticlesComponent from "components/particle";
import Image from 'next/image';
import LazyImageTrail from 'components/LazyImageTrail';
import Section1 from "components/sections/Section1";
import Section2 from "components/sections/Section2";
import Section4 from "components/sections/Section4";
import Section5 from "components/sections/Section5";
import { Footer } from 'components/Footer';
import NavigationNext from 'components/NavigationNext';
import Section99 from 'components/sections/Section99';
import Tomcs from 'components/Tomcs';
import Hail from 'components/Hail';

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

    const preloadLovePage = () => {
      router.prefetch('/love');

      import('./love/page').catch(() => {});
      import('../components/particle2').catch(() => {});
      import('../components/LoveMastHead.js').catch(() => {});
      import('../components/sections/Section3.js').catch(() => {});
      import('../components/Footer2.js').catch(() => {});

      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = '/locomotive-scroll.css';
      link.as = 'style';
      document.head.appendChild(link);
    };

    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(preloadLovePage);
      } else {
        setTimeout(preloadLovePage, 100);
      }
    }

    return () => {
      scroll.destroy();
    };
  }, [router]);

  return (
    <section
      data-scroll-container
      ref={scrollRef}
      className="relative w-full bg-[#FFF] overflow-hidden"
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <ParticlesComponent id="particles" />
      </div>

      <div className="relative z-10">
        <MastHead />
      

        <Section1 />
        <Tomcs/>
        <Section2 />
        <Section5 /> 
        <Footer/>


      </div>
    </section>
  );
}
