#!/bin/bash

# Quick deployment script for GitHub Actions cron setup
# Run: bash deploy-github-actions.sh

echo "🚀 Deploying GitHub Actions Cron Setup"
echo "========================================"
echo ""

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo "❌ Not a git repository. Please run this from your project root."
    exit 1
fi

# Check if GitHub Actions workflow exists
if [ ! -f .github/workflows/newsletter-cron.yml ]; then
    echo "❌ GitHub Actions workflow not found!"
    echo "Expected: .github/workflows/newsletter-cron.yml"
    exit 1
fi

echo "✅ GitHub Actions workflow found"
echo ""

# Show current git status
echo "📊 Current git status:"
git status --short
echo ""

# Ask for confirmation
read -p "📝 Ready to commit and push? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

# Add all changes
echo "📦 Adding changes..."
git add .

# Commit
echo "💾 Committing changes..."
git commit -m "Add GitHub Actions cron for newsletter emails

- Added .github/workflows/newsletter-cron.yml
- Removed Vercel cron from vercel.json (not on Pro plan)
- Fixed subscriber data with preferredTime
- Added test scripts and documentation"

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin main || git push origin master

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Go to your GitHub repository"
echo "2. Click on the 'Actions' tab"
echo "3. Enable workflows if prompted"
echo "4. You should see 'Send Newsletter Emails' workflow"
echo "5. Click 'Run workflow' to test it manually"
echo ""
echo "🎉 Your newsletter emails will now be sent automatically every hour!"
echo "   Most subscribers will receive emails at 9:00 AM CST"
echo ""
echo "🔗 GitHub Actions: https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\(.*\)\.git/\1/')/actions"
