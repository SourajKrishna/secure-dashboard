# 🚀 Supabase + Vercel Setup Guide

Complete step-by-step guide to deploy your Secure Dashboard with Supabase database on Vercel.

---

## 📋 Prerequisites

- GitHub account
- Vercel account (free tier works)
- Supabase account (free tier works)
- Discord webhook URL

---

## Part 1: Supabase Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"New Project"**
3. Fill in project details:
   - **Name**: `secure-dashboard` (or any name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click **"Create new project"** and wait 2-3 minutes

### Step 2: Set Up Database Tables

1. In your Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Copy the entire contents of `database/schema.sql` from your project
4. Paste it into the SQL editor
5. Click **"Run"** or press `Ctrl+Enter`
6. You should see: "Success. No rows returned"

### Step 3: Get Your Supabase Credentials

1. In Supabase dashboard, click **"Settings"** (gear icon in sidebar)
2. Click **"API"** under Project Settings
3. Find and copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")
4. Save these for later!

---

## Part 2: Install Dependencies

### Step 1: Install Node Modules

Open terminal in your project folder and run:

```bash
npm install
```

This will install the Supabase client library and other dependencies.

---

## Part 3: Vercel Deployment

### Step 1: Push Code to GitHub

If you haven't already:

```bash
git init
git add .
git commit -m "Add Supabase integration"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Import Project to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. **Don't deploy yet!** We need to add environment variables first

### Step 3: Add Environment Variables

In the Vercel project configuration page:

1. Expand **"Environment Variables"** section
2. Add these three variables:

   **Variable 1:**
   - Name: `DISCORD_WEBHOOK_URL`
   - Value: Your Discord webhook URL
   - Environment: Production, Preview, Development (check all)

   **Variable 2:**
   - Name: `SUPABASE_URL`
   - Value: Your Supabase Project URL (from Part 1, Step 3)
   - Environment: Production, Preview, Development (check all)

   **Variable 3:**
   - Name: `SUPABASE_ANON_KEY`
   - Value: Your Supabase anon public key (from Part 1, Step 3)
   - Environment: Production, Preview, Development (check all)

3. Click **"Deploy"**

### Step 4: Wait for Deployment

- Vercel will build and deploy your project
- Takes 1-2 minutes
- You'll get a URL like: `https://your-project.vercel.app`

---

## Part 4: Verify Everything Works

### Test 1: Generate Access Code

1. Visit your Vercel URL
2. Click **"Generate New Code"** button
3. Check your Discord channel - you should receive a code
4. Check Supabase:
   - Go to **"Table Editor"** in Supabase
   - Click `access_codes` table
   - You should see a new row with your code

### Test 2: Verify Access

1. Enter the code from Discord into your dashboard
2. Click **"Verify Access"**
3. You should gain access to the dashboard
4. Check Supabase `access_codes` table again:
   - The `is_used` column should now be `true`
   - The `used_at` timestamp should be set
5. Check `dashboard_access_logs` table:
   - You should see a new log entry

### Test 3: Send Announcement

1. In the dashboard, create an announcement
2. Click **"Send Announcement"**
3. Check Discord - announcement should appear
4. Check Supabase `announcements` table:
   - Your announcement should be stored there

---

## 🔧 Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution:** 
- Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set
- Redeploy: Deployments → (three dots) → Redeploy

### Issue: "Failed to store access code" or database errors

**Solution:**
- Go to Supabase SQL Editor
- Run this query to check if tables exist:
  ```sql
  SELECT table_name FROM information_schema.tables 
  WHERE table_schema = 'public';
  ```
- If tables are missing, re-run the `database/schema.sql` file

### Issue: Codes not appearing in Discord

**Solution:**
- Verify `DISCORD_WEBHOOK_URL` is set correctly in Vercel
- Test the webhook URL directly:
  ```bash
  curl -X POST "YOUR_WEBHOOK_URL" \
    -H "Content-Type: application/json" \
    -d '{"content": "Test message"}'
  ```

### Issue: "Module not found" errors

**Solution:**
- Make sure you ran `npm install`
- Verify `package.json` has `@supabase/supabase-js` in dependencies
- Redeploy the project on Vercel

---

## 📊 View Your Data

### Supabase Dashboard

**Access Codes:**
```sql
SELECT * FROM access_codes ORDER BY created_at DESC;
```

**Recent Announcements:**
```sql
SELECT * FROM announcements ORDER BY created_at DESC LIMIT 10;
```

**Access Logs:**
```sql
SELECT * FROM dashboard_access_logs ORDER BY accessed_at DESC LIMIT 20;
```

### Useful Queries

**Count total announcements:**
```sql
SELECT COUNT(*) as total FROM announcements;
```

**Active (unused) access codes:**
```sql
SELECT * FROM access_codes 
WHERE is_used = false AND expires_at > NOW();
```

**Failed access attempts:**
```sql
SELECT * FROM dashboard_access_logs 
WHERE access_granted = false;
```

---

## 🎯 Next Steps

### Security Enhancements

1. **Enable RLS (Row Level Security)** in Supabase (already configured in schema)
2. **Rate limiting**: Consider adding rate limits to prevent abuse
3. **IP whitelisting**: Restrict access to specific IP ranges if needed

### Features to Add

1. **Admin panel** to view logs directly in the dashboard
2. **Analytics** to track usage patterns
3. **Notification system** for failed access attempts
4. **Multi-user support** with different access levels

### Monitoring

1. **Vercel Analytics**: Enable in Vercel Dashboard → Analytics
2. **Supabase Logs**: View in Supabase Dashboard → Logs
3. **Discord Notifications**: Set up alerts for system events

---

## 📁 Project Structure

```
webhook/
├── api/
│   ├── generate-code.js       # Creates and stores access codes
│   ├── verify-code.js          # Verifies codes from database
│   └── send-announcement.js    # Sends and stores announcements
├── lib/
│   └── supabase.js             # Supabase client configuration
├── database/
│   └── schema.sql              # Database schema
├── index.html                  # Frontend
├── script.js                   # Frontend logic
├── style.css                   # Styles
├── package.json                # Dependencies
└── vercel.json                 # Vercel configuration
```

---

## 🆘 Support

If you encounter issues:

1. Check Vercel deployment logs: Dashboard → Deployments → Click deployment → View logs
2. Check Supabase logs: Dashboard → Logs
3. Check browser console for frontend errors (F12)
4. Verify all environment variables are set correctly

---

## ✅ Checklist

Before going live, verify:

- [ ] Supabase project created and database tables set up
- [ ] All three environment variables added to Vercel
- [ ] Project deployed successfully on Vercel
- [ ] Generated code appears in Discord
- [ ] Code verification works and updates database
- [ ] Announcements send to Discord and save to database
- [ ] All tables visible in Supabase Table Editor

---

## 🎉 You're Done!

Your secure dashboard is now live with full database persistence using Supabase and hosted on Vercel!

**Your deployment URL:** `https://your-project.vercel.app`

Remember to:
- Keep your Supabase credentials secure
- Monitor your usage (both Supabase and Vercel have free tiers)
- Regularly check logs for any issues
