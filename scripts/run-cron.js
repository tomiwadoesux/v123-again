const { MongoClient } = require("mongodb");
const axios = require("axios");
const { Resend } = require("resend");
const { HfInference } = require("@huggingface/inference");
const cheerio = require("cheerio");
require("dotenv").config({ path: ".env.local" });

// Configuration
const MONGODB_URI = process.env.MONGODB_URI;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NEWSAPI_KEY = process.env.NEWSAPI_KEY;
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const GIPHY_API_KEY = process.env.GIPHY_API_KEY;

if (!MONGODB_URI || !RESEND_API_KEY) {
  console.error("❌ Missing required environment variables.");
  process.exit(1);
}

const resend = new Resend(RESEND_API_KEY);
const hf = new HfInference(HUGGINGFACE_API_KEY);

// --- Helper Functions ---

async function getRandomGiphy() {
  try {
    const tags = ["funny", "happy", "news", "excited", "thumbs up"];
    const tag = tags[Math.floor(Math.random() * tags.length)];
    const res = await axios.get(`https://api.giphy.com/v1/gifs/random`, {
      params: { api_key: GIPHY_API_KEY, tag, rating: "pg" },
      timeout: 5000,
    });
    return (
      res.data.data?.images?.original?.url ||
      "https://media.giphy.com/media/l0HlO3BJ8LxrZ4Khq/giphy.gif"
    );
  } catch (e) {
    console.error("Giphy Error:", e.message);
    return "https://media.giphy.com/media/l0HlO3BJ8LxrZ4Khq/giphy.gif";
  }
}

async function scrapeArticle(url) {
  try {
    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      timeout: 5000,
    });
    const $ = cheerio.load(data);
    $("script, style, nav, footer, header").remove();
    const content = $("p")
      .map((_, el) => $(el).text())
      .get()
      .join(" ")
      .slice(0, 3000);
    return content || "";
  } catch (e) {
    console.log(`Scrape failed for ${url}: ${e.message}`);
    return "";
  }
}

async function summarize(text) {
  if (!text || text.length < 100) return text;
  try {
    const result = await hf.summarization({
      model: "sshleifer/distilbart-cnn-12-6",
      inputs: text.slice(0, 1024),
      parameters: { max_length: 150, min_length: 30 },
    });
    return result.summary_text || text.slice(0, 300) + "...";
  } catch (e) {
    console.log("AI Summary failed, using fallback.");
    return text.slice(0, 300) + "...";
  }
}

async function sendNewsletter(subscriber, articles, gifUrl) {
  const { email, category, frequency } = subscriber;
  const subject = `📰 V123 ${category.charAt(0).toUpperCase() + category.slice(1)} • Daily Digest`;

  // Use the Minimal Aesthetic Design
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { margin: 0; padding: 0; background-color: #f4f4f4; color: #171717; font-family: sans-serif; }
        .wrapper { width: 100%; background-color: #f4f4f4; padding-bottom: 40px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { text-align: center; padding: 40px 20px 30px; border-bottom: 2px solid #171717; }
        .logo { font-size: 52px; font-weight: 400; color: #171717; margin: 0; letter-spacing: -1px; }
        .date { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #666; margin-top: 15px; }
        .content { padding: 40px 30px; }
        .article { margin-bottom: 50px; }
        .category-tag { display: inline-block; font-size: 10px; font-weight: 700; text-transform: uppercase; color: #EB8E41; margin-bottom: 10px; border-bottom: 1px solid #EB8E41; }
        .article-title { font-size: 24px; font-weight: 700; color: #171717; margin: 0 0 15px 0; }
        .article-summary { font-size: 16px; line-height: 1.7; color: #444; }
        .read-more { display: inline-block; margin-top: 15px; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #171717; text-decoration: none; border: 1px solid #171717; padding: 10px 20px; }
        .footer { background-color: #171717; color: #ffffff; padding: 40px 20px; text-align: center; font-size: 12px; }
        .footer a { color: #fff; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <h1 class="logo">V123</h1>
            <div class="date">${new Date().toLocaleDateString()} • ${category.toUpperCase()}</div>
          </div>
          <div class="content">
            <p style="text-align:center; font-style:italic; margin-bottom:40px;">Your daily dose of what matters.</p>
            ${articles
              .map(
                (a, i) => `
              <div class="article">
                <span class="category-tag">Story 0${i + 1}</span>
                <h2 class="article-title">${a.title}</h2>
                <div class="article-summary">${a.summary}</div>
                <a href="${a.link}" class="read-more">Read Full Story</a>
              </div>
            `
              )
              .join("")}
            <div style="text-align:center; margin-top:40px;">
              <img src="${gifUrl}" style="max-width:100%; border:4px solid #fff; box-shadow:0 4px 10px rgba(0,0,0,0.05);" />
            </div>
          </div>
          <div class="footer">
            "Art is never finished, only abandoned."<br><br>
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/api/news?action=unsubscribe&email=${email}">Unsubscribe</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "V123 <mailing@ayotomcs.me>",
    to: email,
    subject,
    html,
  });
  console.log(`✅ Sent to ${email}`);
}

async function sendAdminReport(sentLog) {
  if (sentLog.length === 0) return;

  const subject = `📊 V123 Delivery Report: ${sentLog.length} Emails Sent`;
  const html = `
    <h1>Daily Delivery Report</h1>
    <p>The following subscribers received their 11 AM newsletter:</p>
    <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
      <thead>
        <tr>
          <th>Email</th>
          <th>Category</th>
          <th>Timezone</th>
        </tr>
      </thead>
      <tbody>
        ${sentLog
          .map(
            (s) => `
          <tr>
            <td>${s.email}</td>
            <td>${s.category}</td>
            <td>${s.timezone}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "V123 <mailing@ayotomcs.me>",
    to: "ayotomiwawaledurojaye@gmail.com",
    subject,
    html,
  });
  console.log(`✅ Admin Report Sent with ${sentLog.length} entries.`);
}

async function run() {
  console.log("🚀 Starting Cron Script...");
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db("newsletter");
    const subscribers = await db.collection("subscribers").find({}).toArray();

    if (subscribers.length === 0) {
      console.log("No subscribers found.");
      return;
    }

    const now = new Date();
    const currentHour = now.getHours(); // Server time (UTC usually in Actions)

    // NOTE: In GitHub Actions, we might want to adjust for Timezone.
    // For simplicity, we process everyone who matches "preferredTime.hour" relative to CST roughly?
    // Actually, we'll just process everyone for "Daily" check or specific logc.
    // For now, let's just make it robust.

    console.log(`Checking ${subscribers.length} subscribers...`);

    const sentLog = [];

    for (const sub of subscribers) {
      const timezone = sub.timezone || "UTC";
      let localHour;

      try {
        // Get hour in user's timezone (0-23)
        const dateStr = new Date().toLocaleString("en-US", {
          timeZone: timezone,
          hour: "numeric",
          hour12: false,
        });
        localHour = parseInt(dateStr, 10);

        // Handle "24" edge case if some locales return it (rare, mostly 0-23)
        if (localHour === 24) localHour = 0;
      } catch (e) {
        console.warn(
          `Timezone error for ${sub.email} (${timezone}):`,
          e.message
        );
        // Fallback to UTC/Server time if timezone is invalid
        localHour = new Date().getHours();
      }

      console.log(
        `Checking ${sub.email}: Local Hour is ${localHour} (Target: 11)`
      );

      // Send only at 11 AM
      if (localHour !== 11) continue;

      // Fetch News
      const newsUrl = `https://newsapi.org/v2/top-headlines?country=us&category=${sub.category === "top" ? "general" : sub.category}&pageSize=2&apiKey=${NEWSAPI_KEY}`;
      const newsRes = await axios.get(newsUrl).catch((e) => null);
      if (!newsRes || !newsRes.data.articles) {
        console.log(`No news found for ${sub.category}`);
        continue;
      }

      const rawArticles = newsRes.data.articles;
      const processedArticles = [];

      for (const article of rawArticles) {
        const content = await scrapeArticle(article.url);
        const summary = await summarize(
          content || article.description || article.title
        );
        processedArticles.push({
          title: article.title,
          summary,
          link: article.url,
        });
      }

      const gifUrl = await getRandomGiphy();
      await sendNewsletter(sub, processedArticles, gifUrl);
      sentLog.push({ email: sub.email, category: sub.category, timezone });
    }

    if (sentLog.length > 0) {
      await sendAdminReport(sentLog);
    } else {
      console.log("No emails scheduled for this hour.");
    }
  } catch (error) {
    console.error("❌ Cron Failed:", error);
    process.exit(1);
  } finally {
    await client.close();
    process.exit(0);
  }
}

run();
