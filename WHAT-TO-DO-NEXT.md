# ✋ WHAT TO DO NEXT - Manual Steps

Follow these exact steps in order. Check off each one as you complete it.

---

## ✅ STEP 1: Create Supabase Account & Project (5 minutes)

### 1.1 Sign Up for Supabase
- [ ] Open browser and go to: **https://supabase.com**
- [ ] Click **"Start your project"** button
- [ ] Sign up with GitHub (recommended) or email
- [ ] Verify your email if needed

### 1.2 Create New Project
- [ ] Click **"New Project"** button
- [ ] Fill in the form:
  - **Name**: `secure-dashboard` (or any name you want)
  - **Database Password**: Create a strong password
    - ⚠️ **IMPORTANT**: Write this password down! You'll need it later
  - **Region**: Choose closest to your location (e.g., `US East`, `Europe West`)
  - **Pricing Plan**: Select **"Free"**
- [ ] Click **"Create new project"**
- [ ] Wait 2-3 minutes for project to initialize (you'll see a progress bar)

### 1.3 Set Up Database Tables
- [ ] Once project is ready, look at the left sidebar
- [ ] Click **"SQL Editor"** (icon looks like `</>`)
- [ ] Click **"New query"** button (top right)
- [ ] Open this file on your computer: `database/schema.sql`
- [ ] Select ALL the text in that file (Ctrl+A)
- [ ] Copy it (Ctrl+C)
- [ ] Paste into the Supabase SQL Editor (Ctrl+V)
- [ ] Click **"Run"** button (or press Ctrl+Enter)
- [ ] You should see: ✅ **"Success. No rows returned"**

### 1.4 Verify Tables Were Created
- [ ] In left sidebar, click **"Table Editor"** (icon looks like a table)
- [ ] You should see 3 tables:
  - `access_codes`
  - `announcements`
  - `dashboard_access_logs`
- [ ] If you see all 3 tables ✅ SUCCESS!

### 1.5 Get Your Supabase Credentials
- [ ] In left sidebar, click **"Settings"** (gear icon at bottom)
- [ ] Click **"API"** in the settings menu
- [ ] Find **"Project URL"** section
  - [ ] Copy the URL (looks like: `https://xxxxx.supabase.co`)
  - [ ] **SAVE THIS** - Paste it into a notepad file
- [ ] Scroll down to **"Project API keys"** section
- [ ] Find the **"anon public"** key
  - [ ] Click to reveal the full key
  - [ ] Copy the entire key (long string of random characters)
  - [ ] **SAVE THIS** - Paste it into your notepad file
- [ ] Keep this notepad file open! You'll need these in Step 3

✅ **STEP 1 COMPLETE!** Supabase is ready!

---

## ✅ STEP 2: Get Your Discord Webhook URL (2 minutes)

### 2.1 Create Discord Webhook
- [ ] Open **Discord** app or web version
- [ ] Go to the server where you want announcements posted
- [ ] Right-click on the channel where you want announcements
- [ ] Click **"Edit Channel"**
- [ ] Click **"Integrations"** in left menu
- [ ] Click **"Webhooks"** or **"View Webhooks"**
- [ ] Click **"New Webhook"** or **"Create Webhook"**
- [ ] Give it a name: `Dashboard Announcements` (or anything you want)
- [ ] Optionally upload an icon/avatar
- [ ] Click **"Copy Webhook URL"** button
- [ ] **SAVE THIS** - Paste it into your notepad file
- [ ] Click **"Save Changes"**

✅ **STEP 2 COMPLETE!** Discord webhook ready!

---

## ✅ STEP 3: Push Code to GitHub (3 minutes)

### 3.1 Check if Git is Initialized
Open PowerShell/Terminal in your project folder and run:
```powershell
cd "c:\Users\vyshn\OneDrive\Desktop\webhook"
git status
```

### 3.2 If You See "Not a git repository"
Run these commands:
```powershell
git init
git add .
git commit -m "Initial commit with Supabase integration"
```

### 3.3 If Git is Already Initialized
Run these commands:
```powershell
git add .
git commit -m "Add Supabase database integration"
```

### 3.4 Create GitHub Repository
- [ ] Open browser and go to: **https://github.com**
- [ ] Log in to your GitHub account
- [ ] Click the **"+"** icon (top right corner)
- [ ] Click **"New repository"**
- [ ] Fill in:
  - **Repository name**: `secure-dashboard` (or any name)
  - **Description**: (optional) "Secure announcement dashboard"
  - **Visibility**: Choose **Public** or **Private**
  - **DO NOT** check "Initialize with README" (leave unchecked)
- [ ] Click **"Create repository"**

### 3.5 Push Code to GitHub
GitHub will show you commands. Copy them and run in PowerShell:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual values!

- [ ] Run the commands
- [ ] Refresh your GitHub repository page
- [ ] You should see all your files ✅

✅ **STEP 3 COMPLETE!** Code is on GitHub!

---

## ✅ STEP 4: Deploy to Vercel (5 minutes)

### 4.1 Sign Up for Vercel
- [ ] Open browser and go to: **https://vercel.com**
- [ ] Click **"Sign Up"** or **"Log In"**
- [ ] Choose **"Continue with GitHub"**
- [ ] Authorize Vercel to access your GitHub

### 4.2 Import Your Project
- [ ] On Vercel dashboard, click **"Add New..."** button
- [ ] Select **"Project"** from dropdown
- [ ] Find your repository (`secure-dashboard` or whatever you named it)
- [ ] Click **"Import"** next to it

### 4.3 Configure Project (IMPORTANT!)
You'll see a configuration page. **DO NOT CLICK DEPLOY YET!**

- [ ] Scroll down to **"Environment Variables"** section
- [ ] Click to expand it

### 4.4 Add Environment Variable #1
- [ ] In the **"Name"** field, type: `DISCORD_WEBHOOK_URL`
- [ ] In the **"Value"** field, paste your Discord webhook URL from Step 2
- [ ] Check all 3 environment boxes:
  - ✅ Production
  - ✅ Preview
  - ✅ Development
- [ ] Click **"Add"**

### 4.5 Add Environment Variable #2
- [ ] In the **"Name"** field, type: `SUPABASE_URL`
- [ ] In the **"Value"** field, paste your Supabase Project URL from Step 1.5
- [ ] Check all 3 environment boxes:
  - ✅ Production
  - ✅ Preview
  - ✅ Development
- [ ] Click **"Add"**

### 4.6 Add Environment Variable #3
- [ ] In the **"Name"** field, type: `SUPABASE_ANON_KEY`
- [ ] In the **"Value"** field, paste your Supabase anon key from Step 1.5
- [ ] Check all 3 environment boxes:
  - ✅ Production
  - ✅ Preview
  - ✅ Development
- [ ] Click **"Add"**

### 4.7 Deploy!
- [ ] Verify you have all 3 environment variables added
- [ ] Click **"Deploy"** button
- [ ] Wait 1-2 minutes for deployment to complete
- [ ] You'll see confetti 🎉 when it's done!

### 4.8 Get Your Live URL
- [ ] Click **"Continue to Dashboard"**
- [ ] At the top, you'll see your deployment URL
- [ ] It looks like: `https://your-project-name.vercel.app`
- [ ] Click the URL or the **"Visit"** button to open your dashboard

✅ **STEP 4 COMPLETE!** Your dashboard is LIVE!

---

## ✅ STEP 5: Test Everything (3 minutes)

### 5.1 Test Access Code Generation
- [ ] Open your Vercel URL in browser
- [ ] Click **"Generate New Code"** button
- [ ] Check your Discord channel
  - [ ] You should see a message with a 6-character code (like `ABC123`)
- [ ] Open Supabase (https://app.supabase.com)
- [ ] Click on your project
- [ ] Click **"Table Editor"** → **"access_codes"** table
  - [ ] You should see your code in the table
  - [ ] `is_used` column should be `false`

### 5.2 Test Code Verification
- [ ] Go back to your dashboard in browser
- [ ] Type the code from Discord into the input field
- [ ] Click **"Verify Access"** button
- [ ] You should gain access to the dashboard ✅
- [ ] Go back to Supabase `access_codes` table
- [ ] Refresh the table
  - [ ] The `is_used` column should now be `true`
  - [ ] The `used_at` timestamp should be filled in
- [ ] Click **"Table Editor"** → **"dashboard_access_logs"** table
  - [ ] You should see a new entry with `access_granted = true`

### 5.3 Test Announcements
- [ ] In your dashboard, fill in the announcement form:
  - **Title**: `Test Announcement`
  - **Message**: `This is a test!`
  - **Priority**: Choose any (Info, Update, or Alert)
- [ ] Click **"Send Announcement"** button
- [ ] Check your Discord channel
  - [ ] You should see your announcement with colored formatting
- [ ] Go back to Supabase **"Table Editor"** → **"announcements"** table
  - [ ] You should see your announcement stored there

✅ **STEP 5 COMPLETE!** Everything is working!

---

## 🎉 YOU'RE DONE!

### Your Dashboard is Live At:
```
https://your-project-name.vercel.app
```

### What You Can Do Now:

1. **Share the URL** with people who need access
2. **Monitor your data** in Supabase Table Editor
3. **View logs** in Vercel Dashboard → Deployments
4. **Run queries** from `SQL-QUERIES.md` in Supabase SQL Editor

---

## 📊 How to View Your Data

### In Supabase:
1. Go to https://app.supabase.com
2. Click on your project
3. Click **"Table Editor"**
4. Select any table to view data:
   - `access_codes` - All generated codes
   - `announcements` - All announcements sent
   - `dashboard_access_logs` - All access attempts

### Run Queries:
1. Click **"SQL Editor"** in Supabase
2. Open `SQL-QUERIES.md` in your project
3. Copy any query you want to run
4. Paste in SQL Editor and click **"Run"**

---

## 🔧 Making Changes Later

### Update Your Code:
```powershell
# Make your changes to files
git add .
git commit -m "Description of changes"
git push
```
Vercel will automatically deploy your changes!

### Update Environment Variables:
1. Go to Vercel Dashboard
2. Click your project
3. Click **"Settings"** → **"Environment Variables"**
4. Edit or add variables
5. Go to **"Deployments"** → Click ⋯ menu → **"Redeploy"**

---

## 🆘 If Something Goes Wrong

### Code Not in Discord?
1. Go to Vercel → Settings → Environment Variables
2. Check `DISCORD_WEBHOOK_URL` is correct
3. Redeploy

### Database Errors?
1. Go to Supabase → Table Editor
2. Verify all 3 tables exist
3. If not, re-run `database/schema.sql` in SQL Editor

### "Missing environment variables" error?
1. Go to Vercel → Settings → Environment Variables
2. Verify all 3 variables are set:
   - `DISCORD_WEBHOOK_URL`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
3. Make sure all have Production, Preview, and Development checked
4. Redeploy the project

### Check Logs:
- **Vercel logs**: Dashboard → Deployments → Click deployment → View Function Logs
- **Supabase logs**: Dashboard → Logs
- **Browser console**: Press F12 → Console tab

---

## 📞 Need More Help?

Read these files in your project:
- `SUPABASE-SETUP-GUIDE.md` - Detailed troubleshooting
- `ARCHITECTURE.md` - How everything works
- `SQL-QUERIES.md` - Database queries

---

**Bookmark this file** and check off items as you complete them! ✅
