# 🎯 Quick Deploy Checklist

Use this as your deployment checklist. Check off each item as you complete it!

## ☑️ Pre-Deployment

- [ ] Code is ready and tested locally
- [ ] All files committed to Git
- [ ] Repository pushed to GitHub

## 🗄️ Supabase Setup

- [ ] Created Supabase account at [supabase.com](https://supabase.com)
- [ ] Created new Supabase project
- [ ] Ran `database/schema.sql` in Supabase SQL Editor
- [ ] Copied Project URL from Supabase Settings → API
- [ ] Copied anon public key from Supabase Settings → API
- [ ] Verified 3 tables created: `access_codes`, `announcements`, `dashboard_access_logs`

## 🚀 Vercel Setup

- [ ] Imported GitHub repository to Vercel
- [ ] Added `DISCORD_WEBHOOK_URL` environment variable
- [ ] Added `SUPABASE_URL` environment variable
- [ ] Added `SUPABASE_ANON_KEY` environment variable
- [ ] Set all variables for Production, Preview, and Development
- [ ] Deployed project

## ✅ Testing

- [ ] Visited deployment URL
- [ ] Clicked "Generate New Code" button
- [ ] Received code in Discord
- [ ] Verified code appears in Supabase `access_codes` table
- [ ] Entered code and verified access
- [ ] Checked code marked as `is_used = true` in database
- [ ] Checked entry in `dashboard_access_logs` table
- [ ] Created and sent an announcement
- [ ] Received announcement in Discord
- [ ] Verified announcement in Supabase `announcements` table

## 🎉 Post-Deployment

- [ ] Bookmarked deployment URL
- [ ] Saved Supabase dashboard URL
- [ ] Saved Vercel project URL
- [ ] Shared access with team (if applicable)

---

## 📝 Quick Reference

**Supabase Dashboard:** https://app.supabase.com  
**Vercel Dashboard:** https://vercel.com/dashboard  
**Your Deployment:** `https://your-project.vercel.app`

## 🆘 If Something Fails

1. **Check Vercel deployment logs**: Vercel Dashboard → Your Project → Deployments → View Logs
2. **Check Supabase logs**: Supabase Dashboard → Logs
3. **Verify environment variables**: Vercel Dashboard → Settings → Environment Variables
4. **Redeploy**: Vercel Dashboard → Deployments → ⋯ Menu → Redeploy

## 📖 Need Detailed Instructions?

See **[SUPABASE-SETUP-GUIDE.md](SUPABASE-SETUP-GUIDE.md)** for complete step-by-step guide.
