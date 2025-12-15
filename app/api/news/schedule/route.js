import axios from "axios";
import { MongoClient } from "mongodb";
import * as cheerio from "cheerio";
import { Resend } from "resend";
import { HfInference } from "@huggingface/inference";

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Send email via Resend
const sendEmail = async (mailOptions) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.RESEND_FROM_NAME || "V123 Newsletter"} <${process.env.RESEND_FROM_EMAIL}>`,
      to: [mailOptions.to],
      subject: mailOptions.subject,
      html: mailOptions.html,
    });

    if (error) {
      throw new Error(`Resend API error: ${error.message}`);
    }

    console.log(`Email sent successfully to ${mailOptions.to}`);
    return { message: "Email sent via Resend", id: data?.id };
  } catch (error) {
    console.error("Resend Error:", error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Enhanced welcome email function using Resend
const sendWelcomeEmail = async (email, category, frequency) => {
  const welcomeHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to V123 Newsletter!</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .welcome-box { background: white; padding: 25px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .feature-list { list-style: none; padding: 0; }
        .feature-list li { padding: 10px 0; border-bottom: 1px solid #eee; }
        .feature-list li:last-child { border-bottom: none; }
        .emoji { font-size: 1.2em; margin-right: 10px; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #777; }
        .unsubscribe { color: #e74c3c; text-decoration: none; font-size: 12px; }
        .button { display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 Welcome to V123!</h1>
        <p>Thanks for joining our ${category} newsletter family!</p>
      </div>

      <div class="content">
        <div class="welcome-box">
          <h2>🚀 You're All Set!</h2>
          <p>Hi there! Welcome aboard the V123 Newsletter train! 🚂</p>
          <p>You've successfully subscribed to receive <strong>${frequency}</strong> updates about <strong>${category}</strong> news, and we couldn't be more excited to have you with us!</p>

          <h3>What to Expect:</h3>
          <ul class="feature-list">
            <li><span class="emoji">📰</span> Top 3 ${category} news articles</li>
            <li><span class="emoji">🤖</span> AI-powered summaries for quick reading</li>
            <li><span class="emoji">🎭</span> Quirky humor and fun commentary</li>
            <li><span class="emoji">🎉</span> Random GIFs to brighten your day</li>
            <li><span class="emoji">🔗</span> Direct links to full articles</li>
          </ul>

          <p><strong>Delivery Schedule:</strong> Every ${frequency === 'daily' ? 'day' : 'week'} at 9:00 AM</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="#" class="button">Visit V123 Website</a>
          </div>

          <p style="color: #666; font-style: italic;">Your first newsletter will arrive soon. Get ready for news with personality! 😄</p>
        </div>
      </div>

      <div class="footer">
        <p>Thanks for being awesome! 🌟</p>
        <p>
          <a href="/api/news?action=unsubscribe&email=${encodeURIComponent(email)}" class="unsubscribe">
            Unsubscribe
          </a> |
          <a href="/preferences" style="color: #007bff; text-decoration: none; font-size: 12px;">
            Manage Preferences
          </a>
        </p>
        <p style="font-size: 11px; color: #999; margin-top: 15px;">
          V123 Newsletter | Making news fun since 2024
        </p>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    subject: `🎉 Welcome to V123 ${category.charAt(0).toUpperCase() + category.slice(1)} Newsletter!`,
    html: welcomeHtml
  });
};

// Initialize Hugging Face Client
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Hugging Face summarization with better error handling
async function summarizeText(text) {
  try {
    if (!text || text.length < 50) {
      return text + " (No additional summary available)";
    }

    // Try AI summarization with timeout
    const summaryPromise = hf.summarization({
      model: 'sshleifer/distilbart-cnn-12-6', // More reliable model
      inputs: text.length > 1024 ? text.slice(0, 1024) : text,
      parameters: { 
        max_length: 150, 
        min_length: 30
      }
    });

    // Race between summarization and timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Summarization timeout')), 8000)
    );

    const result = await Promise.race([summaryPromise, timeoutPromise]);
    const summary = result.summary_text || (result[0] && result[0].summary_text);

    if (summary && summary.length > 20) {
      // Add humor touch
      const humorPrefixes = [
        "Plot twist alert! ",
        "Breaking: ",
        "In today's 'well, that happened' news: ",
        "Here's the tea: ☕ ",
        "Buckle up buttercup! "
      ];
      
      const randomPrefix = humorPrefixes[Math.floor(Math.random() * humorPrefixes.length)];
      return `${randomPrefix}${summary} 😄`;
    }

    throw new Error('No valid summary returned');
    
  } catch (error) {
    console.error("Hugging Face Error:", error.message);
    
    // Enhanced fallback: extract first few sentences
    const fallbackSnippet = text.length > 500 ? text.slice(0, 500) + "..." : text;
    
    // Add humor even to fallback
    const humorPrefixes = [
      "Our AI took a coffee break, but here's the scoop: ",
      "AI's napping, so here's the raw intel: ",
      "No AI magic today, but check this out: "
    ];
    const randomPrefix = humorPrefixes[Math.floor(Math.random() * humorPrefixes.length)];
    
    return `${randomPrefix}${fallbackSnippet}`;
  }
}

// Enhanced Giphy function
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
    return gifData?.images?.fixed_height?.url || 
           gifData?.images?.original?.url || 
           "https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif";
    
  } catch (error) {
    console.error("Giphy Error:", error.message);
    // Fallback GIFs
    const fallbackGifs = [
      "https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif",
      "https://media.giphy.com/media/26BRrSvJUa0crqw4E/giphy.gif", 
      "https://media.giphy.com/media/26gR0YFZxWbnUPtMA/giphy.gif"
    ];
    return fallbackGifs[Math.floor(Math.random() * fallbackGifs.length)];
  }
}

// Improved article scraping with timeout
async function scrapeArticleContent(url) {
  try {
    const response = await axios.get(url, {
      timeout: 8000, // Reduced timeout
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      maxRedirects: 3
    });
    
    const $ = cheerio.load(response.data);
    
    // Remove unwanted elements
    $('script, style, nav, header, footer, .ad, .advertisement, .social-share, .comments, .sidebar').remove();
    
    const contentSelectors = [
      'article', '.article-content', '.post-content', '.entry-content',
      '.story-content', '.content-body', '.article-body', '.post-body',
      '[role="main"]', '.main-content', '.article-text', '.story-text'
    ];
    
    let content = '';
    
    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        content = element.text().trim();
        if (content.length > 500) { // Further increased minimum length
          break;
        }
      }
    }
    
    // Fallback to paragraphs
    if (!content || content.length < 500) {
      const paragraphs = $('p').map((i, el) => $(el).text().trim()).get();
      content = paragraphs.filter(p => p.length > 20).join(' ').substring(0, 3000);
    }
    
    // Clean up content
    content = content
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, ' ')
      .replace(/[^\w\s.,!?;:'"()-]/g, '') // Remove special characters
      .trim();
    
    return content || 'Unable to extract article content';
    
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
    return 'Content extraction failed - but we still love you! 💝';
  }
}

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

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const frequency = searchParams.get("frequency") || "daily";
  const testEmail = searchParams.get("test"); // For testing specific email

  let db, subscribers;
  try {
    await mongoClient.connect();
    db = mongoClient.db("newsletter");
    subscribers = db.collection("subscribers");
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

  try {
    // Handle test mode
    let subscriberList;
    if (testEmail) {
      const testSubscriber = await subscribers.findOne({ email: testEmail });
      subscriberList = testSubscriber ? [testSubscriber] : [];
      console.log(`Test mode: Processing ${testEmail}`);
    } else if (frequency === 'scheduled') {
      // For scheduled delivery, find subscribers whose delivery time has come
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      // Find subscribers who should receive emails at this time (ignoring minutes, just matching the hour)
      const dailySubscribers = await subscribers.find({
        frequency: 'daily',
        'preferredTime.hour': currentHour
      }).toArray();

      // For weekly subscribers, also check the day of the week
      const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.

      const weeklySubscribers = await subscribers.find({
        frequency: 'weekly',
        'preferredTime.hour': currentHour
      }).toArray();

      // Filter weekly subscribers to only those whose subscription day matches today
      const filteredWeeklySubscribers = weeklySubscribers.filter(sub => {
        const subscriptionDate = new Date(sub.subscribedAt);
        const subscriptionDay = subscriptionDate.getDay();
        return subscriptionDay === currentDay;
      });

      subscriberList = [...dailySubscribers, ...filteredWeeklySubscribers];
      console.log(`Found ${subscriberList.length} subscribers for scheduled delivery (${dailySubscribers.length} daily, ${filteredWeeklySubscribers.length} weekly)`);
    } else {
      subscriberList = await subscribers.find({ frequency }).toArray();
      console.log(`Found ${subscriberList.length} subscribers for ${frequency} frequency`);
    }

    if (subscriberList.length === 0) {
      return new Response(
        JSON.stringify({
          message: testEmail ? `No subscriber found for ${testEmail}` : `No ${frequency} subscribers found for this time`
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const results = [];
    let processedCount = 0;

    // Process each subscriber with better error handling
    for (const subscriber of subscriberList) {
      try {
        const { email, category } = subscriber;
        console.log(`Processing ${++processedCount}/${subscriberList.length}: ${email} (${category})`);
        
        // Fetch news for this subscriber
        const baseUrl = "https://newsapi.org/v2";
        let endpoint, params;

        if (category === "top") {
          endpoint = `${baseUrl}/top-headlines`;
          params = { country: "us", pageSize: 3 };
        } else if (category === "general") {
          endpoint = `${baseUrl}/top-headlines`;
          params = { country: "us", category: "general", pageSize: 3 };
        } else {
          endpoint = `${baseUrl}/top-headlines`;
          params = {
            country: "us",
            category: category,
            pageSize: 3
          };
        }

        const newsResponse = await axios.get(endpoint, {
          params: { ...params, apiKey: process.env.NEWSAPI_KEY },
          timeout: 10000
        });

        const data = newsResponse.data.articles || [];
        let articles = Array.isArray(data)
          ? data.slice(0, 1).map((article) => ({
              title: article.title || "No title",
              description: article.description || article.content || "No description",
              link: article.url || "#",
              pubDate: article.publishedAt || new Date().toISOString(),
            }))
          : [];

        if (articles.length === 0) {
          articles = [{
            title: `No recent ${category} news found`,
            description: `We couldn't find recent ${category} news, but we're still here to make you smile!`,
            link: "#",
            pubDate: new Date().toISOString()
          }];
        }

        // Process articles with parallel scraping (faster)
        const articlesWithContent = await Promise.allSettled(
          articles.map(async (article) => {
            const scrapedContent = await scrapeArticleContent(article.link);
            return {
              ...article,
              fullContent: scrapedContent,
              originalDescription: article.description
            };
          })
        );

        // Handle scraping results
        const processedArticles = articlesWithContent.map((result, index) => {
          if (result.status === 'fulfilled') {
            return result.value;
          } else {
            console.error(`Scraping failed for article ${index}:`, result.reason);
            return {
              ...articles[index],
              fullContent: articles[index].description || 'Content not available',
              originalDescription: articles[index].description
            };
          }
        });

        // Summarize articles
        const articlesWithSummaries = await Promise.allSettled(
          processedArticles.map(async (article) => {
            const summary = await summarizeText(article.fullContent || article.originalDescription);
            return { ...article, summary };
          })
        );

        // Handle summarization results
        const finalArticles = articlesWithSummaries.map((result, index) => {
          if (result.status === 'fulfilled') {
            return result.value;
          } else {
            console.error(`Summarization failed for article ${index}:`, result.reason);
            return {
              ...processedArticles[index],
              summary: processedArticles[index].originalDescription || "Summary not available, but the article is probably great! 🎉"
            };
          }
        });

        // Get GIF
        const gifUrl = await getRandomGiphy();

        // Create enhanced email content
        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>V123 ${category.charAt(0).toUpperCase() + category.slice(1)} News</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&family=Roboto:wght@300;400;500;700&display=swap');
              
              body { margin: 0; padding: 0; background-color: #f4f4f4; color: #171717; font-family: 'Roboto', sans-serif; -webkit-font-smoothing: antialiased; }
              .wrapper { width: 100%; table-layout: fixed; background-color: #f4f4f4; padding-bottom: 40px; }
              .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
              
              /* Header */
              .header { text-align: center; padding: 40px 20px 30px; border-bottom: 2px solid #171717; }
              .logo { font-family: 'Times New Roman', serif; font-size: 52px; font-weight: 400; color: #171717; margin: 0; letter-spacing: -1px; line-height: 1; }
              .date { font-family: 'Roboto', sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #666; margin-top: 15px; }
              .issue-info { font-family: 'Roboto', sans-serif; font-size: 10px; color: #999; margin-top: 5px; }
              
              /* Content */
              .content { padding: 40px 30px; }
              .intro { font-family: 'Merriweather', serif; font-size: 18px; line-height: 1.6; color: #171717; margin-bottom: 40px; font-style: italic; text-align: center; }
              
              /* Article */
              .article { margin-bottom: 50px; }
              .category-tag { display: inline-block; font-family: 'Roboto', sans-serif; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #EB8E41; margin-bottom: 10px; border-bottom: 1px solid #EB8E41; padding-bottom: 2px; }
              .article-title { font-family: 'Merriweather', serif; font-size: 24px; font-weight: 700; line-height: 1.3; color: #171717; margin: 0 0 15px 0; }
              .article-summary { font-family: 'Roboto', sans-serif; font-size: 16px; line-height: 1.7; color: #444; font-weight: 300; }
              .read-more-btn { display: inline-block; margin-top: 15px; font-family: 'Roboto', sans-serif; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #171717; text-decoration: none; border: 1px solid #171717; padding: 10px 20px; transition: all 0.2s; }
              .read-more-btn:hover { background-color: #171717; color: #ffffff; }
              
              /* GIF Section */
              .gif-section { background-color: #f9f9f9; padding: 30px; margin: 40px 0; text-align: center; border: 1px dashed #ddd; }
              .gif-title { font-family: 'Merriweather', serif; font-size: 16px; font-style: italic; margin-bottom: 20px; color: #555; }
              .gif-img { max-width: 100%; height: auto; border: 4px solid #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
              
              /* Footer */
              .footer { background-color: #171717; color: #ffffff; padding: 40px 20px; text-align: center; }
              .footer-text { font-family: 'Roboto', sans-serif; font-size: 12px; color: #999; line-height: 1.6; margin-bottom: 20px; }
              .footer-links a { color: #fff; text-decoration: none; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0 10px; border-bottom: 1px solid transparent; }
              .footer-links a:hover { border-bottom: 1px solid #fff; }
              .quote { font-family: 'Merriweather', serif; font-style: italic; font-size: 14px; color: #666; margin-top: 30px; }
              
              /* Mobile */
              @media only screen and (max-width: 480px) {
                .logo { font-size: 42px; }
                .content { padding: 30px 20px; }
                .article-title { font-size: 20px; }
              }
            </style>
          </head>
          <body>
            <center class="wrapper">
              <div class="container">
                <!-- Header -->
                <div class="header">
                  <h1 class="logo">V123</h1>
                  <div class="date">${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
                  <div class="issue-info">Daily Edition • ${category.toUpperCase()}</div>
                </div>
                
                <!-- Content -->
                <div class="content">
                  <div class="intro">
                    Your daily dose of what matters, curated just for you.
                  </div>
                  
                  ${finalArticles.map((article, index) => `
                    <div class="article">
                      <span class="category-tag">Story 0${index + 1}</span>
                      <h2 class="article-title">${article.title}</h2>
                      <div class="article-summary">${article.summary}</div>
                      <a href="${article.link}" class="read-more-btn" target="_blank">Read Full Story</a>
                    </div>
                  `).join('')}
                  
                  <div class="gif-section">
                    <div class="gif-title">Moment of Zen</div>
                    <img src="${gifUrl}" alt="Daily GIF" class="gif-img" />
                  </div>
                </div>
                
                <!-- Footer -->
                <div class="footer">
                  <div class="footer-links">
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL || '#'}">Website</a>
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL || '#'}/subscribe">Preferences</a>
                  </div>
                  
                  <div class="quote">
                    "Art is never finished, only abandoned."
                  </div>
                  
                  <p class="footer-text" style="margin-top: 30px;">
                    You received this email because you subscribed to V123.<br>
                    <a href="/api/news?action=unsubscribe&email=${encodeURIComponent(email)}" style="color:#666; text-decoration:underline;">Unsubscribe</a>
                  </p>
                </div>
              </div>
            </center>
          </body>
          </html>
        `;

        // Send email
        await sendEmail({
          to: email,
          subject: `📰 V123 ${category.charAt(0).toUpperCase() + category.slice(1)} • ${frequency.charAt(0).toUpperCase() + frequency.slice(1)} Digest`,
          html: emailHtml,
        });

        results.push({
          email,
          category,
          status: "sent",
          articlesCount: finalArticles.length,
          timestamp: new Date().toISOString()
        });

        // Rate limiting delay
        if (processedCount < subscriberList.length) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }

      } catch (subscriberError) {
        console.error(`Error processing subscriber ${subscriber.email}:`, subscriberError.message);
        results.push({
          email: subscriber.email,
          category: subscriber.category,
          status: "failed",
          error: subscriberError.message,
          timestamp: new Date().toISOString()
        });
      }
    }

    return new Response(
      JSON.stringify({
        message: `Processed ${subscriberList.length} subscribers for ${frequency} frequency`,
        results,
        summary: {
          total: subscriberList.length,
          sent: results.filter(r => r.status === "sent").length,
          failed: results.filter(r => r.status === "failed").length,
          timestamp: new Date().toISOString()
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Schedule Error:", error.message);
    return new Response(
      JSON.stringify({ 
        error: "Failed to process scheduled emails",
        details: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
  }
}
export { sendWelcomeEmail };