// Authentication system
let isSignUpMode = false;

document.addEventListener('DOMContentLoaded', () => {
    checkExistingLogin();
    initFormHandlers();
    addFormAnimations();
});

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

function initFormHandlers() {
    const authForm = document.getElementById('auth-form');
    if (authForm) {
        authForm.addEventListener('submit', handleAuthSubmit);
    }
    
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && document.activeElement.tagName === 'INPUT') {
            const form = document.getElementById('auth-form');
            if (form) {
                handleAuthSubmit(e);
            }
        }
    });
}

function handleAuthSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value.trim();
    
    const errors = validateForm(email, password, name);
    const formElement = document.getElementById('auth-form');
    
    if (errors.length > 0) {
        FormValidator.showErrors(errors, formElement);
        return;
    }
    
    FormValidator.showErrors([], formElement);
    
    const submitBtn = document.getElementById('auth-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        if (isSignUpMode) {
            handleSignUp(name, email, password);
        } else {
            handleSignIn(email, password);
        }
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1000);
}

function validateForm(email, password, name = '') {
    const errors = [];
    
    if (!email) {
        errors.push('Email is required');
    } else if (!FormValidator.validateEmail(email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!FormValidator.validatePassword(password)) {
        errors.push('Password must be at least 6 characters long');
    }
    
    if (isSignUpMode && !name.trim()) {
        errors.push('Full name is required');
    }
    
    return errors;
}

function handleSignUp(name, email, password) {
    try {
        const users = Storage.get('users', []);
        
        if (users.find(user => user.email === email)) {
            NotificationManager.show('An account with this email already exists. Please sign in instead.', 'warning');
            return;
        }
        
        const newUser = { 
            id: Date.now(), 
            name, 
            email, 
            password, 
            joinDate: new Date().toISOString() 
        };
        
        users.push(newUser);
        Storage.set('users', users);
        
        NotificationManager.show('Account created successfully! Please sign in with your new credentials.');
        
        switchMode();
        document.getElementById('auth-form').reset();
        
    } catch (error) {
        console.error('Sign up error:', error);
        NotificationManager.show('An error occurred during sign up. Please try again.', 'error');
    }
}

function handleSignIn(email, password) {
    try {
        const users = Storage.get('users', []);
        const user = users.find(user => user.email === email && user.password === password);
        
        if (user) {
            Storage.set('currentUser', {
                ...user,
                loginTime: new Date().toISOString()
            });
            
            NotificationManager.show(`Welcome back, ${user.name}! Redirecting to home page...`);
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
            
        } else {
            NotificationManager.show('Invalid email or password. Please check your credentials and try again.', 'error');
        }
    } catch (error) {
        console.error('Sign in error:', error);
        NotificationManager.show('An error occurred during sign in. Please try again.', 'error');
    }
}

function checkExistingLogin() {
    const currentUser = Storage.get('currentUser');
    if (currentUser) {
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
                            <h5>Welcome back, ${currentUser.name}!</h5>
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
    }
}

function logout() {
    Storage.remove('currentUser');
    document.getElementById('existingLoginModal').remove();
    NotificationManager.show('Logged out successfully. You can now sign in with a different account.', 'info');
}

function goToHome() {
    window.location.href = 'index.html';
}

function addFormAnimations() {
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
