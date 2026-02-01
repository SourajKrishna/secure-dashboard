// Vercel Serverless Function - Verify Access Code
const activeCodes = new Map(); // In production, use Redis or database

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
                message: 'Missing code or session ID' 
            });
        }

        // In production, retrieve from Redis/database
        const storedData = activeCodes.get(sessionId);

        if (!storedData) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid or expired session' 
            });
        }

        // Check expiration
        if (Date.now() > storedData.expiration) {
            activeCodes.delete(sessionId);
            return res.status(401).json({ 
                success: false, 
                message: 'Access code has expired' 
            });
        }

        // Check if already used
        if (storedData.used) {
            return res.status(401).json({ 
                success: false, 
                message: 'Access code has already been used' 
            });
        }

        // Verify code
        if (code.toUpperCase() !== storedData.code) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid access code' 
            });
        }

        // Mark as used
        storedData.used = true;
        activeCodes.set(sessionId, storedData);

        res.status(200).json({ 
            success: true, 
            message: 'Access granted' 
        });

    } catch (error) {
        console.error('Error verifying code:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Verification failed' 
        });
    }
}

// Store code (called internally by generate-code)
export function storeCode(sessionId, code, expiration) {
    activeCodes.set(sessionId, {
        code: code,
        expiration: expiration,
        used: false
    });
}
