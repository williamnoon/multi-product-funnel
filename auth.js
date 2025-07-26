// Authentication JavaScript

// Demo user accounts
const demoAccounts = {
    admin: {
        email: 'admin@funnelmaster.com',
        password: 'admin123',
        role: 'admin',
        plan: 'admin',
        name: 'Admin User',
        permissions: ['all']
    },
    pro: {
        email: 'pro@example.com',
        password: 'pro123',
        role: 'user',
        plan: 'pro',
        name: 'Pro User',
        permissions: ['create_funnels', 'edit_funnels', 'analytics', 'templates']
    },
    basic: {
        email: 'basic@example.com',
        password: 'basic123',
        role: 'user',
        plan: 'basic',
        name: 'Basic User',
        permissions: ['create_funnels', 'edit_funnels'],
        limits: { funnels: 3 }
    }
};

// Authentication state
let isLoading = false;

// Initialize auth system
document.addEventListener('DOMContentLoaded', function() {
    setupFormHandlers();
    setupPasswordStrength();
    checkExistingSession();
});

// Setup form event handlers
function setupFormHandlers() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Signup form
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    // Forgot password form
    const forgotForm = document.getElementById('forgot-form');
    if (forgotForm) {
        forgotForm.addEventListener('submit', handleForgotPassword);
    }
}

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    
    if (isLoading) return;
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember');

    // Validate inputs
    if (!validateEmail(email)) {
        showValidationError('email', 'Please enter a valid email address');
        return;
    }

    if (!password) {
        showValidationError('password', 'Password is required');
        return;
    }

    // Show loading state
    setLoadingState(true);

    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check credentials
        const user = authenticateUser(email, password);
        
        if (user) {
            // Store session
            storeUserSession(user, remember);
            
            // Show success message
            showNotification('Login successful! Redirecting...', 'success');
            
            // Redirect based on role
            setTimeout(() => {
                if (user.role === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'dashboard.html';
                }
            }, 1500);
        } else {
            showNotification('Invalid email or password', 'error');
        }
    } catch (error) {
        showNotification('Login failed. Please try again.', 'error');
    } finally {
        setLoadingState(false);
    }
}

// Handle signup form submission
async function handleSignup(e) {
    e.preventDefault();
    
    if (isLoading) return;
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const plan = formData.get('plan');

    // Validate inputs
    if (!name.trim()) {
        showValidationError('signup-name', 'Name is required');
        return;
    }

    if (!validateEmail(email)) {
        showValidationError('signup-email', 'Please enter a valid email address');
        return;
    }

    if (password.length < 6) {
        showValidationError('signup-password', 'Password must be at least 6 characters');
        return;
    }

    // Show loading state
    setLoadingState(true, 'signup-form');

    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Create user account
        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            role: 'user',
            plan: plan,
            permissions: plan === 'pro' ? 
                ['create_funnels', 'edit_funnels', 'analytics', 'templates'] :
                ['create_funnels', 'edit_funnels'],
            limits: plan === 'basic' ? { funnels: 3 } : null,
            created: new Date().toISOString()
        };

        // Store user session
        storeUserSession(newUser, false);

        // Show success message
        showNotification('Account created successfully! Redirecting...', 'success');

        // Close signup modal and redirect
        setTimeout(() => {
            closeSignup();
            window.location.href = 'dashboard.html';
        }, 1500);

    } catch (error) {
        showNotification('Account creation failed. Please try again.', 'error');
    } finally {
        setLoadingState(false, 'signup-form');
    }
}

// Handle forgot password form submission
async function handleForgotPassword(e) {
    e.preventDefault();
    
    if (isLoading) return;
    
    const formData = new FormData(e.target);
    const email = formData.get('email');

    if (!validateEmail(email)) {
        showValidationError('forgot-email', 'Please enter a valid email address');
        return;
    }

    setLoadingState(true, 'forgot-form');

    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        showNotification('Password reset link sent to your email!', 'success');
        
        setTimeout(() => {
            closeForgotPassword();
        }, 2000);

    } catch (error) {
        showNotification('Failed to send reset link. Please try again.', 'error');
    } finally {
        setLoadingState(false, 'forgot-form');
    }
}

// Demo login function
function demoLogin(accountType) {
    const account = demoAccounts[accountType];
    if (!account) return;

    // Fill login form
    document.getElementById('email').value = account.email;
    document.getElementById('password').value = account.password;

    // Auto-submit after brief delay
    setTimeout(() => {
        document.getElementById('login-form').dispatchEvent(new Event('submit'));
    }, 500);
}

// Authenticate user
function authenticateUser(email, password) {
    // Check demo accounts
    for (const [key, account] of Object.entries(demoAccounts)) {
        if (account.email === email && account.password === password) {
            return account;
        }
    }
    
    // Check stored users (in real app, this would be API call)
    const storedUsers = JSON.parse(localStorage.getItem('funnelmaster_users') || '[]');
    return storedUsers.find(user => user.email === email && user.password === password);
}

// Store user session
function storeUserSession(user, remember) {
    const sessionData = {
        user: {
            id: user.id || Date.now(),
            name: user.name,
            email: user.email,
            role: user.role,
            plan: user.plan,
            permissions: user.permissions,
            limits: user.limits
        },
        timestamp: Date.now()
    };

    if (remember) {
        localStorage.setItem('funnelmaster_session', JSON.stringify(sessionData));
    } else {
        sessionStorage.setItem('funnelmaster_session', JSON.stringify(sessionData));
    }
}

// Check for existing session
function checkExistingSession() {
    const sessionData = 
        JSON.parse(localStorage.getItem('funnelmaster_session')) ||
        JSON.parse(sessionStorage.getItem('funnelmaster_session'));

    if (sessionData) {
        const hoursSinceLogin = (Date.now() - sessionData.timestamp) / (1000 * 60 * 60);
        
        // Session valid for 24 hours
        if (hoursSinceLogin < 24) {
            // Redirect to appropriate dashboard
            if (sessionData.user.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'dashboard.html';
            }
        } else {
            // Clear expired session
            localStorage.removeItem('funnelmaster_session');
            sessionStorage.removeItem('funnelmaster_session');
        }
    }
}

// Password strength checker
function setupPasswordStrength() {
    const passwordInput = document.getElementById('signup-password');
    if (!passwordInput) return;

    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = calculatePasswordStrength(password);
        updatePasswordStrengthUI(strength);
    });
}

function calculatePasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (password.match(/[a-z]/)) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[^a-zA-Z0-9]/)) score++;

    if (score < 2) return 'weak';
    if (score < 3) return 'fair';
    if (score < 4) return 'good';
    return 'strong';
}

function updatePasswordStrengthUI(strength) {
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    if (!strengthBar || !strengthText) return;

    strengthBar.className = `strength-bar ${strength}`;
    
    const strengthLabels = {
        weak: 'Weak password',
        fair: 'Fair password',
        good: 'Good password',
        strong: 'Strong password'
    };
    
    strengthText.textContent = strengthLabels[strength];
}

// Modal functions
function showSignup() {
    document.getElementById('signup-modal').classList.add('active');
}

function closeSignup() {
    document.getElementById('signup-modal').classList.remove('active');
}

function showForgotPassword() {
    document.getElementById('forgot-modal').classList.add('active');
}

function closeForgotPassword() {
    document.getElementById('forgot-modal').classList.remove('active');
}

// Google login (mock implementation)
function loginWithGoogle() {
    showNotification('Google login will be available soon!', 'info');
}

// Password toggle
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.password-toggle');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.innerHTML = '<span class="icon-eye-off"></span>';
    } else {
        passwordInput.type = 'password';
        toggleBtn.innerHTML = '<span class="icon-eye"></span>';
    }
}

// Loading state management
function setLoadingState(loading, formId = 'login-form') {
    isLoading = loading;
    const form = document.getElementById(formId);
    const button = form.querySelector('.auth-button');
    const buttonText = button.querySelector('.button-text');
    const buttonLoader = button.querySelector('.button-loader');

    if (loading) {
        button.disabled = true;
        buttonText.style.opacity = '0';
        buttonLoader.style.display = 'block';
    } else {
        button.disabled = false;
        buttonText.style.opacity = '1';
        buttonLoader.style.display = 'none';
    }
}

// Validation functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showValidationError(inputId, message) {
    const input = document.getElementById(inputId);
    if (!input) return;

    // Add error styling
    input.classList.add('error');
    input.classList.remove('success');

    // Remove existing validation message
    const existingMessage = input.parentNode.querySelector('.validation-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new validation message
    const validationDiv = document.createElement('div');
    validationDiv.className = 'validation-message error';
    validationDiv.textContent = message;

    // Insert after the input
    input.parentNode.insertBefore(validationDiv, input.nextSibling);

    // Remove message after 3 seconds
    setTimeout(() => {
        if (validationDiv.parentNode) {
            validationDiv.remove();
        }
        input.classList.remove('error');
    }, 3000);

    // Focus the input
    input.focus();
}

// Notification system
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
        top: 20px;
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

// Add notification animations
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