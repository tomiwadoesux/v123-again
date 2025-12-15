# 🚀 GitHub Actions Cron Setup (FREE Alternative)

**Date:** December 14, 2025  
**Status:** ✅ Ready to Deploy

Since you're on Vercel's free (Hobby) plan, we'll use **GitHub Actions** to trigger your newsletter emails. This is **completely free** and works just as well!

## ✅ What I've Set Up

### 1. **GitHub Actions Workflow**
Created: `.github/workflows/newsletter-cron.yml`

This workflow:
- ✅ Runs **every hour** at minute 0 (same as Vercel cron would)
- ✅ Calls your API endpoint: `https://v123.ayotomcs.me/api/news/schedule?frequency=scheduled`
- ✅ Completely **FREE** (GitHub Actions gives you 2,000 minutes/month for free)
- ✅ Can be manually triggered from GitHub UI

### 2. **Removed Vercel Cron**
Updated: `vercel.json`
- ✅ Removed the `crons` section (won't work on free plan anyway)

### 3. **Fixed Subscriber Data**
- ✅ Added `preferredTime` to all 20 subscribers
- ✅ 18 subscribers will get emails at 9:00 AM CST
- ✅ 1 subscriber at 9:00 PM CST
- ✅ 1 subscriber at 11:00 PM CST

## 📋 Deployment Steps

### Step 1: Commit and Push to GitHub

```bash
cd /Users/mac/Documents/InPortfolio/v123-again

# Add all changes
git add .

# Commit
git commit -m "Add GitHub Actions cron for newsletter emails"

# Push to GitHub
git push origin main
```

### Step 2: Enable GitHub Actions

1. Go to your GitHub repository
2. Click on the **"Actions"** tab
3. If prompted, click **"I understand my workflows, go ahead and enable them"**
4. You should see the workflow: **"Send Newsletter Emails"**

### Step 3: Verify the Workflow

1. In the Actions tab, click on **"Send Newsletter Emails"**
2. You'll see the schedule: **"Runs every hour at minute 0"**
3. Click **"Run workflow"** to test it manually (optional)

### Step 4: Monitor First Run

The workflow will run at the top of every hour. To check:

1. Go to **Actions** tab
2. Click on the latest run
3. Click on the **"send-emails"** job
4. Expand **"Trigger Newsletter Cron"** to see the output

## 🎯 How It Works

### Schedule:
```yaml
schedule:
  - cron: '0 * * * *'  # Every hour at minute 0
```

### What Happens:
1. **Every hour** (e.g., 9:00 AM, 10:00 AM, 11:00 AM, etc.)
2. GitHub Actions triggers the workflow
3. It calls: `https://v123.ayotomcs.me/api/news/schedule?frequency=scheduled`
4. Your API checks the current hour
5. Finds subscribers whose `preferredTime.hour` matches
6. Sends emails to those subscribers

### Example Timeline (CST):
- **9:00 AM** → GitHub Actions runs → Finds 18 subscribers → Sends emails ✅
- **10:00 AM** → GitHub Actions runs → No subscribers → No emails sent
- **9:00 PM** → GitHub Actions runs → Finds 1 subscriber → Sends email ✅
- **11:00 PM** → GitHub Actions runs → Finds 1 subscriber → Sends email ✅

## 🔍 Testing

### Manual Test (Before Pushing):
```bash
# Test the endpoint locally
curl "https://v123.ayotomcs.me/api/news/schedule?frequency=scheduled"
```

### Manual Trigger on GitHub:
1. Go to **Actions** tab
2. Click **"Send Newsletter Emails"**
3. Click **"Run workflow"** dropdown
4. Click **"Run workflow"** button
5. Watch it execute in real-time

## 📊 Current Configuration

### Subscribers:
- **Total:** 20 subscribers
- **Daily:** 17 subscribers
- **Weekly:** 3 subscribers

### Delivery Times:
- **9:00 AM CST:** 18 subscribers
- **9:00 PM CST:** 1 subscriber
- **11:00 PM CST:** 1 subscriber

### API Endpoints:
- **Production:** `https://v123.ayotomcs.me`
- **Cron Endpoint:** `/api/news/schedule?frequency=scheduled`

## ✅ Advantages of GitHub Actions

1. **100% Free** - No need for Vercel Pro
2. **Reliable** - GitHub's infrastructure
3. **Transparent** - See logs for every run
4. **Manual Control** - Can trigger manually anytime
5. **Version Controlled** - Workflow is in your repo

## 🎉 What's Different from Vercel Cron?

### Vercel Cron (Requires Pro - $20/month):
- Runs on Vercel's infrastructure
- Configured in `vercel.json`
- No visibility into runs (unless you check function logs)

### GitHub Actions (FREE):
- Runs on GitHub's infrastructure
- Configured in `.github/workflows/`
- Full visibility with logs and status badges
- Can be manually triggered
- **Works exactly the same way!**

## 🚨 Important Notes

### GitHub Actions Limits (Free Plan):
- ✅ **2,000 minutes/month** (plenty for this use case)
- ✅ Your workflow uses ~1 second per run
- ✅ Running every hour = 720 runs/month = ~12 minutes/month
- ✅ You're using **0.6%** of your free quota!

### If the Workflow Doesn't Run:
1. Make sure the repository is **public** (or you have Actions enabled for private repos)
2. Check that Actions are enabled in repo settings
3. Verify the workflow file is in `.github/workflows/` directory
4. Check the Actions tab for any errors

## 📞 Troubleshooting

### Workflow Not Showing Up?
```bash
# Make sure the file is in the right place
ls -la .github/workflows/newsletter-cron.yml

# Check the file is valid YAML
cat .github/workflows/newsletter-cron.yml
```

### Workflow Failing?
1. Check the Actions tab for error messages
2. Verify your API endpoint is accessible:
   ```bash
   curl "https://v123.ayotomcs.me/api/news/schedule?frequency=scheduled"
   ```
3. Check Vercel function logs for errors

### No Emails Being Sent?
1. Run the test script:
   ```bash
   node test-cron.js your-email@example.com
   ```
2. Check Resend dashboard for delivery status
3. Verify subscriber data:
   ```bash
   node fix-subscribers.js
   ```

## 🎯 Next Steps

1. ✅ Commit and push to GitHub
2. ✅ Enable GitHub Actions in your repo
3. ✅ Wait for the next hour (or trigger manually)
4. ✅ Check your email!

## 📝 Commands Summary

```bash
# 1. Commit and push
git add .
git commit -m "Add GitHub Actions cron for newsletter emails"
git push origin main

# 2. Test manually (optional)
curl "https://v123.ayotomcs.me/api/news/schedule?frequency=scheduled"

# 3. Check subscriber data (optional)
node fix-subscribers.js
```

---

**Ready to deploy!** Just commit and push to GitHub, and your newsletter emails will start sending automatically every hour! 🎉
