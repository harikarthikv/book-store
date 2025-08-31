// Enhanced Bootstrap cart management
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

// Display cart items with Bootstrap styling
function displayCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartEl = document.getElementById('empty-cart');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '';
        emptyCartEl?.classList.remove('d-none');
        updateCartTotals(0);
        return;
    }
    
    emptyCartEl?.classList.add('d-none');
    let total = 0;
    
    const cartHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        return `
            <div class="card mb-3 border-0 shadow-sm">
                <div class="row g-0">
                    <div class="col-md-3">
                        <img src="${item.img}" alt="${item.name}" class="img-fluid rounded-start h-100" 
                             style="object-fit: cover; min-height: 150px;">
                    </div>
                    <div class="col-md-9">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-8">
                                    <h5 class="card-title text-truncate">${item.name}</h5>
                                    <p class="card-text text-muted small mb-1">by ${item.author}</p>
                                    <p class="card-text text-muted small">${item.series}</p>
                                    <span class="badge bg-success">₹${item.price} each</span>
                                </div>
                                <div class="col-md-4">
                                    <div class="d-flex flex-column align-items-end h-100">
                                        <div class="mb-3">
                                            <strong class="h6">₹${itemTotal}</strong>
                                        </div>
                                        <div class="btn-group mb-2" role="group">
                                            <button class="btn btn-outline-secondary btn-sm" onclick="updateQuantity('${item.id}', -1)">
                                                <i class="fas fa-minus"></i>
                                            </button>
                                            <span class="btn btn-outline-secondary btn-sm disabled">${item.quantity}</span>
                                            <button class="btn btn-outline-secondary btn-sm" onclick="updateQuantity('${item.id}', 1)">
                                                <i class="fas fa-plus"></i>
                                            </button>
                                        </div>
                                        <button class="btn btn-outline-danger btn-sm" onclick="removeFromCart('${item.id}')">
                                            <i class="fas fa-trash me-1"></i>Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    cartItemsContainer.innerHTML = cartHTML;
    updateCartTotals(total);
}

// Update cart totals
function updateCartTotals(total) {
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    
    if (subtotalEl) subtotalEl.textContent = `₹${total}`;
    if (totalEl) totalEl.textContent = `₹${total}`;
}

// Update item quantity
function updateQuantity(itemId, change) {
    const item = cart.find(item => item.id == itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCart();
            showBootstrapNotification(`Updated quantity for "${item.name}"`, 'info');
        }
    }
}

// Remove item from cart
function removeFromCart(itemId) {
    const item = cart.find(item => item.id == itemId);
    const itemName = item ? item.name : 'Item';
    
    cart = cart.filter(item => item.id != itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    showBootstrapNotification(`"${itemName}" removed from cart`, 'warning');
}

// Clear entire cart with Bootstrap modal confirmation
function clearCart() {
    if (cart.length === 0) {
        showBootstrapNotification('Your cart is already empty', 'info');
        return;
    }
    
    // Create and show Bootstrap modal
    const modalHTML = `
        <div class="modal fade" id="clearCartModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-exclamation-triangle text-warning me-2"></i>
                            Clear Cart
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        Are you sure you want to clear your entire cart? This action cannot be undone.
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-danger" onclick="confirmClearCart()" data-bs-dismiss="modal">
                            <i class="fas fa-trash me-2"></i>Clear Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('clearCartModal'));
    modal.show();
    
    // Clean up modal after hiding
    document.getElementById('clearCartModal').addEventListener('hidden.bs.modal', () => {
        document.getElementById('clearCartModal').remove();
    });
}

// Confirm clear cart
function confirmClearCart() {
    cart = [];
    localStorage.removeItem('cart');
    displayCart();
    showBootstrapNotification('Cart cleared successfully', 'success');
}

// Enhanced checkout with Bootstrap modal
function checkout() {
    if (cart.length === 0) {
        showBootstrapNotification('Your cart is empty', 'warning');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const modalHTML = `
        <div class="modal fade" id="checkoutModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-credit-card me-2"></i>
                            Checkout Confirmation
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="text-center mb-3">
                            <h4>Order Summary</h4>
                        </div>
                        <div class="row">
                            <div class="col-6">Items:</div>
                            <div class="col-6 text-end">${itemCount} book${itemCount !== 1 ? 's' : ''}</div>
                        </div>
                        <div class="row">
                            <div class="col-6">Subtotal:</div>
                            <div class="col-6 text-end">₹${total}</div>
                        </div>
                        <div class="row">
                            <div class="col-6">Shipping:</div>
                            <div class="col-6 text-end text-success">Free</div>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="col-6"><strong>Total:</strong></div>
                            <div class="col-6 text-end"><strong>₹${total}</strong></div>
                        </div>
                        <div class="alert alert-info mt-3">
                            <small><i class="fas fa-info-circle me-1"></i>This is a demo checkout. No payment will be processed.</small>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-success" onclick="confirmCheckout()" data-bs-dismiss="modal">
                            <i class="fas fa-check me-2"></i>Confirm Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('checkoutModal'));
    modal.show();
    
    document.getElementById('checkoutModal').addEventListener('hidden.bs.modal', () => {
        document.getElementById('checkoutModal').remove();
    });
}

// Confirm checkout
function confirmCheckout() {
    showBootstrapNotification('Order placed successfully! Thank you for shopping with ReadRealm.', 'success');
    cart = [];
    localStorage.removeItem('cart');
    displayCart();
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
    const toast = new bootstrap.Toast(toastElement, { delay: 4000 });
    toast.show();
    
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

// Initialize cart display
document.addEventListener('DOMContentLoaded', displayCart);