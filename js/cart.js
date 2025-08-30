// Simple cart management
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

// Display cart items
function displayCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalContainer = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="no-results">Your cart is empty. <a href="filter.html">Browse books</a></p>';
        cartTotalContainer.style.display = 'none';
        return;
    }
    
    cartTotalContainer.style.display = 'block';
    let total = 0;
    
    const cartHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">Rs.${item.price}</p>
                </div>
                <div class="cart-controls">
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                    <button class="btn btn-secondary" onclick="removeFromCart('${item.id}')">Remove</button>
                </div>
            </div>
        `;
    }).join('');
    
    cartItemsContainer.innerHTML = cartHTML;
    cartTotalContainer.querySelector('h3').textContent = `Total: Rs.${total}`;
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
        }
    }
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id != itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    showNotification('Item removed from cart');
}

// Clear entire cart
function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        localStorage.removeItem('cart');
        displayCart();
        showNotification('Cart cleared');
    }
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (confirm(`Proceed to checkout? Total: Rs.${total}`)) {
        alert('Thank you for your order! (Demo checkout)');
        cart = [];
        localStorage.removeItem('cart');
        displayCart();
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

// Initialize cart display
document.addEventListener('DOMContentLoaded', displayCart);