# Newsletter Setup Guide

## Required Environment Variables

Add these to your `.env.local` file or Vercel environment variables:

### MongoDB Configuration
```
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/your_database?retryWrites=true&w=majority
```

### Mailgun Configuration
```
MAILGUN_API_KEY=your_mailgun_api_key_here
MAILGUN_DOMAIN=newsletter.ayotomcs.me
MAILGUN_FROM_EMAIL=postmaster@newsletter.ayotomcs.me
```

### News API Configuration
```
NEWSAPI_KEY=your_newsapi_key_here
```

### Optional Services (for enhanced features)

#### Mailchimp Configuration
```
MAILCHIMP_API_KEY=your_mailchimp_api_key_here
MAILCHIMP_SERVER_PREFIX=us1
MAILCHIMP_LIST_ID=your_mailchimp_list_id_here
```

#### Hugging Face Configuration (for AI summarization)
```
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
```

#### Giphy Configuration (for GIFs in emails)
```
GIPHY_API_KEY=your_giphy_api_key_here
```

#### Admin Email for notifications
```
ADMIN_EMAIL=your_admin_email@example.com
```

## Features

### ✅ What's Working Now:
1. **Show News on Screen** - Fetches and displays news articles without sending emails
2. **Subscribe** - Adds user to database and sends welcome email with news
3. **Unsubscribe** - Removes user from database and sends confirmation email
4. **Send News** - Sends current news to specified email
5. **Test Mailgun Email** - Tests basic Mailgun functionality

### 📧 Email Notifications:
- **Welcome Email**: Sent when user subscribes (includes news articles)
- **Unsubscribe Email**: Sent when user unsubscribes
- **Admin Notifications**: Sent to admin for all actions

### 🎯 Next Steps:
1. Set up MongoDB Atlas account and get connection string
2. Configure Mailgun domain and API key
3. Get NewsAPI key from https://newsapi.org/
4. Add environment variables to Vercel
5. Test the functionality!

## Testing

Visit `/test-newsletter` to test all functionality:
- Use "Show News on Screen" to see articles without subscribing
- Use "Subscribe" to add yourself to the newsletter
- Use "Send News" to receive current news via email
- Use "Unsubscribe" to remove yourself from the newsletter 