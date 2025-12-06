"use client";
import { useState } from "react";
import Link from "next/link";
import ParticlesComponent from "components/particle";
import { useNotification } from "@/context/NotificationContext";
import { Analytics } from "@vercel/analytics/react";

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("top");
  const [frequency, setFrequency] = useState("daily");
  
  const { showNotification } = useNotification();

  const categories = [
    "top",
    "business",
    "entertainment",
    "general",
    "health",
    "science",
    "sports",
    "technology",
  ];

  const handleSubscribe = () => {
    if (!email) {
      showNotification('Please enter an email address', 'error');
      return;
    }

    setLoading(true);
    
    // Non-blocking fetch - allows user to navigate away
    const endpoint = `/api/news?action=subscribe&email=${encodeURIComponent(email)}&category=${category}&frequency=${frequency}`;
    
    fetch(endpoint)
      .then(res => res.json().then(data => ({ status: res.status, body: data })))
      .then(({ status, body }) => {
        if (status >= 200 && status < 300) {
          showNotification(`Welcome to the club. Subscribed to ${category} News.`);
        } else {
          showNotification(`Failed to subscribe: ${body.error || 'Unknown error'}`, 'error');
        }
      })
      .catch(error => {
        showNotification('Failed to subscribe: ' + error.message, 'error');
      })
      .finally(() => {
        setLoading(false); 
      });
  };

  const handleUnsubscribe = () => {
    if (!email) {
      showNotification('Please enter an email address', 'error');
      return;
    }

    setLoading(true);
    
    const endpoint = `/api/news?action=unsubscribe&email=${encodeURIComponent(email)}`;
    
    fetch(endpoint)
      .then(res => res.json().then(data => ({ status: res.status, body: data })))
      .then(({ status, body }) => {
        if (status >= 200 && status < 300) {
          showNotification('Successfully unsubscribed.');
        } else {
          showNotification(`Failed to unsubscribe: ${body.error || 'Unknown error'}`, 'error');
        }
      })
      .catch(error => {
        showNotification('Failed to unsubscribe: ' + error.message, 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSendSample = () => {
    if (!email) {
      showNotification('Please enter an email address', 'error');
      return;
    }

    setLoading(true);
    showNotification('Sending news... feel free to browse while you wait.', 'success');

    const endpoint = `/api/news?action=send&email=${encodeURIComponent(email)}&category=${category}`;
    
    fetch(endpoint)
      .then(res => res.json().then(data => ({ status: res.status, body: data })))
      .then(({ status, body }) => {
        if (status >= 200 && status < 300) {
          showNotification(`Dispatched News email to ${email}.`);
        } else {
          showNotification(`Failed to dispatch: ${body.error || 'Unknown error'}`, 'error');
        }
      })
      .catch(error => {
        showNotification('Failed to send email: ' + error.message, 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="relative min-h-screen w-full font-roboto bg-[#f4f4f4] text-[#171717] flex flex-col">

      {/* Particles background layer */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
        <ParticlesComponent id="particles" />
      </div>

      {/* Navigation */}
           <div className=" h-auto lg:-mb-0 md:-mb-6 px-[2.5rem] md:px-[3rem] lg:px-[4.15rem] pt-[1.3rem] ">
        <div className="flex flex-col md:flex-row w-full gap-9">
         
          <div className="flex-1 justify-center flex relative">
           <Link href="/" className="hover:opacity-70 transition-opacity">
              <h1 className="title-text relative -top-7 lg:-top-7 md:-top-9 whitespace-nowrap text-center text-4xl md:text-[3.3rem] lg:text-[4.3rem] font-light z-10">
                TITLE: "V123"
              </h1>
            </Link>
          </div>
       
        </div>
        <div className="relative -top-12 md:-top-17">
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
              strokeWidth="3"
            />
          </svg>
          <h6 className=" title-text text-xs md:text-base  lg:text-lg text-center font tracking-[0.1rem] md:tracking-[0.15rem]">
            “Art is never finished, only abandoned”
          </h6>
          <div className="relative -top-3 md:-top-0">
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
                y1="7"
                x2="100"
                y2="7"
                stroke="black"
                strokeWidth="0.4"
              />
            </svg>
          </div>
        </div>
      
      </div>
      {/* Main Content */}
      <div className="relative z-10 flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white border border-black p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-fino text-4xl md:text-5xl mb-4 tracking-wide">
              SUBSCRIBE
            </h1>
            <p className="font-merriweather italic text-gray-600 text-sm md:text-base">
              Join the inner circle. Curated content, delivered daily.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            
            {/* News Configuration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-xs uppercase tracking-wider mb-2">Topic</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-transparent border border-black px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent text-sm font-roboto appearance-none rounded-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-xs uppercase tracking-wider mb-2">Frequency</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full bg-transparent border border-black px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent text-sm font-roboto appearance-none rounded-none"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-xs uppercase tracking-wider mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full bg-transparent border border-black px-4 py-3 focus:outline-none focus:ring-1 focus:ring-accent placeholder-gray-400 font-roboto rounded-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-4 space-y-3">
              <div className="flex gap-3">
                <button
                  onClick={handleSubscribe}
                  disabled={loading}
                  className="flex-1 bg-black text-white border border-black py-3 text-sm font-bold uppercase tracking-widest hover:bg-accent hover:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Subscribe'}
                </button>
                <button
                  onClick={handleUnsubscribe}
                  disabled={loading}
                  className="flex-1 bg-transparent text-black border border-black py-3 text-sm font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Unsubscribe
                </button>
              </div>
              
              <button
                onClick={handleSendSample}
                disabled={loading}
                className="w-full text-xs text-gray-500 hover:text-accent underline decoration-dotted underline-offset-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Test: Send me a sample now
              </button>
            </div>
          </div>

        </div>
      </div>
      
      {/* Footer Minimal */}
      <div className="relative z-10 p-6 text-center">
        <p className="text-xs font-roboto text-gray-400 uppercase tracking-widest">
          © 2025 V123. Art is never finished.
        </p>
      </div>
      <Analytics />
    </div>
  );
}

