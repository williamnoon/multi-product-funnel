// User Dashboard JavaScript

// Sample user data and state
let currentUser = null;
let userFunnels = [];
let featuredTemplates = [
    {
        id: 1,
        name: "AI Product Launch",
        category: "ai-income",
        description: "Perfect for launching AI-powered products",
        preview: "🧠"
    },
    {
        id: 2,
        name: "Crypto Investment Guide",
        category: "crypto-wealth",
        description: "Convert visitors into crypto investors",
        preview: "₿"
    },
    {
        id: 3,
        name: "App Development Course",
        category: "app-empire",
        description: "Sell your app development expertise",
        preview: "📱"
    }
];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadUserSession();
    loadUserData();
    loadFeaturedTemplates();
    setupEventListeners();
});

// Load user session
function loadUserSession() {
    const sessionData = 
        JSON.parse(localStorage.getItem('funnelmaster_session')) ||
        JSON.parse(sessionStorage.getItem('funnelmaster_session'));

    if (!sessionData) {
        // Redirect to login if no session
        window.location.href = 'login.html';
        return;
    }

    currentUser = sessionData.user;
    
    // Update UI with user info
    updateUserInfo();
    checkPlanLimits();
}

// Update user information in UI
function updateUserInfo() {
    if (!currentUser) return;

    // Update header
    document.getElementById('user-name').textContent = currentUser.name;
    document.getElementById('user-email').textContent = currentUser.email;
    document.getElementById('welcome-name').textContent = currentUser.name.split(' ')[0];
    
    // Update avatar
    const initials = currentUser.name.split(' ').map(n => n[0]).join('');
    document.getElementById('user-avatar').textContent = initials;
    
    // Update plan badge
    const planBadge = document.getElementById('user-plan');
    planBadge.textContent = currentUser.plan.charAt(0).toUpperCase() + currentUser.plan.slice(1);
    planBadge.className = `plan-badge ${currentUser.plan}`;
}

// Check plan limits and show upgrade notice
function checkPlanLimits() {
    if (currentUser.plan === 'basic') {
        document.getElementById('upgrade-notice').style.display = 'block';
        
        // Update funnel limit display
        const funnelLimit = document.getElementById('funnel-limit');
        if (funnelLimit && currentUser.limits) {
            funnelLimit.textContent = `of ${currentUser.limits.funnels} max`;
        }
    }
}

// Load user data (funnels, stats)
function loadUserData() {
    // Load user's funnels from localStorage (in real app, this would be API call)
    const storedFunnels = JSON.parse(localStorage.getItem(`funnels_${currentUser.id}`) || '[]');
    userFunnels = storedFunnels;
    
    // Update stats
    updateDashboardStats();
    loadUserFunnels();
}

// Update dashboard statistics
function updateDashboardStats() {
    const funnelCount = userFunnels.length;
    const totalViews = userFunnels.reduce((sum, f) => sum + (f.views || 0), 0);
    const totalConversions = userFunnels.reduce((sum, f) => sum + (f.conversions || 0), 0);
    const totalRevenue = userFunnels.reduce((sum, f) => sum + (f.revenue || 0), 0);

    document.getElementById('funnel-count').textContent = funnelCount;
    document.getElementById('total-views').textContent = totalViews.toLocaleString();
    document.getElementById('total-conversions').textContent = totalConversions.toLocaleString();
    document.getElementById('total-revenue').textContent = `$${totalRevenue.toLocaleString()}`;
}

// Load user's funnels
function loadUserFunnels() {
    const container = document.getElementById('user-funnels');
    const emptyState = document.getElementById('empty-funnels');
    
    if (userFunnels.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    container.style.display = 'grid';
    emptyState.style.display = 'none';
    
    container.innerHTML = userFunnels.map(funnel => `
        <div class="funnel-card">
            <div class="funnel-card-header">
                <h3 class="funnel-card-title">${funnel.name}</h3>
                <div class="funnel-card-meta">
                    <span class="funnel-status ${funnel.status}">${funnel.status}</span>
                    <span>${formatDate(funnel.lastModified)}</span>
                </div>
            </div>
            <div class="funnel-card-body">
                <div class="funnel-stats">
                    <div class="funnel-stat">
                        <div class="funnel-stat-value">${funnel.views || 0}</div>
                        <div class="funnel-stat-label">Views</div>
                    </div>
                    <div class="funnel-stat">
                        <div class="funnel-stat-value">${funnel.conversions || 0}</div>
                        <div class="funnel-stat-label">Conversions</div>
                    </div>
                </div>
                <div class="funnel-card-actions">
                    <button class="action-btn edit" onclick="editFunnel(${funnel.id})">
                        Edit
                    </button>
                    <button class="action-btn view" onclick="viewFunnel(${funnel.id})">
                        View
                    </button>
                    <button class="action-btn delete" onclick="deleteFunnel(${funnel.id})">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Load featured templates
function loadFeaturedTemplates() {
    const container = document.getElementById('featured-templates');
    
    container.innerHTML = featuredTemplates.map(template => `
        <div class="template-card">
            <div class="template-preview">
                ${template.preview}
            </div>
            <div class="template-content">
                <h3 class="template-title">${template.name}</h3>
                <p class="template-description">${template.description}</p>
                <div class="template-actions">
                    <button class="btn-secondary" onclick="previewTemplate(${template.id})">
                        Preview
                    </button>
                    <button class="btn-primary" onclick="useTemplate(${template.id})">
                        Use Template
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Setup event listeners
function setupEventListeners() {
    // Funnel filter
    const filterSelect = document.getElementById('funnel-filter');
    if (filterSelect) {
        filterSelect.addEventListener('change', function() {
            filterFunnels(this.value);
        });
    }
    
    // Template category buttons
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active from all buttons
            categoryButtons.forEach(b => b.classList.remove('active'));
            // Add active to clicked button
            this.classList.add('active');
            // Filter templates
            filterTemplates(this.dataset.category);
        });
    });
}

// Funnel management functions
function createNewFunnel() {
    // Check plan limits
    if (currentUser.plan === 'basic' && currentUser.limits && userFunnels.length >= currentUser.limits.funnels) {
        showUpgradeModal();
        return;
    }
    
    showModal('create-funnel-modal');
}

function createFromScratch() {
    closeCreateFunnel();
    
    // Create new funnel
    const newFunnel = {
        id: Date.now(),
        name: 'New Funnel',
        type: 'ai-income',
        status: 'draft',
        views: 0,
        conversions: 0,
        revenue: 0,
        created: new Date().toISOString(),
        lastModified: new Date().toISOString()
    };
    
    userFunnels.push(newFunnel);
    saveFunnels();
    loadUserData();
    
    // Redirect to editor (in real app)
    showNotification('New funnel created! Opening editor...', 'success');
    setTimeout(() => {
        // window.location.href = `editor.html?id=${newFunnel.id}`;
        showNotification('Editor would open here in full implementation', 'info');
    }, 1500);
}

function createFromTemplate() {
    closeCreateFunnel();
    showModal('template-browser-modal');
    loadTemplateBrowser();
}

function importFunnel() {
    closeCreateFunnel();
    showNotification('Import feature coming soon!', 'info');
}

function editFunnel(id) {
    showNotification(`Opening editor for funnel ${id}...`, 'info');
    // In real app: window.location.href = `editor.html?id=${id}`;
}

function viewFunnel(id) {
    const funnel = userFunnels.find(f => f.id === id);
    if (funnel) {
        showNotification(`Opening funnel: ${funnel.name}`, 'info');
        // In real app: window.open(`funnel.html?id=${id}`, '_blank');
    }
}

function deleteFunnel(id) {
    if (confirm('Are you sure you want to delete this funnel?')) {
        userFunnels = userFunnels.filter(f => f.id !== id);
        saveFunnels();
        loadUserData();
        showNotification('Funnel deleted successfully!', 'success');
    }
}

// Template functions
function browseTemplates() {
    showModal('template-browser-modal');
    loadTemplateBrowser();
}

function loadTemplateBrowser() {
    const container = document.getElementById('templates-browser');
    
    // Extended template list for browser
    const allTemplates = [
        ...featuredTemplates,
        {
            id: 4,
            name: "SaaS Product Launch",
            category: "ai-income",
            description: "Perfect for software product launches",
            preview: "💻"
        },
        {
            id: 5,
            name: "Trading Course Funnel",
            category: "crypto-wealth",
            description: "Sell your trading expertise",
            preview: "📈"
        },
        {
            id: 6,
            name: "Mobile App Landing",
            category: "app-empire",
            description: "Convert visitors to app downloads",
            preview: "📲"
        }
    ];
    
    container.innerHTML = allTemplates.map(template => `
        <div class="template-card">
            <div class="template-preview">
                ${template.preview}
            </div>
            <div class="template-content">
                <h3 class="template-title">${template.name}</h3>
                <p class="template-description">${template.description}</p>
                <div class="template-actions">
                    <button class="btn-secondary" onclick="previewTemplate(${template.id})">
                        Preview
                    </button>
                    <button class="btn-primary" onclick="useTemplate(${template.id})">
                        Use Template
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function previewTemplate(id) {
    showNotification(`Previewing template ${id}...`, 'info');
}

function useTemplate(id) {
    // Check plan limits
    if (currentUser.plan === 'basic' && currentUser.limits && userFunnels.length >= currentUser.limits.funnels) {
        showUpgradeModal();
        return;
    }
    
    const template = featuredTemplates.find(t => t.id === id);
    if (!template) return;
    
    // Create funnel from template
    const newFunnel = {
        id: Date.now(),
        name: template.name + ' Funnel',
        type: template.category,
        status: 'draft',
        views: 0,
        conversions: 0,
        revenue: 0,
        created: new Date().toISOString(),
        lastModified: new Date().toISOString()
    };
    
    userFunnels.push(newFunnel);
    saveFunnels();
    loadUserData();
    
    closeTemplateBrowser();
    showNotification(`Funnel created from ${template.name} template!`, 'success');
}

// Filter functions
function filterFunnels(status) {
    const filteredFunnels = status === 'all' ? 
        userFunnels : 
        userFunnels.filter(f => f.status === status);
    
    // Re-render with filtered funnels
    const container = document.getElementById('user-funnels');
    container.innerHTML = filteredFunnels.map(funnel => `
        <div class="funnel-card">
            <div class="funnel-card-header">
                <h3 class="funnel-card-title">${funnel.name}</h3>
                <div class="funnel-card-meta">
                    <span class="funnel-status ${funnel.status}">${funnel.status}</span>
                    <span>${formatDate(funnel.lastModified)}</span>
                </div>
            </div>
            <div class="funnel-card-body">
                <div class="funnel-stats">
                    <div class="funnel-stat">
                        <div class="funnel-stat-value">${funnel.views || 0}</div>
                        <div class="funnel-stat-label">Views</div>
                    </div>
                    <div class="funnel-stat">
                        <div class="funnel-stat-value">${funnel.conversions || 0}</div>
                        <div class="funnel-stat-label">Conversions</div>
                    </div>
                </div>
                <div class="funnel-card-actions">
                    <button class="action-btn edit" onclick="editFunnel(${funnel.id})">
                        Edit
                    </button>
                    <button class="action-btn view" onclick="viewFunnel(${funnel.id})">
                        View
                    </button>
                    <button class="action-btn delete" onclick="deleteFunnel(${funnel.id})">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterTemplates(category) {
    // Filter template display by category
    const templateCards = document.querySelectorAll('#templates-browser .template-card');
    templateCards.forEach((card, index) => {
        const template = featuredTemplates[index];
        if (category === 'all' || template.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Upgrade functions
function showUpgradeModal() {
    showModal('upgrade-modal');
}

function closeUpgradeModal() {
    closeModal('upgrade-modal');
}

function upgradeToPro() {
    // Simulate upgrade process
    showNotification('Upgrading to Pro...', 'info');
    
    setTimeout(() => {
        // Update user plan
        currentUser.plan = 'pro';
        currentUser.permissions = ['create_funnels', 'edit_funnels', 'analytics', 'templates'];
        currentUser.limits = null;
        
        // Update session storage
        const sessionData = {
            user: currentUser,
            timestamp: Date.now()
        };
        localStorage.setItem('funnelmaster_session', JSON.stringify(sessionData));
        
        // Update UI
        updateUserInfo();
        document.getElementById('upgrade-notice').style.display = 'none';
        
        closeUpgradeModal();
        showNotification('Successfully upgraded to Pro! 🎉', 'success');
    }, 2000);
}

// Modal functions
function showModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function closeCreateFunnel() {
    closeModal('create-funnel-modal');
}

function closeTemplateBrowser() {
    closeModal('template-browser-modal');
}

// Utility functions
function saveFunnels() {
    localStorage.setItem(`funnels_${currentUser.id}`, JSON.stringify(userFunnels));
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('funnelmaster_session');
        sessionStorage.removeItem('funnelmaster_session');
        window.location.href = 'login.html';
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;

    // Add styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1001;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        min-width: 300px;
        animation: slideInRight 0.3s ease-out;
        ${type === 'success' ? 'background: #10b981;' : 
          type === 'error' ? 'background: #ef4444;' : 
          'background: #3b82f6;'}
    `;

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// Add notification animations if not already added
if (!document.querySelector('#notification-styles')) {
    const notificationStyles = document.createElement('style');
    notificationStyles.id = 'notification-styles';
    notificationStyles.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .notification button {
            background: none;
            border: none;
            color: white;
            font-size: 1.25rem;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
        }
        
        .notification button:hover {
            background: rgba(255, 255, 255, 0.2);
        }
    `;
    document.head.appendChild(notificationStyles);
}