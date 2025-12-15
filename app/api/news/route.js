import axios from "axios";
import { MongoClient } from "mongodb";
import validator from "validator";
import * as cheerio from "cheerio";
import { Resend } from "resend";
import { scheduleDelayedEmail, scheduleRecurringEmails } from "../../../lib/scheduleEmail.js";
import Parser from 'rss-parser';
import { HfInference } from "@huggingface/inference";

let resend;
try {
  if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
} catch (error) {
  console.warn("Resend initialization failed:", error.message);
}

// Initialize Hugging Face Client
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

const sendTransactionalEmail = async (mailOptions) => {
  console.log(`[EMAIL] Attempting to send email to: ${mailOptions.to}`);
  
  if (!resend) {
    const errorMsg = "Resend client not initialized - check RESEND_API_KEY environment variable";
    console.error(`[EMAIL ERROR] ${errorMsg}`);
    return { message: "Email sending skipped", error: errorMsg };
  }

  try {
    const emailPayload = {
      from: `${process.env.RESEND_FROM_NAME || "V123 Newsletter"} <${process.env.RESEND_FROM_EMAIL}>`,
      to: [mailOptions.to],
      subject: mailOptions.subject,
      html: mailOptions.html,
    };

    const { data, error } = await resend.emails.send(emailPayload);

    if (error) {
      console.error(`[EMAIL ERROR] Resend API returned error:`, error);
      throw new Error(`Resend API error: ${JSON.stringify(error)}`);
    }

    console.log(`[EMAIL SUCCESS] Email sent to ${mailOptions.to} with ID: ${data?.id}`);
    return { message: "Email sent via Resend", emailId: data?.id, success: true };
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed to send email to ${mailOptions.to}:`, error.message);
    throw new Error(`Failed to send transactional email: ${error.message}`);
  }
};

const storeSubscriber = async (email, category, frequency) => {
  console.log(`Storing subscriber: ${email} (${category}, ${frequency})`);
  return { email, category, frequency, subscribedAt: new Date(), status: "active" };
};

// Optimized scraping with timeout for Vercel Free Plan
async function scrapeArticleContent(url) {
  try {
    const response = await axios.get(url, {
      timeout: 3000, // Reduced to 3s
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    $('script, style, nav, header, footer, .advertisement, form, button').remove();
    let content = $('p').map((_, el) => $(el).text().trim()).get().join(' ');
    content = content.replace(/\s+/g, ' ').trim();

    return content.length > 200 ? content : null;
  } catch (error) {
    console.log(`Scrape failed/timeout for ${url}: ${error.message}`);
    return null;
  }
}

async function aiSummarizeContent(title, content, originalDescription) {
  try {
    if (!content || content.length < 200) {
      return originalDescription || content;
    }

    if (!process.env.HUGGINGFACE_API_KEY) {
      return generateFallbackSummary(content, originalDescription);
    }

    const textToSummarize = `Summarize: ${title}\n${content}`.slice(0, 3000);

    const summaryResult = await hf.summarization({
      model: 'sshleifer/distilbart-cnn-12-6', // Faster model
      inputs: textToSummarize,
      parameters: { max_length: 150, min_length: 30 }
    });

    const summary = summaryResult.summary_text || (summaryResult[0] && summaryResult[0].summary_text);
    return summary || generateFallbackSummary(content, originalDescription);
  } catch (error) {
    console.error('AI summarization failed:', error.message);
    return generateFallbackSummary(content, originalDescription);
  }
}

function generateFallbackSummary(content, originalDescription) {
  if (originalDescription && originalDescription.length > 200) return originalDescription;
  const sentences = content ? content.match(/[^.!?]+[.!?]+/g) || [] : [];
  return sentences.slice(0, 3).join(' ') || originalDescription || "Summary not available.";
}

async function summarizeText(title, originalDescription, url, fullContentRss = null) {
  let contentToSummarize = fullContentRss && fullContentRss.length > 150 ? fullContentRss : null;
  
  if (!contentToSummarize) {
    contentToSummarize = await scrapeArticleContent(url);
  }
  
  if (!contentToSummarize) {
    contentToSummarize = originalDescription;
  }

  return await aiSummarizeContent(title, contentToSummarize, originalDescription);
}

async function getRandomGiphy() {
  try {
    const tags = ["funny", "happy", "news", "excited", "thumbs up"];
    const tag = tags[Math.floor(Math.random() * tags.length)];
    const res = await axios.get(`https://api.giphy.com/v1/gifs/random`, {
      params: { api_key: process.env.GIPHY_API_KEY, tag, rating: "pg" },
      timeout: 3000,
    });
    return res.data.data?.images?.original?.url || "https://media.giphy.com/media/l0HlO3BJ8LxrZ4Khq/giphy.gif";
  } catch (e) {
    console.error("Giphy Error:", e.message);
    return "https://media.giphy.com/media/l0HlO3BJ8LxrZ4Khq/giphy.gif";
  }
}

let mongoClient;
try {
  if (process.env.MONGODB_URI) {
    mongoClient = new MongoClient(process.env.MONGODB_URI, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
    });
  }
} catch (error) {
  console.warn("MongoDB Client init failed:", error.message);
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || "top";
  const email = searchParams.get("email");
  const action = searchParams.get("action") || "fetch";

  // MongoDB Connection
  let db, subscribers, scheduledEmails;
  if (mongoClient) {
    try {
      await mongoClient.connect();
      db = mongoClient.db("newsletter");
      subscribers = db.collection("subscribers");
      scheduledEmails = db.collection("scheduled_emails");
    } catch (e) {
      console.warn("DB Connection failed, proceeding without DB");
    }
  }

  // Handle Subscribe
  if (action === "subscribe") {
    if (!email || !validator.isEmail(email)) return Response.json({ error: "Invalid email" }, { status: 400 });
    
    // DB Ops
    if (subscribers) {
      await subscribers.updateOne({ email }, { $set: { email, category, frequency: "daily", subscribedAt: new Date() }}, { upsert: true });
    }
    
    // Send Welcome Email (With Minimal Design)
    await sendTransactionalEmail({
      to: email,
      subject: `Welcome to V123 ${category.charAt(0).toUpperCase() + category.slice(1)} Newsletter`,
      html: `
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
            .content { padding: 40px 30px; text-align: center; }
            .welcome-title { font-size: 24px; font-weight: 700; color: #171717; margin-bottom: 20px; }
            .text { font-size: 16px; line-height: 1.6; color: #444; margin-bottom: 20px; }
            .accent { color: #EB8E41; font-weight: 700; }
            .footer { background-color: #171717; color: #ffffff; padding: 40px 20px; text-align: center; font-size: 12px; }
            .footer a { color: #fff; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="header">
                <h1 class="logo">V123</h1>
              </div>
              <div class="content">
                <h2 class="welcome-title">Welcome to the Club</h2>
                <p class="text">
                  You've successfully subscribed to the <span class="accent">${category}</span> newsletter.
                </p>
                <p class="text">
                  We're thrilled to have you. Expect daily insights, curated stories, and a touch of inspiration delivered straight to your inbox.
                </p>
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                   <p style="font-style: italic; color: #666;">"Art is never finished, only abandoned."</p>
                </div>
              </div>
              <div class="footer">
                &copy; ${new Date().getFullYear()} V123 Newsletter.<br><br>
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://v123.ayotomcs.me'}/api/news?action=unsubscribe&email=${encodeURIComponent(email)}">Unsubscribe</a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    });

    return Response.json({ message: "Subscribed" });
  }
  
  // Handle Unsubscribe
  if (action === "unsubscribe") {
    if (subscribers && email) await subscribers.deleteOne({ email });
    return Response.json({ message: "Unsubscribed" });
  }

  // Handle Fetch/Send News
  const guardianRssFeeds = {
    top: 'https://www.theguardian.com/world/rss',
    general: 'https://www.theguardian.com/world/rss',
    business: 'https://www.theguardian.com/business/rss',
    technology: 'https://www.theguardian.com/technology/rss',
    entertainment: 'https://www.theguardian.com/culture/rss',
    science: 'https://www.theguardian.com/science/rss',
    sports: 'https://www.theguardian.com/sport/rss',
    health: 'https://www.theguardian.com/society/rss',
  };

  try {
    const parser = new Parser();
    const feed = await parser.parseURL(guardianRssFeeds[category] || guardianRssFeeds.top);
    
    // LIMIT TO 1 ARTICLE if sending via "Send Sample" (Vercel Timeout Protection)
    // If just fetching JSON (action=fetch), we can do 2.
    const articleLimit = (action === 'send' || email) ? 1 : 2;
    const rawArticles = feed.items.slice(0, articleLimit);
    
    const summarizedArticles = await Promise.all(rawArticles.map(async (item) => {
      const summary = await summarizeText(item.title, item.contentSnippet || item.description, item.link, item['content:encoded']);
      return {
        title: item.title,
        url: item.link,
        summary
      };
    }));

    const giphyUrl = await getRandomGiphy();

    if (action === "fetch") {
      return Response.json({ articles: summarizedArticles, giphy: giphyUrl });
    }

    if (email) {
      await sendTransactionalEmail({
        to: email,
        subject: `V123: Your ${category.toUpperCase()} Update`,
        html: `
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
                    ${summarizedArticles.map((a, i) => `
                      <div class="article">
                        <span class="category-tag">Story 0${i + 1}</span>
                        <h2 class="article-title">${a.title}</h2>
                        <div class="article-summary">${a.summary}</div>
                        <a href="${a.url}" class="read-more">Read Full Story</a>
                      </div>
                    `).join('')}
                    <div style="text-align:center; margin-top:40px;">
                      <img src="${giphyUrl}" style="max-width:100%; border:4px solid #fff; box-shadow:0 4px 10px rgba(0,0,0,0.05);" />
                    </div>
                  </div>
                  <div class="footer">
                    "Art is never finished, only abandoned."<br><br>
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://v123.ayotomcs.me'}/api/news?action=unsubscribe&email=${encodeURIComponent(email)}">Unsubscribe</a>
                  </div>
                </div>
              </div>
            </body>
            </html>
        `
      });
      return Response.json({ message: "Email Sent", success: true });
    }

    return Response.json({ message: "Nothing to do" });

  } catch (error) {
    console.error("Route Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}