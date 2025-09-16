# MailerLite Automation Setup Guide

## 🎯 Overview
This guide will help you set up automated email sequences in MailerLite that trigger when subscribers join your newsletter. The automation will handle welcome emails, onboarding, and engagement sequences.

## 📋 Prerequisites
- MailerLite account with API access
- Your API key configured in environment variables
- Groups created in MailerLite for each news category

## 🚀 Step-by-Step Setup

### Step 1: Create Groups in MailerLite

Create separate groups for each news category:

1. **Log into MailerLite Dashboard**
2. **Go to Subscribers → Groups**
3. **Create the following groups:**
   - `technology_subscribers`
   - `business_subscribers`
   - `health_subscribers`
   - `science_subscribers`
   - `sports_subscribers`
   - `entertainment_subscribers`
   - `general_subscribers`

### Step 2: Set Up Automation Workflow

#### 2.1 Create New Automation
1. **Go to Automations → Create Automation**
2. **Choose Template:** "Advanced Welcome Email" (or start from scratch)
3. **Name:** "V123 Newsletter Welcome Sequence"

#### 2.2 Configure Trigger
1. **Trigger Type:** "Subscriber added to group"
2. **Select Group:** Choose one of your category groups (e.g., `technology_subscribers`)
3. **Conditions:** None (triggers for all new group members)

#### 2.3 Design Email Sequence

**Email 1: Welcome (0 minutes delay)**
```
Subject: 🎉 Welcome to V123 - Your [Category] News Journey Begins!

Content:
<h1>🎉 Welcome to V123 Newsletter!</h1>
<p>Hi there, news enthusiast!</p>
<p>You've just joined our exclusive [Category] news community. Get ready for:</p>
<ul>
  <li>📰 Curated [Category] news with AI summaries</li>
  <li>🎭 Fun GIFs to brighten your day</li>
  <li>🚀 Fresh content delivered [Frequency]</li>
</ul>
<p>Your first news digest is coming soon!</p>
```

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
   - Trigger: Subscriber added to `technology_subscribers`
   - Customize content for tech news

2. **Business News Automation**
   - Trigger: Subscriber added to `business_subscribers`
   - Customize content for business news

3. **Health News Automation**
   - Trigger: Subscriber added to `health_subscribers`
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
- Verify group name matches exactly (e.g., `technology_subscribers`)
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