"use client";
import React, { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LazyImageTrail from "components/LazyImageTrail";
import Tyre from "components/Tyre";

gsap.registerPlugin(ScrollTrigger);

export default function Section5() {
  useEffect(() => {
    // Select all divs with the class "float-div"
    const floatDivs = document.querySelectorAll(".float-div");
    const floaterDivs = document.querySelectorAll(".floater-div");
    const floateyDivs = document.querySelectorAll(".floatey-div");

    // Loop through each div and apply the animation
    floatDivs.forEach((div, index) => {
      const direction = index % 2 === 0 ? "up" : "down"; // Alternate direction
      animateFloat(div, direction);
    });
    floaterDivs.forEach((div, index) => {
      const direction = index % 2 === 0 ? "up" : "down"; // Alternate direction
      animateFloater(div, direction);
    });
    floateyDivs.forEach((div, index) => {
      const direction = index % 2 === 0 ? "up" : "down"; // Alternate direction
      animateFloatey(div, direction);
    });
  }, []); // Empty dependency array ensures this runs once on mount

  // Function to animate the floating effect
  const animateFloat = (element, direction) => {
    const yValue = direction === "up" ? -80 : 80; // Move up by -50px or down by 50px
    gsap.to(element, {
      y: yValue, // Vertical movement
      scrollTrigger: {
        trigger: element, // The element itself triggers the animation
        start: "top bottom", // Start when the top of the div hits the bottom of the viewport

        end: "bottom top", // End when the bottom of the div hits the top of the viewport
        scrub: true, // Smoothly ties the animation to scroll position
      },
    });
  };
  const animateFloater = (element, direction) => {
    const xValue = direction === "up" ? 360 : -360; // Move right by 100px or left by -100px
    gsap.to(element, {
      x: xValue, // Horizontal movement
      scrollTrigger: {
        trigger: element, // The element itself triggers the animation
        start: "top 10%", // Start when the top of the div hits the bottom of the viewport
        scrub: true, // Smoothly ties the animation to scroll position
      },
    });
  };

  const animateFloatey = (element, direction) => {
    const xValue = direction === "up" ? -360 : 360; // Move right by 100px or left by -100px
    gsap.to(element, {
      x: xValue, // Horizontal movement
      scrollTrigger: {
        trigger: element, // The element itself triggers the animation
        start: "top 10%", // Start when the top of the div hits the bottom of the viewport
        scrub: true, // Smoothly ties the animation to scroll position
      },
    });
  };

  return (
    <section className="h-[100vh] px-[2.5rem] md:px-[3rem] lg:px-[4.15rem]  py-[1.3rem]  w-[100%] h-auto justify-center items-center align-center">
      <div className="flex gap-3 md:gap-1 flex-col">
        <div className="flex justify-between flex-row">
          <div className="self-center  sm:block hidden  w-[25%] h-auto">
            <div className="grid w-full pb-2 grid-cols-2">
              <h5 className="text-left whitespace-nowrap italic text-black-500 text-xs text-xs">From</h5>
              <p className="text-right whitespace-nowrap underline italic text-[#EB8E41] text-xs">
                <a
                  href="https://www.davidsipress.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#EB8E41]"
                >
                  David Sipress
                </a>
              </p>
            </div>
            <div className="">
              <LazyImageTrail imageSrc="./images/cartoon4.webp" />
              <div className="flex flex-row justify-between">
                <Tyre />
                <Tyre />
              </div>
            </div>
          </div>
          <div className=" w-[70%] md:w-[40%] h-auto">
            <div className="grid w-full pb-2 grid-cols-2">
              <h5 className="text-left whitespace-nowrap italic text-black-500 text-xs text-xs">From</h5>
              <p className="text-right underline whitespace-nowrap italic text-[#EB8E41] text-xs">
                <a
                  href="https://www.paulnoth.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#EB8E41]"
                >
                  Paul Noth
                </a>
              </p>
            </div>
            <LazyImageTrail imageSrc="./images/cartoon01.webp" />
          </div>
        </div>
        <div className="flex justify-between flex-row-reverse">
          <div className="self-center  sm:block hidden w-[25%] h-auto">
            <div className="grid w-full pb-2 grid-cols-2">
              <h5 className="text-left whitespace-nowrap italic text-black-500 text-xs text-xs">From</h5>
              <p className="text-right whitespace-nowrap italic underline text-[#EB8E41] text-xs">
                <a
                  href="https://en.wikipedia.org/wiki/Charles_Barsotti"
                  target="_blank"
                  rel="noopener noreferrer"
                  className=""
                >
                 Charles Barsotti
                </a>
              </p>
            </div>
            <div className="">
              <LazyImageTrail imageSrc="./images/cartoon3.webp" />
              <div className="flex flex-row justify-between">
                <Tyre />
                <Tyre />
              </div>
            </div>
          </div>
          <div className=" w-[70%] md:w-[40%] h-auto">
            <div className="grid w-full pb-2 grid-cols-2">
              <h5 className="text-left whitespace-nowrap italic text-black-500 text-xs text-xs">From</h5>
              <p className="text-right whitespace-nowrap italic underline text-[#EB8E41] text-xs">
                <a
                  href="https://en.wikipedia.org/wiki/Zach_Kanin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#EB8E41]"
                >
                  Zach Kanin
                </a>
              </p>
            </div>
            <LazyImageTrail imageSrc="./images/cartoon2.webp" />
          </div>
        </div>
        <div className="flex flex-row"></div>
      </div>
    </section>
  );
}
