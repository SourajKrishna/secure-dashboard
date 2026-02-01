// ============================================
// LOCAL TEST VERSION WITH DIRECT WEBHOOK
// ============================================
const CONFIG = {
    // Discord webhook URL - DIRECTLY EMBEDDED FOR LOCAL TESTING
    DISCORD_WEBHOOK_URL: 'https://discord.com/api/webhooks/1467387274617553038/lWTIH7RbNUaKeLUY7wtogbOGmjG-rdprEaLxZTkBDQ8VPfNd_0zaPWjSnbi1tHgmKHs3',
    
    CODE_EXPIRATION_TIME: 5 * 60 * 1000,
    ANNOUNCEMENTS_KEY: 'dashboard_announcements',
};

// ============================================
// ACCESS CODE MANAGEMENT - LOCAL VERSION
// ============================================
class AccessCodeManager {
    constructor() {
        this.currentCode = null;
        this.codeExpiration = null;
        this.countdownInterval = null;
        this.isCodeUsed = false;
    }

    generateCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    async createNewCode() {
        this.currentCode = this.generateCode();
        this.codeExpiration = Date.now() + CONFIG.CODE_EXPIRATION_TIME;
        this.isCodeUsed = false;

        await this.sendCodeToDiscord();
        this.startCountdown();

        return this.currentCode;
    }

    async sendCodeToDiscord() {
        const timestamp = new Date().toLocaleTimeString();
        const message = {
            embeds: [{
                title: '🔐 Dashboard Access Code (LOCAL TEST)',
                color: 5865242,
                fields: [
                    {
                        name: 'Access Code',
                        value: `\`${this.currentCode}\``,
                        inline: true
                    },
                    {
                        name: 'Timestamp',
                        value: timestamp,
                        inline: true
                    }
                ],
                description: '⚠️ This code expires in 5 minutes and is single-use only.',
                footer: {
                    text: 'Local Test - Secure Dashboard'
                },
                timestamp: new Date().toISOString()
            }]
        };

        try {
            const response = await fetch(CONFIG.DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message)
            });

            if (!response.ok) {
                throw new Error('Failed to send code to Discord');
            }

            console.log('✅ Access code sent to Discord successfully');
            return true;
        } catch (error) {
            console.error('❌ Error sending code to Discord:', error);
            alert('⚠️ Unable to send access code to Discord. Please check the webhook URL.');
            return false;
        }
    }

    startCountdown() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }

        const updateCountdown = () => {
            const remaining = this.codeExpiration - Date.now();
            
            if (remaining <= 0) {
                clearInterval(this.countdownInterval);
                document.getElementById('countdown').textContent = '0:00';
                document.getElementById('countdown').style.color = 'var(--error-color)';
                return;
            }

            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);
            document.getElementById('countdown').textContent = 
                `${minutes}:${seconds.toString().padStart(2, '0')}`;
        };

        updateCountdown();
        this.countdownInterval = setInterval(updateCountdown, 1000);
    }

    verifyCode(inputCode) {
        if (inputCode.toUpperCase() !== this.currentCode) {
            return { success: false, message: 'Invalid access code.' };
        }

        if (Date.now() > this.codeExpiration) {
            return { success: false, message: 'Access code has expired.' };
        }

        if (this.isCodeUsed) {
            return { success: false, message: 'Access code has already been used.' };
        }

        this.isCodeUsed = true;
        clearInterval(this.countdownInterval);

        return { success: true, message: 'Access granted!' };
    }

    invalidateCode() {
        this.currentCode = null;
        this.codeExpiration = null;
        this.isCodeUsed = false;
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
    }
}

// ============================================
// ANNOUNCEMENT MANAGER - LOCAL VERSION
// ============================================
class AnnouncementManager {
    constructor() {
        this.announcements = this.loadAnnouncements();
    }

    loadAnnouncements() {
        const stored = localStorage.getItem(CONFIG.ANNOUNCEMENTS_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        return this.getDefaultAnnouncements();
    }

    getDefaultAnnouncements() {
        return [
            {
                id: 1,
                title: 'Welcome to Local Test Version',
                content: 'This is your secure announcement center running locally. Discord webhooks are working directly from your browser!',
                priority: 'info',
                timestamp: new Date().toISOString()
            },
            {
                id: 2,
                title: 'Test Announcement',
                content: 'Try creating a new announcement to see it appear in your Discord channel!',
                priority: 'update',
                timestamp: new Date(Date.now() - 3600000).toISOString()
            }
        ];
    }

    saveAnnouncements() {
        localStorage.setItem(CONFIG.ANNOUNCEMENTS_KEY, JSON.stringify(this.announcements));
    }

    async addAnnouncement(title, content, priority = 'info') {
        const announcement = {
            id: Date.now(),
            title,
            content,
            priority,
            timestamp: new Date().toISOString()
        };

        // Send to Discord
        await this.sendToDiscord(announcement);

        // Add to local storage
        this.announcements.unshift(announcement);
        this.saveAnnouncements();
        
        return announcement;
    }

    async sendToDiscord(announcement) {
        const priorityConfig = {
            info: { color: 4437377, emoji: 'ℹ️' },
            update: { color: 16426522, emoji: '🔔' },
            alert: { color: 15746887, emoji: '⚠️' }
        };

        const config = priorityConfig[announcement.priority] || priorityConfig.info;

        const message = {
            embeds: [{
                title: `${config.emoji} ${announcement.title}`,
                description: announcement.content,
                color: config.color,
                timestamp: announcement.timestamp,
                footer: {
                    text: 'Local Test - Announcement Center'
                }
            }]
        };

        try {
            const response = await fetch(CONFIG.DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message)
            });

            if (!response.ok) {
                throw new Error('Failed to send announcement');
            }

            console.log('✅ Announcement sent to Discord');
            return true;
        } catch (error) {
            console.error('❌ Error sending announcement:', error);
            throw error;
        }
    }

    getAnnouncements() {
        return this.announcements.sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        );
    }

    renderAnnouncements() {
        const container = document.getElementById('announcements-list');
        const announcements = this.getAnnouncements();

        if (announcements.length === 0) {
            container.innerHTML = `
                <div class="placeholder">
                    <div class="placeholder-icon">
                        <i data-feather="inbox" class="placeholder-icon-svg"></i>
                    </div>
                    <p>No announcements available.</p>
                </div>
            `;
            feather.replace();
            return;
        }

        container.innerHTML = announcements.map(announcement => `
            <div class="announcement-card priority-${announcement.priority}">
                <div class="announcement-header">
                    <h3 class="announcement-title">${this.escapeHtml(announcement.title)}</h3>
                    <span class="announcement-tag tag-${announcement.priority}">
                        ${announcement.priority}
                    </span>
                </div>
                <div class="announcement-content">
                    ${this.escapeHtml(announcement.content)}
                </div>
                <div class="announcement-footer">
                    <span class="timestamp">
                        ${this.formatTimestamp(announcement.timestamp)}
                    </span>
                </div>
            </div>
        `).join('');

        feather.replace();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
}

// ============================================
// UI CONTROLLER
// ============================================
class UIController {
    constructor(accessManager, announcementManager) {
        this.accessManager = accessManager;
        this.announcementManager = announcementManager;
        this.isAuthenticated = false;
        
        this.initializeElements();
        this.attachEventListeners();
        this.initialize();
    }

    initializeElements() {
        this.verificationScreen = document.getElementById('verification-screen');
        this.dashboardScreen = document.getElementById('dashboard-screen');
        this.accessCodeInput = document.getElementById('access-code-input');
        this.verifyBtn = document.getElementById('verify-btn');
        this.regenerateBtn = document.getElementById('regenerate-btn');
        this.errorMessage = document.getElementById('error-message');
        this.logoutBtn = document.getElementById('logout-btn');
        this.refreshBtn = document.getElementById('refresh-btn');
        this.loadingOverlay = document.getElementById('loading-overlay');
        
        this.announcementTitle = document.getElementById('announcement-title');
        this.announcementContent = document.getElementById('announcement-content');
        this.sendAnnouncementBtn = document.getElementById('send-announcement-btn');
        this.clearFormBtn = document.getElementById('clear-form-btn');
        this.togglePanelBtn = document.getElementById('toggle-panel-btn');
        this.announcementForm = document.getElementById('announcement-form');
        this.priorityBtns = document.querySelectorAll('.priority-btn');
        this.selectedPriority = 'info';
    }

    attachEventListeners() {
        this.verifyBtn.addEventListener('click', () => this.handleVerification());
        this.accessCodeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleVerification();
        });
        this.regenerateBtn.addEventListener('click', () => this.handleRegenerate());
        this.logoutBtn.addEventListener('click', () => this.handleLogout());
        this.refreshBtn.addEventListener('click', () => this.handleRefresh());

        this.accessCodeInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.toUpperCase();
        });
        
        this.sendAnnouncementBtn.addEventListener('click', () => this.handleSendAnnouncement());
        this.clearFormBtn.addEventListener('click', () => this.handleClearForm());
        this.togglePanelBtn.addEventListener('click', () => this.handleTogglePanel());
        
        this.priorityBtns.forEach(btn => {
            btn.addEventListener('click', () => this.handlePrioritySelection(btn));
        });
        
        this.announcementContent.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.handleSendAnnouncement();
            }
        });
    }

    async initialize() {
        const isAuthenticated = sessionStorage.getItem('dashboard_authenticated');
        
        if (isAuthenticated === 'true') {
            this.showDashboard();
        } else {
            this.showVerification();
            await this.generateNewAccessCode();
        }

        feather.replace();
        console.log('🧪 Local Test Dashboard Initialized');
        console.log('✅ Webhook URL configured');
    }

    async generateNewAccessCode() {
        this.showLoading();
        try {
            const success = await this.accessManager.createNewCode();
            this.errorMessage.textContent = '';
            if (success) {
                console.log('✅ Access code generated and sent to Discord!');
            }
        } catch (error) {
            this.errorMessage.textContent = 'Error generating code. Please refresh the page.';
        } finally {
            this.hideLoading();
        }
    }

    handleVerification() {
        const inputCode = this.accessCodeInput.value.trim();
        
        if (!inputCode) {
            this.showError('Please enter an access code.');
            return;
        }

        const result = this.accessManager.verifyCode(inputCode);
        
        if (result.success) {
            this.errorMessage.textContent = '';
            this.errorMessage.style.color = 'var(--success-color)';
            this.errorMessage.textContent = '✓ Access granted!';
            
            setTimeout(() => {
                sessionStorage.setItem('dashboard_authenticated', 'true');
                this.showDashboard();
            }, 500);
        } else {
            this.showError(result.message);
            this.accessCodeInput.value = '';
        }
    }

    async handleRegenerate() {
        this.accessCodeInput.value = '';
        this.errorMessage.textContent = '';
        await this.generateNewAccessCode();
    }

    handleLogout() {
        sessionStorage.removeItem('dashboard_authenticated');
        this.accessManager.invalidateCode();
        this.showVerification();
        this.generateNewAccessCode();
    }

    handleRefresh() {
        this.announcementManager.renderAnnouncements();
        const refreshText = this.refreshBtn.querySelector('span');
        refreshText.textContent = 'Refreshed';
        setTimeout(() => {
            refreshText.textContent = 'Refresh';
        }, 1500);
    }

    handlePrioritySelection(selectedBtn) {
        this.priorityBtns.forEach(btn => btn.classList.remove('active'));
        selectedBtn.classList.add('active');
        this.selectedPriority = selectedBtn.dataset.priority;
    }

    handleClearForm() {
        this.announcementTitle.value = '';
        this.announcementContent.value = '';
        this.priorityBtns.forEach(btn => btn.classList.remove('active'));
        this.priorityBtns[0].classList.add('active');
        this.selectedPriority = 'info';
    }

    handleTogglePanel() {
        this.announcementForm.classList.toggle('collapsed');
        const icon = this.togglePanelBtn.querySelector('.toggle-icon');
        
        if (this.announcementForm.classList.contains('collapsed')) {
            icon.setAttribute('data-feather', 'plus');
        } else {
            icon.setAttribute('data-feather', 'minus');
        }
        
        feather.replace();
    }

    async handleSendAnnouncement() {
        const title = this.announcementTitle.value.trim();
        const content = this.announcementContent.value.trim();

        if (!title) {
            alert('⚠️ Please enter a title for the announcement.');
            this.announcementTitle.focus();
            return;
        }

        if (!content) {
            alert('⚠️ Please enter content for the announcement.');
            this.announcementContent.focus();
            return;
        }

        this.sendAnnouncementBtn.disabled = true;
        const btnText = this.sendAnnouncementBtn.querySelector('span');
        btnText.textContent = 'Sending...';
        this.showLoading();

        try {
            await this.announcementManager.addAnnouncement(
                title, 
                content, 
                this.selectedPriority
            );

            this.announcementManager.renderAnnouncements();
            this.handleClearForm();

            btnText.textContent = 'Sent! ✓';
            setTimeout(() => {
                btnText.textContent = 'Send Announcement';
            }, 2000);

            console.log('✅ Announcement sent successfully!');

        } catch (error) {
            console.error('❌ Error sending announcement:', error);
            alert('❌ Failed to send announcement. Please check the console.');
            btnText.textContent = 'Send Announcement';
        } finally {
            this.sendAnnouncementBtn.disabled = false;
            this.hideLoading();
            feather.replace();
        }
    }

    showError(message) {
        this.errorMessage.style.color = 'var(--error-color)';
        this.errorMessage.textContent = message;
    }

    showVerification() {
        this.verificationScreen.classList.add('active');
        this.dashboardScreen.classList.remove('active');
        this.accessCodeInput.value = '';
        this.errorMessage.textContent = '';
        feather.replace();
    }

    showDashboard() {
        this.verificationScreen.classList.remove('active');
        this.dashboardScreen.classList.add('active');
        this.announcementManager.renderAnnouncements();
        feather.replace();
    }

    showLoading() {
        this.loadingOverlay.classList.add('active');
    }

    hideLoading() {
        this.loadingOverlay.classList.remove('active');
    }
}

// ============================================
// INITIALIZE APPLICATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('dashboard_authenticated') !== 'true') {
        sessionStorage.removeItem('dashboard_authenticated');
    }

    const accessManager = new AccessCodeManager();
    const announcementManager = new AnnouncementManager();
    const uiController = new UIController(accessManager, announcementManager);

    feather.replace();

    console.log('🚀 Local Test Dashboard Ready!');
    console.log('📡 Webhook URL: Configured');
    console.log('✅ Ready to send to Discord!');
});
