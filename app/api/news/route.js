import axios from "axios";
import { MongoClient } from "mongodb";
import validator from "validator";
import mailchimp from "@mailchimp/mailchimp_marketing";

// Send email via Mailchimp
const sendMailchimpEmail = async (mailOptions) => {
  try {
    const response = await fetch("https://api.mailchimp.com/3.0/campaigns", {
      method: "POST",QQ
      headers: {
        Authorization: `Bearer ${process.env.MAILCHIMP_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "regular",
        recipients: { list_id: process.env.MAILCHIMP_LIST_ID },
        settings: {
          subject_line: mailOptions.subject,
          from_name: "Your Newsletter",
          reply_to: process.env.MAILCHIMP_FROM_EMAIL,
        },
      }),
    });
    if (!response.ok) {
      throw new Error(`Mailchimp campaign creation failed: ${response.statusText}`);
    }
    const campaign = await response.json();
    await fetch(`https://api.mailchimp.com/3.0/campaigns/${campaign.id}/content`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${process.env.MAILCHIMP_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ html: mailOptions.html }),
    });
    await fetch(`https://api.mailchimp.com/3.0/campaigns/${campaign.id}/actions/send`, {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.MAILCHIMP_API_KEY}` },
    });
    return { message: "Email sent" };
  } catch (error) {
    console.error("Mailchimp Error:", error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Sync subscriber to Mailchimp audience
const syncSubscriber = async (email, category, frequency) => {
  mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: process.env.MAILCHIMP_SERVER_PREFIX, // e.g., 'us1'
  });
  try {
    await mailchimp.lists.addListMember(process.env.MAILCHIMP_LIST_ID, {
      email_address: email,
      status: "subscribed",
      merge_fields: { CATEGORY: category, FREQUENCY: frequency },
    });
    console.log(`Subscribed ${email} to Mailchimp list`);
  } catch (error) {
    console.error("Mailchimp Sync Error:", error.message);
  }
};

// Hugging Face summarization
async function summarizeText(text) {
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      { inputs: text, parameters: { max_length: 100, min_length: 30 } },
      {
        headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
      }
    );
    return response.data[0]?.summary_text || text.slice(0, 100) + "...";
  } catch (error) {
    console.error("Hugging Face Error:", error.message);
    return text.slice(0, 100) + "...";
  }
}

// Fetch random Giphy
async function getRandomGiphy() {
  try {
    const response = await axios.get(
      `https://api.giphy.com/v1/gifs/random?api_key=${process.env.GIPHY_API_KEY}&tag=funny&rating=pg`
    );
    return (
      response.data.data?.images?.original?.url ||
      "https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif"
    );
  } catch (error) {
    console.error("Giphy Error:", error.message);
    return "https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif";
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
    "top",
    "world",
    "politics",
    "business",
    "technology",
    "sports",
    "entertainment",
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
      await subscribers.updateOne(
        { email },
        {
          $set: {
            email,
            category,
            frequency: searchParams.get("frequency") || "daily",
            subscribedAt: new Date(),
          },
        },
        { upsert: true }
      );
      await syncSubscriber(email, category, searchParams.get("frequency") || "daily");
      console.log(
        `Subscribed ${email} to ${category} news (${
          searchParams.get("frequency") || "daily"
        })`
      );
      return new Response(
        JSON.stringify({ message: `Subscribed ${email} to ${category} news` }),
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
      await subscribers.deleteOne({ email });
      console.log(`Unsubscribed ${email} from ${category} news`);
      return new Response(
        JSON.stringify({
          message: `Unsubscribed ${email} from ${category} news`,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Fetch news from Real-Time News Data API
    let articles;
    try {
      const topicMap = {
        top: "top", // Will use /top-headlines
        world: "WORLD",
        politics: "politics", // Will use /search
        business: "BUSINESS",
        technology: "TECHNOLOGY",
        sports: "SPORTS",
        entertainment: "ENTERTAINMENT",
      };
      const baseUrl = "https://real-time-news-data.p.rapidapi.com";
      let endpoint;
      let params;

      if (category === "top") {
        endpoint = `${baseUrl}/top-headlines`;
        params = { country: "US", lang: "en", limit: 3 };
      } else if (category === "politics") {
        endpoint = `${baseUrl}/search`;
        params = { query: topicMap[category], country: "US", lang: "en", limit: 3, time_published: "anytime" };
      } else {
        endpoint = `${baseUrl}/topic-headlines`;
        params = { topic: topicMap[category], country: "US", lang: "en", limit: 3 };
      }

      const newsResponse = await axios.get(endpoint, {
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": "real-time-news-data.p.rapidapi.com",
        },
        params,
      });

      // Log the full response for debugging
      console.log(`API Response for ${category}:`, JSON.stringify(newsResponse.data, null, 2));

      // Validate response and extract articles
      const data = newsResponse.data.data || newsResponse.data.articles || newsResponse.data.results || [];
      articles = Array.isArray(data)
        ? data.slice(0, 3).map((article) => ({
            title: article.title || article.headline || "No title",
            description: article.snippet || article.description || article.content || article.title || "No description",
            link: article.url || article.link || "#",
            pubDate: article.published_at || article.publication_date || article.date || new Date().toISOString(),
          }))
        : [];
    } catch (error) {
      console.error("Real-Time News Data Error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      articles = [];
    }

    // Summarize articles
    const summarizedArticles = await Promise.all(
      articles.length > 0
        ? articles.map(async (article) => ({
            title: article.title,
            description: article.description,
            link: article.link,
            pubDate: article.pubDate,
            summary: await summarizeText(
              article.description || article.title || "No content"
            ),
          }))
        : [
            {
              title: "No news available",
              description: "No news available",
              link: "#",
              pubDate: new Date().toISOString(),
              summary: "No news available",
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
              <div>
                <h3>${article.title}</h3>
                <p>${article.summary}</p>
                <a href="${article.link}">Read more</a>
                <p>Published: ${new Date(
                  article.pubDate
                ).toLocaleDateString()}</p>
              </div>
              <hr />
            `
          )
          .join("")}
        <h3>Here's a Fun Meme/GIF for You!</h3>
        <img src="${giphyUrl}" alt="Random Meme/GIF" style="max-width: 100%;" />
        <p><a href="/api/news?action=unsubscribe&email=${encodeURIComponent(
          email
        )}">Unsubscribe</a></p>
      `,
    };

    // Send email immediately
    try {
      await sendMailchimpEmail(mailOptions);
      console.log(
        `Email sent successfully for category: ${category} to ${email}`
      );
      await sendMailchimpEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `Email Delivery Success for ${category}`,
        html: `Success: Email sent for ${category} to ${email} at ${new Date().toISOString()}`,
      });

      return new Response(
        JSON.stringify({
          message: `News for ${category} sent to ${email}`,
          articles: summarizedArticles,
          giphy: giphyUrl,
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
      await sendMailchimpEmail({
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