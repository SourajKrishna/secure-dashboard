// Vercel Serverless Function - Generate Access Code
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

        // Generate random code
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        // Generate unique session ID
        const sessionId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        const expiration = Date.now() + (5 * 60 * 1000); // 5 minutes

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

        // Return code info (encrypted/hashed in production)
        res.status(200).json({
            success: true,
            sessionId: sessionId,
            codeHash: hashCode(code), // In production, only return hash
            expiration: expiration
        });

    } catch (error) {
        console.error('Error generating code:', error);
        res.status(500).json({ error: 'Failed to generate access code' });
    }
}

// Simple hash function (use bcrypt or similar in production)
function hashCode(code) {
    let hash = 0;
    for (let i = 0; i < code.length; i++) {
        const char = code.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(36);
}
