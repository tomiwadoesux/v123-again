"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";

const NavigationPrevious = () => {
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
    router.push("/"); // Change this to your desired route
  };


  return (
    <div
    onClick={handleClick}
    className="cursor-pointer fixed bottom-14 left-6 text-white w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition duration-200"
    aria-label="Open chat"
  >
      <svg
        width="158"
        height="158"
        viewBox="0 0 158 158"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Group 81">
          <circle id="Ellipse 62" cx="79" cy="79" r="79" fill="#F4F2EC" />
          <path
            id="arrow"
            d="M94 80.5303C94.8284 80.5303 95.5 79.8587 95.5 79.0303C95.5 78.2018 94.8284 77.5303 94 77.5303L94 80.5303ZM62.9393 77.9696C62.3536 78.5554 62.3536 79.5051 62.9393 80.0909L72.4853 89.6369C73.0711 90.2227 74.0208 90.2227 74.6066 89.6369C75.1924 89.0511 75.1924 88.1013 74.6066 87.5156L66.1213 79.0303L74.6066 70.545C75.1924 69.9592 75.1924 69.0095 74.6066 68.4237C74.0208 67.8379 73.0711 67.8379 72.4853 68.4237L62.9393 77.9696ZM94 77.5303L64 77.5303L64 80.5303L94 80.5303L94 77.5303Z"
            fill="black"
          />
          <g id="text">
            <text
              id="g"
              transform="translate(155.85 78.8218) rotate(90)"
              fill="black"
              style={{ whiteSpace: "pre" }}
              fontFamily="Arial"
              fontSize="17"
              letterSpacing="0em"
            >
              <tspan x="-2.01086" y="13.7002">
                g
              </tspan>
            </text>
            <text
              id="o"
              transform="matrix(-0.16062 0.987016 -0.987084 -0.160203 154.882 91.1663)"
              fill="black"
              style={{ whiteSpace: "pre" }}
              fontFamily="Arial"
              fontSize="17"
              letterSpacing="0em"
            >
              <tspan x="-2.01079" y="13.7002">
                o
              </tspan>
            </text>
            <text
              id="t"
              transform="matrix(-0.465209 0.885201 -0.88571 -0.464238 147.111 114.599)"
              fill="black"
              style={{ whiteSpace: "pre" }}
              fontFamily="Arial"
              fontSize="17"
              letterSpacing="0em"
            >
              <tspan x="-0.884866" y="13.7002">
                t
              </tspan>
            </text>
            <text
              id="o_2"
              transform="matrix(-0.601254 0.799058 -0.799827 -0.600231 140.509 125.08)"
              fill="black"
              style={{ whiteSpace: "pre" }}
              fontFamily="Arial"
              fontSize="17"
              letterSpacing="0em"
            >
              <tspan x="-2.00982" y="13.7002">
                o
              </tspan>
            </text>
            <text
              id="p"
              transform="matrix(-0.823337 0.567552 -0.568577 -0.82263 122.724 142.222)"
              fill="black"
              style={{ whiteSpace: "pre" }}
              fontFamily="Arial"
              fontSize="17"
              letterSpacing="0em"
            >
              <tspan x="-2.00891" y="13.7002">
                p
              </tspan>
            </text>
            <text
              id="r"
              transform="matrix(-0.903671 0.428227 -0.429159 -0.903229 112.001 148.438)"
              fill="black"
              style={{ whiteSpace: "pre" }}
              fontFamily="Arial"
              fontSize="17"
              letterSpacing="0em"
            >
              <tspan x="-1.29406" y="13.7002">
                r
              </tspan>
            </text>
            <text
              id="e"
              transform="matrix(-0.960617 0.277876 -0.27856 -0.960419 100.881 152.723)"
              fill="black"
              style={{ whiteSpace: "pre" }}
              fontFamily="Arial"
              fontSize="17"
              letterSpacing="0em"
            >
              <tspan x="-2.0082" y="13.7002">
                e
              </tspan>
            </text>
            <text
              id="v"
              transform="matrix(-0.992728 0.120379 -0.120695 -0.99269 88.7546 155.304)"
              fill="black"
              style={{ whiteSpace: "pre" }}
              fontFamily="Arial"
              fontSize="17"
              letterSpacing="0em"
            >
              <tspan x="-1.82397" y="13.7002">
                v
              </tspan>
            </text>
            <text
              id="i"
              transform="matrix(-0.999191 -0.0402125 0.0403196 -0.999187 76.3704 155.91)"
              fill="black"
              style={{ whiteSpace: "pre" }}
              fontFamily="Arial"
              fontSize="17"
              letterSpacing="0em"
            >
              <tspan x="-0.70689" y="13.7002">
                i
              </tspan>
            </text>
            <text
              id="o_3"
              transform="matrix(-0.979843 -0.19977 0.200282 -0.979738 63.5774 154.427)"
              fill="black"
              style={{ whiteSpace: "pre" }}
              fontFamily="Arial"
              fontSize="17"
              letterSpacing="0em"
            >
              <tspan x="-2.00809" y="13.7002">
                o
              </tspan>
            </text>
            <text
              id="u"
              transform="matrix(-0.935173 -0.354192 0.355018 -0.93486 52.1104 151.181)"
              fill="black"
              style={{ whiteSpace: "pre" }}
              fontFamily="Arial"
              fontSize="17"
              letterSpacing="0em"
            >
              <tspan x="-2.00834" y="13.7002">
                u
              </tspan>
            </text>
            <text
              id="s"
              transform="matrix(-0.866314 -0.499501 0.5005 -0.865737 40.8625 145.97)"
              fill="black"
              style={{ whiteSpace: "pre" }}
              fontFamily="Arial"
              fontSize="17"
              letterSpacing="0em"
            >
              <tspan x="-1.82457" y="13.7002">
                s
              </tspan>
            </text>
            <text
              id="p_2"
              transform="matrix(-0.663617 -0.748072 0.748949 -0.662628 21.2625 130.164)"
              fill="black"
              style={{ whiteSpace: "pre" }}
              fontFamily="Arial"
              fontSize="17"
              letterSpacing="0em"
            >
              <tspan x="-2.00959" y="13.7002">
                p
              </tspan>
            </text>
            <text
              id="a"
              transform="matrix(-0.534974 -0.844868 0.845511 -0.533957 14.0479 120.689)"
              fill="black"
              style={{ whiteSpace: "pre" }}
              fontFamily="Arial"
              fontSize="17"
              letterSpacing="0em"
            >
              <tspan x="-2.01004" y="13.7002">
                a
              </tspan>
            </text>
            <text
              id="g_2"
              transform="matrix(-0.392409 -0.919791 0.920168 -0.391525 8.0022 109.333)"
              fill="black"
              style={{ whiteSpace: "pre" }}
              fontFamily="Arial"
              fontSize="17"
              letterSpacing="0em"
            >
              <tspan x="-2.01042" y="13.7002">
                g
              </tspan>
            </text>
            <text
              id="e_2"
              transform="matrix(-0.239616 -0.970868 0.971016 -0.239015 4.16309 98.0637)"
              fill="black"
              style={{ whiteSpace: "pre" }}
              fontFamily="Arial"
              fontSize="17"
              letterSpacing="0em"
            >
              <tspan x="-2.0107" y="13.7002">
                e
              </tspan>
            </text>
            <text
              id="g_3"
              transform="matrix(0.0805732 -0.996749 0.996766 0.0803602 2 72.9976)"
              fill="#FF0000"
              style={{ whiteSpace: "pre" }}
              fontFamily="Arial"
              fontSize="17"
              letterSpacing="0em"
            >
              <tspan x="-2.01084" y="13.7002">
                g
              </tspan>
            </text>
            <text
              id="o_4"
              transform="matrix(0.239616 -0.970868 0.971016 0.239015 3.95972 60.771)"
              fill="#FF0000"
              style={{ whiteSpace: "pre" }}
              fontFamily="Arial"
              fontSize="17"
              letterSpacing="0em"
            >
              <tspan x="-2.0107" y="13.7002">
                o
              </tspan>
            </text>
            <text
              id="t_2"
              transform="matrix(0.534974 -0.844868 0.845511 0.533957 13.5935 38.0391)"
              fill="#FF0000"
              style={{ whiteSpace: "pre" }}
              fontFamily="Arial"
              fontSize="17"
              letterSpacing="0em"
            >
              <tspan x="-0.884754" y="13.7002">
                t
              </tspan>
            </text>
            <text
              id="o_5"
              transform="matrix(0.663617 -0.748072 0.748949 0.662628 21.0183 28.1226)"
              fill="#FF0000"
              style={{ whiteSpace: "pre" }}
              fontFamily="Arial"
              fontSize="17"
              letterSpacing="0em"
            >
              <tspan x="-2.00959" y="13.7002">
                o
              </tspan>
            </text>
            <text
              id="p_3"
              transform="matrix(0.866314 -0.499501 0.500499 0.865737 40.1267 12.4653)"
              fill="#FF0000"
              style={{ whiteSpace: "pre" }}
              fontFamily="Arial"
              fontSize="17"
              letterSpacing="0em"
            >
              <tspan x="-2.0087" y="13.7002">
                p
              </tspan>
            </text>
            <text
              id="r_2"
              transform="matrix(0.935173 -0.354192 0.355018 0.93486 51.3157 7.13086)"
              fill="#FF0000"
              style={{ whiteSpace: "pre" }}
              fontFamily="Arial"
              fontSize="17"
              letterSpacing="0em"
            >
              <tspan x="-1.29397" y="13.7002">
                r
              </tspan>
            </text>
            <text
              id="e_3"
              transform="matrix(0.979843 -0.19977 0.200282 0.979738 62.7449 3.75342)"
              fill="#FF0000"
              style={{ whiteSpace: "pre" }}
              fontFamily="Arial"
              fontSize="17"
              letterSpacing="0em"
            >
              <tspan x="-2.00809" y="13.7002">
                e
              </tspan>
            </text>
            <text
              id="v_2"
              transform="matrix(0.999191 -0.0402124 0.0403195 0.999187 75.0403 2.15479)"
              fill="#FF0000"
              style={{ whiteSpace: "pre" }}
              fontFamily="Arial"
              fontSize="17"
              letterSpacing="0em"
            >
              <tspan x="-1.82394" y="13.7002">
                v
              </tspan>
            </text>
            <text
              id="i_2"
              transform="matrix(0.992728 0.120379 -0.120695 0.99269 87.4331 2.54639)"
              fill="#FF0000"
              style={{ whiteSpace: "pre" }}
              fontFamily="Arial"
              fontSize="17"
              letterSpacing="0em"
            >
              <tspan x="-0.706906" y="13.7002">
                i
              </tspan>
            </text>
            <text
              id="o_6"
              transform="matrix(0.960617 0.277876 -0.27856 0.960419 100.065 5.05225)"
              fill="#FF0000"
              style={{ whiteSpace: "pre" }}
              fontFamily="Arial"
              fontSize="17"
              letterSpacing="0em"
            >
              <tspan x="-2.0082" y="13.7002">
                o
              </tspan>
            </text>
            <text
              id="u_2"
              transform="matrix(0.903671 0.428227 -0.429159 0.903229 111.234 9.20898)"
              fill="#FF0000"
              style={{ whiteSpace: "pre" }}
              fontFamily="Arial"
              fontSize="17"
              letterSpacing="0em"
            >
              <tspan x="-2.00851" y="13.7002">
                u
              </tspan>
            </text>
            <text
              id="s_2"
              transform="matrix(0.823337 0.567552 -0.568577 0.82263 122.025 15.3076)"
              fill="#FF0000"
              style={{ whiteSpace: "pre" }}
              fontFamily="Arial"
              fontSize="17"
              letterSpacing="0em"
            >
              <tspan x="-1.82476" y="13.7002">
                s
              </tspan>
            </text>
            <text
              id="p_4"
              transform="matrix(0.601254 0.799058 -0.799827 0.600231 140.288 32.6372)"
              fill="#FF0000"
              style={{ whiteSpace: "pre" }}
              fontFamily="Arial"
              fontSize="17"
              letterSpacing="0em"
            >
              <tspan x="-2.00982" y="13.7002">
                p
              </tspan>
            </text>
            <text
              id="a_2"
              transform="matrix(0.465209 0.885201 -0.88571 0.464238 146.716 42.6611)"
              fill="#FF0000"
              style={{ whiteSpace: "pre" }}
              fontFamily="Arial"
              fontSize="17"
              letterSpacing="0em"
            >
              <tspan x="-2.01024" y="13.7002">
                a
              </tspan>
            </text>
            <text
              id="g_4"
              transform="matrix(0.317048 0.94841 -0.948663 0.316289 151.827 54.4668)"
              fill="#FF0000"
              style={{ whiteSpace: "pre" }}
              fontFamily="Arial"
              fontSize="17"
              letterSpacing="0em"
            >
              <tspan x="-2.01057" y="13.7002">
                g
              </tspan>
            </text>
            <text
              id="e_4"
              transform="matrix(0.16062 0.987016 -0.987084 0.160203 154.745 66.0073)"
              fill="#FF0000"
              style={{ whiteSpace: "pre" }}
              fontFamily="Arial"
              fontSize="17"
              letterSpacing="0em"
            >
              <tspan x="-2.01079" y="13.7002">
                e
              </tspan>
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default NavigationPrevious;
``