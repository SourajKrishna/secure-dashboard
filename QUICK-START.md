# ⚡ Quick Start - 10 Minutes to Deploy

Follow these steps to get your dashboard live with Supabase + Vercel!

---

## Step 1: Supabase (3 minutes)

1. **Go to** → [supabase.com](https://supabase.com) → Sign up (free)

2. **Click** → "New Project"
   - Name: `secure-dashboard`
   - Password: (create strong password)
   - Region: (choose closest)
   - Click "Create new project"

3. **Wait 2 minutes** for project creation

4. **Click** → "SQL Editor" (left sidebar) → "New query"

5. **Open** → `database/schema.sql` from your project folder

6. **Copy & Paste** → entire content into SQL Editor

7. **Click** → "Run" (or Ctrl+Enter)

8. **Get credentials:**
   - Click "Settings" → "API"
   - Copy **Project URL** (save it!)
   - Copy **anon public** key (save it!)

✅ Supabase ready!

---

## Step 2: GitHub (2 minutes)

```bash
cd c:\Users\vyshn\OneDrive\Desktop\webhook

git add .
git commit -m "Add Supabase integration"
git push
```

If first time:
```bash
git init
git add .
git commit -m "Initial commit with Supabase"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

✅ Code on GitHub!

---

## Step 3: Vercel (3 minutes)

1. **Go to** → [vercel.com](https://vercel.com) → Log in with GitHub

2. **Click** → "Add New..." → "Project"

3. **Import** → your repository

4. **STOP!** Before deploy, add environment variables:

   **Expand "Environment Variables"** section and add:

   | Name | Value |
   |------|-------|
   | `DISCORD_WEBHOOK_URL` | Your Discord webhook URL |
   | `SUPABASE_URL` | URL from Supabase (Step 1.8) |
   | `SUPABASE_ANON_KEY` | Key from Supabase (Step 1.8) |

   ⚠️ **Check all 3 boxes** (Production, Preview, Development)

5. **Click** → "Deploy"

6. **Wait 1-2 minutes**

7. **Get your URL** → `https://your-project.vercel.app`

✅ Deployed!

---

## Step 4: Test (2 minutes)

1. **Visit** → your Vercel URL

2. **Click** → "Generate New Code"

3. **Check Discord** → code should appear ✅

4. **Check Supabase:**
   - Go to "Table Editor"
   - Open `access_codes` table
   - See your code ✅

5. **Enter code** → from Discord

6. **Click** → "Verify Access"

7. **Access granted!** ✅

8. **Send test announcement:**
   - Fill in title and message
   - Click "Send Announcement"
   - Check Discord ✅
   - Check Supabase `announcements` table ✅

---

## 🎉 Done!

Your dashboard is live with database persistence!

**Your URL:** `https://your-project.vercel.app`

---

## 📚 Next Steps

- **Read:** [SUPABASE-SETUP-GUIDE.md](SUPABASE-SETUP-GUIDE.md) for detailed info
- **Use:** [SQL-QUERIES.md](SQL-QUERIES.md) to monitor your database
- **Check:** [ARCHITECTURE.md](ARCHITECTURE.md) to understand how it works
- **Reference:** [DEPLOY-CHECKLIST.md](DEPLOY-CHECKLIST.md) to verify everything

---

## 🆘 Something Wrong?

### Code not in Discord?
- Check `DISCORD_WEBHOOK_URL` in Vercel environment variables
- Redeploy: Vercel → Deployments → ⋯ → Redeploy

### Database error?
- Verify you ran `database/schema.sql` in Supabase SQL Editor
- Check tables exist: Table Editor → should see 3 tables

### "Missing Supabase environment variables"?
- Go to Vercel → Settings → Environment Variables
- Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set
- Redeploy

### Still stuck?
- Check Vercel logs: Dashboard → Deployments → View logs
- Check Supabase logs: Dashboard → Logs
- See [SUPABASE-SETUP-GUIDE.md](SUPABASE-SETUP-GUIDE.md) troubleshooting section

---

**Need help?** Open the detailed guide: [SUPABASE-SETUP-GUIDE.md](SUPABASE-SETUP-GUIDE.md)
