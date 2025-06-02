// pages/api/subscribe.js
import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body;
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db('newsletter');
    await db.collection('subscribers').insertOne({ email, subscribedAt: new Date() });
    client.close();
    res.status(200).json({ message: 'Subscribed successfully!' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}