"use client";


import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";

const NavigationNext = () => {
  const router = useRouter();

  useEffect(() => {
    gsap.to("#text", {
      rotation: -360,
      transformOrigin: "center",
      duration: 13,
      repeat: -1,
      ease: "none",
    });
  }, []);

  const handleClick = () => {
    router.push("/love"); // Change this to your desired route
  };


  return (
    <div
    onClick={handleClick}
    className="cursor-pointer fixed bottom-14 right-6 text-white w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition duration-200"
    aria-label="Open chat"
  >
      <svg
        width="174"
        height="174"
        viewBox="0 0 174 174"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Group 83">
          <g id="Group 82">
            <circle id="Ellipse 62" cx="87" cy="87" r="87" fill="white" />
          </g>
          <g id="Group 79">
            <g id="text">
              <text
                id="g"
                transform="matrix(0 -1 1 0 4.99805 88.9148)"
                fill="black"
                style={{ whiteSpace: "pre" }}
                fontFamily="Arial"
                fontSize="17"
                letterSpacing="0em"
              >
                <tspan x="-1.06258" y="13.7002">
                  g
                </tspan>
              </text>
              <text
                id="o"
                transform="translate(5.95996 75.002) rotate(-81.0256)"
                fill="black"
                style={{ whiteSpace: "pre" }}
                fontFamily="Arial"
                fontSize="17"
                letterSpacing="0em"
              >
                <tspan x="-2.12752" y="13.7002">
                  o
                </tspan>
              </text>
              <text
                id="t"
                transform="translate(13.5728 50.6121) rotate(-63.0769)"
                fill="black"
                style={{ whiteSpace: "pre" }}
                fontFamily="Arial"
                fontSize="17"
                letterSpacing="0em"
              >
                <tspan x="0.130491" y="13.7002">
                  t
                </tspan>
              </text>
              <text
                id="o_2"
                transform="translate(20.1338 39.6047) rotate(-54.1026)"
                fill="black"
                style={{ whiteSpace: "pre" }}
                fontFamily="Arial"
                fontSize="17"
                letterSpacing="0em"
              >
                <tspan x="-2.12752" y="13.7002">
                  o
                </tspan>
              </text>
              <text
                id="t_2"
                transform="translate(38.2402 21.1042) rotate(-36.1538)"
                fill="black"
                style={{ whiteSpace: "pre" }}
                fontFamily="Arial"
                fontSize="17"
                letterSpacing="0em"
              >
                <tspan x="-1.06376" y="13.7002">
                  t
                </tspan>
              </text>
              <text
                id="h"
                transform="translate(48.7983 14.4614) rotate(-27.1795)"
                fill="black"
                style={{ whiteSpace: "pre" }}
                fontFamily="Arial"
                fontSize="17"
                letterSpacing="0em"
              >
                <tspan x="-2.12752" y="13.7002">
                  h
                </tspan>
              </text>
              <text
                id="e"
                transform="translate(60.2432 9.4978) rotate(-18.2051)"
                fill="black"
                style={{ whiteSpace: "pre" }}
                fontFamily="Arial"
                fontSize="17"
                letterSpacing="0em"
              >
                <tspan x="-2.12752" y="13.7002">
                  e
                </tspan>
              </text>
              <text
                id="n"
                transform="translate(85.7407 5.02295) rotate(-0.25641)"
                fill="black"
                style={{ whiteSpace: "pre" }}
                fontFamily="Arial"
                fontSize="17"
                letterSpacing="0em"
              >
                <tspan x="-1.6157" y="13.7002">
                  n
                </tspan>
              </text>
              <text
                id="e_2"
                transform="translate(98.1929 5.77954) rotate(8.71795)"
                fill="black"
                style={{ whiteSpace: "pre" }}
                fontFamily="Arial"
                fontSize="17"
                letterSpacing="0em"
              >
                <tspan x="-2.12752" y="13.7002">
                  e
                </tspan>
              </text>
              <text
                id="x"
                transform="translate(111.036 8.62427) rotate(17.6923)"
                fill="black"
                style={{ whiteSpace: "pre" }}
                fontFamily="Arial"
                fontSize="17"
                letterSpacing="0em"
              >
                <tspan x="-2.04393" y="13.7002">
                  x
                </tspan>
              </text>
              <text
                id="t_3"
                transform="translate(123.259 13.488) rotate(26.6667)"
                fill="black"
                style={{ whiteSpace: "pre" }}
                fontFamily="Arial"
                fontSize="17"
                letterSpacing="0em"
              >
                <tspan x="-1.06376" y="13.7002">
                  t
                </tspan>
              </text>
              <text
                id="p"
                transform="translate(143.633 27.7598) rotate(44.6154)"
                fill="black"
                style={{ whiteSpace: "pre" }}
                fontFamily="Arial"
                fontSize="17"
                letterSpacing="0em"
              >
                <tspan x="-1.7863" y="13.7002">
                  p
                </tspan>
              </text>
              <text
                id="a"
                transform="translate(152.167 37.3203) rotate(53.5897)"
                fill="black"
                style={{ whiteSpace: "pre" }}
                fontFamily="Arial"
                fontSize="17"
                letterSpacing="0em"
              >
                <tspan x="-2.12752" y="13.7002">
                  a
                </tspan>
              </text>
              <text
                id="g_2"
                transform="translate(159.262 48.3979) rotate(62.5641)"
                fill="black"
                style={{ whiteSpace: "pre" }}
                fontFamily="Arial"
                fontSize="17"
                letterSpacing="0em"
              >
                <tspan x="-2.12752" y="13.7002">
                  g
                </tspan>
              </text>
              <text
                id="e_3"
                transform="translate(164.276 59.8203) rotate(71.5385)"
                fill="black"
                style={{ whiteSpace: "pre" }}
                fontFamily="Arial"
                fontSize="17"
                letterSpacing="0em"
              >
                <tspan x="-2.12752" y="13.7002">
                  e
                </tspan>
              </text>
              <text
                id="g_3"
                transform="translate(168.86 84.616) rotate(89.4872)"
                fill="#FF0000"
                style={{ whiteSpace: "pre" }}
                fontFamily="Arial"
                fontSize="17"
                letterSpacing="0em"
              >
                <tspan x="-1.44509" y="13.7002">
                  g
                </tspan>
              </text>
              <text
                id="o_3"
                transform="translate(168.114 98.0908) rotate(98.4615)"
                fill="#FF0000"
                style={{ whiteSpace: "pre" }}
                fontFamily="Arial"
                fontSize="17"
                letterSpacing="0em"
              >
                <tspan x="-2.12752" y="13.7002">
                  o
                </tspan>
              </text>
              <text
                id="t_4"
                transform="translate(160.721 122.548) rotate(116.41)"
                fill="#FF0000"
                style={{ whiteSpace: "pre" }}
                fontFamily="Arial"
                fontSize="17"
                letterSpacing="0em"
              >
                <tspan x="0.130491" y="13.7002">
                  t
                </tspan>
              </text>
              <text
                id="o_4"
                transform="translate(154.259 133.614) rotate(125.385)"
                fill="#FF0000"
                style={{ whiteSpace: "pre" }}
                fontFamily="Arial"
                fontSize="17"
                letterSpacing="0em"
              >
                <tspan x="-2.12752" y="13.7002">
                  o
                </tspan>
              </text>
              <text
                id="t_5"
                transform="translate(136.318 152.276) rotate(143.333)"
                fill="#FF0000"
                style={{ whiteSpace: "pre" }}
                fontFamily="Arial"
                fontSize="17"
                letterSpacing="0em"
              >
                <tspan x="-1.06376" y="13.7002">
                  t
                </tspan>
              </text>
              <text
                id="h_2"
                transform="translate(125.82 159.012) rotate(152.308)"
                fill="#FF0000"
                style={{ whiteSpace: "pre" }}
                fontFamily="Arial"
                fontSize="17"
                letterSpacing="0em"
              >
                <tspan x="-2.12752" y="13.7002">
                  h
                </tspan>
              </text>
              <text
                id="e_4"
                transform="translate(114.42 164.078) rotate(161.282)"
                fill="#FF0000"
                style={{ whiteSpace: "pre" }}
                fontFamily="Arial"
                fontSize="17"
                letterSpacing="0em"
              >
                <tspan x="-2.12752" y="13.7002">
                  e
                </tspan>
              </text>
              <text
                id="n_2"
                transform="translate(88.9629 168.781) rotate(179.231)"
                fill="#FF0000"
                style={{ whiteSpace: "pre" }}
                fontFamily="Arial"
                fontSize="17"
                letterSpacing="0em"
              >
                <tspan x="-1.6157" y="13.7002">
                  n
                </tspan>
              </text>
              <text
                id="e_5"
                transform="translate(76.5049 168.136) rotate(-171.795)"
                fill="#FF0000"
                style={{ whiteSpace: "pre" }}
                fontFamily="Arial"
                fontSize="17"
                letterSpacing="0em"
              >
                <tspan x="-2.12752" y="13.7002">
                  e
                </tspan>
              </text>
              <text
                id="x_2"
                transform="translate(63.6372 165.406) rotate(-162.821)"
                fill="#FF0000"
                style={{ whiteSpace: "pre" }}
                fontFamily="Arial"
                fontSize="17"
                letterSpacing="0em"
              >
                <tspan x="-2.04393" y="13.7002">
                  x
                </tspan>
              </text>
              <text
                id="t_6"
                transform="translate(51.3711 160.653) rotate(-153.846)"
                fill="#FF0000"
                style={{ whiteSpace: "pre" }}
                fontFamily="Arial"
                fontSize="17"
                letterSpacing="0em"
              >
                <tspan x="-1.06376" y="13.7002">
                  t
                </tspan>
              </text>
              <text
                id="p_2"
                transform="translate(30.8701 146.563) rotate(-135.897)"
                fill="#FF0000"
                style={{ whiteSpace: "pre" }}
                fontFamily="Arial"
                fontSize="17"
                letterSpacing="0em"
              >
                <tspan x="-1.7863" y="13.7002">
                  p
                </tspan>
              </text>
              <text
                id="a_2"
                transform="translate(22.251 137.08) rotate(-126.923)"
                fill="#FF0000"
                style={{ whiteSpace: "pre" }}
                fontFamily="Arial"
                fontSize="17"
                letterSpacing="0em"
              >
                <tspan x="-2.12752" y="13.7002">
                  a
                </tspan>
              </text>
              <text
                id="g_4"
                transform="translate(15.0576 126.066) rotate(-117.949)"
                fill="#FF0000"
                style={{ whiteSpace: "pre" }}
                fontFamily="Arial"
                fontSize="17"
                letterSpacing="0em"
              >
                <tspan x="-2.12752" y="13.7002">
                  g
                </tspan>
              </text>
              <text
                id="e_6"
                transform="translate(9.94043 114.689) rotate(-108.974)"
                fill="#FF0000"
                style={{ whiteSpace: "pre" }}
                fontFamily="Arial"
                fontSize="17"
                letterSpacing="0em"
              >
                <tspan x="-2.12752" y="13.7002">
                  e
                </tspan>
              </text>
            </g>
            <path
              id="arrow"
              d="M70.9292 86.4026C70.1008 86.4026 69.4292 87.0742 69.4292 87.9026C69.4292 88.731 70.1008 89.4026 70.9292 89.4026L70.9292 86.4026ZM103.94 88.9633C104.526 88.3775 104.526 87.4277 103.94 86.8419L94.3939 77.296C93.8081 76.7102 92.8583 76.7102 92.2725 77.296C91.6868 77.8818 91.6868 78.8315 92.2725 79.4173L100.758 87.9026L92.2725 96.3879C91.6868 96.9737 91.6868 97.9234 92.2725 98.5092C92.8583 99.095 93.8081 99.095 94.3939 98.5092L103.94 88.9633ZM70.9292 89.4026L102.879 89.4026L102.879 86.4026L70.9292 86.4026L70.9292 89.4026Z"
              fill="black"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default NavigationNext;
