"use client";
import { useState } from "react";
import Link from "next/link";
import ParticlesComponent from "components/particle";

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("general");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const categories = [
    "business",
    "entertainment",
    "general",
    "health",
    "science",
    "sports",
    "technology",
  ];

  const handleSubscribe = async () => {
    if (!email) {
      alert('Please enter an email address');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/news?action=subscribe&email=${encodeURIComponent(
          email
        )}&category=${category}&frequency=daily`
      );
      const data = await res.json();
      setResponse(data.message || 'Subscribed successfully!');
      if (res.ok) {
        alert(`Successfully subscribed to ${category} newsletter!`);
        setEmail('');
      } else {
        alert(`Failed to subscribe: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      setResponse('Error: ' + error.message);
      alert('Failed to subscribe: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!email) {
      alert('Please enter an email address');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/news?action=unsubscribe&email=${encodeURIComponent(email)}`
      );
      const data = await res.json();
      setResponse(data.message || 'Unsubscribed successfully!');
      if (res.ok) {
        alert('Successfully unsubscribed!');
        setEmail('');
      } else {
        alert(`Failed to unsubscribe: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      setResponse('Error: ' + error.message);
      alert('Failed to unsubscribe: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full">

      {/* Particles background layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <ParticlesComponent id="particles" />
      </div>

      {/* Subscription form centered */}
      <div className="absolute inset-0 z-10 flex items-center justify-center p-6">
        <div className="max-w-md w-full   rounded-lg p-6  space-y-4">
          {/* Back to Website button */}
          <div className="text-center mb-2">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-800 underline text-sm transition-colors duration-200"
            >
              ← Back to Website
            </Link>
          </div>

          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">V123 News System</h2>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Category Select */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="flex-1 bg-[#EB8E41] text-white py-2 px-4 rounded-md hover:bg-[#EB8E41]/90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Processing...' : 'Subscribe'}
            </button>

            <button
              onClick={handleUnsubscribe}
              disabled={loading}
              className="flex-1 bg-[#DC2625] text-white py-2 px-4 rounded-md hover:bg-[#DC2625]/90 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Processing...' : 'Unsubscribe'}
            </button>
          </div>

          {/* Response Message */}
          {response && (
            <div className="mt-3 p-2 bg-gray-100 rounded-md text-sm text-gray-700">
              {response}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

