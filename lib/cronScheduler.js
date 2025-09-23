import cron from 'node-cron';
import axios from 'axios';

// Get the base URL for API calls (different for dev vs production)
const getBaseUrl = () => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com';
  }
  return 'http://localhost:3000';
};

// Function to call the schedule endpoint
const triggerScheduledEmails = async (frequency) => {
  const baseUrl = getBaseUrl();
  const endpoint = `${baseUrl}/api/news/schedule?frequency=${frequency}`;

  try {
    console.log(`[${new Date().toISOString()}] Triggering ${frequency} email schedule...`);

    const response = await axios.get(endpoint, {
      timeout: 120000, // 2 minutes timeout for bulk emails
      headers: {
        'User-Agent': 'V123-CronScheduler/1.0'
      }
    });

    console.log(`[${new Date().toISOString()}] ${frequency} emails completed:`, response.data.summary);

    return response.data;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error triggering ${frequency} emails:`, error.message);

    // If it's a timeout, that's expected for large subscriber lists
    if (error.code === 'ECONNABORTED') {
      console.log(`[${new Date().toISOString()}] ${frequency} email job likely still running (timeout reached)`);
    }

    throw error;
  }
};

// Start the cron jobs
export const startCronJobs = () => {
  console.log('[CRON] Starting newsletter cron jobs...');

  // Daily emails at 9:00 AM every day
  cron.schedule('0 9 * * *', async () => {
    console.log('[CRON] Running daily email job...');
    try {
      await triggerScheduledEmails('daily');
    } catch (error) {
      console.error('[CRON] Daily email job failed:', error.message);
    }
  }, {
    scheduled: true,
    timezone: "America/New_York" // Adjust timezone as needed
  });

  // Weekly emails at 9:00 AM every Monday
  cron.schedule('0 9 * * 1', async () => {
    console.log('[CRON] Running weekly email job...');
    try {
      await triggerScheduledEmails('weekly');
    } catch (error) {
      console.error('[CRON] Weekly email job failed:', error.message);
    }
  }, {
    scheduled: true,
    timezone: "America/New_York" // Adjust timezone as needed
  });

  // Health check job - runs every hour to make sure the system is alive
  cron.schedule('0 * * * *', () => {
    console.log(`[CRON] Health check - ${new Date().toISOString()} - Cron jobs running`);
  }, {
    scheduled: true
  });

  console.log('[CRON] Newsletter cron jobs started successfully!');
  console.log('[CRON] Daily emails: 9:00 AM every day');
  console.log('[CRON] Weekly emails: 9:00 AM every Monday');
  console.log('[CRON] Timezone: America/New_York');
};

// Stop all cron jobs (useful for testing or shutdown)
export const stopCronJobs = () => {
  console.log('[CRON] Stopping all cron jobs...');
  cron.getTasks().forEach(task => {
    task.stop();
  });
  console.log('[CRON] All cron jobs stopped.');
};

// Manual trigger functions for testing
export const triggerDailyEmails = () => triggerScheduledEmails('daily');
export const triggerWeeklyEmails = () => triggerScheduledEmails('weekly');

// Export default as an object with all functions
export default {
  startCronJobs,
  stopCronJobs,
  triggerDailyEmails,
  triggerWeeklyEmails
};