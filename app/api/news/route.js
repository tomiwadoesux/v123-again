import axios from "axios";
import { MongoClient } from "mongodb";
import validator from "validator";
import * as cheerio from "cheerio";

// Send email via MailerLite
const sendEmail = async (mailOptions) => {
  try {
    const response = await axios.post(
      "https://connect.mailerlite.com/api/emails",
      {
        recipients: [{ email: mailOptions.to }],
        subject: mailOptions.subject,
        html_body: mailOptions.html,
        from: { 
          email: process.env.MAILERLITE_FROM_EMAIL,
          name: process.env.MAILERLITE_FROM_NAME || "V123 Newsletter"
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${process.env.MAILERLITE_API_KEY}`
        }
      }
    );
    
    console.log(`Email sent successfully to ${mailOptions.to}`);
    return { message: "Email sent", id: response.data.id };
  } catch (error) {
    console.error("MailerLite Error:", error.message);
    if (error.response) {
      console.error("MailerLite Response:", error.response.data);
    }
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Sync subscriber to MailerLite
const syncSubscriber = async (email, category, frequency) => {
  try {
    const response = await axios.post(
      "https://connect.mailerlite.com/api/subscribers",
      {
        email: email,
        fields: {
          category: category,
          frequency: frequency
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${process.env.MAILERLITE_API_KEY}`
        }
      }
    );
    console.log(`Subscribed ${email} to MailerLite`);
    return response.data;
  } catch (error) {
    console.error("MailerLite Subscriber Error:", error.message);
    // Don't throw error, just log it so the main flow continues
  }
};

// Hugging Face summarization
async function summarizeText(title, content) {
  try {
    const combinedText = `Title: ${title}. Content: ${content}`;
    const prompt = "Summarize this article in a concise, factual way: ";
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      {
        inputs: prompt + combinedText,
        parameters: { max_length: 200, min_length: 50 },
      },
      {
        headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
      }
    );
    let summary = response.data[0]?.summary_text || combinedText.slice(0, 200) + "...";
    return summary;
  } catch (error) {
    console.error("Hugging Face Error:", error.message);
    return content.slice(0, 100) + "...";
  }
}

// Fetch random Giphy
async function getRandomGiphy() {
  try {
    // Use a mix of random funny tags for variety
    const randomTags = [
      "funny",
      "reaction",
      "meme",
      "lol",
      "humor",
      "comedy",
      "gif",
      "random"
    ];
    
    // Pick a random tag
    const randomTag = randomTags[Math.floor(Math.random() * randomTags.length)];
    
    const response = await axios.get(
      `https://api.giphy.com/v1/gifs/random?api_key=${process.env.GIPHY_API_KEY}&tag=${randomTag}&rating=pg`
    );
    
    // Get the fixed height version which is more reliable for emails
    const gifUrl = response.data.data?.images?.fixed_height?.url ||
                   response.data.data?.images?.original?.url ||
                   "https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif";
    
    console.log(`Random Giphy URL (tag: ${randomTag}):`, gifUrl);
    return gifUrl;
  } catch (error) {
    console.error("Giphy Error:", error.message);
    return "https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif";
  }
}

// Scrape article content from URL
async function scrapeArticleContent(url) {
  try {
    console.log(`Scraping article from: ${url}`);
    
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    // Remove script and style elements
    $('script, style, nav, header, footer, .ad, .advertisement, .social-share, .comments').remove();
    
    // Common selectors for article content
    const contentSelectors = [
      'article',
      '.article-content',
      '.post-content',
      '.entry-content',
      '.story-content',
      '.content-body',
      '.article-body',
      '.post-body',
      '[role="main"]',
      '.main-content',
      '.article-text',
      '.story-text'
    ];
    
    let content = '';
    
    // Try to find content using common selectors
    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        content = element.text().trim();
        if (content.length > 200) { // Ensure we have substantial content
          break;
        }
      }
    }
    
    // If no content found with selectors, try to extract from paragraphs
    if (!content || content.length < 200) {
      const paragraphs = $('p').map((i, el) => $(el).text().trim()).get();
      content = paragraphs.join(' ').substring(0, 2000); // Limit to 2000 chars
    }
    
    // Clean up the content
    content = content
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim();
    
    console.log(`Scraped content length: ${content.length} characters`);
    
    return content || 'Unable to extract article content';
    
  } catch (error) {
    console.error(`Error scraping article from ${url}:`, error.message);
    return 'Unable to extract article content';
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
    // Handle subscription actions
    if (action === "subscribe") {
      if (!email) {
        return new Response(JSON.stringify({ error: "Email required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
      
      const frequency = searchParams.get("frequency") || "daily";
      
      // Save subscriber to database
      await subscribers.updateOne(
        { email },
        {
          $set: {
            email,
            category,
            frequency,
            subscribedAt: new Date(),
          },
        },
        { upsert: true }
      );
      
      // Sync to MailerLite automation (this will trigger the welcome sequence)
      try {
        const syncResponse = await axios.post(
          `${req.nextUrl.origin}/api/mailerlite-sync`,
          {
            email,
            category,
            frequency
          },
          {
            headers: {
              "Content-Type": "application/json",
            }
          }
        );
        
        console.log(`Subscribed ${email} to ${category} news (${frequency}) - Automation triggered`);
        
        return new Response(
          JSON.stringify({ 
            message: `Successfully subscribed ${email} to ${category} news! Welcome sequence started.`,
            automationTriggered: true,
            mailerliteId: syncResponse.data.mailerliteId,
            group: syncResponse.data.group
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
        
      } catch (syncError) {
        console.error("Failed to sync with MailerLite:", syncError.message);
        
        // Still return success for database save, but note the sync issue
        return new Response(
          JSON.stringify({ 
            message: `Subscribed ${email} to ${category} news, but automation sync failed`,
            automationTriggered: false,
            error: syncError.message
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    } else if (action === "unsubscribe") {
      if (!email) {
        return new Response(JSON.stringify({ error: "Email required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
      await subscribers.deleteOne({ email });
      console.log(`Unsubscribed ${email} from ${category} news`);
      
      // Send unsubscribe confirmation email
      try {
        await sendEmail({
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
        await sendEmail({
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
      // Just fetch and return news without sending email
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
        params = { country: "us", pageSize: 3 };
      } else {
        endpoint = `${baseUrl}/everything`;
        params = { 
          q: category, 
          language: "en", 
          sortBy: "publishedAt", 
          pageSize: 3,
          from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Last 7 days
        };
      }

      console.log(`Making API request to: ${endpoint} with params:`, params);
      
      const newsResponse = await axios.get(endpoint, {
        params: {
          ...params,
          apiKey: process.env.NEWSAPI_KEY,
        },
      });

      // Log the full response for debugging
      console.log(`API Response for ${category}:`, JSON.stringify(newsResponse.data, null, 2));

      // Validate response and extract articles
      const data = newsResponse.data.articles || [];
      console.log(`Extracted data array length:`, data.length);
      
      articles = Array.isArray(data)
        ? data.slice(0, 3).map((article) => ({
            title: article.title || "No title",
            description: article.description || article.content || "No description",
            link: article.url || "#",
            pubDate: article.publishedAt || new Date().toISOString(),
          }))
        : [];
      
      console.log(`Processed articles count:`, articles.length);
      
      // Scrape full article content from each URL
      console.log('Starting to scrape article content...');
      const articlesWithContent = await Promise.all(
        articles.map(async (article) => {
          try {
            const scrapedContent = await scrapeArticleContent(article.link);
            return {
              ...article,
              fullContent: scrapedContent,
              originalDescription: article.description
            };
          } catch (scrapeError) {
            console.error(`Failed to scrape article ${article.link}:`, scrapeError.message);
            return {
              ...article,
              fullContent: article.description || 'Unable to scrape content',
              originalDescription: article.description
            };
          }
        })
      );
      
      articles = articlesWithContent;
      console.log('Finished scraping article content');
    } catch (error) {
      console.error("NewsAPI Error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        category: category,
        endpoint: endpoint,
        params: params,
      });
      
      // Check if it's an API key issue
      if (error.response?.status === 401) {
        console.error("API Key issue - check NEWSAPI_KEY environment variable");
      }
      
      articles = [];
    }

    // Summarize articles using title and content
    const summarizedArticles = await Promise.all(
      articles.length > 0
        ? articles.map(async (article) => ({
            title: article.title,
            url: article.link,
            summary: await summarizeText(
              article.title,
              article.fullContent || article.originalDescription || article.title || "No content"
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

    // Prepare email content
    const mailOptions = {
      to: email,
      subject: `Your ${
        category.charAt(0).toUpperCase() + category.slice(1)
      } News Update`,
      html: `
        <h2>Top 3 ${category} News Articles</h2>
        ${summarizedArticles
          .map(
            (article) => `
              <div style="margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; text-align: center;">
                <p style="color: #666; font-style: italic; margin-bottom: 15px;"><strong>Summary:</strong> ${article.summary}</p>
                <a href="${article.link}" style="display: inline-block; padding: 10px 24px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold; margin-bottom: 15px;">See News</a>
              </div>
            `
          )
          .join("")}
        <div style="margin-top: 40px; text-align: center; background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
          <h3 style="color: #333; margin-bottom: 15px;">🎉 Here's a Fun GIF to Brighten Your Day! 🎉</h3>
          <img 
            src="${giphyUrl}" 
            alt="Fun GIF" 
            style="max-width: 100%; max-height: 300px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" 
            onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
          />
          <p style="display: none; color: #666; font-style: italic;">
            🎬 GIF couldn't load, but here's a virtual high-five! ✋
          </p>
          <p style="margin-top: 15px; color: #666; font-size: 14px;">
            Powered by Giphy • <a href="${giphyUrl}" style="color: #007bff;">View original</a>
          </p>
        </div>
        <div style="margin-top: 30px; text-align: center; padding: 20px; border-top: 1px solid #eee;">
          <a href="/api/news?action=unsubscribe&email=${encodeURIComponent(
            email
          )}" style="color: #dc3545; text-decoration: none; font-weight: bold;">Unsubscribe from this newsletter</a>
        </div>
      `,
    };

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

    // Send email immediately (for subscribe and send actions)
    try {
      await sendEmail(mailOptions);
      console.log(
        `Email sent successfully for category: ${category} to ${email}`
      );
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `Email Delivery Success for ${category}`,
        html: `Success: Email sent for ${category} to ${email} at ${new Date().toISOString()}`,
      });

      return new Response(
        JSON.stringify({
          message: `News for ${category} sent to ${email}`,
          articles: summarizedArticles,
          giphy: giphyUrl,
          scrapedContent: true,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (emailError) {
      console.error(
        `Failed to send email for category: ${category} to ${email}`,
        emailError.message
      );
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `Email Delivery Failure for ${category}`,
        html: `Error: Failed to send email for ${category} to ${email} at ${new Date().toISOString()} - ${
          emailError.message
        }`,
      });

      return new Response(
        JSON.stringify({
          error: "Failed to send email",
          articles: summarizedArticles,
          giphy: giphyUrl,
          scrapedContent: true,
        }),
        {
          status: 500,
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
    try {
      await mongoClient.close();
    } catch (error) {
      console.error("MongoDB Close Error:", error.message);
    }
  }
}