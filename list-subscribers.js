const { MongoClient } = require("mongodb");
require("dotenv").config({ path: ".env.local" });

async function listSubscribers() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db("newsletter");
    const subscribers = db.collection("subscribers");

    const allSubscribers = await subscribers.find({}).toArray();

    console.log(`\n📊 Total subscribers: ${allSubscribers.length}`);

    if (allSubscribers.length > 0) {
      console.log("\n📧 Subscriber Emails:");
      allSubscribers.forEach((sub, index) => {
        console.log(`${index + 1}. ${sub.email}`);
      });
    } else {
      console.log("No subscribers found.");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await client.close();
  }
}

listSubscribers().catch(console.error);
