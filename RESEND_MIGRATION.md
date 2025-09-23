# Resend Migration Guide

## Overview
This project has been migrated from MailerLite to **Resend** for email delivery while maintaining MongoDB for subscriber storage and node-cron for scheduling.

## Architecture Changes

### Before (MailerLite)
```
Newsletter System:
├── MongoDB (subscribers)
├── MailerLite API (email sending + subscriber sync)
├── MailerLite Groups (subscriber segmentation)
└── node-cron (scheduling)
```

### After (Resend)
```
Newsletter System:
├── MongoDB (subscribers only)
├── Resend API (email sending)
└── node-cron (scheduling)
```

## Environment Variables

### Required (New)
```bash
# Resend Configuration
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=newsletter@yourdomain.com
RESEND_FROM_NAME=V123 Newsletter
```

### Optional
```bash
# Admin notifications
ADMIN_EMAIL=admin@yourdomain.com

# Production deployment
NEXT_PUBLIC_BASE_URL=https://yourdomain.com

# Enable cron jobs (auto-enabled in production)
ENABLE_CRON_JOBS=true
```

### Remove (Legacy)
```bash
# Remove these after migration
MAILERLITE_API_KEY=...
MAILERLITE_FROM_EMAIL=...
MAILERLITE_FROM_NAME=...
```

## Key Benefits

1. **Simpler Architecture**: No external subscriber sync needed
2. **Better Reliability**: Direct email sending without group management
3. **Unified Scheduling**: Single cron system for all frequencies
4. **Enhanced Monitoring**: Health check and status endpoints

## API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `/api/news?action=subscribe` | Subscribe to newsletter |
| `/api/news?action=unsubscribe` | Unsubscribe from newsletter |
| `/api/news?action=fetch` | Fetch news without sending email |
| `/api/news/schedule?frequency=daily` | Send scheduled emails |
| `/api/news/schedule?frequency=weekly` | Send weekly emails |
| `/api/init-cron` | Initialize cron jobs |
| `/api/health` | System health check |

## Cron Job Schedule

- **Daily emails**: 9:00 AM every day
- **Weekly emails**: 9:00 AM every Monday
- **Health checks**: Every hour
- **Timezone**: America/New_York (configurable)

## Testing

### 1. Test Individual Email
```bash
curl "http://localhost:3000/api/news?action=subscribe&email=test@example.com&category=technology&frequency=daily"
```

### 2. Test Scheduled Emails
```bash
curl "http://localhost:3000/api/news/schedule?frequency=daily&test=test@example.com"
```

### 3. Health Check
```bash
curl "http://localhost:3000/api/health"
```

### 4. Initialize Cron Jobs
```bash
curl "http://localhost:3000/api/init-cron"
```

## Production Deployment

### Vercel/Netlify
1. Set environment variables in deployment platform
2. Cron jobs auto-initialize in production
3. Use health check endpoint for monitoring

### Traditional Server
1. Set `ENABLE_CRON_JOBS=true`
2. Call `/api/init-cron` on server start
3. Monitor with `/api/health`

## Migration Steps

1. ✅ Install Resend package
2. ✅ Replace MailerLite functions with Resend
3. ✅ Update environment variables
4. ✅ Create unified cron scheduler
5. ✅ Add health check endpoint
6. ⏳ Test email functionality
7. ⏳ Deploy to production
8. ⏳ Remove MailerLite credentials

## Troubleshooting

### Email Not Sending
- Check `RESEND_API_KEY` is valid
- Verify `RESEND_FROM_EMAIL` domain is verified in Resend
- Check `/api/health` for configuration status

### Cron Jobs Not Running
- Check `/api/init-cron` was called
- Verify `NODE_ENV=production` or `ENABLE_CRON_JOBS=true`
- Check server logs for cron job initialization

### Database Issues
- Verify `MONGODB_URI` is accessible
- Check `/api/health` for database status
- Ensure MongoDB collection `subscribers` exists

## Support

For issues or questions about this migration:
1. Check the health endpoint first
2. Review server logs for error messages
3. Test individual components (email, database, cron)
4. Verify all environment variables are set correctly