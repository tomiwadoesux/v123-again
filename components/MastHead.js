"use client";
import { useEffect } from "react";
import { gsap } from "gsap";
import { NormalText } from "../components/NormalText";
import { HeaderText } from "../components/HeaderText";
import { Author } from "../components/Author";
import { Headline } from "../components/Headline";
import { Scroll } from "../components/Scroll";

export default function MastHead() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  useEffect(() => {
    // Animate the title
    gsap.from(".title-text", {
      opacity: 0,
      y: 50,
      duration: 1.2,
      ease: "power3.out",
    });

    // Animate SVG lines
    gsap.from(".svg-line", {
      scaleX: 0,
      transformOrigin: "left",
      duration: 1.5,
      ease: "power2.out",
      stagger: 0.2,
      delay: 0.3,
    });

    // Animate SVGs jumping up and down every 6 seconds
    const svgs = gsap.utils.toArray(".jump-svg");
    gsap.timeline({ repeat: -1, repeatDelay: 4 }).to(svgs, {
      y: -50,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.1,
    });
  }, []);

  return (
    <section>
      <div className=" h-31 md:h-43  px-[2.5rem] pt-[1.3rem] md:px-[4.15rem]">
        <div className="flex flex-row w-full gap-9">
          <div className=" sm:block hidden flex-1 ">
            <h4 className="text-left italic text-xs md:text-xs lg:text-base self-start"  role="text">
              A Portfolio Project
            </h4>
          </div>
          <div className="flex-1 justify-center flex relative">
            <h1 className="title-text relative -top-7 whitespace-nowrap text-center text-4xl -top-7 lg:-top-7 md:-top-9 md:text-[3.3rem] lg:text-[4.3rem] text-black font-light z-10 inline-block max-w-full overflow-x-auto">
              TITLE:"V123"
            </h1>
          </div>
          <div className="  sm:block hidden  flex-1">
            <h4 className="text-right text-xs md:text-xs lg:text-base italic ">
              {currentDate}
            </h4>
          </div>
        </div>
        <div className="relative -top-12 md:-top-17">
          <svg
            width="100%"
            height="20"
            viewBox="0 0 100 10"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <line
              className="svg-line"
              x1="0"
              y1="7"
              x2="100"
              y2="7"
              stroke="black"
              strokeWidth="0.8"
            />
            <line
              className="svg-line"
              x1="0"
              y1="2"
              x2="100"
              y2="2"
              stroke="black"
              strokeWidth="1"
            />
            <line
              className="svg-line"
              x1="0"
              y1="5.5"
              x2="100"
              y2="5.5"
              stroke="black"
              strokeWidth="3"
            />
          </svg>
          <h6 className=" title-text text-xs md:text-base  lg:text-lg text-center font tracking-[0.1rem] md:tracking-[0.3rem]">
            “Checking my email daily, because apparently chaos doesn’t send
            itself”
          </h6>
          <div className="relative -top-3 md:-top-0">
            <svg
              width="100%"
              height="20"
              viewBox="0 0 100 10"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <line
                className="svg-line"
                x1="0"
                y1="7"
                x2="100"
                y2="7"
                stroke="black"
                strokeWidth="0.4"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
