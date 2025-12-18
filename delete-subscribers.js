const { MongoClient } = require("mongodb");
require("dotenv").config({ path: ".env.local" });

async function deleteAllSubscribers() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db("newsletter");
    const subscribers = db.collection("subscribers");

    const count = await subscribers.countDocuments();
    console.log(`\nFound ${count} subscribers.`);

    if (count === 0) {
      console.log("No subscribers to delete.");
      return;
    }

    const result = await subscribers.deleteMany({});
    console.log(
      `\n🗑️  Successfully deleted ${result.deletedCount} subscribers.`
    );
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await client.close();
  }
}

deleteAllSubscribers().catch(console.error);
