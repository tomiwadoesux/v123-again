"use client";
import { NormalText } from "components/NormalText";
import { HeaderText } from "components/HeaderText";
import gsap from "gsap";
import { Author } from "components/Author";
import { useLayoutEffect, useRef, useEffect } from "react";
import Image from "next/image";
import { TextPlugin } from "gsap/TextPlugin";
import { Button } from "components/Button";
import Link from "next/link";
import Muah from "components/Muah";
import { Scroll } from "components/Scroll";
import LazyImageTrail from "components/LazyImageTrail";
import Section99 from "./Section99";

// import ThreeSection from "components/ThreeSection";

gsap.registerPlugin(TextPlugin);

export default function Section3() {
  const newsRef = useRef(null);
  const memeRef = useRef(null);
  const gifRef = useRef(null);
  const changerTextRef = useRef(null);
  const swanTextRef = useRef(null);
  const emojiRef = useRef(null);

  useEffect(() => {
    if (!changerTextRef.current) return;

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });


    tl.to(changerTextRef.current, {
      text: "MAYBE HER",
      duration: 0.6,
      ease: "power1.inOut",
    })
      .to(changerTextRef.current, {
        duration: 2,
      })
      .to(changerTextRef.current, {
        text: "HE'S A",
        duration: 0.4,
        ease: "power1.inOut",
      });
  }, []);

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

  useEffect(() => {
    if (!swanTextRef.current || !emojiRef.current) return;

    const moveDistance = 110; // px, adjust as needed

    const animate = () => {
      // Reset to original position, facing right
      gsap.set(emojiRef.current, {
        x: 0,
        scaleX: -1,
      });

      const tl = gsap.timeline();

      // Flip to face left, then move left
      tl.to(emojiRef.current, {
        scaleX: 1,
        duration: 0.3,
        ease: "power2.inOut",
      });
      tl.to(
        emojiRef.current,
        {
          x: -moveDistance,
          duration: 0.6,
          ease: "power2.inOut",
        },
        ">"
      );

      // Pause, then flip to face right and move back
      tl.to(
        emojiRef.current,
        {
          scaleX: -1,
          duration: 0.3,
          ease: "power2.inOut",
        },
        "+=1"
      );
      tl.to(
        emojiRef.current,
        {
          x: 0,
          duration: 0.6,
          ease: "power2.inOut",
        },
        ">"
      );
    };

    animate();
    const interval = setInterval(animate, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section>
      <div className="px-[2.5rem] md:px-[3rem] lg:px-[4.15rem]">
        <Muah />
      </div>

      <div className="  px-[2.5rem] pt-5  md:px-[3rem] lg:px-[4.15rem] ">
        <div className="relative -top- md:-top-0">
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
              strokeWidth="0.8"
            />
          </svg>

          <div className="">
            <svg
              width="35"
              height="20"
              viewBox="0 0 42 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 13H41"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M6 20H41"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M6 27H41"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M22 6L41 6"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <g clipPath="url(#clip0_221_20)">
                <mask
                  id="mask0_221_20"
                  style={{ maskType: "luminance" }}
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                >
                  <path d="M20 0H0V20H20V0Z" fill="white" />
                </mask>
                <g mask="url(#mask0_221_20)">
                  <path
                    d="M13.7003 2.58301C12.192 2.58301 10.842 3.31634 10.0003 4.44134C9.15866 3.31634 7.80866 2.58301 6.30033 2.58301C3.74199 2.58301 1.66699 4.66634 1.66699 7.24134C1.66699 8.23301 1.82533 9.14967 2.10033 9.99967C3.41699 14.1663 7.47533 16.658 9.48366 17.3413C9.76699 17.4413 10.2337 17.4413 10.517 17.3413C12.5253 16.658 16.5837 14.1663 17.9003 9.99967C18.1753 9.14967 18.3337 8.23301 18.3337 7.24134C18.3337 4.66634 16.2587 2.58301 13.7003 2.58301Z"
                    fill="#FF1212"
                  />
                </g>
              </g>
              <defs>
                <clipPath id="clip0_221_20">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
        <div className="flex flex-col md:flex-row  gap-2 md:gap-4 ">
          <div className=" h-[100%]">
            <HeaderText
              className="text-left md:text-center pb-1 pt-2"
              content="THE PLOT"
              color="black"
            />
            <div className="">
              <div className="≈ block pb-4 md:hidden flex-2">
                <div className="w-full md:flex-2  h-[15rem] md:h-[100] lg:h-[35rem] flex  ">
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
              </div>

              <h4 className="  text-xs md:text-[0.85rem] lg:text-base text-justify dropcap">
                I keep forgetting this is a website, ohh...ohh...You get to pick
                the
                <span ref={newsRef}>{splitText(" News Category")}</span>and
                decide if you want
                <span ref={memeRef}> {splitText("Memes")}</span> or
                <span ref={gifRef}> {splitText("GIFs")}</span>sent to your mail
                daily with <span ref={gifRef}> {splitText("No Spam")}</span> and
                the option to unsubscribe anytime. The news comes from the{" "}
                <span ref={gifRef}> {splitText(" New York Times")}</span>, and
                the memes and GIFs are powered by{" "}
                <span ref={gifRef}> {splitText(" Giphy.")}</span>Thanks for
                reading.
              </h4>
              <Button text="Subscribe Here" color="red" />
            </div>
            <div className="w-full sm:block hidden bg-black h-[50%]">
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
          </div>
          <div className=" hidden md:block w-fit">
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
          <div className="md:hidden ">
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
                strokeWidth="0.6"
              />
            </svg>
          </div>

          <div className=" h-[100%] ">
            <h1
              ref={swanTextRef}
              className="text-xl text-center lg:text-left text-red-600 pb-1 pt-2 lg:text-3xl relative flex items-center justify-center"
            >
              THE SWAN
              <span
                ref={emojiRef}
                className="swan-emoji text-2xl ml-2 inline-block -z-10"
                style={{
                  pointerEvents: "none",
                  display: "inline-block",
                }}
              >
                🦢
              </span>
            </h1>
            <div className=" flex md:flex-col gap-3 md:gap-2 flex-row">
              <div className=" flex-1">
                <NormalText
                  content="Slumbering, I saw you again, we 
              sat alone..How simple, how sweet you smell..Let’s take care of our heart..Sake
               of the imagining world we hope within.. Covered by art, like the lines only I can 
               see yet how clear you are..But If I may be lost, leave me be with your heart.. Alone.. Let the heat of the sun
                caress the wrinkles of time off off me As the wind blown sand brush my face leaving me defunct.. But I be with
                 your heart, how can I be defunct then?.. You require care, like how you would 
                 for your white sheet..You won’t fret.. your response? how steady you feel right when you
                 balance on a beam, the ease that annihilate the panic, the ease that is makeshift just at the edge of surrender..But there it was,
                  my flowers at your steps, unfresh"
                  color="black"
                  className=""
                />
                <Author author="Ayotomcs" color="red" />
              </div>
              <div className="  md:hidden  w-fit">
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
             
              <div className=" self-start flex-1">
                <NormalText
                  content="No one knew the struggle..The daily chaos from which she emerged to reach work..The 
              chapter she closed before she began another..Drowning the self in the intensity of work..Experiencing 
              the momentary pleasure of something well done..This was her only relief..No one knew the labyrinth 
              in which she was struggling to keep afloat..The puzzle she was trying to complete..Her world within was only hers. "
                  color="black"
                />
                <Author author="Her world within" color="red" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="   pt-5 px-[2.5rem] md:px-[3rem] lg:px-[4.15rem] ">
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
            strokeWidth="0.8"
          />
        </svg>
        <div>
          <Section99 />
        </div>
        <div className="pb-4">
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
              strokeWidth="0.8"
            />
            <line
              className="svg-line"
              x1="0"
              y1="5.5"
              x2="100"
              y2="5.5"
              stroke="black"
              strokeWidth="2"
            />
          </svg>
        </div>

        <div className="flex flex-col md:flex-row gap-1 md:gap-3 ">
          <div className=" flex-1">
            <div className="w-full ">
              <LazyImageTrail
                className=" object-fit "
                imageSrc="./images/009.webp"
              />
              <div className=" grid w-full pb-2 grid-cols-2 ">
                <p className="text-left whitespace-nowrap italic text-black-500 text-xs">
                  From
                </p>
                <p className="text-right underline whitespace-nowrap italic text-red-400 text-xs">
                  <a
                    href="https://en.wikipedia.org/wiki/Titanic_(1997_film)"
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" hover:text-red-600"
                  >
                    Titanic
                  </a>
                </p>
              </div>
            </div>

            <NormalText
              className="pt-5"
              content="Another who fell under his spell, explained his magic: “Perhaps the most remarkable lover of our time is
               Gabriele D'Annunzio.” And this not withstanding that he is small, bald, and, except when his face lights up with
                enthusiasm, ugly But when he speaks to a woman he likes, his face is transfigured, so that he suddenly becomes 
                Apollo..He seemed to know each woman's weakness: one he would call a goddess of nature, another an incomparable
                 artist in the making, another a romantic figure out of a novel.  "
              color="black"
            />

            <Author author="The art of sedcution" color="red" />
          </div>
          <div className=" hidden md:block w-fit">
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
          <div className="md:hidden ">
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
                strokeWidth="0.6"
              />
            </svg>
          </div>
          <div className=" flex flex-1 h-[60%] flex-col gap-2">
            <div>
              <h1 className="text-xl pb-2 text-center lg:text-left p-0 text-red-600 md:text-2xl lg:text-3xl">
                <span ref={changerTextRef}>HE'S A</span> LOVER
              </h1>
              <div className="flex  flex-row gap-5 md:flex-col ">
                <div className="flex-1">
                  <NormalText
                    content="I love you, So it is enough for me To be near you every now and again..I love you, So it is 
                enough To have a glimpse of your shining beauty, That will never wane..I love you, so I love God and his 
                Universe, the land and the grain, You are the color of the autumn, the cleanness of the first snow..The 
                sweetness of the spring..and the softness of a summer rain."
                    color="black"
                  />
                  <Author
                    from="i love you"
                    author="Sherif Okasha"
                    color="red"
                  />
                </div>
                <div className=" md:hidden w-fit">
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
              
                <div className="flex-1">
                  <NormalText
                    content="Your love is better than wine, your perfume more fragrant than spices. Your lips are sweet as nectar, my bride. Honey
                and milk are under your tongue. Your clothes are scented like the cedars of Lebanon. You
                are my private garden, my treasure, my bride, a secluded spring, a hidden fountain."
                    color="black"
                    className=""
                  />
                  <Author from="The Bible" author="SOS 4:10-12" color="red" />
                </div>
              </div>
              <div className="hidden lg:block h-20"></div>
            </div>
          </div>
          <div className=" hidden md:block w-fit">
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
          <div className="md:hidden ">
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
                strokeWidth="0.6"
              />
            </svg>
          </div>
          <div className=" flex flex-1 flex-col gap-2">
            <div>
              <h1 className="text-xl pb-2 text-center lg:text-left p-0 text-red-600 md:text-2xl lg:text-3xl">
                What He Meant
              </h1>
              <NormalText
                content="I have sought your image without knowledge of your existence, My ideal woman you
             are..So come with me..Please..Be with me and share your life..Create life we will, and together we’ll
             be trustees of another..Come with me and I will pick a red hibiscus for your hair, and the 
             sweet magnolia flower as your perfume’s fragrance..I’ll promise
             nothing except to be with you..And be for you as long as we live..Under the watchful eyes of the stars."
                color="black"
              />
              <Author
                from="will you come with me"
                author="Frederick Douglas Harper "
                color="red"
              />
              <div className="w-full ">
                <LazyImageTrail
                  className=" pt-3 object-fit "
                  imageSrc="./images/lo.jpg"
                />
                <div className=" grid w-full pb-2 grid-cols-2 ">
                  <p className="text-left whitespace-nowrap italic text-black-500 text-xs">
                    From
                  </p>
                  <p className="text-right underline whitespace-nowrap italic text-red-400 text-xs">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
