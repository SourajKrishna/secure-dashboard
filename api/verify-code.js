// Vercel Serverless Function - Verify Access Code
// Note: This simplified version validates based on session storage
// For production, use Vercel KV (Redis) or a database

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
        const { code, sessionCode, expiration, isUsed } = req.body;

        if (!code || !sessionCode) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required parameters' 
            });
        }

        // Check if already used
        if (isUsed) {
            return res.status(401).json({ 
                success: false, 
                message: 'Access code has already been used' 
            });
        }

        // Check expiration
        if (Date.now() > expiration) {
            return res.status(401).json({ 
                success: false, 
                message: 'Access code has expired' 
            });
        }

        // Verify code matches
        if (code.toUpperCase() !== sessionCode.toUpperCase()) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid access code' 
            });
        }

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
