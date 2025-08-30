let isSignUpMode = false;

// Switch between sign in and sign up
function switchMode() {
    const formTitle = document.getElementById('form-title');
    const authBtn = document.getElementById('auth-btn');
    const nameGroup = document.getElementById('name-group');
    const switchText = document.getElementById('switch-text');
    
    isSignUpMode = !isSignUpMode;
    
    if (isSignUpMode) {
        formTitle.textContent = 'Sign Up';
        authBtn.textContent = 'Sign Up';
        nameGroup.style.display = 'block';
        switchText.innerHTML = 'Already have an account? <a href="#" onclick="switchMode()">Sign In</a>';
    } else {
        formTitle.textContent = 'Sign In';
        authBtn.textContent = 'Sign In';
        nameGroup.style.display = 'none';
        switchText.innerHTML = 'Don\'t have an account? <a href="#" onclick="switchMode()">Sign Up</a>';
    }
}

// Handle form submission
function handleAuthSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    
    if (isSignUpMode) {
        // Sign up logic
        if (name && email && password) {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            // Check if user already exists
            if (users.find(user => user.email === email)) {
                alert('User already exists with this email');
                return;
            }
            
            // Add new user
            users.push({ name, email, password, id: Date.now() });
            localStorage.setItem('users', JSON.stringify(users));
            
            alert('Account created successfully! Please sign in.');
            switchMode();
            document.getElementById('auth-form').reset();
        } else {
            alert('Please fill all fields');
        }
    } else {
        // Sign in logic
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(user => user.email === email && user.password === password);
        
        if (user) {
            // Store current user session
            localStorage.setItem('currentUser', JSON.stringify(user));
            alert(`Welcome back, ${user.name}!`);
            window.location.href = 'index.html';
        } else {
            alert('Invalid email or password');
        }
    }
}

// Check if user is already logged in
function checkExistingLogin() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        if (confirm(`You're already logged in as ${user.name}. Do you want to continue to home page?`)) {
            window.location.href = 'index.html';
        } else {
            localStorage.removeItem('currentUser');
        }
    }
}

// Initialize login functionality
document.addEventListener('DOMContentLoaded', () => {
    checkExistingLogin();
    
    // Bind form submit event
    const authForm = document.getElementById('auth-form');
    if (authForm) {
        authForm.addEventListener('submit', handleAuthSubmit);
    }
});
