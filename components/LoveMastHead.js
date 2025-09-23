"use client";
import { useEffect } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { NormalText } from "../components/NormalText";
import { HeaderText } from "../components/HeaderText";
import { Author } from "../components/Author";
import { Headline } from "../components/Headline";
import { Scroll } from "../components/Scroll";

export default function LoveMastHead() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  useEffect(() => {
    gsap.from(".title-text", {
      opacity: 0,
      y: 50,
      duration: 1.2,
      ease: "power3.out",
    });

    gsap.from(".svg-line", {
      scaleX: 0,
      transformOrigin: "left",
      duration: 1.5,
      ease: "power2.out",
      stagger: 0.2,
      delay: 0.3,
    });
  }, []);

  return (
    <section>
      <div className=" h-auto lg:-mb-0 md:-mb-6 sm:-mb-4  px-[2.5rem] md:px-[3rem] lg:px-[4.15rem] pt-[1.3rem] ">
      <div className="flex flex-row w-full gap-9">
          <div className="sm:block hidden flex-1 flex">
          <h4 className=" text-[#DC2625] underline text-left underline text-xs md:text-xs lg:text-base italic ">
              <Link href="/" className="hover:opacity-70 transition-opacity">
                Previous Page{" "}
              </Link>
            </h4>
          </div>
          <div className="flex-1 justify-center flex relative">
            <Link href="/" className="hover:opacity-70 transition-opacity">
              <h1 className="title-text relative -top-7 lg:-top-7 md:-top-9 whitespace-nowrap text-center text-4xl md:text-[3.3rem] lg:text-[4.3rem] text-[#DC2625] font-light z-10">
                TITLE: "LOVE"
              </h1>
            </Link>
            {/* Four heart SVGs positioned close together */}
            <div className="absolute top-0 left-[40%] z-0 flex gap-2">
              <svg
                className="jump-svg opacity-0"
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 27C15 27 3 18 3 9C3 3.5 7.5 1 12 1C14 1 16 2 18 4C20 2 22 1 24 1C28.5 1 33 3.5 33 9C33 18 21 27 15 27Z"
                  fill="#FF6B6B"
                />
              </svg>
              <svg
                className="jump-svg opacity-0"
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 27C15 27 3 18 3 9C3 3.5 7.5 1 12 1C14 1 16 2 18 4C20 2 22 1 24 1C28.5 1 33 3.5 33 9C33 18 21 27 15 27Z"
                  fill="#FF8787"
                />
              </svg>
              <svg
                className="jump-svg opacity-0"
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 27C15 27 3 18 3 9C3 3.5 7.5 1 12 1C14 1 16 2 18 4C20 2 22 1 24 1C28.5 1 33 3.5 33 9C33 18 21 27 15 27Z"
                  fill="#FF8787"
                />
              </svg>
              <svg
                className="jump-svg opacity-0"
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 27C15 27 3 18 3 9C3 3.5 7.5 1 12 1C14 1 16 2 18 4C20 2 22 1 24 1C28.5 1 33 3.5 33 9C33 18 21 27 15 27Z"
                  fill="#FF6B6B"
                />
              </svg>
            </div>
          </div>
          <div className="sm:block hidden flex-1">
            <p className="text-right text-xs md:text-xs lg:text-base italic">
              {currentDate}
            </p>
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
              y1="5.5"
              x2="100"
              y2="5.5"
              stroke="black"
              strokeWidth="3"
            />
          </svg>
          <h6 className=" title-text text-xs md:text-base  lg:text-lg text-center font tracking-[0.1rem] md:tracking-[0.2rem]">
            “Art is never finished, only abandoned”
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
        <div className="flex flex-row-reverse relative md:hidden -top-36 justify-between w-full ">
          <div className=" ">
            <h4
              className="text-left  hidden md:block  italic text-xs md:text-xs lg:text-base self-start"
              role="text"
            >
              {currentDate}
            </h4>
          </div>

          <div className=" ">
            <h4 className=" text-[#DC2625] underline text-right underline00 text-xs md:text-xs lg:text-base italic ">
              <Link href="/" className="hover:opacity-70 transition-opacity">
                Previous Page{" "}
              </Link>
            </h4>
          </div>
        </div>
      </div>
    </section>
  );
}
