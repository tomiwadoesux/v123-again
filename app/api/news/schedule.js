import axios from "axios";
import { MongoClient } from "mongodb";
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

// Hugging Face summarization
async function summarizeText(text) {
  try {
    const prompt = "Summarize this article in a concise, factual way: ";
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      {
        inputs: prompt + text,
        parameters: { max_length: 200, min_length: 50 },
      },
      {
        headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
      }
    );
    let summary = response.data[0]?.summary_text || text.slice(0, 100) + "...";
    // Inject humor post-processing
    summary = `Buckle up for some news with a twist! ${summary} And honestly, who saw *that* coming? 😄`;
    return summary;
  } catch (error) {
    console.error("Hugging Face Error:", error.message);
    return text.slice(0, 100) + "...";
  }
}

// Fetch random Giphy
async function getRandomGiphy() {
  try {
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
    
    const randomTag = randomTags[Math.floor(Math.random() * randomTags.length)];
    
    const response = await axios.get(
      `https://api.giphy.com/v1/gifs/random?api_key=${process.env.GIPHY_API_KEY}&tag=${randomTag}&rating=pg`
    );
    
    const gifUrl = response.data.data?.images?.fixed_height?.url ||
                   response.data.data?.images?.original?.url ||
                   "https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif";
    
    return gifUrl;
  } catch (error) {
    console.error("Giphy Error:", error.message);
    return "https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif";
  }
}

// Scrape article content from URL
async function scrapeArticleContent(url) {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    $('script, style, nav, header, footer, .ad, .advertisement, .social-share, .comments').remove();
    
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
    
    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        content = element.text().trim();
        if (content.length > 200) {
          break;
        }
      }
    }
    
    if (!content || content.length < 200) {
      const paragraphs = $('p').map((i, el) => $(el).text().trim()).get();
      content = paragraphs.join(' ').substring(0, 2000);
    }
    
    content = content
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, ' ')
      .trim();
    
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
  const frequency = searchParams.get("frequency") || "daily"; // daily or weekly
  
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
    // Get all subscribers for the specified frequency
    const subscriberList = await subscribers.find({ frequency }).toArray();
    console.log(`Found ${subscriberList.length} subscribers for ${frequency} frequency`);

    if (subscriberList.length === 0) {
      return new Response(
        JSON.stringify({ message: `No ${frequency} subscribers found` }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const results = [];

    // Process each subscriber
    for (const subscriber of subscriberList) {
      try {
        const { email, category } = subscriber;
        
        // Fetch news for this subscriber
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
            from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          };
        }

        const newsResponse = await axios.get(endpoint, {
          params: {
            ...params,
            apiKey: process.env.NEWSAPI_KEY,
          },
        });

        const data = newsResponse.data.articles || [];
        let articles = Array.isArray(data)
          ? data.slice(0, 3).map((article) => ({
              title: article.title || "No title",
              description: article.description || article.content || "No description",
              link: article.url || "#",
              pubDate: article.publishedAt || new Date().toISOString(),
            }))
          : [];

        // Scrape article content
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
              console.error(`Error scraping article: ${scrapeError.message}`);
              return article;
            }
          })
        );

        // Summarize articles
        const articlesWithSummaries = await Promise.all(
          articlesWithContent.map(async (article) => {
            try {
              const summary = await summarizeText(article.fullContent || article.originalDescription);
              return {
                ...article,
                summary
              };
            } catch (summaryError) {
              console.error(`Error summarizing article: ${summaryError.message}`);
              return {
                ...article,
                summary: article.originalDescription || "Summary not available"
              };
            }
          })
        );

        // Get random GIF
        const gifUrl = await getRandomGiphy();

        // Create email content
        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>V123 ${category.charAt(0).toUpperCase() + category.slice(1)} News</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .article { background: white; margin: 20px 0; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
              .article h3 { color: #2c3e50; margin-top: 0; }
              .article p { color: #555; }
              .read-more { display: inline-block; background: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px; }
              .gif-section { text-align: center; margin: 30px 0; }
              .gif-section img { max-width: 100%; border-radius: 8px; }
              .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #777; }
              .unsubscribe { color: #e74c3c; text-decoration: none; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>📰 V123 ${category.charAt(0).toUpperCase() + category.slice(1)} News</h1>
              <p>Your ${frequency} dose of the latest ${category} news with a twist! 🎉</p>
            </div>
            
            <div class="content">
              ${articlesWithSummaries.map(article => `
                <div class="article">
                  <h3>${article.title}</h3>
                  <p>${article.summary}</p>
                  <a href="${article.link}" class="read-more" target="_blank">Read Full Article →</a>
                </div>
              `).join('')}
              
              <div class="gif-section">
                <h3>🎭 Because why not?</h3>
                <img src="${gifUrl}" alt="Random GIF" style="max-width: 300px;">
              </div>
            </div>
            
            <div class="footer">
              <p>Thanks for being awesome! 🌟</p>
              <p><a href="#" class="unsubscribe">Unsubscribe</a> | <a href="#">Manage Preferences</a></p>
            </div>
          </body>
          </html>
        `;

        // Send email
        await sendEmail({
          to: email,
          subject: `📰 V123 ${category.charAt(0).toUpperCase() + category.slice(1)} News - ${frequency.charAt(0).toUpperCase() + frequency.slice(1)} Digest`,
          html: emailHtml,
        });

        results.push({
          email,
          category,
          status: "sent",
          articlesCount: articlesWithSummaries.length,
        });

        // Add delay between emails to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (subscriberError) {
        console.error(`Error processing subscriber ${subscriber.email}:`, subscriberError.message);
        results.push({
          email: subscriber.email,
          category: subscriber.category,
          status: "failed",
          error: subscriberError.message,
        });
      }
    }

    // Close MongoDB connection
    await mongoClient.close();

    return new Response(
      JSON.stringify({
        message: `Processed ${subscriberList.length} subscribers for ${frequency} frequency`,
        results,
        summary: {
          total: subscriberList.length,
          sent: results.filter(r => r.status === "sent").length,
          failed: results.filter(r => r.status === "failed").length,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Schedule Error:", error.message);
    
    // Close MongoDB connection
    if (mongoClient) {
      await mongoClient.close();
    }

    return new Response(
      JSON.stringify({ error: "Failed to process scheduled emails" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
} 