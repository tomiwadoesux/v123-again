"use client";
import { useLayoutEffect, useRef, useEffect } from "react";
import gsap from "gsap";
import { NormalText } from "components/NormalText";
import { HeaderText } from "components/HeaderText";
import { Author } from "components/Author";
import Image from "next/image";
import { Scroll } from "components/Scroll";
import { Button } from "components/Button";
import Hail from "components/Hail";


import { PutText } from "components/PutText";
import LazyImageTrail from "components/LazyImageTrail";


export default function Section1() {
  const newsRef = useRef(null);
  const memeRef = useRef(null);
  const gifRef = useRef(null);

  // Function to wrap each letter in a span
  const splitText = (text) =>
    text.split(" ").map((word, i) => (
      <span key={i} className="inline-block">
        {word.split(" ").map((char, j) => (
          <span key={j} className="inline-block">
            {char}
          </span>
        ))}
        &nbsp;
      </span>
    ));

  useLayoutEffect(() => {
    if (!newsRef.current || !memeRef.current || !gifRef.current) return;

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 4 });

    // Select all spans inside the words
    const newsLetters = newsRef.current.querySelectorAll("span");
    const memeLetters = memeRef.current.querySelectorAll("span");
    const gifLetters = gifRef.current.querySelectorAll("span");

    // Glitch effect: rapid color flicker
    tl.to([newsLetters, memeLetters, gifLetters], {
      color: "red",
      duration: 0.1,
      repeat: 5,
      yoyo: true,
      ease: "power2.inOut",
    }).to([newsLetters, memeLetters, gifLetters], {
      color: "black",
      duration: 0.1,
      repeat: 5,
      yoyo: true,
      ease: "power2.inOut",
    });
  }, []);

  return (
    <section>
      <div className=" px-[2.5rem] pt-[1.3rem] md:px-[4rem] h-full flex flex-col md:flex-row gap-[4rem] lg:gap-[4rem] md:gap-[2rem]">
        <div className="flex  flex-col gap-1 flex-1 h-[100%]">
          <HeaderText
            className="relative text-center"
            content="THE PLOT"
            color="red"
          />

          <div className=" w-full h-[10rem] bg-black h-[auto] flex ">
            <video
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="./videos/gifvid.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <h4 className="text-xs pt-4 md:text-[0.85rem] lg:text-base text-justify dropcap">
            This project is a simple and friendly service that sends you a daily
            or weekly email with quick {" "}
            <span ref={newsRef}>{splitText("News Articles Summaries")}</span> and a
            <span ref={memeRef}> {splitText("Meme")}</span> or
            <span ref={gifRef}> {splitText("GIF.")}</span>You choose your preferred category,
            and it delivers it summarized. It's all about making your news experience
            enjoyable and easy to read. (I don't like reading long articles)
          </h4>
          <Button className="" text="Subscribe Here" color="red" />
        </div>
        <div className="w-full hidden md:flex md:flex-1 lg:flex-2 h-[15rem] md:h-[100px] lg:h-[34rem] flex justify-center items-center bg-black ">
        <LazyImageTrail className=" w-full h-full "  />
        </div>
      </div>
      <Scroll />

      <PutText color="red" />

      <div className="flex bg-[#F4F2EC] px-[4rem] justify-center items-center h-full w-full">
      </div>
    </section>
  );
}
