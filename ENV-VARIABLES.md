# Quick Start - Environment Variables

Create these environment variables in Vercel:

## Required Environment Variables

1. **DISCORD_WEBHOOK_URL**
   - Your Discord webhook URL
   - Get it from: Discord Server Settings → Integrations → Webhooks

2. **SUPABASE_URL**
   - Your Supabase project URL
   - Get it from: Supabase Dashboard → Settings → API → Project URL
   - Format: `https://xxxxx.supabase.co`

3. **SUPABASE_ANON_KEY**
   - Your Supabase anonymous key
   - Get it from: Supabase Dashboard → Settings → API → anon public key
   - This is safe to use in client-side code

## Setting Environment Variables in Vercel

### Option 1: During Initial Setup
1. Import project from GitHub
2. Before deploying, add variables in "Environment Variables" section
3. Deploy

### Option 2: After Deployment
1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable
4. After adding all variables, go to **Deployments**
5. Click the three dots on latest deployment → **Redeploy**

## Example .env.local (for local development only)

```bash
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/your-webhook-url
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

**⚠️ NEVER commit .env files to Git!**

The `.gitignore` file should already include:
```
.env
.env.local
.env*.local
```
