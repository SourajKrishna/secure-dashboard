# 🚀 Vercel Deployment Guide

Complete step-by-step guide to deploy your Secure Dashboard to Vercel.

---

## 📋 Prerequisites

Before you begin, make sure you have:

- [ ] A Vercel account (sign up at [vercel.com](https://vercel.com))
- [ ] Git installed on your computer
- [ ] A Discord webhook URL
- [ ] A GitHub account (recommended)

---

## 🔧 Step 1: Prepare Your Project

### 1.1 Install Git (if not already installed)

**Windows:**
```powershell
# Download from https://git-scm.com/download/win
# Or use winget:
winget install Git.Git
```

**Verify installation:**
```powershell
git --version
```

### 1.2 Initialize Git Repository

Open PowerShell in your project folder and run:

```powershell
cd c:\Users\vyshn\OneDrive\Desktop\webhook
git init
git add .
git commit -m "Initial commit: Secure Dashboard with Discord integration"
```

---

## 🌐 Step 2: Create GitHub Repository

### 2.1 Create Repository on GitHub

1. Go to [github.com](https://github.com)
2. Click the **+** icon in the top right
3. Select **New repository**
4. Name it: `secure-dashboard` (or any name you prefer)
5. **Do NOT** initialize with README, .gitignore, or license
6. Click **Create repository**

### 2.2 Push Your Code to GitHub

Copy the commands from GitHub and run in PowerShell:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/secure-dashboard.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

## 🚀 Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Website (Recommended)

#### 3.1 Sign Up / Log In to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign Up** or **Log In**
3. Choose **Continue with GitHub**
4. Authorize Vercel to access your GitHub account

#### 3.2 Import Your Repository

1. Click **Add New...** → **Project**
2. Find your `secure-dashboard` repository
3. Click **Import**

#### 3.3 Configure Project

**Framework Preset:** Select `Other` or leave as detected

**Root Directory:** Leave as `./`

**Build Settings:** Keep defaults

#### 3.4 Add Environment Variables

This is **CRITICAL** - click **Environment Variables** and add:

| Name | Value |
|------|-------|
| `DISCORD_WEBHOOK_URL` | Your Discord webhook URL |

**Your Discord Webhook URL:**
```
https://discord.com/api/webhooks/1467387274617553038/lWTIH7RbNUaKeLUY7wtogbOGmjG-rdprEaLxZTkBDQ8VPfNd_0zaPWjSnbi1tHgmKHs3
```

#### 3.5 Deploy

1. Click **Deploy**
2. Wait 1-2 minutes for deployment to complete
3. You'll see a success message with your live URL!

---

### Option B: Deploy via Vercel CLI

#### 3.1 Install Vercel CLI

```powershell
npm install -g vercel
```

#### 3.2 Login to Vercel

```powershell
vercel login
```

Follow the prompts to authenticate.

#### 3.3 Deploy

```powershell
cd c:\Users\vyshn\OneDrive\Desktop\webhook
vercel
```

**Answer the prompts:**
- Set up and deploy? **Y**
- Which scope? Choose your account
- Link to existing project? **N**
- What's your project's name? `secure-dashboard`
- In which directory is your code located? `./`

#### 3.4 Add Environment Variable

```powershell
vercel env add DISCORD_WEBHOOK_URL
```

Paste your Discord webhook URL when prompted.

Select environments: **Production**, **Preview**, **Development**

#### 3.5 Deploy to Production

```powershell
vercel --prod
```

---

## ✅ Step 4: Verify Deployment

### 4.1 Test Your Dashboard

1. Open the Vercel deployment URL (e.g., `https://secure-dashboard.vercel.app`)
2. You should see the access verification screen
3. Check your Discord channel for the access code
4. Enter the code to verify the system works

### 4.2 Check Discord Integration

- Access code should appear in Discord within seconds
- Test sending an announcement from the dashboard
- Verify it appears in your Discord channel

---

## 🔒 Step 5: Secure Your Webhook (Important!)

### 5.1 Protect Your Repository

**NEVER** commit `.env` or webhook URLs to Git!

Your `.gitignore` file already includes:
```
.env
.env.local
.env.production
```

### 5.2 Rotate Webhook if Exposed

If you accidentally committed your webhook URL:

1. Go to Discord → Channel Settings → Integrations → Webhooks
2. Delete the exposed webhook
3. Create a new webhook
4. Update the environment variable in Vercel:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Edit `DISCORD_WEBHOOK_URL` with the new URL
   - Redeploy the project

---

## 🔄 Step 6: Update Your Deployment

When you make changes to your code:

### Via GitHub (Automatic Deployment)

```powershell
git add .
git commit -m "Description of changes"
git push
```

Vercel will automatically deploy the changes!

### Via Vercel CLI

```powershell
vercel --prod
```

---

## 🛠️ Troubleshooting

### Problem: Access code not appearing in Discord

**Solution:**
1. Check Vercel logs: Dashboard → Your Project → Deployments → Click latest → View Function Logs
2. Verify environment variable is set correctly
3. Test webhook URL manually:
   ```powershell
   curl -X POST YOUR_WEBHOOK_URL -H "Content-Type: application/json" -d '{\"content\": \"Test message\"}'
   ```

### Problem: 500 Internal Server Error

**Solution:**
1. Check Vercel function logs for errors
2. Verify all API files are in the `/api` folder
3. Ensure environment variables are set

### Problem: "Webhook URL not configured" error

**Solution:**
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Make sure `DISCORD_WEBHOOK_URL` is set for all environments
3. Redeploy the project

### Problem: Code verification fails

**Solution:**
1. This is expected with serverless functions (stateless)
2. For production, you need to implement Redis or a database
3. Current implementation is for demonstration purposes

---

## 📊 Project Structure

```
webhook/
├── api/
│   ├── generate-code.js      # Generates and sends access codes
│   ├── send-announcement.js   # Sends announcements to Discord
│   └── verify-code.js         # Verifies access codes
├── index.html                 # Main HTML file
├── style.css                  # Neumorphic design styles
├── script.js                  # Frontend logic with API calls
├── vercel.json               # Vercel configuration
├── package.json              # Project metadata
├── .gitignore                # Git ignore rules
├── .env.example              # Environment variables template
└── DEPLOYMENT.md             # This file
```

---

## 🎯 Next Steps

### For Production Use

1. **Implement Persistent Storage:**
   - Use Vercel KV (Redis) for access code storage
   - Or use a database like Supabase, MongoDB Atlas

2. **Add Rate Limiting:**
   - Prevent abuse of code generation
   - Use Vercel's rate limiting features

3. **Enhance Security:**
   - Add CSRF protection
   - Implement proper session management
   - Use secure headers

4. **Add Analytics:**
   - Track announcement views
   - Monitor access attempts
   - Use Vercel Analytics

### Useful Commands

```powershell
# View deployment logs
vercel logs

# View environment variables
vercel env ls

# Remove a deployment
vercel remove [deployment-url]

# Check project details
vercel inspect [deployment-url]
```

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Discord Webhooks Guide](https://discord.com/developers/docs/resources/webhook)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)

---

## 🎉 Success!

Your dashboard is now live and secure! 

**Your deployment URL:** Check your Vercel dashboard or the output from the deployment command.

**Example:** `https://secure-dashboard-abc123.vercel.app`

Share this URL with your team and enjoy your secure announcement center! 🚀

---

## 💡 Tips

1. **Custom Domain:** Add a custom domain in Vercel Dashboard → Settings → Domains
2. **Preview Deployments:** Every GitHub branch gets its own preview URL
3. **Automatic HTTPS:** Vercel provides free SSL certificates
4. **Global CDN:** Your site is automatically deployed to Vercel's global edge network

---

**Need Help?** 
- Check Vercel's documentation
- Review function logs in Vercel Dashboard
- Test API endpoints using browser DevTools Network tab

**Made with ❤️ - Deployed on Vercel**
