let isSignUpMode = false;

// Switch between sign in and sign up with Bootstrap styling
function switchMode() {
    const formTitle = document.getElementById('form-title');
    const authBtn = document.getElementById('auth-btn');
    const nameGroup = document.getElementById('name-group');
    const switchText = document.getElementById('switch-text');
    
    isSignUpMode = !isSignUpMode;
    
    if (isSignUpMode) {
        formTitle.innerHTML = '<i class="fa-solid fa-user-plus me-2"></i>Sign Up';
        authBtn.innerHTML = '<i class="fa-solid fa-user-plus me-2"></i>Sign Up';
        nameGroup.style.display = 'block';
        switchText.innerHTML = 'Already have an account? <a href="#" onclick="switchMode()" class="text-success text-decoration-none fw-bold">Sign In</a>';
    } else {
        formTitle.innerHTML = '<i class="fa-solid fa-user-circle me-2"></i>Sign In';
        authBtn.innerHTML = '<i class="fa-solid fa-sign-in-alt me-2"></i>Sign In';
        nameGroup.style.display = 'none';
        switchText.innerHTML = 'Don\'t have an account? <a href="#" onclick="switchMode()" class="text-success text-decoration-none fw-bold">Sign Up</a>';
    }
}

// Enhanced form validation
function validateForm(email, password, name = '') {
    const errors = [];
    
    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        errors.push('Email is required');
    } else if (!emailPattern.test(email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Password validation
    if (!password) {
        errors.push('Password is required');
    } else if (password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }
    
    // Name validation for sign up
    if (isSignUpMode && !name.trim()) {
        errors.push('Full name is required');
    }
    
    return errors;
}

// Show form validation errors
function showFormErrors(errors) {
    const existingAlert = document.querySelector('.alert-danger');
    if (existingAlert) existingAlert.remove();
    
    if (errors.length > 0) {
        const alertHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="fas fa-exclamation-circle me-2"></i>
                <ul class="mb-0">
                    ${errors.map(error => `<li>${error}</li>`).join('')}
                </ul>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        const form = document.getElementById('auth-form');
        form.insertAdjacentHTML('beforebegin', alertHTML);
    }
}

// Handle form submission with enhanced UX
function handleAuthSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value.trim();
    
    // Validate form
    const errors = validateForm(email, password, name);
    if (errors.length > 0) {
        showFormErrors(errors);
        return;
    }
    
    // Clear any existing errors
    showFormErrors([]);
    
    // Show loading state
    const submitBtn = document.getElementById('auth-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
    submitBtn.disabled = true;
    
    // Simulate API delay
    setTimeout(() => {
        if (isSignUpMode) {
            handleSignUp(name, email, password);
        } else {
            handleSignIn(email, password);
        }
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1000);
}

// Handle sign up
function handleSignUp(name, email, password) {
    try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if user already exists
        if (users.find(user => user.email === email)) {
            showBootstrapAlert('An account with this email already exists. Please sign in instead.', 'warning');
            return;
        }
        
        // Add new user
        const newUser = { 
            id: Date.now(), 
            name, 
            email, 
            password, 
            joinDate: new Date().toISOString() 
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        showBootstrapAlert('Account created successfully! Please sign in with your new credentials.', 'success');
        
        // Switch to sign in mode and clear form
        switchMode();
        document.getElementById('auth-form').reset();
        
    } catch (error) {
        console.error('Sign up error:', error);
        showBootstrapAlert('An error occurred during sign up. Please try again.', 'danger');
    }
}

// Handle sign in
function handleSignIn(email, password) {
    try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(user => user.email === email && user.password === password);
        
        if (user) {
            // Store current user session
            localStorage.setItem('currentUser', JSON.stringify({
                ...user,
                loginTime: new Date().toISOString()
            }));
            
            showBootstrapAlert(`Welcome back, ${user.name}! Redirecting to home page...`, 'success');
            
            // Redirect after short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
            
        } else {
            showBootstrapAlert('Invalid email or password. Please check your credentials and try again.', 'danger');
        }
    } catch (error) {
        console.error('Sign in error:', error);
        showBootstrapAlert('An error occurred during sign in. Please try again.', 'danger');
    }
}

// Bootstrap alert system
function showBootstrapAlert(message, type = 'info') {
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) existingAlert.remove();
    
    const alertHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'danger' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    const form = document.getElementById('auth-form');
    form.insertAdjacentHTML('beforebegin', alertHTML);
    
    // Auto-dismiss success messages
    if (type === 'success') {
        setTimeout(() => {
            const alert = document.querySelector('.alert');
            if (alert) {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }
        }, 5000);
    }
}

// Check if user is already logged in
function checkExistingLogin() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        try {
            const user = JSON.parse(currentUser);
            
            // Create Bootstrap modal for existing login
            const modalHTML = `
                <div class="modal fade" id="existingLoginModal" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header bg-info text-white">
                                <h5 class="modal-title">
                                    <i class="fas fa-user-check me-2"></i>Already Logged In
                                </h5>
                            </div>
                            <div class="modal-body text-center">
                                <i class="fas fa-user-circle fa-3x text-success mb-3"></i>
                                <h5>Welcome back, ${user.name}!</h5>
                                <p class="text-muted">You're already logged in. Would you like to continue to the home page?</p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" onclick="logout()">
                                    <i class="fas fa-sign-out-alt me-2"></i>Sign Out
                                </button>
                                <button type="button" class="btn btn-success" onclick="goToHome()">
                                    <i class="fas fa-home me-2"></i>Go to Home
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            const modal = new bootstrap.Modal(document.getElementById('existingLoginModal'), {
                backdrop: 'static',
                keyboard: false
            });
            modal.show();
            
        } catch (error) {
            console.error('Error parsing current user:', error);
            localStorage.removeItem('currentUser');
        }
    }
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    document.getElementById('existingLoginModal').remove();
    showBootstrapAlert('Logged out successfully. You can now sign in with a different account.', 'info');
}

// Go to home function
function goToHome() {
    window.location.href = 'index.html';
}

// Add loading animation to form
function addFormLoadingAnimation() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('shadow-sm');
        });
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('shadow-sm');
        });
    });
}

// Initialize login functionality
document.addEventListener('DOMContentLoaded', () => {
    checkExistingLogin();
    addFormLoadingAnimation();
    
    // Bind form submit event
    const authForm = document.getElementById('auth-form');
    if (authForm) {
        authForm.addEventListener('submit', handleAuthSubmit);
    }
    
    // Add enter key support for better UX
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && document.activeElement.tagName === 'INPUT') {
            const form = document.getElementById('auth-form');
            if (form) {
                handleAuthSubmit(e);
            }
        }
    });
});
