// /app/test-newsletter/page.js
"use client";
import { useState } from "react";

import FormData from "form-data"; // form-data v4.0.1
import Mailgun from "mailgun.js"; // mailgun.js v11.1.0

// import ThreeSection from "components/ThreeSection";

async function sendSimpleMessage() {
  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({
    username: "api",
    key: process.env.NEXT_PUBLIC_MAILGUN_API_KEY || process.env.MAILGUN_API_KEY || "API_KEY",
    // When you have an EU-domain, you must specify the endpoint:
    // url: "https://api.eu.mailgun.net"
  });
  try {
    const data = await mg.messages.create(process.env.NEXT_PUBLIC_MAILGUN_DOMAIN || "newsletter.ayotomcs.me", {
      from: process.env.NEXT_PUBLIC_MAILGUN_FROM_EMAIL || "postmaster@newsletter.ayotomcs.me",
      to: ["Wale-Durojaye Ayotomiwa <ayotomiwawaledurojaye@gmail.com>"],
      subject: "Hello Wale-Durojaye Ayotomiwa",
      text: "Congratulations Wale-Durojaye Ayotomiwa, you just sent an email with Mailgun! You are truly awesome!",
    });

    console.log(data); // logs response data
  } catch (error) {
    console.log(error); //logs any error
  }
}

export default function TestNewsletter() {
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("top");
  const [frequency, setFrequency] = useState("daily");
  const [response, setResponse] = useState("");
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      const res = await fetch(
        `/api/news?action=subscribe&email=${encodeURIComponent(
          email
        )}&category=${category}&frequency=${frequency}`
      );
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse(JSON.stringify({ error: error.message }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/news?action=unsubscribe&email=${encodeURIComponent(email)}`
      );
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse(JSON.stringify({ error: error.message }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/news?category=${category}&email=${encodeURIComponent(email)}`
      );
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse(JSON.stringify({ error: error.message }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const handleShowNews = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/news?category=${category}&action=fetch`
      );
      const data = await res.json();
      setNewsData(data);
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse(JSON.stringify({ error: error.message }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", color: "#333", marginBottom: "30px" }}>Test Newsletter API</h1>
      
      <div style={{ display: "grid", gap: "15px", marginBottom: "30px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="test@example.com"
            style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Category:</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Frequency:</label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", marginBottom: "30px" }}>
        <button 
          onClick={handleShowNews} 
          disabled={loading}
          style={{ 
            backgroundColor: '#28a745', 
            color: 'white', 
            padding: '12px 20px', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Loading...' : 'Show News on Screen'}
        </button>
        <button 
          onClick={handleSubscribe} 
          disabled={loading}
          style={{ 
            backgroundColor: '#007bff', 
            color: 'white', 
            padding: '12px 20px', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Loading...' : 'Subscribe'}
        </button>
        <button 
          onClick={handleUnsubscribe} 
          disabled={loading}
          style={{ 
            backgroundColor: '#dc3545', 
            color: 'white', 
            padding: '12px 20px', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Loading...' : 'Unsubscribe'}
        </button>
        <button 
          onClick={handleSend} 
          disabled={loading}
          style={{ 
            backgroundColor: '#ffc107', 
            color: 'black', 
            padding: '12px 20px', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Loading...' : 'Send News'}
        </button>
        <button 
          onClick={sendSimpleMessage} 
          disabled={loading}
          style={{ 
            backgroundColor: '#6f42c1', 
            color: 'white', 
            padding: '12px 20px', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Loading...' : 'Test Mailgun Email'}
        </button>
      </div>

      {newsData && newsData.articles && (
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ color: "#333", marginBottom: "20px" }}>Latest {category} News:</h2>
          <div style={{ display: "grid", gap: "20px" }}>
            {newsData.articles.map((article, index) => (
              <div key={index} style={{ 
                border: "1px solid #ddd", 
                borderRadius: "8px", 
                padding: "20px",
                backgroundColor: "#f9f9f9"
              }}>
                <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>{article.title}</h3>
                <p style={{ margin: "0 0 15px 0", color: "#666", lineHeight: "1.5" }}>
                  {article.description}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      color: "#007bff", 
                      textDecoration: "none", 
                      fontWeight: "bold" 
                    }}
                  >
                    Read Full Article →
                  </a>
                  <span style={{ color: "#999", fontSize: "12px" }}>
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "8px" }}>
        <h3 style={{ margin: "0 0 15px 0", color: "#333" }}>API Response:</h3>
        <pre style={{ 
          backgroundColor: "#fff", 
          padding: "15px", 
          borderRadius: "5px", 
          overflow: "auto",
          fontSize: "12px",
          border: "1px solid #ddd"
        }}>
          {response || "No response yet. Click a button above to test the API."}
        </pre>
      </div>
    </div>
  );
}
