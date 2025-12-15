# 🔐 Required GitHub Secrets

To make the newsletter cron work, you MUST add these secrets to your GitHub Repository.

**Go to:** Settings -> Secrets and variables -> Actions -> "New repository secret"

| Secret Name | Value Example |
|-------------|---------------|
| `MONGODB_URI` | `mongodb+srv://...` |
| `RESEND_API_KEY` | `re_1234...` |
| `NEWSAPI_KEY` | `8293...` |
| `HUGGINGFACE_API_KEY` | `hf_...` |
| `GIPHY_API_KEY` | `AbC...` |
| `RESEND_FROM_EMAIL` | `mailing@ayotomcs.me` |
| `NEXT_PUBLIC_BASE_URL` | `https://v123.ayotomcs.me` |

## 🚀 Why is this needed?
We moved the email processing from Vercel (which times out after 10 seconds) to **GitHub Actions** (which runs for up to 6 hours). GitHub Actions needs these passwords to connect to your database and send emails.
