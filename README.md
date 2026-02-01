# 🔐 Secure Dashboard - Announcement Center

A secure, controlled-access dashboard powered by Discord webhooks that functions as an announcement center.

## ✨ Features

### 🔑 Access Verification System
- **One-time access codes** generated automatically
- **5-minute expiration** timer with countdown
- **Discord webhook integration** for code delivery
- **Session-based authentication** for secure access
- **Single-use codes** that invalidate after verification

### 📢 Announcement Center
- **Read-only announcement display**
- **Three priority levels**: Info, Update, Alert
- **Real-time timestamps** with relative time display
- **Color-coded priority indicators**
- **Responsive design** for all devices
- **Discord webhook powered** announcements

### 🛡️ Security Features
- No code exposure in client-side code
- Time-based expiration mechanism
- One-time use verification
- Session management
- Direct dashboard access prevention

### 🎨 User Experience
- Professional Discord-inspired UI
- Smooth animations and transitions
- Loading states and feedback
- Error handling with clear messages
- Mobile-responsive layout

## 🚀 Quick Start

### 1. Setup Discord Webhook

1. Open your Discord server
2. Right-click on the desired channel
3. Select **Edit Channel** > **Integrations** > **Webhooks**
4. Click **New Webhook**
5. Copy the Webhook URL

### 2. Configure the Dashboard

Open `script.js` and update the CONFIG object:

```javascript
const CONFIG = {
    DISCORD_WEBHOOK_URL: 'https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_TOKEN',
    CODE_EXPIRATION_TIME: 5 * 60 * 1000, // 5 minutes
    CODE_LENGTH: 6,
    ANNOUNCEMENTS_KEY: 'dashboard_announcements',
};
```

### 3. Open the Dashboard

1. Open `index.html` in your web browser
2. An access code will be automatically generated
3. Check your Discord channel for the code
4. Enter the code in the verification screen
5. Access granted! 🎉

## 📖 How to Use

### Accessing the Dashboard

1. **Initial Load**: When you open the dashboard, a unique access code is generated
2. **Discord Notification**: The code is sent to your configured Discord channel
3. **Verification**: Copy the code from Discord and paste it into the verification screen
4. **Access**: Once verified, you'll see the Announcement Center

### Adding Announcements

#### Option 1: Browser Console (Testing)

```javascript
// Add a test announcement
addTestAnnouncement('Title', 'Your message here', 'info');

// Priority options: 'info', 'update', 'alert'
addTestAnnouncement('System Update', 'New features available', 'update');
addTestAnnouncement('Important', 'Action required', 'alert');
```

#### Option 2: Discord Webhook (Production)

```javascript
// Send announcement via Discord webhook
sendAnnouncementToDiscord('Title', 'Content', 'info');
```

### Priority Levels

- 🟢 **Info**: General information and updates
- 🟡 **Update**: Important updates and changes
- 🔴 **Alert**: Critical alerts and urgent notices

## 🛠️ Customization

### Modify Expiration Time

In `script.js`:

```javascript
CODE_EXPIRATION_TIME: 10 * 60 * 1000, // Change to 10 minutes
```

### Change Code Length

```javascript
CODE_LENGTH: 8, // Change to 8 characters
```

### Update Colors

Edit `style.css` CSS variables:

```css
:root {
    --primary-color: #5865F2;
    --success-color: #43B581;
    --error-color: #F04747;
    --warning-color: #FAA61A;
}
```

## 📁 File Structure

```
webhook/
│
├── index.html          # Main HTML structure
├── style.css           # Styling and animations
├── script.js           # Core functionality
├── config.js           # Configuration guide
└── README.md           # Documentation
```

## 🔧 Technical Details

### Technologies Used
- **HTML5**: Structure and semantic markup
- **CSS3**: Styling, animations, and responsive design
- **Vanilla JavaScript**: Core functionality and logic
- **Discord Webhooks API**: External integration

### Browser Compatibility
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

### Storage
- `sessionStorage`: Authentication state
- `localStorage`: Announcements persistence

## ⚠️ Important Security Notes

1. **Never expose your webhook URL** in public repositories
2. This is a **client-side demo** - not suitable for production without backend
3. For production use, implement **server-side authentication**
4. **Webhook URLs** should be stored securely (environment variables, backend)
5. Consider implementing **rate limiting** for production environments

## 🐛 Troubleshooting

### Code not sending to Discord
- ✓ Verify webhook URL is correct in `script.js`
- ✓ Check Discord webhook hasn't been deleted
- ✓ Look for errors in browser console (F12)

### Dashboard accessible without verification
- ✓ Clear browser cache and localStorage
- ✓ Try incognito/private browsing mode
- ✓ Check sessionStorage is cleared

### Announcements not showing
- ✓ Use browser console: `addTestAnnouncement('Test', 'Message', 'info')`
- ✓ Check localStorage for data
- ✓ Refresh the page

## 💡 Use Cases

- 📊 Portfolio projects
- 🏢 Internal company dashboards
- 🎮 Gaming community announcements
- 🔔 Team notification systems
- 📢 Controlled-access information centers

## 🎯 Design Principles

- **Minimal UI**: Clean and distraction-free
- **Professional**: Discord-inspired aesthetic
- **Secure**: No technical details exposed to users
- **User-friendly**: Clear feedback and error messages
- **Responsive**: Works on all device sizes

## 📝 License

This project is provided as-is for educational and portfolio purposes.

## 🤝 Contributing

This is a demonstration project. Feel free to fork and customize for your needs!

## 📞 Support

For issues or questions, refer to:
- `config.js` for setup instructions
- Browser console for debugging
- Discord API documentation for webhook details

---

**Made with ❤️ for secure, controlled-access dashboards**

*Note: This is a demonstration project. For production use, implement proper backend authentication and security measures.*
