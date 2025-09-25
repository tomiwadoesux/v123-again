"use client";
import { useState } from "react";
import Link from "next/link";
import ParticlesComponent from "components/particle";

export default function AwwwardsSubscribe() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const handleSubscribe = async () => {
    if (!email) {
      alert('Please enter an email address');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/awwwards-subscribe?action=subscribe&email=${encodeURIComponent(email)}`
      );
      const data = await res.json();
      setResponse(data.message || 'Subscribed successfully!');
      if (res.ok) {
        alert('🎨 Successfully subscribed to daily design inspiration!');
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
        `/api/awwwards-subscribe?action=unsubscribe&email=${encodeURIComponent(email)}`
      );
      const data = await res.json();
      setResponse(data.message || 'Unsubscribed successfully!');
      if (res.ok) {
        alert('Successfully unsubscribed from design inspiration!');
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
        <div className="max-w-md w-full rounded-lg p-6 space-y-4">
          {/* Back to Website button */}
          <div className="text-center mb-2">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-800 underline text-sm transition-colors duration-200"
            >
              ← Back to Website
            </Link>
          </div>

          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            🎨 Daily Design Inspiration
          </h2>

          <div className="text-center mb-6 text-gray-600">
            <p className="mb-2">Get 3 amazing Awwwards sites delivered daily</p>
            <p className="text-sm">📧 Delivered at 4:30 PM ET every day</p>
          </div>

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

          {/* Feature highlights */}
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">What you'll get:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>🏆 3 award-winning sites from Awwwards</li>
              <li>🎯 Unique selection every day</li>
              <li>💡 Design tips and inspiration</li>
              <li>⚡ Beautiful, easy-to-read format</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600 text-white py-2 px-4 rounded-md hover:from-purple-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Processing...' : '🎨 Subscribe'}
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

          {/* Additional info */}
          <div className="text-center text-xs text-gray-500 mt-4">
            <p>Free forever • No spam • Unsubscribe anytime</p>
            <p className="mt-1">Sites sourced from Awwwards.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}