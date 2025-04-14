"use client";
import { NormalText } from "/components/NormalText";
import { HeaderText } from "/components/HeaderText";
import gsap from "gsap";
import { Author } from "/components/Author";
import { useLayoutEffect, useRef, useEffect } from "react";
import Image from "next/image";
import { TextPlugin } from "gsap/TextPlugin";
import { Button } from "/components/Button";
import Link from "next/link";
import Muah from "/components/Muah";
import { Scroll } from "/components/Scroll";
import LazyImageTrail from "/components/LazyImageTrail";
// import ThreeSection from "components/ThreeSection";

gsap.registerPlugin(TextPlugin);

export default function Section3() {
  const newsRef = useRef(null);
  const memeRef = useRef(null);
  const gifRef = useRef(null);
  const changingTextRef = useRef(null);
  const changerTextRef = useRef(null);

  useEffect(() => {
    if (!changingTextRef.current) return;

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 });

    tl.to(changingTextRef.current, {
      text: "HIS",
      duration: 0.3,
      ease: "power1.inOut",
    })
      .to(changingTextRef.current, {
        duration: 2,
      })
      .to(changingTextRef.current, {
        text: "A",
        duration: 0.3,
        ease: "power1.inOut",
      });

    tl.to(changerTextRef.current, {
      text: "SHE'S HIS",
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

  return (
    <section>
      <div className="px-[2.5rem]  md:px-[4.15rem]">
        <Muah />
      </div>

      <div className="  px-[2.5rem]  md:px-[4.15rem] ">
        <div className="grid grid-row md:grid-cols-2  gap-[1.5rem] md:gap-[2rem] lg:gap-[4rem]">
          <div className=" h-[100%]">
            <HeaderText
              className="text-center"
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
          {/* <div className="">
            <div className="w-full  h-[60%]">
              <div className=" grid w-full pb-2 grid-cols-2 ">
                <p className="text-left whitespace-nowrap italic text-black-500 text-xs">
                  From
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
              </div>`
             
               <LazyImageTrail
                                className=" object-fit "
                                imageSrc="./images/lo.jpg"
                              />
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
          </div> */}

          <div className=" h-[100%] ">
            <h1 className="text-3xl text-center text-red-600 lg:text-4xl">
              SHE'S <span ref={changingTextRef}>A</span> LEOPARD
            </h1>
            <div className=" flex md:flex-col  gap-5 flex-row">
              <div className=" flex-1">
                <NormalText
                  content="Slumbering, I saw you again, we 
              sat alone..How simple, how sweet you smell..Let’s take care of our heart..Sake
               of the imagining world we hope within..Covered by art, you are the lines only I can 
               see yet how clear you are..But If I may be lost, leave me be with your heart..Let the sun
                caress the wrinkles of time off.. As the wind blown sand brush my face..Your heart, I lay my
                 head to rest on the bosom of my mother, earth..You require care, like how you would 
                 for your white sheet..You won’t prosecute, your response; how steady you feel when you
                 balance on a beam, the ease that is makeshift, the edge of surrender..But there it was,
                  my flower in front of your steps"
                  color="black"
                  className=""
                />
                <Author author="Ayotomcs" color="red" />
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

      <Scroll />

      <div className="  px-[2.5rem] pt-5 md:px-[4.15rem] ">
        <div className="grid grid-row md:grid-cols-3  gap-[1.5rem] md:gap-[2rem] lg:gap-[4rem]">
          <div className="">
            <div className="w-full ">
              <div className=" grid w-full pb-2 grid-cols-2 ">
                <p className="text-left whitespace-nowrap italic text-black-500 text-xs">
                  From
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

              <LazyImageTrail
                className=" object-fit "
                imageSrc="./images/lo.jpg"
              />
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

          <div className=" flex h-[60%] flex-col gap-2">
            <div>
              <h1 className="text-3xl text-center text-red-600 lg:text-4xl">
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
          <div className=" flex flex-col gap-2">
            <div>
              <HeaderText
                className=" relative text-center"
                content="WHAT HE MEANT"
                color="black"
              />
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
                <div className=" grid w-full pb-2 grid-cols-2 ">
                  <p className="text-left whitespace-nowrap italic text-black-500 text-xs">
                    From
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

                <LazyImageTrail
                  className=" object-fit "
                  imageSrc="./images/lo.jpg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
