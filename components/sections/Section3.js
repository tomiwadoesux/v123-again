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
gsap.registerPlugin(TextPlugin);
import axios from "axios";

async function sendMailerLiteEmail({ to, subject, html }) {
  const apiKey = process.env.MAILERLITE_API_KEY;
  const response = await axios.post(
    "https://api.mailerlite.com/api/v2/email/send",
    {
      to,
      subject,
      html,
      from: "your_verified_sender@yourdomain.com",
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-MailerLite-ApiKey": apiKey,
      },
    }
  );
  return response.data;
}

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

      <div className="  px-[2.5rem] pt-2  md:px-[3rem] lg:px-[4.15rem] ">
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
        </div>
        <div className="flex flex-col md:flex-row  gap-0 md:gap-4 ">
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
              <h4 className="text-xs pt-0 pb-2 md:pt-4 md:text-sm lg:text-base text-justify dropcap">
                This project is pretty simple: it uses{" "}
                <span ref={newsRef}>{splitText("Hugging Face AI")}</span> to
                summarize the latest{" "}
                <span ref={gifRef}>{splitText("news articles")}</span> that it gets from The Guardian RSS and
                delivers them to your inbox daily or weekly. Get the most
                important stories without the noise, all powered by AI to keep
                you informed effortlessly.{" "}
                <span ref={memeRef}>{splitText("Stay updated ;)")}</span>
              </h4>

              <Button
                className=""
                text="Subscribe Here"
                background="#DC2625"
                color="#F4F2EC"
              />
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
              className="text-xl text-center lg:text-left text-[#DC2625] pb-1 pt-2 lg:text-3xl relative flex items-center justify-center"
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
                  content=" Yo'u are the constant object of my thoughts',
he wrote to his wife from abroad. 'My imagination exhausts itself in guessing what you are doing'.
 His generals saw him distracted: he would leave
meetings early, spend hours writing letters, or stare at the miniature of
Josephine he wore around his neck."
                  color="black"
                  className=""
                />
                <Author
                  from="The Art of Seduction"
                  author="Robert Greene"
                  color="#DC2625"
                />{" "}
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
                <Author
                  from="Her World Within"
                  author="Robert Greene"
                  color="#DC2625"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="   pt-6 px-[2.5rem] md:px-[3rem] lg:px-[4.15rem] ">
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
        <div className="pb-2 md:pb-4 pt-4">
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

        <div className="flex flex-col md:flex-row gap-1 md:gap-2 lg:gap-3 ">
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
                    className=" hover:text-[#DC2625]"
                  >
                    Titanic
                  </a>
                </p>
              </div>
            </div>

            <NormalText
              className="pt-2"
              content="Another who fell under his spell, explained his magic: “Perhaps the most remarkable lover of our time is
               Gabriele D'Annunzio.” And this not withstanding that he is small, bald, and, except when his face lights up with
                enthusiasm, ugly But when he speaks to a woman he likes, his face is transfigured, so that he suddenly becomes 
                Apollo..He seemed to know each woman's weakness: one he would call a goddess of nature, another an incomparable
                 artist in the making, another a romantic figure out of a novel.  "
              color="black"
            />

            <Author
              from="The art of Seduction"
              author="Robert Greene"
              color="#DC2625"
            />
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

          <div className=" flex flex-1 h-[60%] flex-col gap-2">
            <div className="pt-3 md:pt-0">
              <h1 className="text-xl pb-2 text-center lg:text-left p-0 text-[#DC2625] md:text-2xl lg:text-3xl">
                <span ref={changerTextRef}>HE'S A</span> LOVER
              </h1>
              <div className="flex  flex-row gap-3 md:flex-col ">
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
                    color="#DC2625"
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
                  <Author
                    from="The Bible"
                    author="SOS 4:10-12"
                    color="#DC2625"
                  />
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

          <div className=" pt-3 md:pt-0 flex flex-1 flex-col gap-2">
            <div>
              <h1 className="text-xl pb-2 text-center lg:text-left p-0 text-[#DC2625] md:text-2xl lg:text-3xl">
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
                color="#DC2625"
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
                      className=" hover:text-[#DC2625]"
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
