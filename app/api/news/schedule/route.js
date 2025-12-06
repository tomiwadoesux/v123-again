import axios from "axios";
import { MongoClient } from "mongodb";
import * as cheerio from "cheerio";
import { Resend } from "resend";

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

// Hugging Face summarization with better error handling
async function summarizeText(text) {
  try {
    if (!text || text.length < 50) {
      return text + " (No additional summary available)";
    }

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      {
        inputs: text.length > 2048 ? text.slice(0, 2048) : text, // Use more content for AI
        parameters: { 
          max_length: 1000, 
          min_length: 30,
          do_sample: false 
        },
      },
      {
        headers: { 
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 10000
      }
    );

    let summary = response.data[0]?.summary_text || text;
    
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
    
  } catch (error) {
    console.error("Hugging Face Error:", error.message);
    
    // Enhanced fallback message that explicitly states AI failure
    const fallbackSnippet = text.length > 500 ? text.slice(0, 500) + "..." : text;
    return `⚠️ **AI Summary Unavailable:** We couldn't generate our usual witty summary for this one (our AI bots are having a nap). \n\nHere is a snippet from the article instead:\n\n"${fallbackSnippet}"`;
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
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; }
              .container { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
              .header h1 { margin: 0; font-size: 28px; }
              .header p { margin: 10px 0 0 0; opacity: 0.9; }
              .content { padding: 30px; }
              .article { background: #f8f9fa; margin: 25px 0; padding: 25px; border-radius: 8px; border-left: 4px solid #667eea; }
              .article h3 { color: #2c3e50; margin-top: 0; font-size: 18px; }
              .article p { color: #555; margin: 15px 0; }
              .read-more { display: inline-block; background: linear-gradient(135deg, #3498db, #2980b9); color: white; padding: 12px 24px; text-decoration: none; border-radius: 25px; font-weight: 500; transition: all 0.3s ease; }
              .gif-section { text-align: center; margin: 40px 0; padding: 30px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 12px; color: white; }
              .gif-section h3 { margin: 0 0 20px 0; }
              .gif-section img { max-width: 100%; max-height: 250px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
              .footer { text-align: center; margin-top: 30px; padding: 30px; background: #f8f9fa; color: #777; border-radius: 0 0 12px 12px; }
              .footer a { color: #e74c3c; text-decoration: none; }
              .date { font-size: 12px; color: #999; margin-bottom: 10px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>📰 V123 ${category.charAt(0).toUpperCase() + category.slice(1)} News</h1>
                <p>Your ${frequency} dose of news with personality! • ${new Date().toLocaleDateString()}</p>
              </div>
              
              <div class="content">
                ${finalArticles.map((article, index) => `
                  <div class="article">
                    <div class="date">Article ${index + 1} • ${new Date(article.pubDate).toLocaleDateString()}</div>
                    <h3>${article.title}</h3>
                    <p>${article.summary}</p>
                    <a href="${article.link}" class="read-more" target="_blank">Read Full Story →</a>
                  </div>
                `).join('')}
                
                <div class="gif-section">
                  <h3>🎭 Your Daily Dose of Joy!</h3>
                  <img src="${gifUrl}" alt="Fun GIF to brighten your day" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                  <p style="display: none;">🎬 GIF couldn't load, but imagine something really funny here! 😄</p>
                </div>
              </div>
              
              <div class="footer">
                <p>That's all for today, news ninja! 🥷✨</p>
                <p style="font-size: 12px; margin-top: 20px;">
                  <a href="/api/news?action=unsubscribe&email=${encodeURIComponent(email)}">Unsubscribe</a> | 
                  <a href="#" style="color: #007bff;">Manage Preferences</a>
                </p>
                <p style="font-size: 11px; color: #999; margin-top: 15px;">
                  V123 Newsletter • Making news fun since 2024 🚀
                </p>
              </div>
            </div>
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