// Enhanced Bootstrap book filter
class BootstrapBookFilter {
    constructor() {
        this.books = typeof BOOKS_DATA !== 'undefined' ? BOOKS_DATA : [];
        this.filteredBooks = [...this.books];
        this.init();
    }

    init() {
        this.bindEvents();
        this.displayBooks(this.books);
        this.updateResultsCount(this.books.length);
    }

    bindEvents() {
        const searchInput = document.getElementById('txtSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e));
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleSearch(e);
                }
            });
        }
    }

    handleSearch(event) {
        const searchTerm = event.target.value.toLowerCase().trim();
        
        if (searchTerm) {
            this.filteredBooks = this.books.filter(book => 
                book.name.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm) ||
                book.series.toLowerCase().includes(searchTerm)
            );
            this.updateResultsCount(this.filteredBooks.length, searchTerm);
        } else {
            this.filteredBooks = [...this.books];
            this.updateResultsCount(this.books.length);
        }
        
        this.displayBooks(this.filteredBooks);
    }

    updateResultsCount(count, searchTerm = '') {
        const resultsCountEl = document.getElementById('results-count');
        const bookCountEl = document.getElementById('book-count');
        
        if (resultsCountEl) {
            resultsCountEl.textContent = searchTerm 
                ? `Search Results for "${searchTerm}"` 
                : 'All Books';
        }
        
        if (bookCountEl) {
            bookCountEl.textContent = `${count} book${count !== 1 ? 's' : ''}`;
        }
    }

    displayBooks(books) {
        const container = document.getElementById('book-results');
        const noResultsEl = document.getElementById('no-results');
        
        if (!container) return;

        if (books.length === 0) {
            container.innerHTML = '';
            noResultsEl?.classList.remove('d-none');
            return;
        }

        noResultsEl?.classList.add('d-none');

        const booksHTML = books.map(book => `
            <div class="col-md-6 col-lg-4 col-xl-3">
                <div class="card h-100 shadow-sm border-0 book-card" style="transition: transform 0.2s;">
                    <img src="${book.img}" alt="${book.name}" class="card-img-top" 
                         style="height: 280px; object-fit: cover;"/>
                    <div class="card-body d-flex flex-column">
                        <h6 class="card-title text-truncate" title="${book.name}">${book.name}</h6>
                        <p class="card-text text-muted small mb-1">by ${book.author}</p>
                        <p class="card-text text-muted small mb-2">${book.series}</p>
                        <div class="mt-auto">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <span class="h6 text-success mb-0">₹${book.price}</span>
                                <span class="badge bg-light text-dark">${book.series}</span>
                            </div>
                            <button class="btn btn-success btn-sm w-100" onclick="addToCart(${JSON.stringify(book).replace(/"/g, '&quot;')})">
                                <i class="fas fa-cart-plus me-2"></i>Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = booksHTML;
        
        // Add hover effect
        this.addCardHoverEffects();
    }

    addCardHoverEffects() {
        document.querySelectorAll('.book-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }
}

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
    } catch (error) {
        console.error('Error adding to cart:', error);
        showBootstrapNotification('Failed to add book to cart', 'danger');
    }
}

// Bootstrap toast notification system
function showBootstrapNotification(message, type = 'success') {
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
    
    const toastElement = document.querySelector('.toast:last-of-type');
    const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
    toast.show();
    
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

// Clear search function
function clearSearch() {
    const searchInput = document.getElementById('txtSearch');
    if (searchInput) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        searchInput.focus();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (typeof BOOKS_DATA === 'undefined') {
        console.error('BOOKS_DATA not found. Make sure books.js is loaded.');
        return;
    }
    new BootstrapBookFilter();
});