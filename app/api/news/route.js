import axios from "axios";
import { MongoClient } from "mongodb";
import validator from "validator";
import * as cheerio from "cheerio";
import { Resend } from "resend";
import { scheduleDelayedEmail, scheduleRecurringEmails } from "../../../lib/scheduleEmail.js";

let resend;
try {
  if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
} catch (error) {
  console.warn("Resend initialization failed:", error.message);
}

const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';
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
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);

    // Remove unwanted elements
    $('script, style, nav, header, footer, .advertisement, .ads, .social-media').remove();

    // Try multiple selectors for article content
    let content = '';
    const selectors = [
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
      if (paragraphs.length > 2) {
        content = paragraphs.map((_, el) => $(el).text().trim()).get().join(' ');
        break;
      }
    }

    // Clean up the content
    content = content.replace(/\s+/g, ' ').trim();

    // Return meaningful content (at least 100 characters)
    if (content.length > 100) {
      return content;
    }

    return null;
  } catch (error) {
    console.error(`Failed to scrape ${url}:`, error.message);
    return null;
  }
}

// AI summarization function using Hugging Face
async function aiSummarizeContent(title, content) {
  try {
    if (!process.env.HUGGINGFACE_API_KEY) {
      console.warn('Hugging Face API key not found, using fallback summary');
      return content.length > 1000 ? content.slice(0, 1000) + '...' : content;
    }

    // Prepare the text for summarization
    const textToSummarize = `${title}. ${content}`;

    // Limit input text length (Hugging Face has token limits)
    const limitedText = textToSummarize.length > 2000
      ? textToSummarize.slice(0, 2000) + '...'
      : textToSummarize;

    const response = await axios.post(
      HUGGINGFACE_API_URL,
      {
        inputs: limitedText,
        parameters: {
          max_length: 600,
          min_length: 250,
          do_sample: false
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    if (response.data && response.data[0] && response.data[0].summary_text) {
      return response.data[0].summary_text;
    }

    // If no summary returned, use fallback
    console.warn('No summary returned from Hugging Face API');
    return content.length > 1000 ? content.slice(0, 1000) + '...' : content;
  } catch (error) {
    console.error('Hugging Face AI summarization failed:', error.message);
    // Fallback to simple truncation
    return content.length > 1000 ? content.slice(0, 1000) + '...' : content;
  }
}

// Enhanced summarization with web scraping and AI
async function summarizeText(title, originalContent, url) {
  // First try to scrape full content from the article URL
  let fullContent = await scrapeArticleContent(url);

  // If scraping fails, use original content
  if (!fullContent) {
    fullContent = originalContent || title || "No content available";
  }

  // Use AI to create a comprehensive summary
  return await aiSummarizeContent(title, fullContent);
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
      return new Response(
        JSON.stringify({ error: "Database connection failed" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
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
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;1,400;1,700&family=Titillium+Web:wght@400;600;700&family=Roboto:wght@300;400;500;700&display=swap');
            </style>
            <div style="background-color: white; font-family: 'Roboto', 'Titillium Web', sans-serif;">
              <div style="margin: 0 auto; margin-top: 10px; width: 100%; max-width: 600px; border: 1px solid #e5e7eb;">
                <!-- Tracking Section -->
                <section style="background-color: #f3f4f6; padding: 40px;">
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0;">
                    <div>
                      <p style="margin: 0; font-weight: 500; line-height: 2; font-family: 'Roboto', 'Titillium Web', sans-serif;">Not Interested?</p>
                      <p style="margin: 0; font-size: 14px; color: #6b7280; font-family: 'Roboto', 'Titillium Web', sans-serif;">Email: ${email}</p>
                    </div>
                    <div>
                      <a href="/subscribe"
                         style="padding: 10px 16px; text-align: center; font-size: 16px; font-weight: 500; color: #DC2625; text-decoration: underline; text-underline-offset: 2px; background: transparent; border: none; cursor: pointer;">
                        Unsubscribe
                      </a>
                    </div>
                  </div>
                </section>

                <hr style="margin: 0; border-color: #e5e7eb;" />

                <!-- Message Section -->
                <section style="padding: 74px 4px; text-align: center;">
                  <h1 style="font-family: 'Fino', serif; font-size: 36px; font-weight: bold; letter-spacing: 0.1em;">
                    Welcome to V123 Newsletter!
                  </h1>

                  <p style="padding-bottom: 16px; font-family: 'Roboto', 'Titillium Web', sans-serif;">
                    Your first <strong>${category}</strong> newsletter will be delivered soon :)
                  </p>
                </section>

                <hr style="margin: 0; border-color: #e5e7eb;" />

                <!-- What to expect Section -->
                <section style="padding: 40px;">
                  <p style="margin: 0; font-size: 16px; font-weight: 500; line-height: 2; font-family: 'Roboto', 'Titillium Web', sans-serif;">What to expect:</p>
                  <ul style="list-style-type: disc; padding-left: 20px; font-size: 16px; line-height: 2; margin: 0; font-family: 'Roboto', 'Titillium Web', sans-serif;">
                    <li>Quick summaries of top 2 news articles for easy reading</li>
                    <li>1 GIF</li>
                    <li>Direct links to full articles</li>
                  </ul>
                </section>

                <hr style="margin: 0; border-color: #e5e7eb;" />

                <!-- Logo Section -->
                <section style="padding: 22px 40px 16px; display: flex; justify-content: center; align-items: center;">
                  <svg width="21" height="20" viewBox="0 0 374 320" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block; cursor: pointer; overflow: visible; transform: scale(1.5);">
                    <g id="Group 70">
                      <g id="code">
                        <g id="Group 69">
                          <rect id="Rectangle 117" x="92.9004" y="38.373" width="19.8005" height="19.8005" fill="black" stroke="black"/>
                          <rect id="Rectangle 123" x="92.9004" y="163.177" width="19.8005" height="19.8005" fill="black" stroke="black"/>
                          <rect id="Rectangle 118" x="72.1006" y="55.3916" width="19.8005" height="19.8005" fill="black" stroke="black"/>
                          <rect id="Rectangle 122" x="72.1006" y="146.158" width="19.8005" height="19.8005" fill="black" stroke="black"/>
                          <rect id="Rectangle 119" x="51.3008" y="72.4102" width="19.8005" height="19.8005" fill="black" stroke="black"/>
                          <rect id="Rectangle 121" x="51.3008" y="129.14" width="19.8005" height="19.8005" fill="black" stroke="black"/>
                          <rect id="Rectangle 120" x="30.5" y="89.4287" width="19.8005" height="42.492" fill="black" stroke="black"/>
                        </g>
                        <g id="Group 67">
                          <rect id="Rectangle 131" x="227.203" y="1" width="20.8005" height="39.7101" fill="black"/>
                          <rect id="Rectangle 132" x="206.403" y="36.9268" width="20.8005" height="39.7101" fill="black"/>
                          <rect id="Rectangle 133" x="185.603" y="72.8555" width="20.8005" height="39.7101" fill="black"/>
                          <rect id="Rectangle 134" x="164.802" y="108.784" width="20.8005" height="39.7101" fill="black"/>
                          <rect id="Rectangle 135" x="144.002" y="144.712" width="20.8005" height="39.7101" fill="black"/>
                          <rect id="Rectangle 136" x="123.201" y="180.641" width="20.8005" height="39.7101" fill="black"/>
                        </g>
                        <g id="Group 68">
                          <rect id="Rectangle 124" width="20.8005" height="20.8005" transform="matrix(-1 0 0 1 278.803 37.873)" fill="black"/>
                          <rect id="Rectangle 125" width="20.8005" height="20.8005" transform="matrix(-1 0 0 1 278.803 162.677)" fill="black"/>
                          <rect id="Rectangle 126" width="20.8005" height="20.8005" transform="matrix(-1 0 0 1 299.604 54.8916)" fill="black"/>
                          <rect id="Rectangle 127" width="20.8005" height="20.8005" transform="matrix(-1 0 0 1 299.604 145.658)" fill="black"/>
                          <rect id="Rectangle 128" width="20.8005" height="20.8005" transform="matrix(-1 0 0 1 320.403 71.9102)" fill="black"/>
                          <rect id="Rectangle 129" width="20.8005" height="20.8005" transform="matrix(-1 0 0 1 320.403 128.64)" fill="black"/>
                          <rect id="Rectangle 130" width="20.8005" height="43.492" transform="matrix(-1 0 0 1 341.204 88.9287)" fill="black"/>
                        </g>
                      </g>
                      <g id="Hat">
                        <path id="Vector 50" d="M44 143L77 143L77 177L66 177L66 231L55 231L55 286L66 286L66 297L88 297L88 309L131.5 309L131.5 319.5L241.5 319.5L241.5 309L285.5 309L285.5 297L307 297L307 286.5L318.5 286.5L318.5 232.5L307 232.5L307 176.5L297 176.5L297 143.5L329.5 143.5L329.5 132.5L351 132.5L351 121L363 121L363 110L374 110L374 77L361.5 77L361.5 66L351 66L351 55.5L340.5 55.5L340.5 44.5L329.5 44.5L329.5 34L307 34L307 22.5L285 22.5L285 12L252 12L252 -1.06656e-05L120.5 -2.21617e-05L120.5 11L88 11L88 21.5L65.5 21.5L65.5 33L44 33L44 43.5L33 43.5L33 55L21.5 55L21.5 66L11 66L11 78L2.11126e-05 78L1.83588e-05 109.5L11 109.5L11 121L21.5 121L21.5 131.5L44 131.5L44 143Z" fill="black"/>
                        <path id="Vector 51" d="M284 133L297 133L297 87.5L274.5 87.5L274.5 76.5L252.5 76.5L252.5 65L120 65L120 75.5L98 75.5L98 87L76.5 87L76.5 133L89 133L89 121.5L100 121.5L100 111L133 111L133 99.5L240 99.5L240 110.5L273 110.5L273 122L284 122L284 133Z" fill="white"/>
                      </g>
                    </g>
                  </svg>
                </section>

                <!-- Footer Section -->
                <section style="padding: 22px 40px;">
                  <p style="margin: 0; color: #9ca3af; text-align: center; padding: 30px 0; font-family: 'Roboto', 'Titillium Web', sans-serif;">
                    Please contact
                    <a href="mailto:hello@ayotomcs.me" style="color: #9ca3af; text-decoration: underline;">
                      hello@ayotomcs.me
                    </a>
                    if you have any questions. (If you reply to this email, I won't be able to see it)
                  </p>

                  <p style="margin: 0; color: #9ca3af; font-size: 13px; text-align: center; font-family: 'Roboto', 'Titillium Web', sans-serif;">
                    © 2025 ayotomcs. All Rights Reserved.
                  </p>

                  <div style="display: flex; justify-content: center; padding: 8px 0 20px; align-items: center; gap: 4px;">
                    <a href="https://x.com/ayotomcs" target="_blank" rel="noopener noreferrer" aria-label="View X Account">
                      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48" style="transform: scale(0.75);">
                        <path fill="#212121" fill-rule="evenodd" d="M38,42H10c-2.209,0-4-1.791-4-4V10c0-2.209,1.791-4,4-4h28c2.209,0,4,1.791,4,4v28C42,40.209,40.209,42,38,42z" clip-rule="evenodd"></path>
                        <path fill="#fff" d="M34.257,34h-6.437L13.829,14h6.437L34.257,34z M28.587,32.304h2.563L19.499,15.696h-2.563 L28.587,32.304z"></path>
                        <polygon fill="#fff" points="15.866,34 23.069,25.656 22.127,24.407 13.823,34"></polygon>
                        <polygon fill="#fff" points="24.45,21.721 25.355,23.01 33.136,14 31.136,14"></polygon>
                      </svg>
                    </a>
                    <a href="https://www.linkedin.com/in/ayotomcs/" target="_blank" rel="noopener noreferrer" aria-label="View LinkedIn Profile">
                      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 50 50" style="transform: scale(0.75);">
                        <path d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z"></path>
                      </svg>
                    </a>
                    <a href="https://github.com/tomiwadoesux" target="_blank" rel="noopener noreferrer" aria-label="View this Project on GitHub">
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" style="transform: scale(0.75);">
                        <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z" />
                      </svg>
                    </a>
                  </div>
                </section>
              </div>
            </div>
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

    // Fetch news from NewsAPI
    let articles;
    try {
      const baseUrl = "https://newsapi.org/v2";
      let endpoint;
      let params;

      if (category === "top") {
        endpoint = `${baseUrl}/top-headlines`;
        params = { country: "us", pageSize: 2 };
      } else if (category === "general") {
        endpoint = `${baseUrl}/top-headlines`;
        params = { country: "us", category: "general", pageSize: 2 };
      } else {
        endpoint = `${baseUrl}/top-headlines`;
        params = {
          country: "us",
          category: category,
          pageSize: 2
        };
      }

      console.log(`Making API request to: ${endpoint} with params:`, params);
      
      const newsResponse = await axios.get(endpoint, {
        params: {
          ...params,
          apiKey: process.env.NEWSAPI_KEY,
        },
      });

      const data = newsResponse.data.articles || [];
      console.log(`Extracted data array length:`, data.length);
      
      articles = Array.isArray(data)
        ? data.slice(0, 2).map((article) => ({
            title: article.title || "No title",
            description: article.description || article.content || "No description",
            link: article.url || "#",
            pubDate: article.publishedAt || new Date().toISOString(),
          }))
        : [];
      
      console.log(`Processed articles count:`, articles.length);
      
      const articlesWithContent = articles.map((article) => ({
        ...article,
        fullContent: article.description || article.content || article.title || 'No content available',
        originalDescription: article.description
      }));

      articles = articlesWithContent;
      
    } catch (error) {
      console.error("NewsAPI Error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
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
              article.fullContent || article.originalDescription || "No content",
              article.url
            ),
          }))
        : [
            {
              title: `No ${category} news found`,
              url: "#",
              summary: `No ${category} news found - check API configuration`,
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
          subject: `Your ${category.charAt(0).toUpperCase() + category.slice(1)} News Update`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
              <h2 style="color: #333; text-align: center; margin-bottom: 30px; border-bottom: 2px solid #007bff; padding-bottom: 15px;">Top 2 ${category.charAt(0).toUpperCase() + category.slice(1)} News Articles</h2>
              ${summarizedArticles
                .map(
                  (article) => `
                    <article style="margin-bottom: 40px; padding: 25px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
                      <h3 style="margin: 0 0 20px 0; color: #333; font-size: 22px; line-height: 1.3;"><strong>${article.title}</strong></h3>
                      <div style="margin-bottom: 20px; color: #555; font-size: 16px; line-height: 1.6; text-align: justify;">
                        ${article.summary}
                      </div>
                      <div style="text-align: center; margin-top: 20px;">
                        <a href="${article.url}"
                           style="display: inline-block; padding: 12px 25px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; transition: background-color 0.3s;"
                           target="_blank" rel="noopener noreferrer">Read Full Article →</a>
                      </div>
                    </article>
                  `
                )
                .join("")}
              <div style="margin-top: 40px; text-align: center; background-color: #f8f9fa; padding: 25px; border-radius: 12px; border: 2px solid #e9ecef;">
                <h3 style="color: #333; margin-bottom: 20px; font-size: 20px;">🎉 Here's a Fun GIF to Brighten Your Day! 🎉</h3>
                <img
                  src="${giphyUrl}"
                  alt="Fun GIF"
                  style="max-width: 100%; max-height: 300px; border-radius: 12px; box-shadow: 0 6px 12px rgba(0,0,0,0.15);"
                  onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
                />
                <p style="display: none; color: #666; font-style: italic; font-size: 16px;">
                  🎬 GIF couldn't load, but here's a virtual high-five! ✋
                </p>
                <p style="margin-top: 15px; color: #666; font-size: 14px;">
                  Powered by Giphy • <a href="${giphyUrl}" style="color: #007bff; text-decoration: none;">View original</a>
                </p>
              </div>
              <div style="margin-top: 40px; text-align: center; padding: 25px; border-top: 2px solid #eee; background-color: #f8f9fa; border-radius: 8px;">
                <p style="margin: 0 0 15px 0; color: #666; font-size: 14px;">Thanks for reading! Stay informed with V123 Newsletter.</p>
                <div style="margin-top: 15px;">
                  <a href="/api/news?action=unsubscribe&email=${encodeURIComponent(
                    email
                  )}" style="color: #dc3545; text-decoration: none; font-size: 12px; font-weight: normal;">Unsubscribe from this newsletter</a>
                </div>
              </div>
            </div>
          `,
        });

        console.log(`Newsletter sent successfully to ${email}`);

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