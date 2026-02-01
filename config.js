// ============================================
// DISCORD WEBHOOK CONFIGURATION
// ============================================

/*
 * SETUP INSTRUCTIONS:
 * 
 * 1. Create a Discord Webhook:
 *    - Go to your Discord server
 *    - Right-click on the channel where you want to receive codes/announcements
 *    - Select "Edit Channel" > "Integrations" > "Webhooks"
 *    - Click "New Webhook"
 *    - Copy the Webhook URL
 * 
 * 2. Update the Configuration:
 *    - Open script.js
 *    - Find the CONFIG object at the top of the file
 *    - Replace 'YOUR_DISCORD_WEBHOOK_URL_HERE' with your actual webhook URL
 * 
 * Example:
 * DISCORD_WEBHOOK_URL: 'https://discord.com/api/webhooks/123456789/abcdefghijklmnop'
 * 
 * 3. IMPORTANT SECURITY NOTES:
 *    - Never commit your webhook URL to public repositories
 *    - Keep your webhook URL private and secure
 *    - For production use, implement server-side authentication
 *    - This client-side implementation is for portfolio/demo purposes only
 * 
 * 4. Testing the Dashboard:
 *    - Open index.html in your browser
 *    - A unique access code will be generated and sent to Discord
 *    - Copy the code from Discord
 *    - Paste it into the verification screen
 *    - Access the Announcement Center
 * 
 * 5. Adding Announcements:
 *    - Option 1: Use the browser console:
 *      addTestAnnouncement('Title', 'Content', 'info')
 *      Priority options: 'info', 'update', 'alert'
 * 
 *    - Option 2: Send via Discord webhook:
 *      sendAnnouncementToDiscord('Title', 'Content', 'info')
 * 
 * 6. Customization:
 *    - Code expiration time: Modify CODE_EXPIRATION_TIME in CONFIG
 *    - Code length: Modify CODE_LENGTH in CONFIG
 *    - Colors and styling: Edit style.css
 */

// ============================================
// EXAMPLE WEBHOOK URLS (Replace with yours)
// ============================================

// For Access Codes:
// CONFIG.DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN';

// You can create separate webhooks for access codes and announcements
// if you want them in different channels

// ============================================
// HOW TO GET YOUR DISCORD WEBHOOK URL
// ============================================

/*
 * Step-by-step:
 * 
 * 1. Open Discord
 * 2. Navigate to your server
 * 3. Click on the settings icon (⚙️) next to the channel name
 * 4. Go to "Integrations" in the left sidebar
 * 5. Click "Create Webhook" or "View Webhooks"
 * 6. Click "New Webhook" button
 * 7. Give it a name (e.g., "Dashboard Access Codes")
 * 8. Click "Copy Webhook URL"
 * 9. Paste the URL in script.js CONFIG object
 * 
 * The URL format looks like:
 * https://discord.com/api/webhooks/[WEBHOOK_ID]/[WEBHOOK_TOKEN]
 */

// ============================================
// TROUBLESHOOTING
// ============================================

/*
 * Problem: "Error sending code to Discord"
 * Solution: 
 *   - Verify your webhook URL is correct
 *   - Make sure the webhook hasn't been deleted
 *   - Check browser console for detailed error messages
 * 
 * Problem: Code not appearing in Discord
 * Solution:
 *   - Check that you're looking at the correct Discord channel
 *   - Verify webhook permissions in Discord
 *   - Ensure webhook URL is properly set in CONFIG
 * 
 * Problem: Dashboard immediately shows without verification
 * Solution:
 *   - Clear browser cache and localStorage
 *   - Open in incognito/private browsing mode
 *   - Check sessionStorage is cleared
 * 
 * Problem: Announcements not showing
 * Solution:
 *   - Open browser console and use: addTestAnnouncement('Test', 'Message', 'info')
 *   - Check localStorage for stored announcements
 *   - Refresh the page
 */

// ============================================
// FEATURES OVERVIEW
// ============================================

/*
 * ✅ Access Verification System:
 *    - Unique one-time codes generated per session
 *    - 5-minute expiration timer
 *    - Codes sent automatically to Discord
 *    - Session-based authentication
 * 
 * ✅ Announcement Center:
 *    - Read-only announcement display
 *    - Three priority levels: Info, Update, Alert
 *    - Timestamp with relative time display
 *    - Color-coded priority indicators
 *    - Responsive design
 * 
 * ✅ Security Features:
 *    - One-time use codes
 *    - Time-based expiration
 *    - Session management
 *    - No code exposure in client
 * 
 * ✅ User Experience:
 *    - Professional Discord-inspired UI
 *    - Smooth animations
 *    - Loading states
 *    - Error handling
 *    - Responsive layout
 */

// ============================================
// DEMO/TESTING COMMANDS
// ============================================

/*
 * Open browser console and try these:
 * 
 * Add a test announcement:
 * addTestAnnouncement('System Update', 'The dashboard has been updated with new features.', 'update')
 * 
 * Add an alert:
 * addTestAnnouncement('Important Notice', 'Please review the security guidelines.', 'alert')
 * 
 * Add an info message:
 * addTestAnnouncement('Welcome', 'Thank you for using our dashboard.', 'info')
 * 
 * Send announcement to Discord (requires webhook setup):
 * sendAnnouncementToDiscord('New Feature', 'Check out the new announcement system!', 'info')
 */

console.log('📋 Configuration guide loaded');
console.log('💡 See config.js for setup instructions');
