import axios from "axios";
import { MongoClient } from "mongodb";

// MongoDB connection
let mongoClient;
try {
  mongoClient = new MongoClient(process.env.MONGODB_URI, {
    connectTimeoutMS: 10000,
    serverSelectionTimeoutMS: 10000,
  });
} catch (error) {
  console.error("MongoDB Client Error:", error.message);
}

// Sync subscriber with MailerLite group to trigger automation
const syncSubscriberToGroup = async (email, category, frequency) => {
  try {
    const groupName = `${category}_subscribers`;
    
    // First, check if the group exists, if not create it
    try {
      await axios.get(
        `https://connect.mailerlite.com/api/groups`,
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${process.env.MAILERLITE_API_KEY}`
          }
        }
      );
    } catch (error) {
      console.log("Groups endpoint not available, proceeding with subscriber creation");
    }

    // Add subscriber to MailerLite with group assignment
    const response = await axios.post(
      "https://connect.mailerlite.com/api/subscribers",
      {
        email: email,
        groups: [groupName],
        fields: {
          category: category,
          frequency: frequency,
          subscribed_date: new Date().toISOString(),
          source: "v123_newsletter"
        },
        status: "active"
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${process.env.MAILERLITE_API_KEY}`
        }
      }
    );
    
    console.log(`Subscriber ${email} synced to MailerLite group ${groupName}`);
    return response.data;
  } catch (error) {
    console.error("MailerLite Sync Error:", error.message);
    if (error.response) {
      console.error("Error Response:", error.response.data);
    }
    throw error;
  }
};

export async function POST(req) {
  try {
    const { email, category, frequency } = await req.json();

    if (!email || !category || !frequency) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: email, category, frequency" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Connect to MongoDB
    await mongoClient.connect();
    const db = mongoClient.db("newsletter");
    const subscribers = db.collection("subscribers");

    // Save to database
    await subscribers.updateOne(
      { email },
      {
        $set: {
          email,
          category,
          frequency,
          subscribedAt: new Date(),
          mailerliteSynced: true,
        },
      },
      { upsert: true }
    );

    // Sync to MailerLite (this will trigger automation)
    const mailerliteResult = await syncSubscriberToGroup(email, category, frequency);

    // Close MongoDB connection
    await mongoClient.close();

    return new Response(
      JSON.stringify({ 
        message: `Successfully subscribed ${email} to ${category} news!`,
        mailerliteId: mailerliteResult.id,
        automationTriggered: true,
        group: `${category}_subscribers`
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Sync Error:", error.message);
    
    // Close MongoDB connection
    if (mongoClient) {
      await mongoClient.close();
    }

    return new Response(
      JSON.stringify({ 
        error: "Failed to sync subscriber",
        details: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email parameter required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Connect to MongoDB
    await mongoClient.connect();
    const db = mongoClient.db("newsletter");
    const subscribers = db.collection("subscribers");

    // Get subscriber info
    const subscriber = await subscribers.findOne({ email });

    // Close MongoDB connection
    await mongoClient.close();

    if (!subscriber) {
      return new Response(
        JSON.stringify({ error: "Subscriber not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        subscriber,
        group: `${subscriber.category}_subscribers`
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Get Subscriber Error:", error.message);
    
    // Close MongoDB connection
    if (mongoClient) {
      await mongoClient.close();
    }

    return new Response(
      JSON.stringify({ 
        error: "Failed to get subscriber info",
        details: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
} 