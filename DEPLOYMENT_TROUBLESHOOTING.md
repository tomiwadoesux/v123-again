# 🔍 Vercel Deployment Troubleshooting Guide

**Date:** December 14, 2025

## 🚨 Issue: Email sending fails on deployment (Vercel)

You mentioned that emails work locally but fail after deployment. Here are the most common causes and fixes.

### 1. Check Vercel Environment Variables
Local `.env.local` files are **NOT** automatically uploaded to Vercel. You must verify them in the Vercel Dashboard.

**Check these variables:**
- `MONGODB_URI`
- `RESEND_API_KEY`
- `NEWSAPI_KEY`
- `HUGGINGFACE_API_KEY`
- `GIPHY_API_KEY`
- `RESEND_FROM_EMAIL` (e.g., mailing@ayotomcs.me)
- `RESEND_FROM_NAME` (e.g., V123)

**How to Fix:**
1. Go to Vercel Dashboard → Project → Settings → Environment Variables.
2. Ensure all keys from your `.env.local` are present.
3. Redeploy if you add missing variables.

### 2. Check MongoDB Connection (Crucial!)
Vercel functions run on dynamic IP addresses. Your MongoDB cluster must allow connections from **anywhere**.

**How to Fix:**
1. Go to MongoDB Atlas Dashboard.
2. Click **Network Access**.
3. Ensure there is an IP Whitelist entry for `0.0.0.0/0` (Allow Access from Anywhere).
4. If not, add it.

### 3. Check Base URL
Your `test-cron.js` uses `NEXT_PUBLIC_BASE_URL`. Ensure this is set correctly in Vercel.
- **Value:** `https://v123.ayotomcs.me`
- Note: This affects links in the email, not the sending functionality itself.

### 4. Vercel Function Timeout
The news fetching + AI summarization takes ~20 seconds. Vercel's default timeout is **10 seconds** on the Hobby plan (15s on Pro).

**Error:** `FUNCTION_INVOCATION_TIMEOUT`

**Solution:**
You may be hitting the 10s limit. 
- **Option A:** Upgrade to Pro (not desired).
- **Option B:** Optimize the code (reduce number of articles, disable AI on free tier).
- **Option C:** Use the "Send Sample" button which runs as a standard API request (sometimes has slightly more leniency but still bound by limits).

**Optimization applied:** We reduced the timeout in the code to 8s for scraping and AI, but the total time might still exceed 10s.

## 🛠 Action Plan

1. **Verify Env Vars:** Check Vercel dashboard.
2. **Verify MongoDB Network:** Check IP whitelist.
3. **Check Logs:**
   - Go to Vercel Dashboard → Deployments → Select latest deployment → Functions.
   - Look for the error log. It will tell us exactly what failed (e.g., `MongoTimeoutError`, `ConnectTimeoutError`).

Let me know what the error log says!
