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
      <div className="hidden md:block pt-8 px-[2.5rem] pt-[1.3rem] md:px-[4rem] lg:px-[4rem]">
        <div className=" h-[33.3%] grid overflow-hidden grid-row-3 md:grid-cols-2 lg:grid-cols-3 gap-9 md:gap-[2rem] lg:gap-[4rem]">
          <div className="  md:h-[29rem]">
            <div className=" grid w-full pb-2 grid-cols-2 ">
              <p className="text-left whitespace-nowrap italic text-black-500 text-xs">
                From
              </p>
              <p className="text-right whitespace-nowrap italic text-red-400 text-xs">
                <a
                  href="https://en.wikipedia.org/wiki/Twice_Born"
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" hover:text-red-600"
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

              <div>
                <div className=" grid w-full pb-2 grid-cols-2 ">
                  <p className="text-left whitespace-nowrap italic text-black-500 text-xs">
                    From
                  </p>
                  <p className="text-right whitespace-nowrap italic text-red-400 text-xs">
                    <a
                      href="https://en.wikipedia.org/wiki/Twice_Born"
                      target="_blank"
                      rel="noopener noreferrer"
                      className=" hover:text-red-600"
                    >
                      Twice Born
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <NormalText
              className=" h-[33.3%] pt-6"
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
          <div className="hidden lg:block flex flex-1 h-[95%] flex-col">
            <div className=" grid w-full pb-2 grid-cols-2 ">
              <p className="text-left whitespace-nowrap italic text-black-500 text-xs">
                From
              </p>
              <p className="text-right whitespace-nowrap italic text-red-400 text-xs">
                <a
                  href="https://en.wikipedia.org/wiki/Meet_Joe_Black"
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" hover:text-red-600"
                >
                  Meet Joe Black
                </a>
              </p>
            </div>

            {/* First Video - Plays on hover */}
            <div
              className="bg-black h-[25%]"
              onMouseEnter={() => handleMouseEnter(0)}
              onMouseLeave={() => handleMouseLeave(0)}
            >
              <video
                ref={videoRefs[0]}
                src="/videos/001.mp4"
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            {/* Second Video - Always autoplay */}
            <div className="bg-black h-[25%]">
              <video
                ref={videoRefs[1]}
                src="/videos/002.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            {/* Third Video - Plays on hover */}
            <div
              className="bg-black h-[25%]"
              onMouseEnter={() => handleMouseEnter(2)}
              onMouseLeave={() => handleMouseLeave(2)}
            >
              <video
                ref={videoRefs[2]}
                src="/videos/003.mp4"
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            {/* Fourth Video - Plays on hover */}
            <div
              className="bg-black h-[25%]"
              onMouseEnter={() => handleMouseEnter(3)}
              onMouseLeave={() => handleMouseLeave(3)}
            >
              <video
                ref={videoRefs[3]}
                src="/videos/004.mp4"
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className=" ">
            <NormalText
              className=" pt-3 "
              content="The storm didn’t sustain for days, nor the rain..The happiness is not forever, nor the pain..
              They are the visitors, will come and go..You are an ancient forest here..please know: Sadness will dry 
              you, your tear will bring the rain..Still, you will remain here, unmoved and same..Rain will grow foliage 
              on your being..The storm will try to destroy everything..Still trust me, you are not a leaf, You are an ancient
               forest..Drought is seasoning you..Bush fire is cleaning you..Storm is sweeping you..Everyone is helping you the best. "
              color="black"
            />
            <Author author=" Md. Firoj Alam" color="red" />
            <div>
              <div className="pt-2">
                <div className=" grid w-full pb-2 grid-cols-2 ">
                  <p className="text-left whitespace-nowrap italic text-grey-400 text-xs">
                    <a
                      href="https://en.wikipedia.org/wiki/Princess_Mononoke"
                      target="_blank"
                      rel="noopener noreferrer"
                      className=" hover:text-black"
                    >
                      From
                    </a>{" "}
                  </p>
                  <p className="text-right whitespace-nowrap italic text-red-400 text-xs">
                    <a
                      href="https://en.wikipedia.org/wiki/Princess_Mononoke"
                      target="_blank"
                      rel="noopener noreferrer"
                      className=" hover:text-red-600"
                    >
                      Princess Mononoke
                    </a>
                  </p>
                </div>
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
      </div>
      <div className="block px-[2.5rem] md:hidden">
        <div className=" w-[100%] h-[auto] flex-row gap-9 md:w-full md:h-[full]">
          <div className="bg-black">
            <LazyImageTrail
              className=" object-fit flex-1"
              imageSrc="./images/002.png"
            />
          </div>
          <div className="flex gap-5 pt-4 pb-4 flex-row">
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
          <div className="bg-black">
            <LazyImageTrail
              className=" object-fit flex-1"
              imageSrc="./images/002.png"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
