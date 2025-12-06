"use client";
import { useLayoutEffect, useRef, useEffect } from "react";
import gsap from "gsap";
import { NormalText } from "components/NormalText";
import { HeaderText } from "components/HeaderText";
import { Author } from "components/Author";
import Image from "next/image";
import { AsciiScatter } from "components/Ascii";
import { Button } from "components/Button";
import Hail from "components/Hail";

import { PutText } from "components/PutText";
import LazyImageTrail from "components/LazyImageTrail";
import { Scroll2 } from "components/Scroll2";

export default function Section1() {
  const newsRef = useRef(null);
  const memeRef = useRef(null);
  const gifRef = useRef(null);

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
      color: "#EB8E41",
      duration: 0.4,
      repeat: 8,
      yoyo: true,
      ease: "power2.inOut",
    })
      .to([newsLetters, memeLetters, gifLetters], {
        color: "#EB8E41",
        duration: 0.4,
        repeat: 8,
        yoyo: true,
        ease: "power2.inOut",
      })
      .to([newsLetters, memeLetters, gifLetters], {
        color: "black",
        duration: 0.4,
        repeat: 5,
        yoyo: true,
        ease: "power2.inOut",
      });
  }, []);

  return (
    <section>
      <div className="w-[100vw] -mt-10 md:mt-0 ">
        <div className=" px-[2.5rem] w-[100%] md:px-[3rem] lg:px-[4.15rem] h-full flex flex-col md:flex-row gap-9 lg:gap-[1rem] md:gap-[1rem]">
          <div className="flex  flex-col gap-1 flex-1 h-[100%]">
            <HeaderText
              className="relative p-0 pb-2 md:pb-0 text-center"
              content="THE PLOT"
              color="#EB8E41"
            />
            <div className="hidden lg:block">
              <div className=" flex-col flex ">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <AsciiScatter
                    ascii={`=====================-------------------------------------------------======================
==================------------------------------------------------------=-=====-============
================-------------------------==+****++=------------------------====--====-======
==============-----------------------=#%@@@@@@@@@@@@@%*=--------------------==-=============
=============----------------------+@@@@%#@@@@@@@@@@@@@@%+--------------------==============
============---------------------=%@@@@@*%@@@@@@@@@@@@@@@@%=-------------------=============
==========----------------------+@%*=---------+#%@@@@@@@@@@@*-------------------============
=========----------------------#@#=------------=+*%@@@@@@@@@@*-------------------===========
========----------------------=@%=--------------++*@@@@@@@@@@@+-------------------==========
========---------------------#%@*=-------------===++*%@@@@@@@@%=-------------------=========
=======---------------------#@@@==------------------=#@@@@@@@@@*--=---=--=----------========
===++==-----=+=------------+@@@@------------==-----==*%@@@@@@@@@--=====++++---------========
+++++++====++++=====-------#@@@@=+++++=--=+******++*++#@@@@@@@@@++++++++++++---------=======
***+++++++++++++++++=------+@@@@*#+%@*+--+*+=*@@++*===+@@@@@@@@@@+++++++++*+=--------======+
***+++++++++++++++++=--=---+@@@@--==+=---==--=++=----=*@@@@@@@@@@*****++++**+=-------=====+*
**+++++++++***+**+++==+**+*%@@@@--------===--------==+%@@@@@@@@@@#*******+***+=-=========+**
**+++++++++***************#@@@@@=-------===------===+*%@@@@@@@@@@%************+==========+**
*++++++++*****************%@@@@@%=--------------===++*%@@@@@@@@@@%+=============++++++++++++
##*********************###@@@@@@@+===-+*##*---====+++*%@@@@@@@@@@@%##**********************#
####*****************#####%@@@@@@%=======+==+=====+++*%@@@@@@@@@@@%#####*****************###
#####*************########%@@@@@@@#====+++++======++*#@@@@@@@@@@@@@######***************####
######***********#########%@@@@@@@@%+==-=========+*+#%%@@@@@@@@@@@@#****************########
#######**********#########%@@@@@@@@@@#=----===+++*##**%@@@@@@@@@@@@#*********************###
########*****************+*@@@@@@@@@@@%*=+++***###*#**%@@@@@@@@@@@@#********************####
###########**********++++++%@@@@@@@@@@@@@#***#****##**+@@@@@@@@@@@@*******###***############
###########*********++++++++%@@@@@@@@@@@@#+++*******++++@@@@@@@@@@@###################***###
##########*+++++++++++++++++*@@@@@@@@@@@@#===+++++++===++@@@@@@@@@@%#**************+***#####
#####****++*#***###++**++**##@@@@@@@@@@@@*+==========--=+@@@@@@@@@@@@%####****+##*+++**#####
+++++++++###########%%%%####%@@@@@@@@@#+-==========----=%%@@@@@@@@@@@@%#########*+++########
*++++**+*#############%%####%@@@@@@#=------------------=#@@@@@%@@@@@@@@#*****++++**#########
##*+*##################%%###@@@@@@%--------------------=%%@@@%%@@@@@@@@@%%%*+++********+*#*#
###########################@@@@@@@+---------------------*@@@@@%@@@@@%%@@@@%##########*****##
#######################%@@@@@@@#+#=--------------------=+@@@@@%@%%#%%%%%@@@@@%#*#***+*****++
####%#################%@@@@@@%=-+----------------------=*#@@@%%#%%####%%%%%@@@@%###*********
####%###%%%##########%@@@@@@@*-------------------------+@%%%%%####%@@@@@@@@@@@@@@%######****
########%%##########@@@@@@@@@%*-----------------------+##%%##%@@@@@@@@@@@@@@@@@@@@%#######**
################*#%@@@@@@@@@%%%%#+=---==-----------=*#%%%%@@@@@@@@@@@@@@@@@@@@@@@@@%########
######***#######%@@@@@@@@@@%%%%%%%%%##*+---------=*#%%%@@@@@@@@@@%@%@@@@@@@@@@@@@@@@########
####***########%@@@@@@@@@@%%%%%%%%%%%%%%%%%%%%%%###%%%%@@@@@@@@%%@@@@@@@@@@@@@@@@@@@%#######
%####***#######@@@@@@@@@@%%%%%%@%%@%%%%%%%%%%%%%%%%%@@@@@@@@@@%%%@%@@@%#%%%%@@@@@@@@@%######
%%########*****%@@@@@@@@@%%%%%@@%@@%%%%%%%%%%%%%%@@@@@@@@@@@@@@%@%@@%%%%%%%%@@@@@@@@@%****#%
%%%%###########%@@@@@@@@%%%@%@@%%@@%%%%%%%@%%%@@@@@@@@@@@@@@%@@@@%%%%%%%%@@@@@@@@@@@@@%##%%%
%%%%#########%@@@@@@@@@@%%@@%@@%@@@%@@@%@@@%%%%%@@@@@@@@@@@@@@@@%%%%%%@@@@@@@@@@@@@@@@@##%%%
%%%*********#@@@@@@@@@@@@%@@@@@%@@@@@@@@@%%%%%@@@@@@@@@@@@@@@@@%%%%%%@@@@@@@@@@@@@%@@@@#**#%
%%*********#@@@@@@@@@@@@@@@@@@@%@@@@@@@@%%%@@@@@@@@@@@@@@@@@@@%@@%@@@@@@@@@@@@@@@@@@@@@%***%
#*********#@@@@@@@@@@@@@@@@@@@@%@@@@@@@@@%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@****
#%%#%##%%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%***
%%%%%%@@@@@@@@@%%%%%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%@@@@@@@@@@@@@@@@@@%%%
%%%%@@@@@@@@@@@@@@@@@@%%@@@@@@@@@@@@@@@@%@@@@@@@@@@@@@@@@@@@@@@@@@@@%%%%%%@@@@@@@@@@@@@@@@%%
%%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%@%@@@@@@@@@@@@@@@@%%`}
                  />
                </div>
              </div>
            </div>
            <div className=" hidden md:block lg:hidden">
              <div className=" w-full aspect-square  flex-col flex gap-2">
                <AsciiScatter
                  ascii={`--------::::::::::::::::::::::--------
------:::::::::*%%@@@@%-::::::::------
----:::::::::+#=-==*@@@@%::::::::-----
---:::::::::**::::::=#@@@%::::::::----
------:::::*@-::::-::-%@@@=---=::::---
*+======-::*@+++-==*+-+@@@@++=+=::---=
+===+***++*%@=:::-::-=%@@@@****+=----+
**++***+**#@@%--+=---+#@@@@%**+*+++++*
##*++++*###@@@#-==--=*@@@@@%*++++++***
##********+@@@@@#+****#@@@@%++++++++*#
####+++++=+=@@@@@==++=-#@@@@*******+**
++++****####@@@#-----::#@@@@@%##*++***
#********##%@@=::::::::#@@@@@@%*****+*
#####***#@@@+-::::::::-%@%###%%@@#***+
#####**#@@@@#+:::::::-#%%@@@@@@@@@%###
#*+###%@@@@%%%%%%%%%#%%@@@%@@@@@@@@###
%#####%@@@%%@%@%%%%%@@@@@@@%%%%@@@@%*#
%**+*@@@@@@@@@@@@%%@@@@@@@%%@@@@@@@@*#
****@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%+
%%@@@@@@@%@@@@@@%@@@@@@@@@@@%%%@@@@@@%
`}
                />
              </div>
            </div>
            <div>
              <h4 className="text-xs pt-0 pb-2 md:pt-4 md:text-sm lg:text-base text-justify dropcap">
                This project is pretty simple: it uses{" "}
                <span ref={newsRef}>{splitText("Hugging Face AI")}</span>{" "}
                to summarize the latest{" "}
                <span ref={gifRef}>{splitText("news articles")}</span> that it gets from The Guardian RSS and delivers
                them to your inbox daily or weekly. Get the most important stories
                without the noise, all powered by AI to keep you informed effortlessly.{" "}
                <span ref={memeRef}>{splitText("Stay updated ;)")}</span>
              </h4>

              <Button
                className=""
                text="Subscribe Here"
                background="#EB8E41"
                color="#000"
              />
            </div>
          </div>
          <div className="hidden md:block">
            <svg
              width="10"
              height="100%"
              viewBox="0 0 10 50"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <line
                x1="0.5"
                y1="0"
                x2="0.5"
                y2="100"
                stroke="black"
                strokeWidth="1"
              />
            </svg>
          </div>

          <div className="w-[100%] border border-black lg:w-[55%] aspect-square flex flex-col gap-2 overflow-hidden">
            <LazyImageTrail
              imageSrc="./images/toshow.png"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        <div className="md:px-[4rem] w-[100%] pt-4 px-[2.5rem]">
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
      </div>

      {/* <PutText color="red" />
      <div className="md:px-[4rem] pt-4 px-[2.5rem]">
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
            strokeWidth="0.6"
          />
        </svg>
      </div> */}
      <div className="flex bg-[#F4F2EC] px-[4rem] justify-center items-center h-full w-full"></div>

      <div className="fixed z-50 bottom-0 ">
        <Scroll2 />
      </div>
    </section>
  );
}
