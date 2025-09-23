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

// Get or create MailerLite group for category
const getOrCreateGroup = async (category) => {
  try {
    const groupName = `${category.charAt(0).toUpperCase() + category.slice(1)} Newsletter`;

    // First, try to get existing groups
    const groupsResponse = await axios.get(
      "https://connect.mailerlite.com/api/groups",
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${process.env.MAILERLITE_API_KEY}`
        }
      }
    );

    // Check if group already exists
    const existingGroup = groupsResponse.data.data.find(group => group.name === groupName);
    if (existingGroup) {
      console.log(`Using existing group: ${groupName} (ID: ${existingGroup.id})`);
      return existingGroup.id;
    }

    // Create new group if it doesn't exist
    const createResponse = await axios.post(
      "https://connect.mailerlite.com/api/groups",
      {
        name: groupName
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${process.env.MAILERLITE_API_KEY}`
        }
      }
    );

    console.log(`Created new group: ${groupName} (ID: ${createResponse.data.data.id})`);
    return createResponse.data.data.id;

  } catch (error) {
    console.error("=== GROUP CREATION/RETRIEVAL ERROR ===");
    console.error("Error message:", error.message);
    console.error("Category:", category);
    console.error("Group name attempted:", `${category.charAt(0).toUpperCase() + category.slice(1)} Newsletter`);

    if (error.response) {
      console.error("HTTP Status:", error.response.status);
      console.error("API Response:", JSON.stringify(error.response.data, null, 2));
      console.error("Request headers:", JSON.stringify(error.response.config?.headers, null, 2));
    }

    if (error.code) {
      console.error("Error code:", error.code);
    }

    console.error("=== END GROUP ERROR ===");
    return null; // Will fall back to subscriber without group
  }
};

// Sync subscriber with MailerLite and assign to proper group
const syncSubscriberToGroup = async (email, category, frequency) => {
  try {
    // Extract name from email for better presentation
    const name = email.split('@')[0].replace(/[._-]/g, ' ').split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    // Get or create the appropriate group
    const groupId = await getOrCreateGroup(category);

    // Prepare subscriber data with clean, professional fields
    const subscriberData = {
      email: email,
      name: name, // Proper name instead of email
      fields: {
        category: category,
        frequency: frequency,
        subscribed_date: new Date().toISOString(),
        source: "v123_newsletter"
      },
      status: "active"
    };

    // Add group assignment if group was created/found
    if (groupId) {
      subscriberData.groups = [groupId.toString()];
    }

    // Add subscriber to MailerLite
    const response = await axios.post(
      "https://connect.mailerlite.com/api/subscribers",
      subscriberData,
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${process.env.MAILERLITE_API_KEY}`
        }
      }
    );

    console.log(`Subscriber ${email} (${name}) synced to MailerLite`);
    if (groupId) {
      console.log(`Assigned to group: ${category.charAt(0).toUpperCase() + category.slice(1)} Newsletter`);
    }
    console.log(`Subscriber added to group for campaign targeting`);

    return {
      ...response.data,
      groupId: groupId,
      groupName: groupId ? `${category.charAt(0).toUpperCase() + category.slice(1)} Newsletter` : null
    };
  } catch (error) {
    console.error("=== MAILERLITE SYNC ERROR ===");
    console.error("Error message:", error.message);
    console.error("Email:", email);
    console.error("Category:", category);
    console.error("Frequency:", frequency);
    console.error("Subscriber data sent:", JSON.stringify({
      email,
      name: email.split('@')[0].replace(/[._-]/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      fields: { category, frequency, subscribed_date: new Date().toISOString(), source: "v123_newsletter" },
      status: "active"
    }, null, 2));

    if (error.response) {
      console.error("HTTP Status:", error.response.status);
      console.error("API Response:", JSON.stringify(error.response.data, null, 2));
      console.error("Request URL:", error.response.config?.url);
      console.error("Request method:", error.response.config?.method);
      console.error("Request headers:", JSON.stringify(error.response.config?.headers, null, 2));
    }

    if (error.code) {
      console.error("Error code:", error.code);
    }

    console.error("=== END SYNC ERROR ===");
    throw error;
  }
};

export async function POST(req) {
  try {
    // Validate environment variables
    const requiredEnvVars = {
      MAILERLITE_API_KEY: process.env.MAILERLITE_API_KEY,
      MONGODB_URI: process.env.MONGODB_URI
    };

    const missingEnvVars = Object.entries(requiredEnvVars)
      .filter(([, value]) => !value)
      .map(([key]) => key);

    if (missingEnvVars.length > 0) {
      console.error("Missing environment variables:", missingEnvVars);
      return new Response(
        JSON.stringify({
          error: "Server configuration error",
          details: `Missing environment variables: ${missingEnvVars.join(', ')}`
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

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

    // Connect to MongoDB with validation
    console.log("Attempting MongoDB connection...");
    let db, subscribers;
    try {
      await mongoClient.connect();
      console.log("MongoDB connection successful");

      // Test the connection
      db = mongoClient.db("newsletter");
      await db.admin().ping();
      console.log("MongoDB ping successful");

      subscribers = db.collection("subscribers");
    } catch (mongoError) {
      console.error("=== MONGODB CONNECTION ERROR ===");
      console.error("Error message:", mongoError.message);
      console.error("MongoDB URI configured:", !!process.env.MONGODB_URI);
      console.error("Error code:", mongoError.code);
      console.error("=== END MONGODB ERROR ===");

      return new Response(
        JSON.stringify({
          error: "Database connection failed",
          details: mongoError.message,
          suggestion: "Check your MONGODB_URI environment variable and database status"
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

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

    // Sync to MailerLite (subscriber ready for campaigns)
    console.log(`Syncing ${email} to MailerLite for campaign targeting...`);
    const mailerliteResult = await syncSubscriberToGroup(email, category, frequency);

    // Close MongoDB connection
    await mongoClient.close();

    return new Response(
      JSON.stringify({
        message: `Successfully subscribed ${email} to ${category} news!`,
        mailerliteId: mailerliteResult.data?.id || mailerliteResult.id,
        campaignReady: true,
        group: mailerliteResult.groupName || `${category.charAt(0).toUpperCase() + category.slice(1)} Newsletter`,
        groupId: mailerliteResult.groupId,
        subscriberName: email.split('@')[0].replace(/[._-]/g, ' ').split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        nextSteps: [
          "Subscriber has been added to MailerLite group",
          "Create campaigns targeting this group in MailerLite dashboard",
          "Campaigns can now be sent to this subscriber"
        ]
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
    const debug = searchParams.get("debug");

    // Debug endpoint to test MailerLite connectivity
    if (debug === "true") {
      console.log("=== MAILERLITE DEBUG TEST ===");

      // Check environment variables
      const envCheck = {
        MAILERLITE_API_KEY: !!process.env.MAILERLITE_API_KEY,
        MONGODB_URI: !!process.env.MONGODB_URI,
        MAILERLITE_FROM_EMAIL: !!process.env.MAILERLITE_FROM_EMAIL,
        MAILERLITE_FROM_NAME: !!process.env.MAILERLITE_FROM_NAME
      };

      console.log("Environment variables status:", envCheck);

      // Test MailerLite API connectivity
      try {
        console.log("Testing MailerLite API connectivity...");
        const testResponse = await axios.get(
          "https://connect.mailerlite.com/api/me",
          {
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${process.env.MAILERLITE_API_KEY}`
            }
          }
        );

        console.log("MailerLite API test successful:", testResponse.data);

        // Test groups endpoint
        const groupsResponse = await axios.get(
          "https://connect.mailerlite.com/api/groups",
          {
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${process.env.MAILERLITE_API_KEY}`
            }
          }
        );

        console.log("Groups fetched successfully:", groupsResponse.data.data?.length || 0, "groups");

        return new Response(
          JSON.stringify({
            status: "success",
            environment: envCheck,
            mailerlite: {
              connection: "success",
              account: testResponse.data.data,
              groups: {
                count: groupsResponse.data.data?.length || 0,
                names: groupsResponse.data.data?.map(g => g.name) || []
              }
            },
            timestamp: new Date().toISOString()
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );

      } catch (apiError) {
        console.error("MailerLite API test failed:", apiError.message);
        if (apiError.response) {
          console.error("API Error Response:", JSON.stringify(apiError.response.data, null, 2));
        }

        return new Response(
          JSON.stringify({
            status: "error",
            environment: envCheck,
            mailerlite: {
              connection: "failed",
              error: apiError.message,
              status: apiError.response?.status,
              details: apiError.response?.data
            },
            timestamp: new Date().toISOString()
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email parameter required. Use ?debug=true to test connectivity." }),
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
        group: `${subscriber.category}_sub`
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