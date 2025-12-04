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
  // Enhanced logging for debugging
  console.log(`[EMAIL] Attempting to send email to: ${mailOptions.to}`);
  console.log(`[EMAIL] Subject: ${mailOptions.subject}`);
  console.log(`[EMAIL] Resend client initialized: ${!!resend}`);
  console.log(`[EMAIL] From name: ${process.env.RESEND_FROM_NAME}`);
  console.log(`[EMAIL] From email: ${process.env.RESEND_FROM_EMAIL}`);

  if (!resend) {
    const errorMsg = "Resend client not initialized - check RESEND_API_KEY environment variable";
    console.error(`[EMAIL ERROR] ${errorMsg}`);
    return {
      message: "Email sending skipped - Resend not configured",
      emailId: null,
      error: errorMsg
    };
  }

  if (!process.env.RESEND_FROM_EMAIL) {
    const errorMsg = "RESEND_FROM_EMAIL environment variable not set";
    console.error(`[EMAIL ERROR] ${errorMsg}`);
    throw new Error(errorMsg);
  }

  try {
    const emailPayload = {
      from: `${process.env.RESEND_FROM_NAME || "V123 Newsletter"} <${process.env.RESEND_FROM_EMAIL}>`,
      to: [mailOptions.to],
      subject: mailOptions.subject,
      html: mailOptions.html,
    };

    console.log(`[EMAIL] Sending with payload from: ${emailPayload.from}`);

    const { data, error } = await resend.emails.send(emailPayload);

    if (error) {
      console.error(`[EMAIL ERROR] Resend API returned error:`, error);
      throw new Error(`Resend API error: ${JSON.stringify(error)}`);
    }

    console.log(`[EMAIL SUCCESS] Email sent to ${mailOptions.to} with ID: ${data?.id}`);
    return {
      message: "Email sent via Resend",
      emailId: data?.id,
      success: true
    };
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed to send email to ${mailOptions.to}:`, {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    throw new Error(`Failed to send transactional email: ${error.message}`);
  }
};

const storeSubscriber = async (email, category, frequency) => {
  const subscriberData = {
    email,
    category,
    frequency,
    subscribedAt: new Date(),
    status: "active"
  };

  console.log(`Storing subscriber: ${email} (${category}, ${frequency})`);
  return {
    subscriberData,
    email: email,
    category: category,
    frequency: frequency
  };
};

async function scrapeArticleContent(url) {
  try {
    const response = await axios.get(url, {
      timeout: 20000, // Increased timeout
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    });

    const $ = cheerio.load(response.data);

    // Remove unwanted elements
    $('script, style, nav, header, footer, .advertisement, .ads, .social-media, .related-content, form, button').remove();

    // Try multiple selectors for article content, prioritized by specificity
    let content = '';
    const selectors = [
      '.zn-body__paragraph', // CNN (Legacy)
      '.article__content p', // CNN (New)
      'div[data-component="text-block"]', // BBC
      '.article-body p', // General
      '.article-text p',
      '.story-text p',
      '.paragraph', 
      'article p',
      '.article-content p',
      '.story-body p',
      '.entry-content p',
      'main p',
      '.content p',
      'p'
    ];

    for (const selector of selectors) {
      const paragraphs = $(selector);
      if (paragraphs.length > 1) {
        content = paragraphs.map((_, el) => $(el).text().trim()).get().join(' ');
        // If we found substantial content, stop looking
        if (content.length > 500) break;
      }
    }

    // Clean up the content
    content = content.replace(/\s+/g, ' ').trim();

    // Return meaningful content (at least 200 characters)
    if (content.length > 200) {
      return content;
    }

    console.log(`Scraping yielded low content length (${content.length}) for ${url}`);
    return null;
  }
  catch (error) {
    console.error(`Failed to scrape ${url}:`, error.message);
    return null;
  }
}

// AI summarization function using Hugging Face
async function aiSummarizeContent(title, content, originalDescription) {
  try {
    // If content is too short (scraping likely failed), prefer original description
    if (!content || content.length < 200) {
      console.log("Content too short for AI, using original description");
      return originalDescription || content;
    }

    const hasKey = !!process.env.HUGGINGFACE_API_KEY;
    console.log(`Hugging Face API Key present: ${hasKey}`);

    if (!hasKey) {
      console.warn('Hugging Face API key not found, using fallback summary');
      return generateFallbackSummary(content, originalDescription);
    }

    console.log("Sending request to Hugging Face for summarization...");

    // Prepare the text for summarization with explicit instruction
    const textToSummarize = `Summarize the following news article into a single detailed, comprehensive paragraph explaining the key points, context, and implications:\n\nTitle: ${title}\n\nContent: ${content}`;

    // Limit input text length (Hugging Face has token limits)
    const limitedText = textToSummarize.length > 3000
      ? textToSummarize.slice(0, 3000)
      : textToSummarize;

    console.log(`Payload size: ${limitedText.length} chars`);

    const summaryResult = await hf.summarization({
      model: 'facebook/bart-large-cnn',
      inputs: limitedText,
      parameters: {
        max_length: 500,
        min_length: 200
      }
    });

    // The library returns the result directly, usually an object or array
    // For summarization, it's typically { summary_text: "..." }
    const summary = summaryResult.summary_text || (summaryResult[0] && summaryResult[0].summary_text);

    if (summary) {
      console.log(`Used AI summary (Length: ${summary.length} chars)`);
      return summary;
    }

    // If no summary returned, use fallback
    console.warn('No summary returned from Hugging Face API (Empty response)', JSON.stringify(summaryResult));
    return generateFallbackSummary(content, originalDescription);
  } catch (error) {
    console.error('Hugging Face AI summarization failed:', error.message);
    // Fallback
    return generateFallbackSummary(content, originalDescription);
  }
}

function generateFallbackSummary(content, originalDescription) {
  console.log("Using heuristic fallback summary");
  
  // If original description is long enough, use it
  if (originalDescription && originalDescription.length > 300) {
    return originalDescription;
  }

  // Otherwise, try to take the first 6 sentences
  let summary = "";
  if (content) {
    // Split by sentence endings, filtering out empty strings
    const sentences = content.match(/[^.!?]+[.!?]+/g) || [];
    if (sentences.length >= 6) {
      summary = sentences.slice(0, 6).join(' ');
    } else {
      // If fewer than 6 sentences, take the whole thing
      summary = content;
    }
  }

  // Strict truncation to ensure we never return a "full article" in fallback mode
  if (summary.length > 1000) {
    summary = summary.slice(0, 1000) + '...';
  }

  return summary || originalDescription || "Summary not available.";
}

// Enhanced summarization with web scraping and AI
async function summarizeText(title, originalDescription, url, fullContentRss = null) {
  let contentToSummarize = fullContentRss;

  if (!contentToSummarize || contentToSummarize.length < 150) {
    // If RSS didn't provide full content, try scraping
    console.log(`RSS full content not sufficient, attempting to scrape ${url}`);
    contentToSummarize = await scrapeArticleContent(url);
  }
  
  // If scraping failed or too short, fall back to originalDescription
  if (!contentToSummarize || contentToSummarize.length < 150) {
     console.log(`Scraping failed or too short for ${url}. Using original description.`);
     contentToSummarize = originalDescription;
  } else {
    console.log(`Using ${contentToSummarize === fullContentRss ? 'RSS full content' : 'Scraped content'} for summarization.`);
  }

  // Use AI to create a comprehensive summary, passing originalDescription as fallback
  return await aiSummarizeContent(title, contentToSummarize, originalDescription);
}

// Completely random GIF from Giphy API
async function getRandomGiphy() {
  try {
    const randomTags = [
      "funny", "reaction", "meme", "lol", "humor",
      "comedy", "celebration", "happy", "excited", "thumbs up"
    ];

    const randomTag = randomTags[Math.floor(Math.random() * randomTags.length)];

    const response = await axios.get(
      `https://api.giphy.com/v1/gifs/random`,
      {
        params: {
          api_key: process.env.GIPHY_API_KEY,
          tag: randomTag,
          rating: 'pg'
        },
        timeout: 5000
      }
    );

    const gifData = response.data.data;
    const gifUrl = gifData?.images?.fixed_height?.url ||
           gifData?.images?.original?.url ||
           "https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif";

    console.log(`Using random Giphy GIF with tag "${randomTag}":`, gifUrl);
    return gifUrl;

  } catch (error) {
    console.error("Giphy API Error:", error.message);
    // Fallback GIFs
    const fallbackGifs = [
      "https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif",
      "https://media.giphy.com/media/26BRrSvJUa0crqw4E/giphy.gif",
      "https://media.giphy.com/media/26gR0YFZxWbnUPtMA/giphy.gif"
    ];
    const fallbackGif = fallbackGifs[Math.floor(Math.random() * fallbackGifs.length)];
    console.log(`Using fallback GIF:`, fallbackGif);
    return fallbackGif;
  }
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

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || "top";
  const email = searchParams.get("email");
  const action = searchParams.get("action") || "fetch";
  const validCategories = [
    "business",
    "entertainment",
    "general",
    "health",
    "science",
    "sports",
    "technology",
    "top"
  ];

  // Map categories to Guardian RSS feeds
  const guardianRssFeeds = {
    top: 'https://www.theguardian.com/world/rss',
    general: 'https://www.theguardian.com/world/rss',
    business: 'https://www.theguardian.com/business/rss',
    technology: 'https://www.theguardian.com/technology/rss',
    entertainment: 'https://www.theguardian.com/culture/rss', // Closest match
    science: 'https://www.theguardian.com/science/rss',
    sports: 'https://www.theguardian.com/sport/rss',
    health: 'https://www.theguardian.com/society/rss', // Closest match
  };

  // Validate inputs
  if (!validCategories.includes(category)) {
    console.error("Invalid category:", category);
    return new Response(JSON.stringify({ error: "Invalid category" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (email && !validator.isEmail(email)) {
    console.error("Invalid email:", email);
    return new Response(JSON.stringify({ error: "Invalid email" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let db, subscribers, scheduledEmails;
  if (mongoClient) {
    try {
      await mongoClient.connect();
      db = mongoClient.db("newsletter");
      subscribers = db.collection("subscribers");
      scheduledEmails = db.collection("scheduled_emails");
    } catch (error) {
      console.error("MongoDB Connection Error:", error.message);
      // Do not return error here, allow reduced functionality
      console.warn("Proceeding without database connection");
    }
  } else {
    console.warn("MongoDB client not initialized - database operations will be skipped");
  }

  try {
    // Handle subscription actions
    if (action === "subscribe") {
      if (!email) {
        return new Response(JSON.stringify({ error: "Email required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
      
      const frequency = searchParams.get("frequency") || "daily";
      const subscriptionTime = new Date();

      if (subscribers) {
        await subscribers.updateOne(
          { email },
          {
            $set: {
              email,
              category,
              frequency,
              subscribedAt: subscriptionTime,
              preferredTime: {
                hour: subscriptionTime.getHours(),
                minute: subscriptionTime.getMinutes()
              }
            },
          },
          { upsert: true }
        );
      } else {
        console.warn("Database not available - subscriber not saved to database");
        // For subscribe action, we probably should warn the user if DB failed, 
        // but the original requirement implies "Send News Now" which is the "send" action.
        // If this is a strict subscribe, maybe we should error if DB is down? 
        // But for now let's allow it to send the welcome email at least.
      }

      // Schedule 10-minute delayed first newsletter
      if (scheduledEmails) {
        const delayedEmailData = await scheduleDelayedEmail(email, category, frequency, subscriptionTime);
        await scheduledEmails.insertOne(delayedEmailData);

        // Schedule recurring emails based on subscription time
        const recurringEmailData = await scheduleRecurringEmails(email, category, frequency, subscriptionTime);
        await scheduledEmails.insertOne(recurringEmailData);
      }

      // Store subscriber data (Resend doesn't require external sync)
      const subscriberInfo = await storeSubscriber(email, category, frequency);

      console.log(`Subscribed ${email} to ${category} news (${frequency})`);

      // Send welcome email immediately using Resend
      try {
        await sendTransactionalEmail({
          to: email,
          subject: `Welcome to V123 ${category.charAt(0).toUpperCase() + category.slice(1)} Newsletter!`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Welcome to V123</title>
              <style>
                @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;1,400&family=Roboto:wght@300;400;500;700&display=swap');
                /* Note: Fino is a custom font, might not render in all email clients, falling back to Serif */
                body { margin: 0; padding: 0; background-color: #ffffff; color: #171717; font-family: 'Roboto', sans-serif; }
                .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { text-align: center; padding: 20px 0; }
                .logo { font-family: 'Didot', 'Times New Roman', serif; font-size: 48px; font-weight: normal; letter-spacing: 2px; margin: 0; text-transform: uppercase; }
                .date { font-family: 'Roboto', sans-serif; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #666; margin-top: 5px; }
                .divider { border-bottom: 1px solid #000; margin: 20px 0; }
                .divider-thin { border-bottom: 1px solid #e5e5e5; margin: 20px 0; }
                .accent { color: #EB8E41; }
                .content { padding: 20px 0; text-align: center; }
                .welcome-title { font-family: 'Merriweather', serif; font-size: 24px; margin-bottom: 15px; }
                .text { line-height: 1.6; color: #333; margin-bottom: 15px; }
                .btn { display: inline-block; padding: 12px 24px; background-color: #171717; color: #ffffff !important; text-decoration: none; font-weight: 500; font-size: 14px; margin-top: 10px; border: 1px solid #171717; }
                .btn:hover { background-color: #ffffff; color: #171717 !important; }
                .footer { text-align: center; font-size: 11px; color: #888; padding-top: 30px; font-family: 'Roboto', sans-serif; }
                .footer a { color: #888; text-decoration: underline; }
              </style>
            </head>
            <body>
              <div class="container">
                <!-- Header -->
                <div class="header">
                  <h1 class="logo">V123</h1>
                  <div class="date">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
                <div class="divider"></div>

                <!-- Content -->
                <div class="content">
                  <h2 class="welcome-title">Welcome to the Club</h2>
                  <p class="text">
                    You've successfully subscribed to the <strong>${category}</strong> newsletter. 
                    We're thrilled to have you.
                  </p>
                  <p class="text">
                    Expect <span class="accent">daily insights</span>, curated stories, and a touch of inspiration delivered straight to your inbox.
                  </p>
                  
                  <div style="margin-top: 30px;">
                    <p class="text" style="font-style: italic; font-family: 'Merriweather', serif;">
                      "Art is never finished, only abandoned."
                    </p>
                  </div>
                </div>

                <div class="divider"></div>

                <!-- What to expect -->
                <div style="padding: 20px 0;">
                  <h3 style="font-family: 'Merriweather', serif; font-size: 18px; margin-bottom: 15px;">What's Inside?</h3>
                  <ul style="list-style-type: none; padding: 0; text-align: left; margin: 0 auto; display: inline-block;">
                    <li style="margin-bottom: 8px;">✓ Curated top news summaries</li>
                    <li style="margin-bottom: 8px;">✓ Daily dose of visual inspiration</li>
                    <li style="margin-bottom: 8px;">✓ Direct links to full stories</li>
                  </ul>
                </div>

                <div class="divider-thin"></div>

                <!-- Footer -->
                <div class="footer">
                  <p>&copy; ${new Date().getFullYear()} V123 Newsletter. All rights reserved.</p>
                  <p>
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://v123-again.vercel.app'}/subscribe">Manage Subscription</a> | 
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://v123-again.vercel.app'}/subscribe">Unsubscribe</a>
                  </p>
                </div>
              </div>
            </body>
            </html>
          `
        });
        console.log(`Welcome email sent successfully to ${email}`);
      } catch (welcomeEmailError) {
        console.error("Failed to send welcome email:", welcomeEmailError.message);
      }

      // Send admin notification if admin email is configured
      if (process.env.ADMIN_EMAIL) {
        try {
          await sendTransactionalEmail({
            to: process.env.ADMIN_EMAIL,
            subject: `New Subscription: ${email}`,
            html: `
              <div style="font-family: Arial, sans-serif;">
                <h3 style="color: #28a745;">New Newsletter Subscription</h3>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Category:</strong> ${category}</p>
                <p><strong>Frequency:</strong> ${frequency}</p>
                <p><strong>Subscribed at:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Email Service:</strong> ✅ Resend</p>
              </div>
            `
          });
        } catch (adminEmailError) {
          console.error("Failed to send admin notification:", adminEmailError.message);
        }
      }

      return new Response(
        JSON.stringify({
          message: `Successfully subscribed ${email} to ${category} news! Welcome email sent.`,
          subscriberInfo: subscriberInfo,
          welcomeEmailSent: true
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else if (action === "unsubscribe") {
      if (!email) {
        return new Response(JSON.stringify({ error: "Email required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
      if (subscribers) {
        await subscribers.deleteOne({ email });
        console.log(`Unsubscribed ${email} from ${category} news`);
      } else {
        console.warn("Database not available - unsubscribe operation skipped");
      }
      
      // Send unsubscribe confirmation using transactional API
      try {
        await sendTransactionalEmail({
          to: email,
          subject: "You've been unsubscribed from V123 Newsletter",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #dc3545;">👋 Sorry to see you go!</h2>
              <p>You've been successfully unsubscribed from the V123 Newsletter.</p>
              <p>If this was a mistake, you can always <a href="/test-newsletter" style="color: #007bff;">resubscribe here</a>.</p>
              <p style="color: #666; font-style: italic;">Thanks for being part of our community!</p>
            </div>
          `,
        });

        // Send notification to admin
        await sendTransactionalEmail({
          to: process.env.ADMIN_EMAIL,
          subject: `Unsubscribe: ${email}`,
          html: `
            <div style="font-family: Arial, sans-serif;">
              <h3 style="color: #dc3545;">User Unsubscribed</h3>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Unsubscribed at:</strong> ${new Date().toLocaleString()}</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send unsubscribe email:", emailError.message);
      }
      
      return new Response(
        JSON.stringify({
          message: `Unsubscribed ${email} from ${category} news. Confirmation email sent.`,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else if (action === "fetch") {
      console.log(`Fetching news for category: ${category}`);
    }

    // Fetch news from The Guardian RSS
    let articles;
    try {
      const parser = new Parser();
      const feedUrl = guardianRssFeeds[category];
      console.log(`Fetching RSS feed from: ${feedUrl}`);
      const feed = await parser.parseURL(feedUrl);
      
      articles = feed.items.slice(0, 2).map((item) => ({
        title: item.title || "No title",
        description: item.contentSnippet || item.description || "No description", // Use contentSnippet for better description
        link: item.link || "#",
        pubDate: item.pubDate || new Date().toISOString(),
        // Check for full content in RSS item, otherwise rely on scraping
        fullContentRss: item['content:encoded'] || item.content // Use full content if available in RSS
      }));
      
      console.log(`Processed ${articles.length} articles from RSS feed`);
      
    } catch (error) {
      console.error("Guardian RSS Fetch Error:", {
        message: error.message,
        category: category,
      });
      
      articles = [];
    }

    // Summarize articles
    const summarizedArticles = await Promise.all(
      articles.length > 0
        ? articles.map(async (article) => ({
            title: article.title,
            url: article.link,
            summary: await summarizeText(
              article.title,
              article.description, // Pass description from RSS as originalDescription
              article.link,
              article.fullContentRss // Pass full content from RSS if available
            ),
          }))
        : [
            {
              title: `No ${category} news found`,
              url: "#",
              summary: `No ${category} news found from The Guardian RSS feed - check configuration or feed availability`,
            },
          ]
    );

    // Fetch random Giphy
    const giphyUrl = await getRandomGiphy();

    // If action is "fetch", just return the articles without sending email
    if (action === "fetch") {
      return new Response(
        JSON.stringify({
          message: `Fetched ${category} news successfully`,
          articles: summarizedArticles,
          giphy: giphyUrl,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Send newsletter email using transactional API for individual sends
    if (email) {
      try {
        await sendTransactionalEmail({
          to: email,
          subject: `V123: Your ${category.charAt(0).toUpperCase() + category.slice(1)} Update`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>V123 Newsletter</title>
              <style>
                @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;1,400&family=Roboto:wght@300;400;500;700&display=swap');
                body { margin: 0; padding: 0; background-color: #ffffff; color: #171717; font-family: 'Roboto', sans-serif; }
                .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { text-align: center; padding: 20px 0; }
                .logo { font-family: 'Didot', 'Times New Roman', serif; font-size: 48px; font-weight: normal; letter-spacing: 2px; margin: 0; text-transform: uppercase; }
                .date { font-family: 'Roboto', sans-serif; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #666; margin-top: 5px; }
                .divider { border-bottom: 1px solid #000; margin: 20px 0; }
                .divider-thin { border-bottom: 1px solid #e5e5e5; margin: 20px 0; }
                .category-label { font-family: 'Roboto', sans-serif; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #EB8E41; margin-bottom: 5px; }
                .article { margin-bottom: 40px; padding-bottom: 20px; border-bottom: 1px dotted #ccc; }
                .article:last-child { border-bottom: none; }
                .article-title { font-family: 'Merriweather', serif; font-size: 22px; line-height: 1.3; margin: 0 0 10px 0; color: #171717; }
                .article-summary { font-size: 16px; line-height: 1.6; color: #333; text-align: left; font-weight: 300; }
                .read-more { display: inline-block; margin-top: 10px; font-size: 14px; font-weight: 500; color: #EB8E41; text-decoration: none; border-bottom: 1px solid #EB8E41; }
                .read-more:hover { color: #000; border-bottom-color: #000; }
                .gif-container { margin-top: 30px; text-align: center; padding: 20px; background-color: #f9f9f9; border: 1px solid #e5e5e5; }
                .footer { text-align: center; font-size: 11px; color: #888; padding-top: 30px; font-family: 'Roboto', sans-serif; }
                .footer a { color: #888; text-decoration: underline; }
              </style>
            </head>
            <body>
              <div class="container">
                <!-- Header -->
                <div class="header">
                  <h1 class="logo">V123</h1>
                  <div class="date">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
                <div class="divider"></div>

                <!-- Articles -->
                ${summarizedArticles
                  .map(
                    (article) => `
                      <div class="article">
                        <div class="category-label">Top Story</div>
                        <h3 class="article-title">${article.title}</h3>
                        <div class="article-summary">
                          ${article.summary}
                        </div>
                        <a href="${article.url}" class="read-more" target="_blank">Read full article</a>
                      </div>
                    `
                  )
                  .join("")}

                <!-- GIF Section -->
                <div class="gif-container">
                  <p style="font-family: 'Merriweather', serif; font-style: italic; margin-top: 0; color: #666;">Daily Moment of Zen</p>
                  <img
                    src="${giphyUrl}"
                    alt="Fun GIF"
                    style="max-width: 100%; border: 1px solid #ddd; margin-top: 10px;"
                    onerror="this.style.display='none';"
                  />
                  <p style="font-size: 10px; color: #999; margin-top: 5px;">Powered by Giphy</p>
                </div>

                <div class="divider-thin"></div>

                <!-- Footer -->
                <div class="footer">
                  <p>&copy; ${new Date().getFullYear()} V123 Newsletter. All rights reserved.</p>
                  <p>
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://v123-again.vercel.app'}/subscribe">Manage Subscription</a> | 
                    <a href="/api/news?action=unsubscribe&email=${encodeURIComponent(email)}">Unsubscribe</a>
                  </p>
                </div>
              </div>
            </body>
            </html>
          `,
        });

        console.log(`Newsletter sent successfully to ${email}`);

        // Send Admin Notification for "Send News Now"
        if (process.env.ADMIN_EMAIL && email !== process.env.ADMIN_EMAIL) {
            try {
              await sendTransactionalEmail({
                to: process.env.ADMIN_EMAIL,
                subject: `User Sent News: ${email}`,
                html: `
                  <div style="font-family: Arial, sans-serif;">
                    <h3 style="color: #007bff;">Manual News Trigger</h3>
                    <p><strong>User:</strong> ${email}</p>
                    <p><strong>Category:</strong> ${category}</p>
                    <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                    <p><strong>Action:</strong> Sent "Send News Now"</p>
                  </div>
                `
              });
              console.log(`Admin notification sent for manual news trigger by ${email}`);
            } catch (adminErr) {
              console.error("Failed to send admin notification:", adminErr.message);
            }
        }

        return new Response(
          JSON.stringify({
            message: `News for ${category} sent to ${email} via Resend`,
            articles: summarizedArticles,
            giphy: giphyUrl,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      } catch (emailError) {
        console.error(`Failed to send newsletter to ${email}:`, emailError.message);

        return new Response(
          JSON.stringify({
            error: "Failed to send newsletter",
            articles: summarizedArticles,
            giphy: giphyUrl,
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    } else {
      return new Response(
        JSON.stringify({
          message: `News content generated for ${category}`,
          articles: summarizedArticles,
          giphy: giphyUrl,
          note: "No email provided - content only generated"
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("API Error:", error.message);
    return new Response(
      JSON.stringify({
        error: "Failed to process request",
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