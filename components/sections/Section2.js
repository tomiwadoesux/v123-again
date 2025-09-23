"use client";
import { NormalText } from "components/NormalText";
import { Author } from "components/Author";
import Image from "next/image";
import { useRef, useState } from "react";
import { Scroll } from "components/Scroll";
import LazyImageTrail from "components/LazyImageTrail";

export default function Section2() {
  const videoRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const handleMouseEnter = (index) => {
    const video = videoRefs[index]?.current;
    if (video) video.play();
  };

  const handleMouseLeave = (index) => {
    const video = videoRefs[index]?.current;
    if (video) video.pause();
  };

  return (
    <section className="pt-4">
      <div className="block px-[2.5rem] md:hidden">
        <div className=" w-[100%] h-[auto] flex-row gap-9 md:w-full md:h-[full]">
          <div className="">
            <div className=" grid w-full pb-2 grid-cols-2 ">
              <p className="text-left whitespace-nowrap italic text-black-500 text-xs">
                from
              </p>
              <p className="text-right whitespace-nowrap italic text-red text-xs">
                <a
                  href="https://en.wikipedia.org/wiki/Twice_Born"
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" underline hover:text-red"
                >
                  Twice Born
                </a>
              </p>
            </div>
            <LazyImageTrail
              className=" object-fit flex-1"
              imageSrc="./images/002.png"
            />
          </div>
          <div className="flex gap-2 pt-7 md:pt-4 pb-4 flex-row">
            <div className="flex-1 flex">
              <div>
                <NormalText
                  content=" Steal from anywhere that resonates with inspiration or fuels your imagination. Devour old films, new films, music, books, paintings, photographs, poems, dreams, random conversations, architecture, bridges, street signs, trees, clouds, bodies of water, light and shadows. Select only things to steal from that speak directly to your soul. If you do this, your work (and theft) will be authentic."
                  color="black"
                />{" "}
                <Author
                  from="Steal Like An Artist"
                  author="Jim Jarmusch"
                  color="#EB8E41
                 "
                />
              </div>
            </div>
            <div className=" w-fit">
              <svg
                width="10"
                height="100%"
                viewBox="0 0 10 50"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                <line
                  x1="5"
                  y1="0"
                  x2="5"
                  y2="50"
                  stroke="black"
                  strokeWidth="1"
                />
              </svg>
            </div>
            <div className="flex-1 flex">
              <div>
                <NormalText
                  content="Works of art are of an infinite loneliness, and with nothing to be so little reached as with criticism. Only love can grasp and hold and fairly judge them. Always trust yourself and your own feeling, as opposed to argumentations, discussions, or introductions of that sort; if it turns out that you are wrong, then the natural growth of your inner life will eventually guide you to other insights. "
                  color="black"
                />{" "}
                <Author
                  from="Letters to a Young Poet"
                  author="Rainer Maria Rilke"
                  color="#EB8E41"
                />
              </div>
            </div>
          </div>
          <div className="">
            <div className=" grid w-full pb-2 grid-cols-2 ">
              <p className="text-left whitespace-nowrap italic text-black-500 text-xs">
                @
              </p>
              <p className="text-right whitespace-nowrap italic text-red text-xs">
                <a
                  href="https://www.instagram.com/feliciathegoat/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" underline hover:text-red"
                >
                  feliciathegoat
                </a>
              </p>
            </div>
            <LazyImageTrail
              className=" object-fit flex-1"
              imageSrc="./images/007.webp"
            />
          </div>
        </div>
      </div>

      <div className=" px-[2.5rem] md:px-[3rem] lg:px-[4.15rem] pt-4 hidden md:block lg:hidden flex flex-col"></div>
      <div className="hidden md:block">
        <div className="flex gap-4 px-[4.15rem]  flex-row">
          <div className=" flex-1">
            <div className=" gap-2 flex flex-col ">
              <div>
                <NormalText
                  content=" Steal from anywhere that resonates with inspiration or fuels your imagination. Devour old films, new films, music, books, paintings, photographs, poems, dreams, random conversations, architecture, bridges, street signs, trees, clouds, bodies of water, light and shadows. Select only things to steal from that speak directly to your soul. If you do this, your work (and theft) will be authentic."
                  color="black"
                />{" "}
                <Author
                  from="Steal Like An Artist"
                  author="Jim Jarmusch"
                  color="#EB8E41
                 "
                />
              </div>
              <div>
                <div className=" grid w-full pb-2 grid-cols-2 ">
                  <p className="text-left whitespace-nowrap italic text-black-500 text-xs">
                    From
                  </p>
                  <p className="text-right whitespace-nowrap italic text-red text-xs">
                    <a
                      href="https://en.wikipedia.org/wiki/Twice_Born"
                      target="_blank"
                      rel="noopener noreferrer"
                      className=" underline hover:text-red"
                    >
                      Twice Born
                    </a>
                  </p>
                </div>
                <div className=" w-[70%] h-[full] md:w-full ">
                  <div className="bg-black">
                    <LazyImageTrail
                      className=" object-fit "
                      imageSrc="./images/002.png"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=" w-fit">
            <svg
              width="10"
              height="100%"
              viewBox="0 0 10 50"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <line
                x1="5"
                y1="0"
                x2="5"
                y2="50"
                stroke="black"
                strokeWidth="1"
              />
            </svg>
          </div>
          <div className="hidden lg:block  flex-1">
            <div className=" gap-2  flex flex-col ">
              <div>
                <div className=" grid w-full pb-2 grid-cols-2 ">
                  <p className="text-left whitespace-nowrap italic text-black-500 text-xs">
                    From
                  </p>
                  <p className="text-right whitespace-nowrap italic text-red text-xs">
                    <a
                      href="https://en.wikipedia.org/wiki/High_Fidelity_(TV_series)"
                      target="_blank"
                      rel="noopener noreferrer"
                      className=" underline hover:text-red"
                    >
                      High Fidelity
                    </a>
                  </p>
                </div>
                <div className=" w-[70%] h-[full] md:w-full ">
                  <div className="bg-black">
                    <LazyImageTrail
                      className=" object-fit "
                      imageSrc="./images/008.webp"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=" hidden lg:block  w-fit">
            <svg
              width="10"
              height="100%"
              viewBox="0 0 10 50"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <line
                x1="5"
                y1="0"
                x2="5"
                y2="50"
                stroke="black"
                strokeWidth="1"
              />
            </svg>
          </div>
          <div className=" flex-1">
            <div className=" gap-2 flex flex-col ">
              <div>
                <div className=" grid w-full pb-2 grid-cols-2 ">
                  <p className="text-left whitespace-nowrap italic text-black-500 text-xs">
                    @
                  </p>
                  <p className="text-right whitespace-nowrap italic text-red text-xs">
                    <a
                      href="https://www.instagram.com/feliciathegoat/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className=" underline hover:text-red"
                    >
                      feliciathegoat
                    </a>
                  </p>
                </div>
                <div className=" w-[70%] h-[full] md:w-full ">
                  <div className="bg-black">
                    <LazyImageTrail
                      className=" object-fit "
                      imageSrc="./images/007.webp"
                    />
                  </div>
                </div>
              </div>
              <div>
                <NormalText
                  className=" pt-1 h-[33.3%]"
                  content="   Works of art are of an infinite loneliness, and with nothing to be so little reached as with criticism. Only love can grasp and hold and fairly judge them. Always trust yourself and your own feeling, as opposed to argumentations, discussions, or introductions of that sort; if it turns out that you are wrong, then the natural growth of your inner life will eventually guide you to other insights."
                  color="black"
                />
                <Author
                 from="Letters to a Young Poet"
                  author="Rainer Maria Rilke"
                  color="#EB8E41"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-[2.5rem] md:px-[3rem] lg:px-[4.15rem] pb-2 md:pb-4 pt-3 md:pt-6 ">
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
            y1="2"
            x2="100"
            y2="2"
            stroke="black"
            strokeWidth="2"
          />
          <line
            className="svg-line"
            x1="0"
            y1="5.5"
            x2="100"
            y2="5.5"
            stroke="black"
            strokeWidth="0.6"
          />
        </svg>
      </div>
    </section>
  );
}
