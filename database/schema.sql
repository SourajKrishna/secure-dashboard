-- Supabase Database Schema for Secure Dashboard
-- Run this SQL in your Supabase SQL Editor

-- Table: access_codes
-- Stores generated access codes with expiration and usage status
CREATE TABLE IF NOT EXISTS access_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(6) NOT NULL,
    session_id VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP WITH TIME ZONE,
    ip_address VARCHAR(50)
);

-- Table: announcements
-- Stores all announcements sent through the dashboard
CREATE TABLE IF NOT EXISTS announcements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'info',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_to_discord BOOLEAN DEFAULT FALSE,
    discord_message_id VARCHAR(100)
);

-- Table: dashboard_access_logs
-- Tracks who accessed the dashboard and when
CREATE TABLE IF NOT EXISTS dashboard_access_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id VARCHAR(100),
    access_granted BOOLEAN DEFAULT FALSE,
    ip_address VARCHAR(50),
    user_agent TEXT,
    accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_access_codes_session ON access_codes(session_id);
CREATE INDEX IF NOT EXISTS idx_access_codes_expires ON access_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_announcements_created ON announcements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_access_logs_accessed ON dashboard_access_logs(accessed_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE access_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_access_logs ENABLE ROW LEVEL SECURITY;

-- Create policies to allow service role access
-- For access_codes
CREATE POLICY "Service role can manage access codes"
ON access_codes
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- For announcements
CREATE POLICY "Service role can manage announcements"
ON announcements
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- For dashboard_access_logs
CREATE POLICY "Service role can manage access logs"
ON dashboard_access_logs
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Optional: Create a function to auto-cleanup expired codes (runs daily)
CREATE OR REPLACE FUNCTION cleanup_expired_codes()
RETURNS void AS $$
BEGIN
    DELETE FROM access_codes
    WHERE expires_at < NOW() - INTERVAL '1 day';
END;
$$ LANGUAGE plpgsql;

-- Optional: Create a scheduled job to run cleanup (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-expired-codes', '0 2 * * *', 'SELECT cleanup_expired_codes()');
