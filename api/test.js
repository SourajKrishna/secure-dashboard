// Test endpoint to verify webhook configuration
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    
    res.status(200).json({
        status: 'ok',
        hasWebhook: !!webhookUrl,
        webhookLength: webhookUrl ? webhookUrl.length : 0,
        timestamp: new Date().toISOString()
    });
}
