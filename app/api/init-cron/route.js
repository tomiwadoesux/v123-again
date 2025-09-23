import { startCronJobs } from '../../../lib/cronScheduler.js';

let cronJobsInitialized = false;

export async function GET(request) {
  try {
    if (!cronJobsInitialized) {
      // Only start cron jobs in production or when explicitly enabled
      if (process.env.NODE_ENV === 'production' || process.env.ENABLE_CRON_JOBS === 'true') {
        startCronJobs();
        cronJobsInitialized = true;

        return new Response(
          JSON.stringify({
            message: 'Cron jobs initialized successfully',
            environment: process.env.NODE_ENV,
            timestamp: new Date().toISOString(),
            jobs: [
              'Daily emails: 9:00 AM every day',
              'Weekly emails: 9:00 AM every Monday',
              'Health check: Every hour'
            ]
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      } else {
        return new Response(
          JSON.stringify({
            message: 'Cron jobs not enabled (development mode)',
            environment: process.env.NODE_ENV,
            note: 'Set ENABLE_CRON_JOBS=true to enable in development'
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
    } else {
      return new Response(
        JSON.stringify({
          message: 'Cron jobs already initialized',
          timestamp: new Date().toISOString()
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('Error initializing cron jobs:', error.message);

    return new Response(
      JSON.stringify({
        error: 'Failed to initialize cron jobs',
        details: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}