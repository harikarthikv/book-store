/* =======================
   DARK THEME ONLY SYSTEM
   ======================= */

// Simple dark theme initialization
(function() {
    // Set dark theme immediately to prevent flash
    document.documentElement.setAttribute('data-theme', 'dark');
    
    // Ensure dark theme is always applied
    document.addEventListener('DOMContentLoaded', () => {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.classList.add('bg-dark');
        
        // Update navbar classes for dark theme
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.classList.add('navbar-dark');
            navbar.classList.remove('navbar-light');
        }
    });
})();
