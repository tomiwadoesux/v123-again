// /app/test-newsletter/page.js
"use client";
import { useState } from 'react';

export default function TestNewsletter() {
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('top');
  const [frequency, setFrequency] = useState('daily');
  const [response, setResponse] = useState('');

  const categories = ['top', 'world', 'business', 'technology', 'sports', 'entertainment'];

  const handleSubscribe = async () => {
    const res = await fetch(
      `/api/news?action=subscribe&email=${encodeURIComponent(email)}&category=${category}&frequency=${frequency}`
    );
    const data = await res.json();
    setResponse(JSON.stringify(data, null, 2));
  };

  const handleUnsubscribe = async () => {
    const res = await fetch(`/api/news?action=unsubscribe&email=${encodeURIComponent(email)}`);
    const data = await res.json();
    setResponse(JSON.stringify(data, null, 2));
  };

  const handleSend = async () => {
    const res = await fetch(`/api/news?category=${category}&email=${encodeURIComponent(email)}`);
    const data = await res.json();
    setResponse(JSON.stringify(data, null, 2));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Newsletter API</h1>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="test@example.com"
        />
      </div>
      <div>
        <label>Category:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Frequency:</label>
        <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>
      <button onClick={handleSubscribe}>Subscribe</button>
      <button onClick={handleUnsubscribe}>Unsubscribe</button>
      <button onClick={handleSend}>Send News</button>
      <pre>{response}</pre>
    </div>
  );
}
