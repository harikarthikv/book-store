// Smooth scrolling for anchor links (Bootstrap navbar)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navbarHeight;
            window.scrollTo({ 
                top: targetPosition, 
                behavior: 'smooth' 
            });
        }
    });
});

// Load popular books with Bootstrap cards
document.addEventListener('DOMContentLoaded', () => {
    const popularBooksContainer = document.getElementById('popular-books');
    
    if (popularBooksContainer && typeof BOOKS_DATA !== 'undefined') {
        const booksHTML = BOOKS_DATA.slice(0, 6).map(book => `
            <div class="col-md-6 col-lg-4">
                <div class="card h-100 shadow-sm border-0 book-card">
                    <img src="${book.img}" alt="${book.name}" class="card-img-top" style="height: 300px; object-fit: cover;"/>
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title text-truncate" title="${book.name}">${book.name}</h5>
                        <p class="card-text text-muted small mb-2">by ${book.author}</p>
                        <div class="mt-auto">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <span class="h5 text-success mb-0">₹${book.price}</span>
                                <span class="badge bg-secondary">${book.series}</span>
                            </div>
                            <button class="btn btn-success w-100" onclick="addToCart(${JSON.stringify(book).replace(/"/g, '&quot;')})">
                                <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        popularBooksContainer.innerHTML = booksHTML;
    }
});

// Enhanced cart functionality with Bootstrap notifications
function addToCart(book) {
    try {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find(item => item.name === book.name);
        
        if (existingItem) {
            existingItem.quantity += 1;
            showBootstrapNotification(`Updated quantity of "${book.name}" in cart!`, 'success');
        } else {
            cart.push({ ...book, quantity: 1, id: Date.now() });
            showBootstrapNotification(`"${book.name}" added to cart!`, 'success');
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    } catch (error) {
        console.error('Error adding to cart:', error);
        showBootstrapNotification('Failed to add book to cart', 'danger');
    }
}

// Bootstrap toast notification system
function showBootstrapNotification(message, type = 'success') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());
    
    const toastHTML = `
        <div class="toast align-items-center text-white bg-${type} border-0 position-fixed" 
             style="top: 100px; right: 20px; z-index: 9999;" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fas fa-check-circle me-2"></i>${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', toastHTML);
    
    // Show the toast
    const toastElement = document.querySelector('.toast:last-of-type');
    const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
    toast.show();
    
    // Remove from DOM after hiding
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

// Update cart count in navbar
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Add badge to cart icon if items exist
    const cartLink = document.querySelector('a[href="cart.html"]');
    if (cartLink && totalItems > 0) {
        cartLink.innerHTML = `
            <i class="fa-solid fa-cart-flatbed"></i>
            <span class="badge bg-success rounded-pill ms-1">${totalItems}</span>
        `;
    }
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', updateCartCount);
