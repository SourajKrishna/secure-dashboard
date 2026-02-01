// Vercel Serverless Function - Send Announcement with Supabase
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

        if (!webhookUrl) {
            return res.status(500).json({ error: 'Webhook URL not configured' });
        }

        const { title, content, priority = 'info' } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }

        // Initialize Supabase client
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey) {
            return res.status(500).json({ error: 'Supabase configuration missing' });
        }
        
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Priority colors and emojis
        const priorityConfig = {
            info: { color: 4437377, emoji: 'ℹ️' },
            update: { color: 16426522, emoji: '🔔' },
            alert: { color: 15746887, emoji: '⚠️' }
        };

        const config = priorityConfig[priority] || priorityConfig.info;

        // Create Discord embed
        const discordMessage = {
            embeds: [{
                title: `${config.emoji} ${title}`,
                description: content,
                color: config.color,
                timestamp: new Date().toISOString(),
                footer: {
                    text: 'Announcement Center'
                }
            }]
        };

        // Send to Discord
        const discordResponse = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(discordMessage)
        });

        if (!discordResponse.ok) {
            throw new Error('Failed to send announcement to Discord');
        }

        // Store announcement in Supabase
        const { data: announcementData, error: dbError } = await supabase
            .from('announcements')
            .insert({
                title,
                content,
                priority,
                sent_to_discord: true
            })
            .select()
            .single();

        if (dbError) {
            console.error('Database error:', dbError);
            // Continue even if database insert fails
        }

        // Return announcement data
        res.status(200).json({
            success: true,
            announcement: {
                id: announcementData?.id || Date.now(),
                title,
                content,
                priority,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Error sending announcement:', error);
        res.status(500).json({ error: 'Failed to send announcement' });
    }
}
