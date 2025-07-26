// Admin Panel JavaScript

// Sample data structures
let funnels = [
    {
        id: 1001,
        name: "AI Income Blueprint v2",
        type: "ai-income",
        status: "published",
        conversions: 156,
        revenue: 12450,
        created: "2025-01-15",
        lastModified: "2025-01-20"
    },
    {
        id: 1002,
        name: "Crypto Wealth Builder",
        type: "crypto-wealth",
        status: "draft",
        conversions: 89,
        revenue: 8900,
        created: "2025-01-18",
        lastModified: "2025-01-22"
    },
    {
        id: 1003,
        name: "App Empire Master",
        type: "app-empire",
        status: "published",
        conversions: 234,
        revenue: 18750,
        created: "2025-01-10",
        lastModified: "2025-01-25"
    }
];

let templates = [
    {
        id: 1,
        name: "Tech Product Launch",
        category: "ai-income",
        description: "Perfect for AI and tech product launches",
        uses: 45
    },
    {
        id: 2,
        name: "Financial Services",
        category: "crypto-wealth",
        description: "Optimized for financial and investment products",
        uses: 32
    },
    {
        id: 3,
        name: "Digital Products",
        category: "app-empire",
        description: "Great for apps and digital tools",
        uses: 67
    }
];

let users = [
    {
        id: 1,
        name: "John Smith",
        email: "john@example.com",
        plan: "pro",
        funnels: 8,
        status: "active",
        joined: "2024-12-15"
    },
    {
        id: 2,
        name: "Sarah Johnson",
        email: "sarah@example.com",
        plan: "basic",
        funnels: 3,
        status: "active",
        joined: "2025-01-20"
    },
    {
        id: 3,
        name: "Mike Wilson",
        email: "mike@example.com",
        plan: "basic",
        funnels: 2,
        status: "inactive",
        joined: "2025-01-10"
    }
];

// Current editing state
let currentFunnel = null;
let currentPage = 'landing';

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    // Set up navigation
    setupNavigation();
    
    // Load initial data
    loadFunnels();
    loadTemplates();
    loadUsers();
    
    // Set up page editor
    setupPageEditor();
});

// Navigation setup
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.dataset.section + '-section';
            showSection(sectionId);
        });
    });
}

// Show specific section
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// Load funnels
function loadFunnels() {
    const container = document.getElementById('funnels-grid');
    if (!container) return;
    
    container.innerHTML = funnels.map(funnel => `
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
                        <div class="funnel-stat-value">${funnel.conversions}</div>
                        <div class="funnel-stat-label">Conversions</div>
                    </div>
                    <div class="funnel-stat">
                        <div class="funnel-stat-value">$${funnel.revenue.toLocaleString()}</div>
                        <div class="funnel-stat-label">Revenue</div>
                    </div>
                </div>
                <div class="funnel-card-actions">
                    <button class="action-btn edit" onclick="editFunnel(${funnel.id})">
                        <span class="icon-brain"></span>
                        Edit
                    </button>
                    ${funnel.status === 'published' ? 
                        `<button class="action-btn view" onclick="viewPublishedFunnel(${funnel.id}, '${funnel.type}')">
                            <span class="icon-target"></span>
                            View Live
                        </button>` :
                        `<button class="action-btn clone" onclick="cloneFunnel(${funnel.id})">
                            <span class="icon-target"></span>
                            Clone
                        </button>`
                    }
                    <button class="action-btn delete" onclick="deleteFunnel(${funnel.id})">
                        <span class="icon-mobile"></span>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Load templates
function loadTemplates() {
    const container = document.getElementById('templates-grid');
    if (!container) return;
    
    container.innerHTML = templates.map(template => `
        <div class="template-card">
            <div class="template-preview">
                <span class="icon-${template.category === 'ai-income' ? 'brain' : template.category === 'crypto-wealth' ? 'crypto' : 'mobile'}"></span>
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

// Load users
function loadUsers() {
    const tbody = document.getElementById('users-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>
                <div class="user-info-cell">
                    <div class="user-avatar-small">${user.name.split(' ').map(n => n[0]).join('')}</div>
                    <div>
                        <div>${user.name}</div>
                        <div style="font-size: 0.875rem; color: #6b7280;">${user.email}</div>
                    </div>
                </div>
            </td>
            <td>
                <span class="plan-badge ${user.plan}">${user.plan}</span>
            </td>
            <td>${user.funnels}</td>
            <td>
                <span class="status-badge ${user.status}">${user.status}</span>
            </td>
            <td>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="action-btn edit" onclick="editUser(${user.id})">Edit</button>
                    <button class="action-btn delete" onclick="deleteUser(${user.id})">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Funnel management functions
function createNewFunnel() {
    currentFunnel = null;
    document.getElementById('funnel-name').value = '';
    document.getElementById('product-type').value = 'ai-income';
    document.getElementById('funnel-status').value = 'draft';
    
    showModal('funnel-editor-modal');
    loadPageEditor('landing');
}

function editFunnel(id) {
    currentFunnel = funnels.find(f => f.id === id);
    if (!currentFunnel) return;
    
    document.getElementById('funnel-name').value = currentFunnel.name;
    document.getElementById('product-type').value = currentFunnel.type;
    document.getElementById('funnel-status').value = currentFunnel.status;
    
    showModal('funnel-editor-modal');
    loadPageEditor('landing');
}

function cloneFunnel(id) {
    const funnel = funnels.find(f => f.id === id);
    if (!funnel) return;
    
    const newFunnel = {
        ...funnel,
        id: Date.now(),
        name: funnel.name + ' (Copy)',
        status: 'draft',
        conversions: 0,
        revenue: 0,
        created: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0]
    };
    
    funnels.push(newFunnel);
    loadFunnels();
    
    showNotification('Funnel cloned successfully!', 'success');
}

function deleteFunnel(id) {
    if (confirm('Are you sure you want to delete this funnel?')) {
        funnels = funnels.filter(f => f.id !== id);
        loadFunnels();
        showNotification('Funnel deleted successfully!', 'success');
    }
}

// View published funnel in clean mode
function viewPublishedFunnel(funnelId, productType) {
    const publishedUrl = `index.html?published=true&funnel=${funnelId}&product=${productType}`;
    
    // Show URL for copying
    showPublishedUrlModal(publishedUrl, funnelId);
}

// Show published URL modal
function showPublishedUrlModal(url, funnelId) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Published Funnel URL</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <p>Your funnel is published! Share this clean URL with your audience:</p>
                
                <div style="background: #f9fafb; padding: 1rem; border-radius: 8px; margin: 1rem 0; font-family: monospace; word-break: break-all;">
                    ${window.location.origin}/${url}
                </div>
                
                <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                    <button class="btn-primary" onclick="copyToClipboard('${url}')">
                        <span class="icon-target"></span>
                        Copy URL
                    </button>
                    <button class="btn-secondary" onclick="window.open('${url}', '_blank')">
                        <span class="icon-mobile"></span>
                        Preview
                    </button>
                </div>
                
                <div style="background: #eff6ff; padding: 1rem; border-radius: 8px; border-left: 4px solid #3b82f6;">
                    <p style="margin: 0; color: #1e40af; font-size: 0.875rem;">
                        <strong>Note:</strong> This URL shows a clean funnel without admin components - perfect for sharing with customers!
                    </p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Auto-remove when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Copy URL to clipboard
function copyToClipboard(url) {
    const fullUrl = `${window.location.origin}/${url}`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(fullUrl).then(() => {
            showNotification('URL copied to clipboard!', 'success');
        }).catch(() => {
            fallbackCopyTextToClipboard(fullUrl);
        });
    } else {
        fallbackCopyTextToClipboard(fullUrl);
    }
}

// Fallback copy function
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Make it invisible
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('URL copied to clipboard!', 'success');
    } catch (err) {
        showNotification('Failed to copy URL. Please copy manually.', 'error');
    }
    
    document.body.removeChild(textArea);
}

function saveFunnel() {
    const name = document.getElementById('funnel-name').value;
    const type = document.getElementById('product-type').value;
    const status = document.getElementById('funnel-status').value;
    
    if (!name.trim()) {
        showNotification('Please enter a funnel name', 'error');
        return;
    }
    
    if (currentFunnel) {
        // Update existing funnel
        currentFunnel.name = name;
        currentFunnel.type = type;
        currentFunnel.status = status;
        currentFunnel.lastModified = new Date().toISOString().split('T')[0];
    } else {
        // Create new funnel
        const newFunnel = {
            id: Date.now(),
            name: name,
            type: type,
            status: status,
            conversions: 0,
            revenue: 0,
            created: new Date().toISOString().split('T')[0],
            lastModified: new Date().toISOString().split('T')[0]
        };
        funnels.push(newFunnel);
    }
    
    loadFunnels();
    closeModal('funnel-editor-modal');
    showNotification('Funnel saved successfully!', 'success');
}

// Page editor setup
function setupPageEditor() {
    const pageTabs = document.querySelectorAll('.page-tab');
    
    pageTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            pageTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Load page editor
            const page = this.dataset.page;
            loadPageEditor(page);
        });
    });
}

function loadPageEditor(page) {
    currentPage = page;
    const editor = document.getElementById('page-editor');
    
    const pageConfigs = {
        landing: {
            title: 'Landing Page Settings',
            fields: [
                { label: 'Main Headline', type: 'text', id: 'headline', placeholder: 'Enter main headline' },
                { label: 'Subheadline', type: 'textarea', id: 'subheadline', placeholder: 'Enter subheadline' },
                { label: 'Lead Magnet Title', type: 'text', id: 'lead-magnet', placeholder: 'Free guide title' },
                { label: 'CTA Button Text', type: 'text', id: 'cta-text', placeholder: 'Button text' }
            ]
        },
        thankyou: {
            title: 'Thank You Page Settings',
            fields: [
                { label: 'Page Title', type: 'text', id: 'ty-title', placeholder: 'Thank you title' },
                { label: 'Confirmation Message', type: 'textarea', id: 'ty-message', placeholder: 'Confirmation message' },
                { label: 'Next Step CTA', type: 'text', id: 'ty-cta', placeholder: 'Next step button' }
            ]
        },
        tripwire: {
            title: 'Tripwire Offer Settings',
            fields: [
                { label: 'Offer Title', type: 'text', id: 'tw-title', placeholder: 'Tripwire offer title' },
                { label: 'Price', type: 'number', id: 'tw-price', placeholder: '47' },
                { label: 'Original Value', type: 'number', id: 'tw-value', placeholder: '297' },
                { label: 'Guarantee Text', type: 'textarea', id: 'tw-guarantee', placeholder: 'Money back guarantee' }
            ]
        },
        upsell: {
            title: 'Upsell Page Settings',
            fields: [
                { label: 'Upsell Title', type: 'text', id: 'us-title', placeholder: 'Upsell title' },
                { label: 'Upsell Price', type: 'number', id: 'us-price', placeholder: '197' },
                { label: 'Savings Amount', type: 'number', id: 'us-savings', placeholder: '100' },
                { label: 'Features List', type: 'textarea', id: 'us-features', placeholder: 'List features (one per line)' }
            ]
        },
        backend: {
            title: 'Backend Offers Settings',
            fields: [
                { label: 'Tier 1 Name', type: 'text', id: 'be-tier1-name', placeholder: 'Coaching program name' },
                { label: 'Tier 1 Price', type: 'number', id: 'be-tier1-price', placeholder: '997' },
                { label: 'Tier 2 Name', type: 'text', id: 'be-tier2-name', placeholder: 'Premium program name' },
                { label: 'Tier 2 Price', type: 'number', id: 'be-tier2-price', placeholder: '2997' }
            ]
        }
    };
    
    const config = pageConfigs[page];
    
    editor.innerHTML = `
        <h5>${config.title}</h5>
        ${config.fields.map(field => `
            <div class="form-group">
                <label>${field.label}</label>
                ${field.type === 'textarea' ? 
                    `<textarea id="${field.id}" placeholder="${field.placeholder}" rows="3"></textarea>` :
                    `<input type="${field.type}" id="${field.id}" placeholder="${field.placeholder}">`
                }
            </div>
        `).join('')}
    `;
}

// Template functions
function previewTemplate(id) {
    const template = templates.find(t => t.id === id);
    if (!template) return;
    
    showNotification(`Previewing ${template.name}`, 'info');
}

function useTemplate(id) {
    const template = templates.find(t => t.id === id);
    if (!template) return;
    
    // Create new funnel from template
    currentFunnel = null;
    document.getElementById('funnel-name').value = template.name + ' Funnel';
    document.getElementById('product-type').value = template.category;
    document.getElementById('funnel-status').value = 'draft';
    
    showModal('funnel-editor-modal');
    loadPageEditor('landing');
    
    showNotification(`Template "${template.name}" loaded!`, 'success');
}

function createTemplate() {
    showNotification('Template creation feature coming soon!', 'info');
}

// User management functions
function inviteUser() {
    showModal('user-invite-modal');
}

function sendInvite() {
    const email = document.getElementById('invite-email').value;
    const plan = document.getElementById('invite-plan').value;
    
    if (!email.trim()) {
        showNotification('Please enter an email address', 'error');
        return;
    }
    
    // Add new user
    const newUser = {
        id: Date.now(),
        name: email.split('@')[0],
        email: email,
        plan: plan,
        funnels: 0,
        status: 'active',
        joined: new Date().toISOString().split('T')[0]
    };
    
    users.push(newUser);
    loadUsers();
    closeModal('user-invite-modal');
    showNotification('User invited successfully!', 'success');
    
    // Clear form
    document.getElementById('invite-email').value = '';
}

function editUser(id) {
    showNotification('User editing feature coming soon!', 'info');
}

function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        users = users.filter(u => u.id !== id);
        loadUsers();
        showNotification('User deleted successfully!', 'success');
    }
}

// Modal functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

function closeFunnelEditor() {
    closeModal('funnel-editor-modal');
}

function closeUserInvite() {
    closeModal('user-invite-modal');
}

// Preview funnel
function previewFunnel() {
    const iframe = document.getElementById('preview-iframe');
    if (iframe) {
        iframe.src = 'index.html?' + Date.now(); // Add timestamp to refresh
    }
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
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

// Add CSS for notifications
const notificationStyles = document.createElement('style');
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

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});