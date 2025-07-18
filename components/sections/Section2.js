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
    <section>
      <div className="px-[2.5rem] md:px-[3rem] lg:px-[4.15rem] pb-2 md:pb-4 pt-4 ">
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

      <div className="block px-[2.5rem] md:hidden">
        <div className=" w-[100%] h-[auto] flex-row gap-9 md:w-full md:h-[full]">
          <div className="">
          <div className=" grid w-full pb-2 grid-cols-2 ">
                  <p className="text-left whitespace-nowrap italic text-black-500 text-xs">
                    @
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
          <div className="flex gap-2 pt-4 pb-4 flex-row">
            <div className="flex-1 flex">
              <div>
                <NormalText
                  content="     No screams, my ears thinking.. No screams, my hands thinking..There's a tone so
            organized, how ryhtimic..The long beard man vowed to labour who knows once told me..Beware, 
            we have loads to lift and hard work to
            do on the maps of the earth..You may find me not, i’m
            held captive for not wishing for more..Should I not be there to
            see?.. No screams, my hands thinking..But there's a"
                  color="black"
                />{" "}
                <Author author="Ayotomcs" color="red" />
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
                  content="The storm didn’t sustain for days, nor the rain..The happiness is not forever, nor the pain..
                They are the visitors, will come and go..You are an ancient forest here..please know: Sadness will dry 
                you, your tear will bring the rain..Still, you will remain here, unmoved and same..Rain will grow foliage 
                on your being..The storm will try to destroy everything..Still trust me, you are not a leaf, You are an ancient
                 forest..Drought is seasoning you..Bush fire is cleaning you..Storm is sweeping you..Everyone is helping you the best. "
                  color="black"
                />{" "}
                <Author author="Ayotomcs" color="red" />
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
                  className=" pt-1 h-[33.3%]"
                  content="     No screams, my ears thinking.. No screams, my hands thinking..There's a tone so
            organized, how ryhtimic..The long beard man vowed to labour who knows once told me..Beware, 
            we have loads to lift and hard work to
            do on the maps of the earth..You may find me not, i’m
            held captive for not wishing for more..Should I not be there to
            see?.. No screams, my hands thinking..But there's a"
                  color="black"
                />
                <Author author="Ayotomcs" color="red" />
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
                  content="     No screams, my ears thinking.. No screams, my hands thinking..There's a tone so
            organized, how ryhtimic..The long beard man vowed to labour who knows once told me..Beware, 
            we have loads to lift and hard work to
            do on the maps of the earth..You may find me not, i’m
            held captive for not wishing for more..Should I not be there to
            see?.. No screams, my hands thinking..But there's a"
                  color="black"
                />
                <Author author="Ayotomcs" color="red" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
