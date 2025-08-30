// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const menu = document.getElementById('menu');

mobileMenuToggle?.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    menu.classList.toggle('active');
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target?.scrollIntoView({ behavior: 'smooth' });
    });
});

// Load popular books
document.addEventListener('DOMContentLoaded', () => {
    const popularBooksContainer = document.getElementById('popular-books');
    
    if (popularBooksContainer && typeof BOOKS_DATA !== 'undefined') {
        const booksHTML = BOOKS_DATA.slice(0, 6).map(book => `
            <div class="book-box">
                <img src="${book.img}" alt="${book.name}" class="book-image" />
                <h3 class="book-title">${book.name}</h3>
                <div class="book-price">Rs.${book.price}</div>
                <div class="book-actions">
                    <button class="btn add-to-cart-btn" onclick="addToCart(${JSON.stringify(book).replace(/"/g, '&quot;')})">
                        <i class="fas fa-shopping-cart"></i>
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
        
        popularBooksContainer.innerHTML = booksHTML;
    }
});

// Simple cart functionality
function addToCart(book) {
    try {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find(item => item.name === book.name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...book, quantity: 1, id: Date.now() });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        showNotification('Book added to cart!');
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('Failed to add book to cart');
    }
}

// Simple notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        background: var(--primary); color: var(--bg-primary);
        padding: 1rem 2rem; border-radius: var(--border-radius);
        box-shadow: var(--shadow); z-index: 10000;
        opacity: 0; transform: translateX(100%);
        transition: var(--transition);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
