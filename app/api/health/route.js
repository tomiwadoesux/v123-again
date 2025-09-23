import { MongoClient } from 'mongodb';

// Test MongoDB connection
const testMongoConnection = async () => {
  try {
    const client = new MongoClient(process.env.MONGODB_URI, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
    });

    await client.connect();
    const db = client.db('newsletter');
    const subscribers = db.collection('subscribers');
    const count = await subscribers.countDocuments();
    await client.close();

    return {
      status: 'healthy',
      subscriberCount: count,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

// Test Resend configuration
const testResendConfig = () => {
  const hasApiKey = !!process.env.RESEND_API_KEY;
  const hasFromEmail = !!process.env.RESEND_FROM_EMAIL;
  const hasFromName = !!process.env.RESEND_FROM_NAME;

  return {
    configured: hasApiKey && hasFromEmail,
    details: {
      apiKey: hasApiKey ? 'configured' : 'missing',
      fromEmail: hasFromEmail ? 'configured' : 'missing',
      fromName: hasFromName ? 'configured' : 'missing'
    }
  };
};

export async function GET(request) {
  try {
    // Test all system components
    const mongoHealth = await testMongoConnection();
    const resendConfig = testResendConfig();

    const healthStatus = {
      status: mongoHealth.status === 'healthy' && resendConfig.configured ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      components: {
        database: mongoHealth,
        emailService: {
          provider: 'Resend',
          configured: resendConfig.configured,
          config: resendConfig.details
        },
        scheduler: {
          status: process.env.NODE_ENV === 'production' || process.env.ENABLE_CRON_JOBS === 'true' ? 'enabled' : 'disabled',
          environment: process.env.NODE_ENV || 'development'
        }
      },
      endpoints: {
        subscribe: '/api/news?action=subscribe',
        unsubscribe: '/api/news?action=unsubscribe',
        fetch: '/api/news?action=fetch',
        schedule: '/api/news/schedule',
        initCron: '/api/init-cron'
      }
    };

    return new Response(
      JSON.stringify(healthStatus, null, 2),
      {
        status: healthStatus.status === 'healthy' ? 200 : 503,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
      }
    );

  } catch (error) {
    console.error('Health check error:', error.message);

    return new Response(
      JSON.stringify({
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}