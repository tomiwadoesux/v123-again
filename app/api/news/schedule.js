import axios from "axios";
import { MongoClient } from "mongodb";
import formData from "form-data";
import * as cheerio from "cheerio";

// Send email via Mailgun
const sendEmail = async (mailOptions) => {
  try {
    const form = new formData();
    form.append('from', process.env.MAILGUN_FROM_EMAIL || 'noreply@yourdomain.com');
    form.append('to', mailOptions.to);
    form.append('subject', mailOptions.subject);
    form.append('html', mailOptions.html);
    
    const response = await axios.post(
      `https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`,
      form,
      {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Basic ${Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString('base64')}`
        }
      }
    );
    
    console.log(`Email sent successfully to ${mailOptions.to}`);
    return { message: "Email sent", id: response.data.id };
  } catch (error) {
    console.error("Mailgun Error:", error.message);
    if (error.response) {
      console.error("Mailgun Response:", error.response.data);
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
              return {
                ...article,
                fullContent: article.description || 'Unable to scrape content',
                originalDescription: article.description
              };
            }
          })
        );

        // Summarize articles
        const summarizedArticles = await Promise.all(
          articlesWithContent.map(async (article) => ({
            title: article.title,
            description: article.originalDescription,
            fullContent: article.fullContent,
            link: article.link,
            pubDate: article.pubDate,
            summary: await summarizeText(
              article.fullContent || article.originalDescription || article.title || "No content"
            ),
          }))
        );

        // Get random GIF
        const giphyUrl = await getRandomGiphy();

        // Prepare email content
        const mailOptions = {
          to: email,
          subject: `Your ${frequency.charAt(0).toUpperCase() + frequency.slice(1)} ${category.charAt(0).toUpperCase() + category.slice(1)} News Update`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #333; text-align: center;">📰 Your ${frequency.charAt(0).toUpperCase() + frequency.slice(1)} News Update</h1>
              <p style="color: #666; text-align: center;">Here's your latest ${category} news from V123</p>
              
              ${summarizedArticles
                .map(
                  (article) => `
                    <div style="margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                      <h3 style="color: #333; margin-bottom: 10px;">${article.title}</h3>
                      <p style="color: #666; font-style: italic; margin-bottom: 15px;"><strong>Summary:</strong> ${article.summary}</p>
                      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
                        <h4 style="margin-top: 0; color: #555;">Full Article Content:</h4>
                        <p style="line-height: 1.6; color: #333;">${article.fullContent ? article.fullContent.substring(0, 800) + (article.fullContent.length > 800 ? '...' : '') : article.description}</p>
                      </div>
                      <a href="${article.link}" style="color: #007bff; text-decoration: none; font-weight: bold;">Read full article →</a>
                      <p style="color: #999; font-size: 12px; margin-top: 10px;">Published: ${new Date(
                        article.pubDate
                      ).toLocaleDateString()}</p>
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
                />
              </div>
              
              <div style="margin-top: 30px; text-align: center; padding: 20px; border-top: 1px solid #eee;">
                <a href="/api/news?action=unsubscribe&email=${encodeURIComponent(
                  email
                )}" style="color: #dc3545; text-decoration: none; font-weight: bold;">Unsubscribe from this newsletter</a>
              </div>
            </div>
          `,
        };

        // Send email
        await sendEmail(mailOptions);
        
        results.push({
          email,
          category,
          status: "sent",
          articlesCount: summarizedArticles.length
        });
        
        console.log(`Scheduled email sent to ${email} for ${category}`);
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Failed to send email to ${subscriber.email}:`, error.message);
        results.push({
          email: subscriber.email,
          category: subscriber.category,
          status: "failed",
          error: error.message
        });
      }
    }

    // Send summary to admin
    const successCount = results.filter(r => r.status === "sent").length;
    const failureCount = results.filter(r => r.status === "failed").length;
    
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `📊 ${frequency.charAt(0).toUpperCase() + frequency.slice(1)} Newsletter Summary`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2 style="color: #333;">📊 ${frequency.charAt(0).toUpperCase() + frequency.slice(1)} Newsletter Summary</h2>
          <p><strong>Total subscribers:</strong> ${subscriberList.length}</p>
          <p><strong>Successfully sent:</strong> ${successCount}</p>
          <p><strong>Failed:</strong> ${failureCount}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          
          <h3>Detailed Results:</h3>
          <ul>
            ${results.map(r => `
              <li style="color: ${r.status === 'sent' ? '#28a745' : '#dc3545'};">
                ${r.email} (${r.category}) - ${r.status}${r.error ? `: ${r.error}` : ''}
              </li>
            `).join('')}
          </ul>
        </div>
      `,
    });

    return new Response(
      JSON.stringify({
        message: `Scheduled ${frequency} newsletter sent to ${subscriberList.length} subscribers`,
        results,
        summary: {
          total: subscriberList.length,
          success: successCount,
          failed: failureCount
        }
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Schedule API Error:", error.message);
    return new Response(
      JSON.stringify({
        error: "Failed to process scheduled newsletter",
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