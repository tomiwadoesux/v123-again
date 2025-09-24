"use client";
import { useState } from "react";
import Link from "next/link";

export const NikeReceiptEmail = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUnsubscribe = async () => {
    if (!email) {
      alert('Please enter an email address');
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(
        `/api/news?action=unsubscribe&email=${encodeURIComponent(email)}`
      );
      const data = await res.json();
if (res.ok) {
        setMessage('Successfully unsubscribed!');
        setEmail('');
        alert('Successfully unsubscribed!');
      } else {
        setMessage(`Failed to unsubscribe: ${data.error || 'Unknown error'}`);
        alert(`Failed to unsubscribe: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      const errorMsg = 'Failed to unsubscribe: ' + error.message;
      setMessage(errorMsg);
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-white font-sans">
      <div className="mx-auto mt-2.5 w-full max-w-[600px] border border-gray-200">
        {/* Tracking Section */}
        <section className="bg-gray-100 px-10 py-5.5">
          <div className="py-3">
            <p className="m-0 font-medium leading-8 text-center mb-4">Not Interested? Unsubscribe Below:</p>
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 flex-1 min-w-0"
                disabled={loading}
              />
              <button
                onClick={handleUnsubscribe}
                disabled={loading || !email}
                className="px-4 py-2 bg-[#DC2625] text-white rounded-md hover:bg-[#DC2625]/90 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium whitespace-nowrap"
              >
                {loading ? 'Processing...' : 'Unsubscribe'}
              </button>
            </div>
            {message && (
              <div className="mt-3 p-2 bg-white rounded-md text-sm text-center">
                <p className={message.includes('Successfully') ? 'text-green-600' : 'text-red-600'}>
                  {message}
                </p>
              </div>
            )}
          </div>
        </section>

        <hr className="m-0 border-gray-200" />

        {/* Message Section */}
        <section className="px-18.5 py-1 text-center">
          <h1 className="text-4xl font-bold tracking-wider">
            Welcome to V123 Newsletter!
          </h1>

          <p className="pb-4">
            {" "}
            Your first news letter will be delivered soon :)
          </p>
          {/* <p className="m-0 font px-6 text-gray-450">
            The project is simple, a service that sends daily or weekly mail of
            AI summarized News Articles and a gif reaction You choose your
            preferred category, and it delivers. It's just about making news
            experience easy to understand. Enjoy ;)
          </p> */}
        </section>

        <hr className="m-0 border-gray-200" />

        {/* Shipping Address */}
        <section className="px-10 py-4">
          <p className="m-0 text-base font-medium leading-8">What to expect:</p>
          <ul className="list-disc pl-5 text-base leading-8 m-0">
            <li>Quick summaries of top 2 news articles for easy reading</li>
            <li>1 GIF</li>
            <li>Direct links to full articles</li>
          </ul>
        </section>

        <hr className="m-0 border-gray-200" />

        <section className="px-10 py-5.5 pt-6 pb-4 flex justify-center items-center">
          <a
            href="https://ayotomcs.me"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit ayotomcs.me"
          >
            <svg
              width="21"
              height="20"
              viewBox="0 0 374 320"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: "block", cursor: "pointer" }}
              className="overflow-visible scale-150"
            >
            <g id="Group 70">
              <g id="code">
                <g id="Group 69">
                  <rect
                    id="Rectangle 117"
                    x="92.9004"
                    y="38.373"
                    width="19.8005"
                    height="19.8005"
                    fill="black"
                    stroke="black"
                  />
                  <rect
                    id="Rectangle 123"
                    x="92.9004"
                    y="163.177"
                    width="19.8005"
                    height="19.8005"
                    fill="black"
                    stroke="black"
                  />
                  <rect
                    id="Rectangle 118"
                    x="72.1006"
                    y="55.3916"
                    width="19.8005"
                    height="19.8005"
                    fill="black"
                    stroke="black"
                  />
                  <rect
                    id="Rectangle 122"
                    x="72.1006"
                    y="146.158"
                    width="19.8005"
                    height="19.8005"
                    fill="black"
                    stroke="black"
                  />
                  <rect
                    id="Rectangle 119"
                    x="51.3008"
                    y="72.4102"
                    width="19.8005"
                    height="19.8005"
                    fill="black"
                    stroke="black"
                  />
                  <rect
                    id="Rectangle 121"
                    x="51.3008"
                    y="129.14"
                    width="19.8005"
                    height="19.8005"
                    fill="black"
                    stroke="black"
                  />
                  <rect
                    id="Rectangle 120"
                    x="30.5"
                    y="89.4287"
                    width="19.8005"
                    height="42.492"
                    fill="black"
                    stroke="black"
                  />
                </g>
                <g id="Group 67">
                  <rect
                    id="Rectangle 131"
                    x="227.203"
                    y="1"
                    width="20.8005"
                    height="39.7101"
                    fill="black"
                  />
                  <rect
                    id="Rectangle 132"
                    x="206.403"
                    y="36.9268"
                    width="20.8005"
                    height="39.7101"
                    fill="black"
                  />
                  <rect
                    id="Rectangle 133"
                    x="185.603"
                    y="72.8555"
                    width="20.8005"
                    height="39.7101"
                    fill="black"
                  />
                  <rect
                    id="Rectangle 134"
                    x="164.802"
                    y="108.784"
                    width="20.8005"
                    height="39.7101"
                    fill="black"
                  />
                  <rect
                    id="Rectangle 135"
                    x="144.002"
                    y="144.712"
                    width="20.8005"
                    height="39.7101"
                    fill="black"
                  />
                  <rect
                    id="Rectangle 136"
                    x="123.201"
                    y="180.641"
                    width="20.8005"
                    height="39.7101"
                    fill="black"
                  />
                </g>
                <g id="Group 68">
                  <rect
                    id="Rectangle 124"
                    width="20.8005"
                    height="20.8005"
                    transform="matrix(-1 0 0 1 278.803 37.873)"
                    fill="black"
                  />
                  <rect
                    id="Rectangle 125"
                    width="20.8005"
                    height="20.8005"
                    transform="matrix(-1 0 0 1 278.803 162.677)"
                    fill="black"
                  />
                  <rect
                    id="Rectangle 126"
                    width="20.8005"
                    height="20.8005"
                    transform="matrix(-1 0 0 1 299.604 54.8916)"
                    fill="black"
                  />
                  <rect
                    id="Rectangle 127"
                    width="20.8005"
                    height="20.8005"
                    transform="matrix(-1 0 0 1 299.604 145.658)"
                    fill="black"
                  />
                  <rect
                    id="Rectangle 128"
                    width="20.8005"
                    height="20.8005"
                    transform="matrix(-1 0 0 1 320.403 71.9102)"
                    fill="black"
                  />
                  <rect
                    id="Rectangle 129"
                    width="20.8005"
                    height="20.8005"
                    transform="matrix(-1 0 0 1 320.403 128.64)"
                    fill="black"
                  />
                  <rect
                    id="Rectangle 130"
                    width="20.8005"
                    height="43.492"
                    transform="matrix(-1 0 0 1 341.204 88.9287)"
                    fill="black"
                  />
                </g>
              </g>
              <g id="Hat">
                <path
                  id="Vector 50"
                  d="M44 143L77 143L77 177L66 177L66 231L55 231L55 286L66 286L66 297L88 297L88 309L131.5 309L131.5 319.5L241.5 319.5L241.5 309L285.5 309L285.5 297L307 297L307 286.5L318.5 286.5L318.5 232.5L307 232.5L307 176.5L297 176.5L297 143.5L329.5 143.5L329.5 132.5L351 132.5L351 121L363 121L363 110L374 110L374 77L361.5 77L361.5 66L351 66L351 55.5L340.5 55.5L340.5 44.5L329.5 44.5L329.5 34L307 34L307 22.5L285 22.5L285 12L252 12L252 -1.06656e-05L120.5 -2.21617e-05L120.5 11L88 11L88 21.5L65.5 21.5L65.5 33L44 33L44 43.5L33 43.5L33 55L21.5 55L21.5 66L11 66L11 78L2.11126e-05 78L1.83588e-05 109.5L11 109.5L11 121L21.5 121L21.5 131.5L44 131.5L44 143Z"
                  fill="black"
                />
                <path
                  id="Vector 51"
                  d="M284 133L297 133L297 87.5L274.5 87.5L274.5 76.5L252.5 76.5L252.5 65L120 65L120 75.5L98 75.5L98 87L76.5 87L76.5 133L89 133L89 121.5L100 121.5L100 111L133 111L133 99.5L240 99.5L240 110.5L273 110.5L273 122L284 122L284 133Z"
                  fill="white"
                />
              </g>
            </g>
          </svg>
          </a>
        </section>

        <section className="px-10 py-5.5">
          <p className="m-0 text-gray-400 text-center pt-7.5 pb-7.5">
            Please contact{" "}
            <a
              href="mailto:hello@ayotomcs.me"
              className="text-[#EB8F41] underline hover:text-gray-600 transition-colors"
            >
              hello@ayotomcs.me
            </a>{" "}
            if you have any questions. (If you reply to this email, I won&apos;t be
            able to see it)
          </p>

          <p className="m-0 text-gray-400 text-13 text-center">
            © 2025 ayotomcs. All Rights Reserved.
          </p>

          <div className="flex justify-center pt-2 pb-5 items-center  gap-1 ">
            <a
              href="https://x.com/ayotomcs"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View X Account"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="30"
                height="30"
                viewBox="0 0 48 48"
                className="scale-75"
              >
                <path
                  fill="#212121"
                  fillRule="evenodd"
                  d="M38,42H10c-2.209,0-4-1.791-4-4V10c0-2.209,1.791-4,4-4h28	c2.209,0,4,1.791,4,4v28C42,40.209,40.209,42,38,42z"
                  clipRule="evenodd"
                ></path>
                <path
                  fill="#fff"
                  d="M34.257,34h-6.437L13.829,14h6.437L34.257,34z M28.587,32.304h2.563L19.499,15.696h-2.563 L28.587,32.304z"
                ></path>
                <polygon
                  fill="#fff"
                  points="15.866,34 23.069,25.656 22.127,24.407 13.823,34"
                ></polygon>
                <polygon
                  fill="#fff"
                  points="24.45,21.721 25.355,23.01 33.136,14 31.136,14"
                ></polygon>
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/ayotomcs/" // replace with your actual GitHub URL
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View LinkedIn Profile"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="30"
                height="30"
                viewBox="0 0 50 50"
                className="scale-75"
              >
                <path d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z"></path>
              </svg>
            </a>
            <a
              href="https://github.com/tomiwadoesux" // replace with your actual GitHub URL
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View this Project on GitHub"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 30 30"
                className="scale-75"
              >
                <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z" />
              </svg>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default NikeReceiptEmail;
