import { MongoClient } from "mongodb";
import { Resend } from "resend";
import axios from "axios";

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
    mongoClient = new MongoClient(process.env.MONGODB_URI);
  }
} catch (error) {
  console.warn("MongoDB Client initialization failed:", error.message);
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action") || "process-pending";

  if (!mongoClient) {
    return new Response(
      JSON.stringify({ error: "Database not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    await mongoClient.connect();
    const db = mongoClient.db("newsletter");
    const scheduledEmails = db.collection("scheduled_emails");

    if (action === "process-pending") {
      // Find emails that are due to be sent (10 minutes after subscription)
      const now = new Date();
      const pendingEmails = await scheduledEmails
        .find({
          type: "first_newsletter",
          status: "pending",
          scheduledTime: { $lte: now }
        })
        .toArray();

      console.log(`Found ${pendingEmails.length} pending emails to send`);

      let sent = 0;
      let failed = 0;

      for (const emailJob of pendingEmails) {
        try {
          // Fetch news for this subscriber
          const newsResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/news?action=fetch&category=${emailJob.category}`
          );

          if (newsResponse.data && newsResponse.data.articles) {
            // Send the newsletter
            const emailResult = await axios.get(
              `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/news?email=${encodeURIComponent(emailJob.email)}&category=${emailJob.category}`
            );

            if (emailResult.status === 200) {
              // Mark as sent
              await scheduledEmails.updateOne(
                { _id: emailJob._id },
                {
                  $set: {
                    status: "sent",
                    sentTime: now,
                    actualSubscriptionTime: emailJob.subscriptionTime
                  }
                }
              );
              sent++;
              console.log(`Sent delayed newsletter to ${emailJob.email}`);
            }
          }
        } catch (error) {
          console.error(`Failed to send delayed email to ${emailJob.email}:`, error.message);
          // Mark as failed
          await scheduledEmails.updateOne(
            { _id: emailJob._id },
            {
              $set: {
                status: "failed",
                failedTime: now,
                errorMessage: error.message
              }
            }
          );
          failed++;
        }
      }

      return new Response(
        JSON.stringify({
          message: `Processed ${pendingEmails.length} scheduled emails`,
          summary: { sent, failed }
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "Unknown action" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Scheduled emails processing error:", error.message);
    return new Response(
      JSON.stringify({ error: "Failed to process scheduled emails" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  } finally {
    if (mongoClient) {
      try {
        await mongoClient.close();
      } catch (error) {
        console.error("MongoDB close error:", error.message);
      }
    }
  }
}