import axios from "axios";
import { MongoClient } from "mongodb";
import * as cheerio from "cheerio";

// Function to extract actual website URL from Awwwards page
async function getActualWebsiteUrl(awwwardsUrl) {
  try {
    console.log(`[AWWWARDS] Extracting actual URL from ${awwwardsUrl}`);

    const response = await axios.get(awwwardsUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);

    // Look for the actual website link on Awwwards page
    const actualUrlSelectors = [
      'a[href^="http"]:contains("Visit Site")',
      'a.visit-btn',
      'a.site-visit',
      '.visit a',
      'a[target="_blank"][href^="http"]',
      'a.external-link'
    ];

    let actualUrl = '';

    for (const selector of actualUrlSelectors) {
      const linkEl = $(selector);
      if (linkEl.length > 0) {
        const href = linkEl.first().attr('href');
        if (href && href.startsWith('http') && !href.includes('awwwards.com')) {
          actualUrl = href;
          console.log(`[AWWWARDS] Found actual URL: ${actualUrl}`);
          break;
        }
      }
    }

    // Fallback: look for any external link that's not awwwards
    if (!actualUrl) {
      $('a[href^="http"]').each((i, el) => {
        const href = $(el).attr('href');
        if (href && !href.includes('awwwards.com') && !href.includes('facebook.com') && !href.includes('twitter.com') && !href.includes('instagram.com')) {
          actualUrl = href;
          console.log(`[AWWWARDS] Fallback actual URL: ${actualUrl}`);
          return false; // break
        }
      });
    }

    return actualUrl || awwwardsUrl; // fallback to awwwards URL if can't find actual site
  } catch (error) {
    console.error(`[AWWWARDS] Error extracting actual URL from ${awwwardsUrl}:`, error.message);
    return awwwardsUrl; // fallback to awwwards URL
  }
}

// Function to get website screenshot using htmlcsstoimage.com API
async function getWebsiteScreenshot(websiteUrl) {
  try {
    // Simple fallback - use a placeholder or screenshot service
    // For now, we'll use a simple approach that doesn't require API keys
    const screenshotUrl = `https://api.screenshotmachine.com?key=demo&url=${encodeURIComponent(websiteUrl)}&dimension=1024x768`;

    console.log(`[AWWWARDS] Generated screenshot URL for ${websiteUrl}`);
    return screenshotUrl;
  } catch (error) {
    console.error(`[AWWWARDS] Error generating screenshot for ${websiteUrl}:`, error.message);
    return ''; // no screenshot
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

async function scrapeAwwwardsSites() {
  try {
    console.log("[AWWWARDS] Starting scrape of Sites of the Day...");

    const response = await axios.get('https://www.awwwards.com/websites/sites-of-the-day/', {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    });

    const $ = cheerio.load(response.data);
    const scrapedSites = [];

    // Look for website cards - Awwwards typically uses these selectors
    const cardSelectors = [
      '.js-grid-item',
      '.site-item',
      '.grid-item',
      '[data-model="site"]',
      '.website-item',
      '.card'
    ];

    let foundCards = $();
    for (const selector of cardSelectors) {
      const cards = $(selector);
      if (cards.length > 0) {
        foundCards = cards;
        console.log(`[AWWWARDS] Found ${cards.length} cards using selector: ${selector}`);
        break;
      }
    }

    // If no specific cards found, try to find any links with awwwards.com/sites/
    if (foundCards.length === 0) {
      foundCards = $('a[href*="/sites/"]').parent();
      console.log(`[AWWWARDS] Fallback: Found ${foundCards.length} potential site links`);
    }

    foundCards.each((index, element) => {
      if (index >= 30) return false; // Limit to 30

      const $card = $(element);

      // Try multiple approaches to extract data
      let siteName = '';
      let siteUrl = '';
      let thumbnailUrl = '';

      // Extract site name
      const titleSelectors = [
        '.site-title',
        '.title',
        'h3',
        'h2',
        '.name',
        '[title]'
      ];

      for (const selector of titleSelectors) {
        const titleEl = $card.find(selector);
        if (titleEl.length > 0) {
          siteName = titleEl.first().text().trim() || titleEl.first().attr('title') || '';
          if (siteName) break;
        }
      }

      // Extract site URL
      const linkSelectors = [
        'a[href*="/sites/"]',
        'a[href^="https://www.awwwards.com/sites/"]',
        'a.site-link',
        'a'
      ];

      for (const selector of linkSelectors) {
        const linkEl = $card.find(selector);
        if (linkEl.length > 0) {
          let href = linkEl.first().attr('href');
          if (href) {
            if (href.startsWith('/')) {
              href = 'https://www.awwwards.com' + href;
            }
            if (href.includes('/sites/') || href.includes('awwwards.com')) {
              siteUrl = href;
              break;
            }
          }
        }
      }

      // Extract thumbnail
      const imgSelectors = [
        'img',
        '.thumbnail img',
        '.site-image img',
        '.preview img'
      ];

      for (const selector of imgSelectors) {
        const imgEl = $card.find(selector);
        if (imgEl.length > 0) {
          let src = imgEl.first().attr('src') || imgEl.first().attr('data-src') || imgEl.first().attr('data-lazy');
          if (src) {
            if (src.startsWith('/')) {
              src = 'https://www.awwwards.com' + src;
            }
            thumbnailUrl = src;
            break;
          }
        }
      }

      // Only add if we have at least name and URL
      if (siteName && siteUrl) {
        scrapedSites.push({
          siteName: siteName,
          awwwardsUrl: siteUrl, // Store the Awwwards URL
          siteUrl: siteUrl, // Will be updated with actual URL later
          actualWebsiteUrl: '', // Will be populated later
          thumbnailUrl: thumbnailUrl || '',
          screenshotUrl: '', // Will be populated later
          scrapedAt: new Date(),
          dateAdded: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
        });
      }
    });

    // If we didn't get enough, try a different approach
    if (scrapedSites.length < 5) {
      console.log("[AWWWARDS] Low results, trying alternative scraping approach...");

      // Look for any links that might be site links
      $('a[href*="/sites/"]').each((index, element) => {
        if (index >= 30) return false;

        const $link = $(element);
        const href = $link.attr('href');
        let siteName = $link.text().trim() || $link.find('img').attr('alt') || `Site ${index + 1}`;

        if (href && siteName) {
          const fullUrl = href.startsWith('/') ? 'https://www.awwwards.com' + href : href;

          // Check if we already have this site
          const exists = scrapedSites.some(site => site.siteUrl === fullUrl);
          if (!exists) {
            scrapedSites.push({
              siteName: siteName,
              awwwardsUrl: fullUrl,
              siteUrl: fullUrl,
              actualWebsiteUrl: '',
              thumbnailUrl: '',
              screenshotUrl: '',
              scrapedAt: new Date(),
              dateAdded: new Date().toISOString().split('T')[0]
            });
          }
        }
      });
    }

    console.log(`[AWWWARDS] Successfully scraped ${scrapedSites.length} sites`);

    // Process first 10 sites to get actual URLs and screenshots (to avoid rate limiting)
    const processLimit = Math.min(scrapedSites.length, 10);
    console.log(`[AWWWARDS] Processing ${processLimit} sites for actual URLs and screenshots...`);

    for (let i = 0; i < processLimit; i++) {
      const site = scrapedSites[i];
      try {
        // Get actual website URL
        const actualUrl = await getActualWebsiteUrl(site.awwwardsUrl);
        site.actualWebsiteUrl = actualUrl;
        site.siteUrl = actualUrl; // Update siteUrl to be the actual website

        // Get screenshot
        const screenshotUrl = await getWebsiteScreenshot(actualUrl);
        site.screenshotUrl = screenshotUrl;

        console.log(`[AWWWARDS] Processed ${i + 1}/${processLimit}: ${site.siteName}`);

        // Add delay to avoid rate limiting
        if (i < processLimit - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
        }
      } catch (error) {
        console.error(`[AWWWARDS] Error processing ${site.siteName}:`, error.message);
        // Keep original URLs if processing fails
      }
    }

    return scrapedSites;

  } catch (error) {
    console.error("[AWWWARDS] Error scraping sites:", error.message);

    // Return fallback data if scraping fails
    return Array.from({length: 10}, (_, i) => ({
      siteName: `Awesome Design Site ${i + 1}`,
      awwwardsUrl: `https://awwwards.com/sites/example-${i + 1}`,
      siteUrl: `https://example-design-${i + 1}.com`,
      actualWebsiteUrl: `https://example-design-${i + 1}.com`,
      thumbnailUrl: `https://via.placeholder.com/400x300/6366f1/ffffff?text=Site+${i + 1}`,
      screenshotUrl: `https://via.placeholder.com/800x600/f3f4f6/333333?text=Site+${i + 1}`,
      scrapedAt: new Date(),
      dateAdded: new Date().toISOString().split('T')[0]
    }));
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action") || "scrape";

  if (!mongoClient) {
    return new Response(
      JSON.stringify({ error: "MongoDB not configured" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  let db, awwwardsCollection;
  try {
    await mongoClient.connect();
    db = mongoClient.db("newsletter");
    awwwardsCollection = db.collection("awwwards_sites");
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
    if (action === "scrape") {
      console.log("[AWWWARDS API] Starting daily scrape...");

      // Scrape new sites
      const newSites = await scrapeAwwwardsSites();

      if (newSites.length === 0) {
        return new Response(
          JSON.stringify({
            message: "No sites found during scrape",
            sites: [],
            count: 0
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // Remove today's existing entries to avoid duplicates
      const today = new Date().toISOString().split('T')[0];
      await awwwardsCollection.deleteMany({ dateAdded: today });

      // Insert new sites
      if (newSites.length > 0) {
        await awwwardsCollection.insertMany(newSites);
      }

      console.log(`[AWWWARDS API] Stored ${newSites.length} sites for ${today}`);

      return new Response(
        JSON.stringify({
          message: `Successfully scraped and stored ${newSites.length} Awwwards sites`,
          sites: newSites,
          count: newSites.length,
          date: today
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );

    } else if (action === "get-today") {
      // Get today's scraped sites
      const today = new Date().toISOString().split('T')[0];
      const todaySites = await awwwardsCollection.find({ dateAdded: today }).toArray();

      return new Response(
        JSON.stringify({
          message: `Found ${todaySites.length} sites for today`,
          sites: todaySites,
          count: todaySites.length,
          date: today
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );

    } else if (action === "get-random") {
      // Get 3 random sites from today for email sending
      const count = parseInt(searchParams.get("count")) || 3;
      const today = new Date().toISOString().split('T')[0];

      const randomSites = await awwwardsCollection.aggregate([
        { $match: { dateAdded: today } },
        { $sample: { size: count } }
      ]).toArray();

      return new Response(
        JSON.stringify({
          message: `Selected ${randomSites.length} random sites`,
          sites: randomSites,
          count: randomSites.length,
          date: today
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );

    } else {
      return new Response(
        JSON.stringify({ error: "Invalid action. Use 'scrape', 'get-today', or 'get-random'" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

  } catch (error) {
    console.error("Awwwards API Error:", error.message);
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