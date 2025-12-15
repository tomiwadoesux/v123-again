#!/bin/bash

# Check Vercel plan and cron job status
# Run: bash check-vercel-plan.sh

echo "🔍 Checking Vercel Plan and Cron Status"
echo "========================================"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "📊 Fetching project information..."
echo ""

# Get project info
vercel project ls 2>/dev/null || echo "⚠️  Please run 'vercel login' first"

echo ""
echo "📋 To check your plan:"
echo "1. Go to: https://vercel.com/dashboard"
echo "2. Click on your project"
echo "3. Go to Settings → General"
echo "4. Look for 'Plan' section"
echo ""
echo "💡 If you see 'Hobby', you need to upgrade to Pro for cron jobs"
echo "💡 If you see 'Pro' or 'Enterprise', cron jobs are enabled"
echo ""
echo "🔗 Upgrade here: https://vercel.com/account/billing"
