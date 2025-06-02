// pages/api/schedule.js
import axios from 'axios';
import cron from 'node-cron';
import getRandomMeme from '../../lib/reddit';
import summarizeText from '../../lib/summarize';
import sendEmail from '../../lib/sendEmail';
import generateEmailContent from '../../lib/generateEmail.js';

export default async function handler(req, res) {
  try {
    // Fetch news
    const newsResponse = await axios.get(
      `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${process.env.NYT_API_KEY}`
    );
    const articles = newsResponse.data.results.slice(0, 3);

    // Summarize articles
    const summarizedArticles = await Promise.all(
      articles.map(async (article) => ({
        ...article,
        abstract: await summarizeText(article.abstract || article.title),
      }))
    );

    // Fetch meme
    const meme = await getRandomMeme();

    // Generate email content
    const emailHtml = generateEmailContent(summarizedArticles, meme);

    // Send email to subscribers (replace with your subscriber list)
    const subscribers = ['user1@example.com', 'user2@example.com']; // Replace with real list
    await Promise.all(
      subscribers.map((email) =>
        sendEmail(email, 'Daily News & Meme Digest', emailHtml)
      )
    );

    res.status(200).json({ message: 'Emails scheduled successfully' });
  } catch (error) {
    console.error('Scheduling Error:', error.message);
    res.status(500).json({ error: 'Failed to schedule emails' });
  }
}

// Schedule the task (runs daily at 8 AM)
cron.schedule('0 8 * * *', async () => {
  console.log('Running daily email task...');
  await handler({}, { status: () => ({ json: () => {} }) });
});

// For weekly emails, use: '0 8 * * 1' (every Monday at 8 AM)