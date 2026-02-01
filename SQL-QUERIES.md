# 📊 Useful SQL Queries for Supabase

Copy and paste these queries into your Supabase SQL Editor to manage and monitor your dashboard.

---

## 📈 Statistics & Monitoring

### Total Counts

```sql
-- Count all access codes generated
SELECT COUNT(*) as total_codes_generated FROM access_codes;

-- Count successful access attempts
SELECT COUNT(*) as successful_accesses 
FROM dashboard_access_logs 
WHERE access_granted = true;

-- Count total announcements
SELECT COUNT(*) as total_announcements FROM announcements;
```

### Recent Activity

```sql
-- Last 10 access codes generated
SELECT 
    code, 
    created_at, 
    expires_at, 
    is_used,
    used_at
FROM access_codes 
ORDER BY created_at DESC 
LIMIT 10;

-- Last 20 access attempts
SELECT 
    session_id,
    access_granted,
    ip_address,
    accessed_at
FROM dashboard_access_logs 
ORDER BY accessed_at DESC 
LIMIT 20;

-- Recent announcements
SELECT 
    title,
    priority,
    created_at,
    sent_to_discord
FROM announcements 
ORDER BY created_at DESC 
LIMIT 10;
```

---

## 🔍 Security Monitoring

### Failed Access Attempts

```sql
-- All failed access attempts
SELECT 
    ip_address,
    user_agent,
    accessed_at,
    COUNT(*) as attempts
FROM dashboard_access_logs 
WHERE access_granted = false
GROUP BY ip_address, user_agent, accessed_at
ORDER BY accessed_at DESC;

-- Failed attempts from same IP (potential attack)
SELECT 
    ip_address,
    COUNT(*) as failed_attempts,
    MAX(accessed_at) as last_attempt
FROM dashboard_access_logs 
WHERE access_granted = false
GROUP BY ip_address
HAVING COUNT(*) > 3
ORDER BY failed_attempts DESC;
```

### Active vs Expired Codes

```sql
-- Currently active (unused and not expired) codes
SELECT 
    code,
    session_id,
    created_at,
    expires_at,
    EXTRACT(EPOCH FROM (expires_at - NOW()))/60 as minutes_remaining
FROM access_codes 
WHERE is_used = false 
  AND expires_at > NOW()
ORDER BY created_at DESC;

-- Expired but unused codes
SELECT 
    code,
    created_at,
    expires_at
FROM access_codes 
WHERE is_used = false 
  AND expires_at < NOW()
ORDER BY expires_at DESC;

-- Used codes
SELECT 
    code,
    created_at,
    used_at,
    EXTRACT(EPOCH FROM (used_at - created_at))/60 as used_after_minutes
FROM access_codes 
WHERE is_used = true
ORDER BY used_at DESC
LIMIT 20;
```

---

## 📊 Analytics & Insights

### Access Patterns by Hour

```sql
-- Access attempts by hour of day
SELECT 
    EXTRACT(HOUR FROM accessed_at) as hour,
    COUNT(*) as attempts,
    SUM(CASE WHEN access_granted THEN 1 ELSE 0 END) as successful
FROM dashboard_access_logs 
WHERE accessed_at > NOW() - INTERVAL '7 days'
GROUP BY EXTRACT(HOUR FROM accessed_at)
ORDER BY hour;
```

### Announcement Statistics by Priority

```sql
-- Announcements grouped by priority
SELECT 
    priority,
    COUNT(*) as count,
    MAX(created_at) as most_recent
FROM announcements
GROUP BY priority
ORDER BY count DESC;
```

### Average Code Usage Time

```sql
-- How quickly are codes being used?
SELECT 
    AVG(EXTRACT(EPOCH FROM (used_at - created_at))/60) as avg_minutes,
    MIN(EXTRACT(EPOCH FROM (used_at - created_at))/60) as min_minutes,
    MAX(EXTRACT(EPOCH FROM (used_at - created_at))/60) as max_minutes
FROM access_codes 
WHERE is_used = true;
```

---

## 🧹 Maintenance & Cleanup

### Delete Old Data

```sql
-- Delete access codes older than 7 days
DELETE FROM access_codes 
WHERE created_at < NOW() - INTERVAL '7 days';

-- Delete access logs older than 30 days
DELETE FROM dashboard_access_logs 
WHERE accessed_at < NOW() - INTERVAL '30 days';

-- Delete announcements older than 90 days
DELETE FROM announcements 
WHERE created_at < NOW() - INTERVAL '90 days';
```

### Clean Up Unused Expired Codes

```sql
-- Remove expired codes that were never used
DELETE FROM access_codes 
WHERE is_used = false 
  AND expires_at < NOW() - INTERVAL '1 day';
```

---

## 🔎 Debugging Queries

### Find Specific Code

```sql
-- Search for a specific code
SELECT * FROM access_codes 
WHERE code = 'ABC123';

-- Find code by session ID
SELECT * FROM access_codes 
WHERE session_id = 'your-session-id-here';
```

### Check Database Size

```sql
-- Table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Row counts
SELECT 
    'access_codes' as table_name, 
    COUNT(*) as rows 
FROM access_codes
UNION ALL
SELECT 
    'announcements' as table_name, 
    COUNT(*) as rows 
FROM announcements
UNION ALL
SELECT 
    'dashboard_access_logs' as table_name, 
    COUNT(*) as rows 
FROM dashboard_access_logs;
```

---

## 📅 Daily/Weekly Reports

### Today's Activity Summary

```sql
-- Summary of today's activity
SELECT 
    (SELECT COUNT(*) FROM access_codes WHERE created_at::date = CURRENT_DATE) as codes_generated,
    (SELECT COUNT(*) FROM dashboard_access_logs WHERE accessed_at::date = CURRENT_DATE AND access_granted = true) as successful_accesses,
    (SELECT COUNT(*) FROM dashboard_access_logs WHERE accessed_at::date = CURRENT_DATE AND access_granted = false) as failed_accesses,
    (SELECT COUNT(*) FROM announcements WHERE created_at::date = CURRENT_DATE) as announcements_sent;
```

### This Week's Statistics

```sql
-- Weekly summary
SELECT 
    DATE_TRUNC('day', created_at) as date,
    COUNT(*) as codes_generated
FROM access_codes 
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- Announcements this week
SELECT 
    DATE_TRUNC('day', created_at) as date,
    COUNT(*) as announcements,
    COUNT(CASE WHEN priority = 'alert' THEN 1 END) as alerts,
    COUNT(CASE WHEN priority = 'update' THEN 1 END) as updates,
    COUNT(CASE WHEN priority = 'info' THEN 1 END) as info
FROM announcements 
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;
```

---

## 🛡️ Security Audit

### Complete Audit Query

```sql
-- Comprehensive security audit
WITH 
failed_ips AS (
    SELECT 
        ip_address,
        COUNT(*) as failed_count
    FROM dashboard_access_logs 
    WHERE access_granted = false 
      AND accessed_at > NOW() - INTERVAL '24 hours'
    GROUP BY ip_address
    HAVING COUNT(*) > 5
),
code_stats AS (
    SELECT 
        COUNT(*) as total_codes,
        SUM(CASE WHEN is_used THEN 1 ELSE 0 END) as used_codes,
        SUM(CASE WHEN NOT is_used AND expires_at < NOW() THEN 1 ELSE 0 END) as expired_unused
    FROM access_codes 
    WHERE created_at > NOW() - INTERVAL '24 hours'
)
SELECT 
    'Suspicious IPs (>5 failed attempts)' as metric,
    COALESCE((SELECT COUNT(*) FROM failed_ips)::text, '0') as value
UNION ALL
SELECT 
    'Codes Generated (24h)' as metric,
    total_codes::text as value
FROM code_stats
UNION ALL
SELECT 
    'Code Usage Rate' as metric,
    ROUND((used_codes::numeric / NULLIF(total_codes, 0) * 100), 2)::text || '%' as value
FROM code_stats;
```

---

## 🎯 Performance Optimization

### Create Additional Indexes (if needed)

```sql
-- Add index for IP address searches
CREATE INDEX IF NOT EXISTS idx_access_logs_ip 
ON dashboard_access_logs(ip_address);

-- Add index for date-based queries
CREATE INDEX IF NOT EXISTS idx_announcements_date 
ON announcements(created_at DESC);

-- Add index for used codes
CREATE INDEX IF NOT EXISTS idx_access_codes_used 
ON access_codes(is_used);
```

---

## 💾 Backup Queries

### Export Data (for backup)

```sql
-- Export all access codes (last 30 days)
COPY (
    SELECT * FROM access_codes 
    WHERE created_at > NOW() - INTERVAL '30 days'
) TO '/tmp/access_codes_backup.csv' WITH CSV HEADER;

-- Export announcements
COPY (
    SELECT * FROM announcements 
    WHERE created_at > NOW() - INTERVAL '90 days'
) TO '/tmp/announcements_backup.csv' WITH CSV HEADER;
```

---

## 🔄 Reset Everything (⚠️ DANGER)

```sql
-- ⚠️ WARNING: This deletes ALL data! Use with caution!

-- Delete all access logs
-- DELETE FROM dashboard_access_logs;

-- Delete all announcements
-- DELETE FROM announcements;

-- Delete all access codes
-- DELETE FROM access_codes;

-- Reset sequences (if needed)
-- ALTER SEQUENCE access_codes_id_seq RESTART WITH 1;
```

---

## 📱 Real-time Monitoring Query

```sql
-- Run this to monitor live activity (refresh every 5 seconds)
SELECT 
    'Last Code Generated' as event,
    code as details,
    created_at as timestamp
FROM access_codes 
ORDER BY created_at DESC 
LIMIT 1

UNION ALL

SELECT 
    'Last Access Attempt' as event,
    CASE WHEN access_granted THEN 'SUCCESS' ELSE 'FAILED' END as details,
    accessed_at as timestamp
FROM dashboard_access_logs 
ORDER BY accessed_at DESC 
LIMIT 1

UNION ALL

SELECT 
    'Last Announcement' as event,
    title as details,
    created_at as timestamp
FROM announcements 
ORDER BY created_at DESC 
LIMIT 1;
```

---

## 💡 Tips

- Run cleanup queries weekly to maintain performance
- Set up automated cleanup using `pg_cron` extension
- Export important data regularly for backups
- Monitor failed access attempts for security
- Use `EXPLAIN ANALYZE` to optimize slow queries

---

**Bookmark this file for quick reference!** 🔖
