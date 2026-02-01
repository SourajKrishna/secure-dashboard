# 🏗️ System Architecture

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                      (index.html + script.js)                   │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │  1. Generate Code Request
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      VERCEL SERVERLESS                          │
│                   (api/generate-code.js)                        │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐     │
│  │ 1. Generate random 6-digit code                      │     │
│  │ 2. Store in Supabase (access_codes table)            │───┐ │
│  │ 3. Send code to Discord webhook                      │   │ │
│  │ 4. Return session info to browser                    │   │ │
│  └──────────────────────────────────────────────────────┘   │ │
└──────────────────────────────────────────────────────────────┼─┘
                                                               │
                 ┌─────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SUPABASE DATABASE                        │
│                                                                 │
│  ┌──────────────────┐  ┌─────────────────┐  ┌───────────────┐ │
│  │  access_codes    │  │  announcements  │  │ access_logs   │ │
│  ├──────────────────┤  ├─────────────────┤  ├───────────────┤ │
│  │ • code           │  │ • title         │  │ • session_id  │ │
│  │ • session_id     │  │ • content       │  │ • granted     │ │
│  │ • expires_at     │  │ • priority      │  │ • ip_address  │ │
│  │ • is_used        │  │ • created_at    │  │ • accessed_at │ │
│  └──────────────────┘  └─────────────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                 │
                 │  2. User enters code
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      VERCEL SERVERLESS                          │
│                    (api/verify-code.js)                         │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐     │
│  │ 1. Query Supabase for code by session_id             │◄──┐ │
│  │ 2. Verify code matches & not expired/used            │   │ │
│  │ 3. Mark as used in database                          │───┤ │
│  │ 4. Log access in dashboard_access_logs               │───┤ │
│  │ 5. Return success/failure to browser                 │   │ │
│  └──────────────────────────────────────────────────────┘   │ │
└──────────────────────────────────────────────────────────────┼─┘
                                                               │
                 ┌─────────────────────────────────────────────┘
                 │
                 │  3. Send announcement
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      VERCEL SERVERLESS                          │
│                 (api/send-announcement.js)                      │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐     │
│  │ 1. Receive announcement data                          │     │
│  │ 2. Send to Discord webhook                            │     │
│  │ 3. Store in Supabase (announcements table)            │───┐ │
│  │ 4. Return confirmation to browser                     │   │ │
│  └──────────────────────────────────────────────────────┘   │ │
└──────────────────────────────────────────────────────────────┼─┘
                                                               │
                                                               ▼
                                                    ┌──────────────────┐
                                                    │  DISCORD SERVER  │
                                                    │   (Webhook)      │
                                                    │                  │
                                                    │ • Access codes   │
                                                    │ • Announcements  │
                                                    └──────────────────┘
```

## Component Responsibilities

### Frontend (Browser)
- **index.html**: User interface structure
- **script.js**: Application logic, API calls
- **style.css**: Visual styling

**Actions:**
- Generate access code requests
- Verify user-entered codes
- Send announcements
- Display UI feedback

---

### Backend (Vercel Serverless Functions)

#### api/generate-code.js
**Purpose:** Create and distribute access codes

**Process:**
1. Generate random 6-character code
2. Create unique session ID
3. Store code in Supabase with expiration (5 min)
4. Send code to Discord
5. Return session info to frontend

**Database Operations:**
- INSERT into `access_codes`

---

#### api/verify-code.js
**Purpose:** Authenticate users

**Process:**
1. Lookup code in Supabase by session_id
2. Check if code is valid (not expired/used)
3. Verify code matches user input
4. Mark code as used
5. Log access attempt

**Database Operations:**
- SELECT from `access_codes`
- UPDATE `access_codes` (mark as used)
- INSERT into `dashboard_access_logs`

---

#### api/send-announcement.js
**Purpose:** Distribute announcements

**Process:**
1. Receive announcement data
2. Send to Discord webhook
3. Store announcement in database
4. Return confirmation

**Database Operations:**
- INSERT into `announcements`

---

### Database (Supabase PostgreSQL)

#### access_codes Table
**Purpose:** Store and manage access codes

**Fields:**
- `id` (UUID): Unique identifier
- `code` (VARCHAR): 6-character access code
- `session_id` (VARCHAR): Unique session identifier
- `created_at` (TIMESTAMP): When code was generated
- `expires_at` (TIMESTAMP): When code expires
- `is_used` (BOOLEAN): Usage status
- `used_at` (TIMESTAMP): When code was used
- `ip_address` (VARCHAR): Client IP

**Indexes:**
- `session_id` - Fast lookups
- `expires_at` - Cleanup queries

---

#### announcements Table
**Purpose:** Store announcement history

**Fields:**
- `id` (UUID): Unique identifier
- `title` (VARCHAR): Announcement title
- `content` (TEXT): Announcement body
- `priority` (VARCHAR): info/update/alert
- `created_at` (TIMESTAMP): When sent
- `sent_to_discord` (BOOLEAN): Delivery status
- `discord_message_id` (VARCHAR): Discord message ID

**Index:**
- `created_at` - Recent announcements

---

#### dashboard_access_logs Table
**Purpose:** Track access attempts

**Fields:**
- `id` (UUID): Unique identifier
- `session_id` (VARCHAR): Related session
- `access_granted` (BOOLEAN): Success/failure
- `ip_address` (VARCHAR): Client IP
- `user_agent` (TEXT): Browser info
- `accessed_at` (TIMESTAMP): When attempt occurred

**Index:**
- `accessed_at` - Recent logs

---

### External Services

#### Discord Webhook
**Purpose:** Notification delivery

**Receives:**
- Access codes with embedded formatting
- Announcements with priority colors

**Format:** Discord embed messages

---

## Security Features

### Row Level Security (RLS)
- Enabled on all tables
- Service role policies allow API access
- Prevents direct client access

### Access Code Security
- Single-use codes (marked as used after verification)
- 5-minute expiration window
- Session-based validation
- IP address logging

### Environment Variables
- All credentials stored in Vercel environment
- Not exposed to client-side code
- Separate for production/preview/development

---

## Data Retention

### Automatic Cleanup
Optional function in schema:
```sql
cleanup_expired_codes()
```

Removes codes older than 24 hours after expiration.

### Manual Queries

**Delete old codes:**
```sql
DELETE FROM access_codes 
WHERE expires_at < NOW() - INTERVAL '7 days';
```

**Archive old announcements:**
```sql
DELETE FROM announcements 
WHERE created_at < NOW() - INTERVAL '30 days';
```

**Clear old logs:**
```sql
DELETE FROM dashboard_access_logs 
WHERE accessed_at < NOW() - INTERVAL '90 days';
```

---

## Performance Considerations

### Database Indexes
All tables have indexes on frequently queried columns:
- `access_codes.session_id` - Verification lookups
- `access_codes.expires_at` - Cleanup queries
- `announcements.created_at` - Recent items
- `dashboard_access_logs.accessed_at` - Log queries

### Caching Strategy
- Access codes: Not cached (security)
- Announcements: Can cache recent (5 min)
- Logs: Read-only, safe to cache

### Serverless Cold Starts
- First request may take 1-2 seconds
- Subsequent requests: <200ms
- Supabase connection pooling handles concurrency

---

## Scalability

### Current Limits (Free Tiers)

**Vercel:**
- 100GB bandwidth/month
- Unlimited serverless function invocations
- 10 second function timeout

**Supabase:**
- 500MB database storage
- 2GB bandwidth/month
- Unlimited API requests
- 50,000 monthly active users

### When to Upgrade

**Database Storage:**
- Each code: ~200 bytes
- Each announcement: ~1KB
- 500MB = ~500,000 announcements

**Bandwidth:**
- API calls are lightweight (<5KB each)
- Should handle 100k+ requests/month

---

## Monitoring Recommendations

### Key Metrics to Track

1. **Access Code Generation Rate**
   - Query: `SELECT COUNT(*) FROM access_codes WHERE created_at > NOW() - INTERVAL '1 hour'`

2. **Success Rate**
   - Query: `SELECT access_granted, COUNT(*) FROM dashboard_access_logs GROUP BY access_granted`

3. **Announcement Volume**
   - Query: `SELECT COUNT(*) FROM announcements WHERE created_at > NOW() - INTERVAL '1 day'`

4. **Failed Attempts**
   - Query: `SELECT * FROM dashboard_access_logs WHERE access_granted = false ORDER BY accessed_at DESC LIMIT 50`

### Alerts to Set Up

- Multiple failed access attempts from same IP
- Unusual spike in code generation
- Database storage approaching limit
- Function errors in Vercel logs

---

This architecture provides a secure, scalable foundation for your announcement dashboard! 🚀
