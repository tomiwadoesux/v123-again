"use client";
import { useState } from "react";

export default function TestAutomation() {
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("technology");
  const [frequency, setFrequency] = useState("daily");
  const [response, setResponse] = useState("");
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

  const handleSubscribeWithAutomation = async () => {
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

  const handleDirectSync = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/mailerlite-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          category,
          frequency
        })
      });
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse(JSON.stringify({ error: error.message }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const handleCheckSubscriber = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/mailerlite-sync?email=${encodeURIComponent(email)}`
      );
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse(JSON.stringify({ error: error.message }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", color: "#333", marginBottom: "30px" }}>
        🚀 MailerLite Automation Test
      </h1>
      
      <div style={{ 
        backgroundColor: "#f8f9fa", 
        padding: "20px", 
        borderRadius: "10px", 
        marginBottom: "30px",
        border: "2px solid #e9ecef"
      }}>
        <h3 style={{ color: "#495057", marginBottom: "15px" }}>📋 How Automation Works:</h3>
        <ol style={{ color: "#6c757d", lineHeight: "1.6" }}>
          <li><strong>Subscribe:</strong> User subscribes via your API</li>
          <li><strong>Sync:</strong> Subscriber is added to MailerLite group (e.g., "technology_subscribers")</li>
          <li><strong>Trigger:</strong> MailerLite automation detects new group member</li>
          <li><strong>Welcome:</strong> Automation sends welcome email sequence</li>
          <li><strong>Follow-up:</strong> Additional emails based on engagement</li>
        </ol>
      </div>
      
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
          onClick={handleSubscribeWithAutomation} 
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
          {loading ? 'Loading...' : '🚀 Subscribe + Trigger Automation'}
        </button>
        <button 
          onClick={handleDirectSync} 
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
          {loading ? 'Loading...' : '📡 Direct MailerLite Sync'}
        </button>
        <button 
          onClick={handleCheckSubscriber} 
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
          {loading ? 'Loading...' : '🔍 Check Subscriber Status'}
        </button>
      </div>

      {response && (
        <div style={{ marginTop: "30px" }}>
          <h3 style={{ color: "#333", marginBottom: "15px" }}>📊 API Response:</h3>
          <pre style={{ 
            backgroundColor: "#f5f5f5", 
            padding: "15px", 
            borderRadius: "5px", 
            overflow: "auto",
            fontSize: "12px",
            border: "1px solid #ddd"
          }}>
            {response}
          </pre>
        </div>
      )}

      <div style={{ 
        backgroundColor: "#e7f3ff", 
        padding: "20px", 
        borderRadius: "10px", 
        marginTop: "30px",
        border: "1px solid #b3d9ff"
      }}>
        <h3 style={{ color: "#0056b3", marginBottom: "15px" }}>🎯 Next Steps in MailerLite:</h3>
        <ol style={{ color: "#0056b3", lineHeight: "1.6" }}>
          <li><strong>Create Groups:</strong> technology_subscribers, business_subscribers, etc.</li>
          <li><strong>Set Up Automation:</strong> "Advanced Welcome Email" template</li>
          <li><strong>Configure Trigger:</strong> "Subscriber added to group"</li>
          <li><strong>Design Workflow:</strong> Welcome → Onboarding → Engagement</li>
          <li><strong>Test:</strong> Use this page to trigger automation</li>
        </ol>
      </div>
    </div>
  );
} 