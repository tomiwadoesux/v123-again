# MailerLite Campaign Management Guide

## 🎯 Overview
This guide covers how to manage your V123 newsletter using **MailerLite Campaigns Only**. All emails are now sent through MailerLite's campaign system:

**Campaign-Based Email Management**:
- **Welcome emails**: MailerLite campaigns → Individual sends
- **Newsletter campaigns**: MailerLite campaigns → Group sends
- **Admin notifications**: MailerLite campaigns → Individual sends
- **Manual control**: Full control over all email sending via MailerLite dashboard

This approach provides **single platform management** with **complete campaign control**.

## 📋 Prerequisites
- MailerLite account with API access
- Your API key configured in environment variables
- Understanding that all emails (including welcome emails) will use MailerLite campaigns

## ⚠️ Important Notes
- **All emails** are now sent via MailerLite campaigns
- **Welcome emails** may go to Promotions tab (this is expected behavior for campaigns)
- **Single platform** - everything managed through MailerLite dashboard
- **Campaign control** - full manual control over email sending

## 🚀 Campaign Management Setup

### Step 1: Subscriber Groups (Already Created)

Your system automatically creates organized groups:
- **Technology Newsletter** (for tech subscribers)
- **Business Newsletter** (for business subscribers)
- **Health Newsletter** (for health subscribers)
- **Science Newsletter** (for science subscribers)
- etc.

Subscribers are automatically assigned to appropriate groups with clean data.

### Step 2: Create Campaign Templates

#### 2.1 Newsletter Campaign Template
1. **Go to Campaigns → Create Campaign**
2. **Choose:** Regular Campaign
3. **Name:** "V123 [Category] Newsletter - [Date]"
4. **Recipients:** Select specific group (e.g., "Technology Newsletter")

#### 2.2 Campaign Content Template
```html
<!DOCTYPE html>
<html>
<head>
    <title>V123 [Category] Newsletter</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">

    <h1>V123 [Category] Newsletter</h1>
    <p style="color: #666;">Your daily dose of [category] news</p>

    <!-- News Article 1 -->
    <div style="margin: 30px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2>[Article 1 Title]</h2>
        <p>[Article 1 Summary]</p>
        <a href="[Article 1 URL]" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Read More</a>
    </div>

    <!-- News Article 2 -->
    <div style="margin: 30px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2>[Article 2 Title]</h2>
        <p>[Article 2 Summary]</p>
        <a href="[Article 2 URL]" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Read More</a>
    </div>

    <!-- News Article 3 -->
    <div style="margin: 30px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2>[Article 3 Title]</h2>
        <p>[Article 3 Summary]</p>
        <a href="[Article 3 URL]" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Read More</a>
    </div>

    <!-- Fun GIF Section -->
    <div style="text-align: center; margin: 40px 0; background: #f8f9fa; padding: 20px; border-radius: 10px;">
        <h3>Today's Fun Break</h3>
        <img src="[GIF_URL]" alt="Fun GIF" style="max-width: 100%; border-radius: 10px;"/>
    </div>

    <!-- Footer -->
    <div style="margin-top: 40px; padding: 20px; border-top: 1px solid #eee; text-align: center;">
        <p style="font-size: 12px; color: #666;">
            You're receiving this because you subscribed to V123 [Category] Newsletter<br>
            <a href="[UNSUBSCRIBE_URL]">Unsubscribe</a> | <a href="[MANAGE_URL]">Manage Preferences</a>
        </p>
    </div>

</body>
</html>
```

### Step 3: Campaign Creation Workflow

#### Daily Newsletter Process:
1. **Generate Content**: Use your `/api/news?category=technology&action=fetch` endpoint
2. **Create Campaign**: In MailerLite dashboard
3. **Select Template**: Use your saved newsletter template
4. **Fill Content**: Replace placeholders with actual news
5. **Select Recipients**: Choose appropriate group (e.g., "Technology Newsletter")
6. **Schedule/Send**: Send immediately or schedule for preferred time

**Email 2: Onboarding (1 day delay)**
```
Subject: 🚀 How to Get the Most from Your V123 Experience

Content:
<h2>🚀 Let's Make Your V123 Experience Amazing!</h2>
<p>Here are some tips to get the most from your [Category] news:</p>
<ol>
  <li>📱 Check your email [Frequency] for fresh updates</li>
  <li>🔗 Click through to read full articles</li>
  <li>💬 Reply to share your thoughts</li>
  <li>⭐ Save important stories for later</li>
</ol>
<p>Your next news digest arrives tomorrow!</p>
```

**Email 3: Engagement (7 days delay)**
```
Subject: 📊 Your First Week with V123 - How's It Going?

Content:
<h2>📊 Your V123 Journey So Far</h2>
<p>You've been with us for a week! Here's what you've received:</p>
<ul>
  <li>📰 [X] [Category] news articles</li>
  <li>🎭 [X] fun GIFs</li>
  <li>📈 [X] AI-generated summaries</li>
</ul>
<p>Want to adjust your preferences? <a href="#">Click here</a></p>
```

### Step 3: Create Multiple Automations

Repeat the process for each news category:

1. **Technology News Automation**
   - Trigger: Subscriber added to `technology_sub`
   - Customize content for tech news

2. **Business News Automation**
   - Trigger: Subscriber added to `business_sub`
   - Customize content for business news

3. **Health News Automation**
   - Trigger: Subscriber added to `health_sub`
   - Customize content for health news

### Step 4: Test Your Automation

1. **Use the test page:** `/test-automation`
2. **Subscribe with a test email**
3. **Check MailerLite dashboard** for automation triggers
4. **Verify emails are sent** in the correct sequence

## 🔧 Advanced Configuration

### Custom Fields Integration
Your API automatically sets these custom fields:
- `category`: The news category (technology, business, etc.)
- `frequency`: Daily or weekly updates
- `subscribed_date`: When they joined
- `source`: "v123_newsletter"

### Conditional Logic
Add conditions based on subscriber behavior:
- **If opened previous email:** Send engagement content
- **If clicked links:** Send premium content
- **If no engagement:** Send re-engagement email

### A/B Testing
Test different email subjects and content:
- Subject line variations
- Content length (short vs. detailed)
- Call-to-action placement

## 📊 Monitoring & Analytics

### Key Metrics to Track
- **Open rates** for each email in sequence
- **Click-through rates** on links
- **Unsubscribe rates** at each stage
- **Conversion rates** (if applicable)

### Automation Performance
- **Trigger rate:** How many subscribers enter automation
- **Completion rate:** How many finish the sequence
- **Engagement rate:** Overall interaction with automation emails

## 🛠️ Troubleshooting

### Common Issues

**Automation not triggering:**
- Check if subscriber is added to correct group
- Verify group name matches exactly (e.g., `technology_sub`)
- Check API response for any errors

**Emails not sending:**
- Verify MailerLite API key is correct
- Check email sending limits
- Review automation status in MailerLite dashboard

**Wrong content showing:**
- Verify custom fields are being set correctly
- Check personalization tags in email content
- Test with different subscriber data

### Debug Steps
1. **Check API logs** for sync errors
2. **Verify subscriber data** in MailerLite dashboard
3. **Test automation manually** with existing subscribers
4. **Review email delivery** in MailerLite reports

## 🎨 Email Template Best Practices

### Design Guidelines
- **Mobile-first:** Ensure emails look good on mobile
- **Clear hierarchy:** Use headings and spacing effectively
- **Brand consistency:** Use your V123 colors and fonts
- **Call-to-action:** Make buttons prominent and clear

### Content Tips
- **Personalization:** Use subscriber's category and frequency
- **Value-focused:** Emphasize benefits of staying subscribed
- **Engagement:** Encourage replies and social sharing
- **Unsubscribe:** Make it easy to opt out

## 📈 Optimization Strategies

### Performance Optimization
- **Segment subscribers** by engagement level
- **A/B test** different automation flows
- **Monitor metrics** and adjust accordingly
- **Clean lists** regularly to maintain deliverability

### Content Optimization
- **Test different subject lines** for better open rates
- **Vary email timing** to find optimal send times
- **Personalize content** based on subscriber behavior
- **Include social proof** and testimonials

## 🔄 Integration with Your Code

### API Endpoints
- **Subscribe:** `/api/news?action=subscribe`
- **Sync:** `/api/mailerlite-sync`
- **Check Status:** `/api/mailerlite-sync?email=...`

### Environment Variables Required
```env
MAILERLITE_API_KEY=your_api_key_here
MAILERLITE_FROM_EMAIL=your_sender_email
MAILERLITE_FROM_NAME=V123 Newsletter
```

### Testing Workflow
1. **Local testing:** Use `/test-automation` page
2. **API testing:** Test endpoints directly
3. **Integration testing:** Full subscription flow
4. **Production testing:** Real subscriber signups

## 🎯 Success Metrics

### Short-term Goals
- **Automation trigger rate:** >95%
- **Welcome email open rate:** >40%
- **Sequence completion rate:** >60%

### Long-term Goals
- **Subscriber retention:** >80% after 30 days
- **Engagement rate:** >25% average
- **Unsubscribe rate:** <5% per month

## 📞 Support Resources

- **MailerLite Documentation:** https://developers.mailerlite.com/
- **API Reference:** https://developers.mailerlite.com/reference
- **Automation Guide:** https://www.mailerlite.com/help/automations
- **Email Templates:** https://www.mailerlite.com/templates

---

**Next Steps:**
1. Set up groups in MailerLite
2. Create automation workflows
3. Test with the `/test-automation` page
4. Monitor performance and optimize
5. Scale to additional categories as needed 