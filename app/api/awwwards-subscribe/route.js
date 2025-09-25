import { MongoClient } from "mongodb";
import validator from "validator";
import { Resend } from "resend";

let resend;
try {
  if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
} catch (error) {
  console.warn("Resend initialization failed:", error.message);
}

let mongoClient;
try {
  if (process.env.MONGODB_URI) {
    mongoClient = new MongoClient(process.env.MONGODB_URI, {
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
    });
  }
} catch (error) {
  console.warn("MongoDB Client initialization failed:", error.message);
}

const sendWelcomeEmail = async (email) => {
  if (!resend) {
    console.warn("Resend not configured, skipping welcome email");
    return;
  }

  const welcomeHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Daily Design Inspiration</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.4;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 0;
          background-color: #ffffff;
        }
        .container {
          background: #ffffff;
          margin: 0;
          padding: 0;
        }
        .header {
          background: #ffffff;
          padding: 30px 20px 20px 20px;
          text-align: left;
          border-bottom: 1px solid #e5e5e5;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
          color: #333333;
        }
        .content {
          padding: 30px 20px;
        }
        .welcome-message {
          margin-bottom: 20px;
        }
        .welcome-message p {
          margin: 0 0 15px 0;
          font-size: 14px;
          color: #666666;
        }
        .footer {
          text-align: center;
          padding: 20px;
          background: #f8f8f8;
          color: #666666;
          border-top: 1px solid #e5e5e5;
        }
        .footer p {
          margin: 5px 0;
          font-size: 12px;
        }
        .footer a {
          color: #0066cc;
          text-decoration: none;
        }
        .footer a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Daily Design Inspiration</h1>
        </div>

        <div class="content">
          <div class="welcome-message">
            <p><strong>Hi there!</strong></p>
            <p>Welcome to your daily design inspiration. Every day at 4:30 PM ET, you'll receive 3 amazing sites from Awwwards directly in your inbox.</p>
            <p>Each email will feature award-winning websites with clean screenshots and direct links to explore the designs.</p>
            <p>Your first daily digest will arrive at 4:30 PM ET today.</p>
            <p>Thanks for subscribing!</p>
          </div>
        </div>

        <div class="footer">
          <p><a href="/subscribe">Unsubscribe</a> | <a href="mailto:ayotomiwawaledurojaye@gmail.com">Contact</a></p>
          <p>Daily Design Inspiration</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.RESEND_FROM_NAME || "V123 Design"} <${process.env.RESEND_FROM_EMAIL}>`,
      to: [email],
      subject: "Welcome to Daily Design Inspiration",
      html: welcomeHtml,
    });

    if (error) {
      throw new Error(`Resend API error: ${JSON.stringify(error)}`);
    }

    console.log(`Welcome email sent to ${email}`);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error(`Failed to send welcome email to ${email}:`, error.message);
    throw error;
  }
};

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");
  const email = searchParams.get("email");

  // Validate email
  if (email && !validator.isEmail(email)) {
    return new Response(
      JSON.stringify({ error: "Invalid email format" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  if (!mongoClient) {
    return new Response(
      JSON.stringify({ error: "Database not configured" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  let db, awwwardsSubscribers;
  try {
    await mongoClient.connect();
    db = mongoClient.db("newsletter");
    awwwardsSubscribers = db.collection("awwwards_subscribers");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    return new Response(
      JSON.stringify({ error: "Database connection failed" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    if (action === "subscribe") {
      if (!email) {
        return new Response(
          JSON.stringify({ error: "Email is required for subscription" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      console.log(`[AWWWARDS SUBSCRIBE] Processing subscription for ${email}`);

      // Check if already subscribed
      const existing = await awwwardsSubscribers.findOne({ email });
      if (existing) {
        if (existing.status === "active") {
          return new Response(
            JSON.stringify({
              message: "Email is already subscribed to Awwwards digest",
              email: email,
              status: "already_subscribed"
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          );
        } else {
          // Reactivate if previously unsubscribed
          await awwwardsSubscribers.updateOne(
            { email },
            {
              $set: {
                status: "active",
                resubscribedAt: new Date(),
                updatedAt: new Date()
              }
            }
          );
        }
      } else {
        // Create new subscription
        await awwwardsSubscribers.insertOne({
          email,
          status: "active",
          subscribedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      // Send welcome email
      try {
        await sendWelcomeEmail(email);
      } catch (welcomeError) {
        console.error("Failed to send welcome email:", welcomeError.message);
        // Don't fail the subscription if welcome email fails
      }

      // Send admin notification
      if (process.env.ADMIN_EMAIL && resend) {
        try {
          await resend.emails.send({
            from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
            to: [process.env.ADMIN_EMAIL],
            subject: "New Awwwards Subscription",
            html: `
              <div style="font-family: Arial, sans-serif;">
                <h3>New Awwwards Subscription</h3>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subscribed:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Type:</strong> ${existing ? 'Resubscription' : 'New Subscriber'}</p>
              </div>
            `,
          });
        } catch (adminError) {
          console.error("Failed to send admin notification:", adminError.message);
        }
      }

      return new Response(
        JSON.stringify({
          message: "Successfully subscribed to Awwwards daily design inspiration!",
          email: email,
          status: "subscribed",
          welcomeEmailSent: true
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );

    } else if (action === "unsubscribe") {
      if (!email) {
        return new Response(
          JSON.stringify({ error: "Email is required for unsubscription" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      console.log(`[AWWWARDS SUBSCRIBE] Processing unsubscription for ${email}`);

      const result = await awwwardsSubscribers.updateOne(
        { email },
        {
          $set: {
            status: "unsubscribed",
            unsubscribedAt: new Date(),
            updatedAt: new Date()
          }
        }
      );

      if (result.matchedCount === 0) {
        return new Response(
          JSON.stringify({
            message: "Email not found in Awwwards subscribers",
            email: email
          }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // Send unsubscribe confirmation
      if (resend) {
        try {
          await resend.emails.send({
            from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
            to: [email],
            subject: "Unsubscribed from Design Inspiration",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2>👋 Sorry to see you go!</h2>
                <p>You've been successfully unsubscribed from the Daily Design Inspiration digest.</p>
                <p>If this was a mistake, you can always <a href="/subscribe">resubscribe here</a>.</p>
                <p style="color: #666; font-style: italic;">Thanks for being part of our creative community!</p>
              </div>
            `,
          });
        } catch (emailError) {
          console.error("Failed to send unsubscribe confirmation:", emailError.message);
        }
      }

      return new Response(
        JSON.stringify({
          message: "Successfully unsubscribed from Awwwards digest",
          email: email,
          status: "unsubscribed"
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );

    } else if (action === "status") {
      if (!email) {
        return new Response(
          JSON.stringify({ error: "Email is required to check status" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const subscriber = await awwwardsSubscribers.findOne({ email });

      return new Response(
        JSON.stringify({
          email: email,
          subscribed: subscriber ? subscriber.status === "active" : false,
          status: subscriber ? subscriber.status : "not_found",
          subscribedAt: subscriber ? subscriber.subscribedAt : null
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );

    } else if (action === "list") {
      // Admin function to list subscribers
      const subscribers = await awwwardsSubscribers.find({}).toArray();

      return new Response(
        JSON.stringify({
          message: `Found ${subscribers.length} total Awwwards subscribers`,
          subscribers: subscribers.map(sub => ({
            email: sub.email,
            status: sub.status,
            subscribedAt: sub.subscribedAt,
            unsubscribedAt: sub.unsubscribedAt
          })),
          summary: {
            total: subscribers.length,
            active: subscribers.filter(s => s.status === "active").length,
            unsubscribed: subscribers.filter(s => s.status === "unsubscribed").length
          }
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );

    } else {
      return new Response(
        JSON.stringify({
          error: "Invalid action",
          availableActions: ["subscribe", "unsubscribe", "status", "list"]
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

  } catch (error) {
    console.error("Awwwards Subscribe API Error:", error.message);
    return new Response(
      JSON.stringify({
        error: "Failed to process subscription request",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  } finally {
    if (mongoClient) {
      try {
        await mongoClient.close();
      } catch (error) {
        console.error("MongoDB Close Error:", error.message);
      }
    }
  }
}