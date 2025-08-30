// Simple search functionality
class SimpleBookFilter {
    constructor() {
        this.books = typeof BOOKS_DATA !== 'undefined' ? BOOKS_DATA : [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.displayBooks(this.books);
    }

    bindEvents() {
        const searchInput = document.getElementById('txtSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e));
        }
    }

    handleSearch(event) {
        const searchTerm = event.target.value.toLowerCase().trim();
        
        if (searchTerm) {
            const filtered = this.books.filter(book => 
                book.name.toLowerCase().includes(searchTerm) ||
                book.series.toLowerCase().includes(searchTerm)
            );
            this.displayBooks(filtered);
        } else {
            this.displayBooks(this.books);
        }
    }

    displayBooks(books) {
        const container = document.querySelector('.products');
        if (!container) return;

        if (books.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <h3>No books found</h3>
                    <p>Try searching with different keywords</p>
                </div>
            `;
            return;
        }

        const booksHTML = books.map(book => `
            <div class="book-box">
                <img src="${book.img}" alt="${book.name}" class="book-image" />
                <h3 class="book-title">${book.name}</h3>
                <p class="book-price">Rs.${book.price}</p>
                <p style="color: var(--text-secondary); margin-bottom: var(--space-sm);">${book.series}</p>
                <div class="book-actions">
                    <button class="btn add-to-cart-btn" onclick="addToCart(${JSON.stringify(book).replace(/"/g, '&quot;')})">
                        <i class="fas fa-shopping-cart"></i>
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');

        container.innerHTML = booksHTML;
    }
}

// Cart functionality
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

// Notification system
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (typeof BOOKS_DATA === 'undefined') {
        console.error('BOOKS_DATA not found. Make sure books.js is loaded.');
        return;
    }
    new SimpleBookFilter();
});