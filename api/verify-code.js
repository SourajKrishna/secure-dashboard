// Vercel Serverless Function - Verify Access Code with Supabase
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
        const { code, sessionId } = req.body;

        if (!code || !sessionId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required parameters' 
            });
        }

        // Initialize Supabase client
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey) {
            return res.status(500).json({ error: 'Supabase configuration missing' });
        }
        
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Retrieve access code from database
        const { data: accessCode, error: fetchError } = await supabase
            .from('access_codes')
            .select('*')
            .eq('session_id', sessionId)
            .single();

        if (fetchError || !accessCode) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid session or code not found' 
            });
        }

        // Check if already used
        if (accessCode.is_used) {
            return res.status(401).json({ 
                success: false, 
                message: 'Access code has already been used' 
            });
        }

        // Check expiration
        const expirationTime = new Date(accessCode.expires_at).getTime();
        if (Date.now() > expirationTime) {
            return res.status(401).json({ 
                success: false, 
                message: 'Access code has expired' 
            });
        }

        // Verify code matches
        if (code.toUpperCase() !== accessCode.code.toUpperCase()) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid access code' 
            });
        }

        // Mark code as used
        const { error: updateError } = await supabase
            .from('access_codes')
            .update({ 
                is_used: true, 
                used_at: new Date().toISOString() 
            })
            .eq('session_id', sessionId);

        if (updateError) {
            console.error('Failed to update code status:', updateError);
        }

        // Log successful access
        await supabase
            .from('dashboard_access_logs')
            .insert({
                session_id: sessionId,
                access_granted: true,
                ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                user_agent: req.headers['user-agent']
            });

        res.status(200).json({ 
            success: true, 
            message: 'Access granted' 
        });

    } catch (error) {
        console.error('Error verifying code:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Verification failed',
            details: error.message
        });
    }
}
