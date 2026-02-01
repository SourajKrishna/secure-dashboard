// Vercel Serverless Function - Generate Access Code with Supabase
import { getSupabaseClient } from '../lib/supabase.js';

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

        // Initialize Supabase client
        const supabase = getSupabaseClient();

        // Generate random code
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        // Generate unique session ID
        const sessionId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        const expiration = Date.now() + (5 * 60 * 1000); // 5 minutes
        const expiresAt = new Date(expiration).toISOString();

        // Store code in Supabase
        const { data: accessCodeData, error: dbError } = await supabase
            .from('access_codes')
            .insert({
                code: code,
                session_id: sessionId,
                expires_at: expiresAt,
                is_used: false,
                ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress
            })
            .select()
            .single();

        if (dbError) {
            console.error('Database error:', dbError);
            throw new Error('Failed to store access code');
        }

        // Send to Discord
        const timestamp = new Date().toLocaleTimeString();
        const discordMessage = {
            embeds: [{
                title: 'Dashboard Access Code',
                color: 5865242,
                fields: [
                    {
                        name: 'Access Code',
                        value: `\`${code}\``,
                        inline: true
                    },
                    {
                        name: 'Timestamp',
                        value: timestamp,
                        inline: true
                    }
                ],
                description: 'This code expires in 5 minutes and is single-use only.',
                footer: {
                    text: 'Secure Dashboard Access System'
                },
                timestamp: new Date().toISOString()
            }]
        };

        const discordResponse = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(discordMessage)
        });

        if (!discordResponse.ok) {
            throw new Error('Failed to send code to Discord');
        }

        // Return code and session info
        res.status(200).json({
            success: true,
            sessionId: sessionId,
            code: code,
            expiration: expiration
        });

    } catch (error) {
        console.error('Error generating code:', error);
        res.status(500).json({ 
            error: 'Failed to generate access code',
            details: error.message 
        });
    }
}
