import axios from "axios";
import { MongoClient } from "mongodb";
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

const sendAwwwardsEmail = async (email, websites) => {
  if (!resend) {
    throw new Error("Resend client not initialized");
  }

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Today's Design Just for you</title>
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
        .header p {
          margin: 8px 0 0 0;
          font-size: 14px;
          color: #666666;
        }
        .content {
          padding: 30px 20px;
        }
        .website-list {
          margin: 0;
          padding: 0;
        }
        .website-item {
          margin-bottom: 30px;
          padding-bottom: 25px;
          border-bottom: 1px solid #f0f0f0;
        }
        .website-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        .website-screenshot {
          width: 100%;
          height: auto;
          margin-bottom: 15px;
          border: 1px solid #e5e5e5;
          display: block;
        }
        .website-title {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
          color: #333333;
          line-height: 1.3;
        }
        .website-link {
          color: #0066cc;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
        }
        .website-link:hover {
          text-decoration: underline;
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
          <h1>Today's Design Just for you</h1>
          <p>${new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}</p>
        </div>

        <div class="content">
          <div class="website-list">
            ${websites.map((site, index) => `
              <div class="website-item">
                ${(site.screenshotUrl || site.thumbnailUrl) ? `
                  <img src="${site.screenshotUrl || site.thumbnailUrl}"
                       alt="${site.siteName} screenshot"
                       class="website-screenshot"
                       onerror="this.style.display='none';">
                ` : ''}

                <h3 class="website-title">${site.siteName}</h3>
                <a href="${site.actualWebsiteUrl || site.siteUrl}"
                   class="website-link"
                   target="_blank"
                   rel="noopener noreferrer">Visit Website</a>
              </div>
            `).join('')}
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
      subject: "Today's Design Just for you",
      html: emailHtml,
    });

    if (error) {
      throw new Error(`Resend API error: ${JSON.stringify(error)}`);
    }

    return {
      success: true,
      messageId: data?.id,
      message: "Awwwards email sent successfully"
    };
  } catch (error) {
    console.error(`Failed to send Awwwards email to ${email}:`, error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const testEmail = searchParams.get("test");

  if (!mongoClient) {
    return new Response(
      JSON.stringify({ error: "MongoDB not configured" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  let db, awwwardsSubscribers, awwwardsSites, deliveryLogs;
  try {
    await mongoClient.connect();
    db = mongoClient.db("newsletter");
    awwwardsSubscribers = db.collection("awwwards_subscribers");
    awwwardsSites = db.collection("awwwards_sites");
    deliveryLogs = db.collection("awwwards_delivery_logs");
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
    console.log("[AWWWARDS DELIVERY] Starting email delivery process...");

    // Get subscribers
    let subscribers;
    if (testEmail) {
      // For test emails, create a mock subscriber object with the test email
      subscribers = [{ email: testEmail, status: "test" }];
      console.log(`[AWWWARDS DELIVERY] Test mode: Processing ${testEmail}`);
    } else {
      subscribers = await awwwardsSubscribers.find({ status: "active" }).toArray();
      console.log(`[AWWWARDS DELIVERY] Found ${subscribers.length} active subscribers`);

      if (subscribers.length === 0) {
        return new Response(
          JSON.stringify({
            message: "No active subscribers found",
            results: [],
            summary: { total: 0, sent: 0, failed: 0 }
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    // Get today's Awwwards sites
    const today = new Date().toISOString().split('T')[0];
    const todaySites = await awwwardsSites.find({ dateAdded: today }).toArray();

    console.log(`[AWWWARDS DELIVERY] Found ${todaySites.length} sites scraped today`);

    if (todaySites.length < 3) {
      // Try to get sites from yesterday if not enough from today
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const yesterdaySites = await awwwardsSites.find({ dateAdded: yesterdayStr }).toArray();
      console.log(`[AWWWARDS DELIVERY] Using ${yesterdaySites.length} sites from yesterday as fallback`);

      if (yesterdaySites.length > 0) {
        todaySites.push(...yesterdaySites);
      }
    }

    if (todaySites.length === 0) {
      return new Response(
        JSON.stringify({
          error: "No Awwwards sites available for delivery",
          message: "Please run the scraper first: /api/awwwards?action=scrape"
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const results = [];
    const deliveryTimestamp = new Date();

    // Process each subscriber
    for (const subscriber of subscribers) {
      try {
        console.log(`[AWWWARDS DELIVERY] Processing ${subscriber.email}...`);

        // Get 3 random sites for this subscriber
        const shuffled = todaySites.sort(() => 0.5 - Math.random());
        const selectedSites = shuffled.slice(0, 3);

        // Ensure we have at least 3 sites (duplicate if necessary)
        while (selectedSites.length < 3 && todaySites.length > 0) {
          selectedSites.push(todaySites[selectedSites.length % todaySites.length]);
        }

        if (selectedSites.length === 0) {
          throw new Error("No sites available for selection");
        }

        // Send email
        const emailResult = await sendAwwwardsEmail(subscriber.email, selectedSites);

        // Log successful delivery (skip logging for test emails)
        if (!testEmail) {
          await deliveryLogs.insertOne({
            email: subscriber.email,
            deliveredAt: deliveryTimestamp,
            sitesDelivered: selectedSites.map(site => ({
              siteName: site.siteName,
              siteUrl: site.siteUrl,
              thumbnailUrl: site.thumbnailUrl
            })),
            messageId: emailResult.messageId,
            status: "sent"
          });
        }

        results.push({
          email: subscriber.email,
          status: "sent",
          sitesCount: selectedSites.length,
          messageId: emailResult.messageId
        });

        // Rate limiting - wait between emails
        if (subscribers.length > 1) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }

      } catch (error) {
        console.error(`[AWWWARDS DELIVERY] Failed to send to ${subscriber.email}:`, error.message);

        // Log failed delivery (skip logging for test emails)
        if (!testEmail) {
          await deliveryLogs.insertOne({
            email: subscriber.email,
            deliveredAt: deliveryTimestamp,
            error: error.message,
            status: "failed"
          });
        }

        results.push({
          email: subscriber.email,
          status: "failed",
          error: error.message
        });
      }
    }

    const summary = {
      total: subscribers.length,
      sent: results.filter(r => r.status === "sent").length,
      failed: results.filter(r => r.status === "failed").length,
      timestamp: deliveryTimestamp.toISOString(),
      sitesAvailable: todaySites.length
    };

    console.log(`[AWWWARDS DELIVERY] Completed: ${summary.sent} sent, ${summary.failed} failed`);

    return new Response(
      JSON.stringify({
        message: `Awwwards delivery completed: ${summary.sent}/${summary.total} emails sent`,
        results,
        summary
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Awwwards Delivery Error:", error.message);
    return new Response(
      JSON.stringify({
        error: "Failed to process Awwwards delivery",
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