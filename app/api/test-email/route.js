import { Resend } from "resend";

let resend;
try {
  if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
} catch (error) {
  console.warn("Resend initialization failed:", error.message);
}

export async function POST(req) {
  try {
    const { to, subject, html } = await req.json();

    console.log(`[TEST EMAIL] Attempting to send test email to: ${to}`);
    console.log(`[TEST EMAIL] Subject: ${subject}`);
    console.log(`[TEST EMAIL] Resend client initialized: ${!!resend}`);

    if (!resend) {
      console.error("[TEST EMAIL ERROR] Resend client not initialized - check RESEND_API_KEY");
      return new Response(
        JSON.stringify({
          error: "Email service not configured",
          details: "Resend API key missing"
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!process.env.RESEND_FROM_EMAIL) {
      console.error("[TEST EMAIL ERROR] RESEND_FROM_EMAIL not set");
      return new Response(
        JSON.stringify({
          error: "Email configuration incomplete",
          details: "From email address not configured"
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { data, error } = await resend.emails.send({
      from: `${process.env.RESEND_FROM_NAME || "V123 Test"} <${process.env.RESEND_FROM_EMAIL}>`,
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error("[TEST EMAIL ERROR] Resend API error:", error);
      return new Response(
        JSON.stringify({
          error: "Failed to send test email",
          details: JSON.stringify(error)
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.log(`[TEST EMAIL SUCCESS] Test email sent to ${to} with ID: ${data?.id}`);

    return new Response(
      JSON.stringify({
        message: "Test email sent successfully via Resend!",
        id: data?.id,
        service: "Resend"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[TEST EMAIL ERROR] Unexpected error:", {
      message: error.message,
      stack: error.stack
    });

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