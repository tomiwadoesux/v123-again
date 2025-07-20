import axios from "axios";

export async function POST(req) {
  try {
    const { to, subject, html } = await req.json();

    const response = await axios.post(
      "https://connect.mailerlite.com/api/emails",
      {
        recipients: [{ email: to }],
        subject: subject,
        html_body: html,
        from: { 
          email: process.env.MAILERLITE_FROM_EMAIL,
          name: process.env.MAILERLITE_FROM_NAME || "V123 Newsletter"
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${process.env.MAILERLITE_API_KEY}`
        }
      }
    );

    return new Response(
      JSON.stringify({ 
        message: "Test email sent successfully!",
        id: response.data.id 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Test Email Error:", error.message);
    if (error.response) {
      console.error("Error Response:", error.response.data);
    }

    return new Response(
      JSON.stringify({ 
        error: "Failed to send test email",
        details: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
} 