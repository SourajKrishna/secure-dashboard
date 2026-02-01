// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    // API Base URL - will be your Vercel deployment URL or localhost for dev
    API_BASE_URL: window.location.origin,
    
    // Code expiration time in milliseconds (5 minutes)
    CODE_EXPIRATION_TIME: 5 * 60 * 1000,
    
    // Announcements storage key
    ANNOUNCEMENTS_KEY: 'dashboard_announcements',
};

// ============================================
// ACCESS CODE MANAGEMENT
// ============================================
class AccessCodeManager {
    constructor() {
        this.sessionId = null;
        this.sessionCode = null;
        this.codeExpiration = null;
        this.countdownInterval = null;
        this.isCodeUsed = false;
    }

    async createNewCode() {
        try {
            console.log('🔄 Calling API:', `${CONFIG.API_BASE_URL}/api/generate-code`);
            
            const response = await fetch(`${CONFIG.API_BASE_URL}/api/generate-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('📡 Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('❌ API Error:', errorData);
                throw new Error(errorData.error || errorData.details || 'Failed to generate access code');
            }

            const data = await response.json();
            console.log('✅ API Response:', { hasCode: !!data.code, hasSession: !!data.sessionId });
            
            this.sessionId = data.sessionId;
            this.sessionCode = data.code;
            this.codeExpiration = data.expiration;
            this.isCodeUsed = false;

            // Start countdown
            this.startCountdown();

            console.log('✅ Access code generated and sent to Discord');
            return true;

        } catch (error) {
            console.error('❌ Error generating code:', error);
            throw error;
        }
    }

    startCountdown() {
        // Clear existing interval
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

    async verifyCode(inputCode) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/api/verify-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: inputCode,
                    sessionId: this.sessionId
                })
            });

            const data = await response.json();
            
            if (!data.success) {
                return { success: false, message: data.message || 'Invalid access code.' };
            }

            // Mark as used
            this.isCodeUsed = true;
            clearInterval(this.countdownInterval);

            return { success: true, message: 'Access granted!' };

        } catch (error) {
            console.error('Error verifying code:', error);
            return { success: false, message: 'Verification failed. Please try again.' };
        }
    }

    invalidateCode() {
        this.sessionId = null;
        this.sessionCode = null;
        this.codeExpiration = null;
        this.isCodeUsed = false;
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
    }
}

// ============================================
// ANNOUNCEMENT MANAGER
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
                title: 'Welcome to the Dashboard',
                content: 'This is your secure announcement center. All announcements are managed through Discord webhooks with a secure backend.',
                priority: 'info',
                timestamp: new Date().toISOString()
            },
            {
                id: 2,
                title: 'System Status',
                content: 'All systems are operational. The dashboard is ready for use with Vercel serverless functions.',
                priority: 'update',
                timestamp: new Date(Date.now() - 3600000).toISOString()
            }
        ];
    }

    saveAnnouncements() {
        localStorage.setItem(CONFIG.ANNOUNCEMENTS_KEY, JSON.stringify(this.announcements));
    }

    async addAnnouncementViaAPI(title, content, priority = 'info') {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/api/send-announcement`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content, priority })
            });

            if (!response.ok) {
                throw new Error('Failed to send announcement');
            }

            const data = await response.json();
            
            // Add to local storage
            this.announcements.unshift(data.announcement);
            this.saveAnnouncements();
            
            return data.announcement;

        } catch (error) {
            console.error('Error sending announcement:', error);
            throw error;
        }
    }

    addAnnouncement(title, content, priority = 'info') {
        const announcement = {
            id: Date.now(),
            title,
            content,
            priority,
            timestamp: new Date().toISOString()
        };

        this.announcements.unshift(announcement);
        this.saveAnnouncements();
        return announcement;
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
        
        // Announcement form elements
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

        // Convert input to uppercase
        this.accessCodeInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.toUpperCase();
        });
        
        // Announcement form listeners
        this.sendAnnouncementBtn.addEventListener('click', () => this.handleSendAnnouncement());
        this.clearFormBtn.addEventListener('click', () => this.handleClearForm());
        this.togglePanelBtn.addEventListener('click', () => this.handleTogglePanel());
        
        // Priority selection
        this.priorityBtns.forEach(btn => {
            btn.addEventListener('click', () => this.handlePrioritySelection(btn));
        });
        
        // Enter key to send announcement
        this.announcementContent.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.handleSendAnnouncement();
            }
        });
    }

    async initialize() {
        // Check if already authenticated (session-based)
        const isAuthenticated = sessionStorage.getItem('dashboard_authenticated');
        
        if (isAuthenticated === 'true') {
            this.showDashboard();
        } else {
            this.showVerification();
            await this.generateNewAccessCode();
        }

        // Initialize Feather Icons
        feather.replace();
    }

    async generateNewAccessCode() {
        this.showLoading();
        try {
            await this.accessManager.createNewCode();
            this.errorMessage.textContent = '';
            console.log('✅ Code generated successfully');
        } catch (error) {
            console.error('❌ Error details:', error);
            this.errorMessage.textContent = `Error: ${error.message}. Check console for details.`;
            this.errorMessage.style.color = 'var(--error-color)';
        } finally {
            this.hideLoading();
        }
    }

    async handleVerification() {
        const inputCode = this.accessCodeInput.value.trim();
        
        if (!inputCode) {
            this.showError('Please enter an access code.');
            return;
        }

        this.showLoading();
        const result = await this.accessManager.verifyCode(inputCode);
        this.hideLoading();
        
        if (result.success) {
            this.errorMessage.textContent = '';
            this.errorMessage.style.color = 'var(--success-color)';
            this.errorMessage.textContent = 'Access granted!';
            
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
        
        // Show feedback
        const refreshText = this.refreshBtn.querySelector('span');
        refreshText.textContent = 'Refreshed';
        setTimeout(() => {
            refreshText.textContent = 'Refresh';
        }, 1500);
    }

    handlePrioritySelection(selectedBtn) {
        // Remove active class from all buttons
        this.priorityBtns.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to selected button
        selectedBtn.classList.add('active');
        
        // Store selected priority
        this.selectedPriority = selectedBtn.dataset.priority;
    }

    handleClearForm() {
        this.announcementTitle.value = '';
        this.announcementContent.value = '';
        
        // Reset priority to info
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

        // Validation
        if (!title) {
            alert('Please enter a title for the announcement.');
            this.announcementTitle.focus();
            return;
        }

        if (!content) {
            alert('Please enter content for the announcement.');
            this.announcementContent.focus();
            return;
        }

        // Disable button while sending
        this.sendAnnouncementBtn.disabled = true;
        const btnText = this.sendAnnouncementBtn.querySelector('span');
        btnText.textContent = 'Sending...';
        this.showLoading();

        try {
            // Send via backend API
            await this.announcementManager.addAnnouncementViaAPI(
                title, 
                content, 
                this.selectedPriority
            );

            // Refresh the display
            this.announcementManager.renderAnnouncements();

            // Clear the form
            this.handleClearForm();

            // Show success message
            btnText.textContent = 'Sent!';
            setTimeout(() => {
                btnText.textContent = 'Send Announcement';
            }, 2000);

        } catch (error) {
            console.error('Error sending announcement:', error);
            alert('Failed to send announcement. Please check your configuration.');
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
    // Prevent direct access to dashboard
    if (sessionStorage.getItem('dashboard_authenticated') !== 'true') {
        sessionStorage.removeItem('dashboard_authenticated');
    }

    // Initialize managers
    const accessManager = new AccessCodeManager();
    const announcementManager = new AnnouncementManager();
    const uiController = new UIController(accessManager, announcementManager);

    // Initialize Feather Icons
    feather.replace();

    console.log('Dashboard initialized with backend integration');
    console.log('API Base URL:', CONFIG.API_BASE_URL);
});
