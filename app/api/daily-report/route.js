import { MongoClient } from "mongodb";
import { Resend } from "resend";

let resend;
try {
  if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
} catch (error) {
  console.warn("Resend initialization failed:", error.message);
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

const sendDailyReport = async (reportData) => {
  if (!resend) {
    throw new Error("Resend client not initialized");
  }

  const {
    date,
    awwwards,
    subscriptions,
    deliveries,
    errors
  } = reportData;

  const reportHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Daily Awwwards Report - ${date}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8fafc;
        }
        .container {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
        }
        .header p {
          margin: 10px 0 0 0;
          opacity: 0.9;
        }
        .content {
          padding: 30px;
        }
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .metric-card {
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #3b82f6;
          text-align: center;
        }
        .metric-card.success {
          border-left-color: #10b981;
        }
        .metric-card.warning {
          border-left-color: #f59e0b;
        }
        .metric-card.error {
          border-left-color: #ef4444;
        }
        .metric-number {
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }
        .metric-label {
          font-size: 14px;
          color: #6b7280;
          margin: 5px 0 0 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .section {
          margin: 30px 0;
        }
        .section h2 {
          color: #1f2937;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 10px;
          font-size: 20px;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
        }
        .data-table th,
        .data-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }
        .data-table th {
          background: #f9fafb;
          font-weight: 600;
          color: #374151;
        }
        .status-sent {
          color: #10b981;
          font-weight: 600;
        }
        .status-failed {
          color: #ef4444;
          font-weight: 600;
        }
        .error-list {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 15px;
          margin: 15px 0;
        }
        .error-item {
          margin: 8px 0;
          font-size: 14px;
          color: #991b1b;
        }
        .summary-box {
          background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
          border: 1px solid #0ea5e9;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .summary-box h3 {
          color: #0c4a6e;
          margin: 0 0 10px 0;
        }
        .footer {
          text-align: center;
          padding: 20px;
          background: #f9fafb;
          color: #6b7280;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📊 Daily Awwwards Report</h1>
          <p>${date} • System Performance Summary</p>
        </div>

        <div class="content">
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-number">${awwwards.sitesScraped}</div>
              <div class="metric-label">Sites Scraped</div>
            </div>

            <div class="metric-card success">
              <div class="metric-number">${deliveries.successful}</div>
              <div class="metric-label">Emails Sent</div>
            </div>

            <div class="metric-card ${deliveries.failed > 0 ? 'error' : 'success'}">
              <div class="metric-number">${deliveries.failed}</div>
              <div class="metric-label">Failed Deliveries</div>
            </div>

            <div class="metric-card">
              <div class="metric-number">${subscriptions.new}</div>
              <div class="metric-label">New Subscribers</div>
            </div>

            <div class="metric-card ${subscriptions.unsubscribed > 0 ? 'warning' : 'success'}">
              <div class="metric-number">${subscriptions.unsubscribed}</div>
              <div class="metric-label">Unsubscriptions</div>
            </div>

            <div class="metric-card">
              <div class="metric-number">${subscriptions.total}</div>
              <div class="metric-label">Total Active</div>
            </div>
          </div>

          ${awwwards.sites && awwwards.sites.length > 0 ? `
          <div class="section">
            <h2>🏆 Today's Scraped Sites</h2>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Site Name</th>
                  <th>URL</th>
                  <th>Has Thumbnail</th>
                </tr>
              </thead>
              <tbody>
                ${awwwards.sites.slice(0, 10).map(site => `
                  <tr>
                    <td>${site.siteName}</td>
                    <td><a href="${site.siteUrl}" target="_blank">${site.siteUrl.substring(0, 50)}${site.siteUrl.length > 50 ? '...' : ''}</a></td>
                    <td>${site.thumbnailUrl ? '✅' : '❌'}</td>
                  </tr>
                `).join('')}
                ${awwwards.sites.length > 10 ? `
                  <tr>
                    <td colspan="3" style="text-align: center; font-style: italic; color: #6b7280;">
                      ... and ${awwwards.sites.length - 10} more sites
                    </td>
                  </tr>
                ` : ''}
              </tbody>
            </table>
          </div>
          ` : ''}

          ${deliveries.details && deliveries.details.length > 0 ? `
          <div class="section">
            <h2>📧 Email Delivery Summary</h2>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Sites Delivered</th>
                  <th>Message ID</th>
                </tr>
              </thead>
              <tbody>
                ${deliveries.details.map(delivery => `
                  <tr>
                    <td>${delivery.email}</td>
                    <td class="status-${delivery.status}">${delivery.status.toUpperCase()}</td>
                    <td>${delivery.sitesCount || 0}</td>
                    <td style="font-family: monospace; font-size: 12px;">${delivery.messageId || delivery.error || '-'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          ` : ''}

          ${subscriptions.newSubscribers && subscriptions.newSubscribers.length > 0 ? `
          <div class="section">
            <h2>👥 New Subscribers Today</h2>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Subscribed At</th>
                </tr>
              </thead>
              <tbody>
                ${subscriptions.newSubscribers.map(sub => `
                  <tr>
                    <td>${sub.email}</td>
                    <td>${new Date(sub.subscribedAt).toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          ` : ''}

          ${subscriptions.unsubscribedUsers && subscriptions.unsubscribedUsers.length > 0 ? `
          <div class="section">
            <h2>👋 Unsubscriptions Today</h2>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Unsubscribed At</th>
                </tr>
              </thead>
              <tbody>
                ${subscriptions.unsubscribedUsers.map(sub => `
                  <tr>
                    <td>${sub.email}</td>
                    <td>${new Date(sub.unsubscribedAt).toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          ` : ''}

          ${errors && errors.length > 0 ? `
          <div class="section">
            <h2>⚠️ Errors and Issues</h2>
            <div class="error-list">
              ${errors.map(error => `<div class="error-item">• ${error}</div>`).join('')}
            </div>
          </div>
          ` : ''}

          <div class="summary-box">
            <h3>📈 Summary</h3>
            <p>
              Today's Awwwards workflow ${deliveries.successful > 0 ? 'ran successfully' : 'encountered issues'}.
              We scraped <strong>${awwwards.sitesScraped} sites</strong> and delivered emails to
              <strong>${deliveries.successful} subscribers</strong>
              ${deliveries.failed > 0 ? ` with ${deliveries.failed} failures` : ''}.
              ${subscriptions.new > 0 ? ` We gained ${subscriptions.new} new subscribers.` : ''}
              ${subscriptions.unsubscribed > 0 ? ` ${subscriptions.unsubscribed} users unsubscribed.` : ''}
            </p>
          </div>
        </div>

        <div class="footer">
          <p>Generated automatically by V123 Daily Report System</p>
          <p>${new Date().toLocaleString()} • Next report tomorrow at 5:00 PM ET</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.RESEND_FROM_NAME || "V123 System"} <${process.env.RESEND_FROM_EMAIL}>`,
      to: [process.env.ADMIN_EMAIL || "ayotomiwawaledurojaye@gmail.com"],
      subject: `📊 Daily Awwwards Report - ${date} (${deliveries.successful} sent, ${deliveries.failed} failed)`,
      html: reportHtml,
    });

    if (error) {
      throw new Error(`Resend API error: ${JSON.stringify(error)}`);
    }

    return {
      success: true,
      messageId: data?.id,
      message: "Daily report sent successfully"
    };
  } catch (error) {
    console.error("Failed to send daily report:", error.message);
    throw new Error(`Failed to send daily report: ${error.message}`);
  }
};

export async function GET(req) {
  if (!mongoClient) {
    return new Response(
      JSON.stringify({ error: "MongoDB not configured" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  let db, awwwardsSubscribers, awwwardsSites, deliveryLogs;
  try {
    await mongoClient.connect();
    db = mongoClient.db("newsletter");
    awwwardsSubscribers = db.collection("awwwards_subscribers");
    awwwardsSites = db.collection("awwwards_sites");
    deliveryLogs = db.collection("awwwards_delivery_logs");
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
    console.log("[DAILY REPORT] Generating daily report...");

    const today = new Date().toISOString().split('T')[0];
    const startOfDay = new Date(today + 'T00:00:00.000Z');
    const endOfDay = new Date(today + 'T23:59:59.999Z');

    // Get today's scraped sites
    const todaySites = await awwwardsSites.find({ dateAdded: today }).toArray();

    // Get today's delivery logs
    const todayDeliveries = await deliveryLogs.find({
      deliveredAt: { $gte: startOfDay, $lte: endOfDay }
    }).toArray();

    // Get subscription changes today
    const newSubscribers = await awwwardsSubscribers.find({
      subscribedAt: { $gte: startOfDay, $lte: endOfDay }
    }).toArray();

    const unsubscribedToday = await awwwardsSubscribers.find({
      unsubscribedAt: { $gte: startOfDay, $lte: endOfDay }
    }).toArray();

    // Get total active subscribers
    const totalActiveSubscribers = await awwwardsSubscribers.countDocuments({ status: "active" });

    // Calculate metrics
    const successfulDeliveries = todayDeliveries.filter(d => d.status === "sent").length;
    const failedDeliveries = todayDeliveries.filter(d => d.status === "failed").length;

    // Collect any errors
    const errors = [];
    if (todaySites.length === 0) {
      errors.push("No sites were scraped today - scraper may have failed");
    }
    if (failedDeliveries > 0) {
      errors.push(`${failedDeliveries} email deliveries failed`);
    }
    if (todayDeliveries.length === 0 && totalActiveSubscribers > 0) {
      errors.push("No emails were sent despite having active subscribers");
    }

    // Prepare report data
    const reportData = {
      date: today,
      awwwards: {
        sitesScraped: todaySites.length,
        sites: todaySites
      },
      subscriptions: {
        new: newSubscribers.length,
        unsubscribed: unsubscribedToday.length,
        total: totalActiveSubscribers,
        newSubscribers,
        unsubscribedUsers: unsubscribedToday
      },
      deliveries: {
        successful: successfulDeliveries,
        failed: failedDeliveries,
        total: todayDeliveries.length,
        details: todayDeliveries
      },
      errors
    };

    console.log(`[DAILY REPORT] Report data compiled: ${successfulDeliveries} sent, ${failedDeliveries} failed`);

    // Send the report email
    let reportSent = false;
    let reportError = null;

    try {
      await sendDailyReport(reportData);
      reportSent = true;
      console.log("[DAILY REPORT] Daily report email sent successfully");
    } catch (error) {
      reportError = error.message;
      console.error("[DAILY REPORT] Failed to send report email:", error.message);
    }

    return new Response(
      JSON.stringify({
        message: `Daily report generated for ${today}`,
        reportSent,
        reportError,
        summary: {
          date: today,
          sitesScraped: todaySites.length,
          emailsSent: successfulDeliveries,
          emailsFailed: failedDeliveries,
          newSubscribers: newSubscribers.length,
          unsubscriptions: unsubscribedToday.length,
          totalActiveSubscribers,
          errorsFound: errors.length
        },
        data: reportData
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Daily Report Error:", error.message);
    return new Response(
      JSON.stringify({
        error: "Failed to generate daily report",
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