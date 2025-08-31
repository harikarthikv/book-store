// =======================
// UNIFIED UTILITIES
// =======================

// Common notification system
class NotificationManager {
    static show(message, type = 'success', duration = 3000) {
        // Remove existing notifications
        document.querySelectorAll('.toast').forEach(toast => toast.remove());
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        const toastHTML = `
            <div class="toast align-items-center text-white bg-${type === 'error' ? 'danger' : type} border-0 position-fixed" 
                 style="top: 100px; right: 20px; z-index: 9999;" role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="${icons[type]} me-2"></i>${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', toastHTML);
        const toastElement = document.querySelector('.toast:last-of-type');
        const toast = new bootstrap.Toast(toastElement, { delay: duration });
        toast.show();
        
        toastElement.addEventListener('hidden.bs.toast', () => toastElement.remove());
    }
}

// Storage utilities
class Storage {
    static get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(`Storage get error for key "${key}":`, error);
            return defaultValue;
        }
    }
    
    static set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Storage set error for key "${key}":`, error);
            return false;
        }
    }
    
    static remove(key) {
        localStorage.removeItem(key);
    }

    static clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    }

    static keys() {
        try {
            return Object.keys(localStorage);
        } catch (error) {
            console.error('Storage keys error:', error);
            return [];
        }
    }
}

// Cart utilities
class CartManager {
    static getCart() {
        return Storage.get('cart', []);
    }
    
    static saveCart(cart) {
        Storage.set('cart', cart);
    }
    
    static addItem(book) {
        try {
            let cart = this.getCart();
            const existingItem = cart.find(item => item.id === book.id);
            
            if (existingItem) {
                existingItem.quantity += 1;
                NotificationManager.show(`Updated quantity of "${book.name}"`, 'info');
            } else {
                cart.push({ ...book, quantity: 1, cartId: Date.now() });
                NotificationManager.show(`"${book.name}" added to cart`);
            }
            
            this.saveCart(cart);
            this.updateCartDisplay();
            return true;
        } catch (error) {
            console.error('Cart add error:', error);
            NotificationManager.show('Failed to add item to cart', 'error');
            return false;
        }
    }
    
    static updateCartDisplay() {
        const cart = this.getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        const cartLinks = document.querySelectorAll('a[href="cart.html"]');
        cartLinks.forEach(cartLink => {
            if (totalItems > 0) {
                const icon = cartLink.querySelector('i');
                if (icon) {
                    // Remove existing badge
                    const existingBadge = cartLink.querySelector('.badge');
                    if (existingBadge) existingBadge.remove();
                    
                    // Add new badge
                    icon.insertAdjacentHTML('afterend', `
                        <span class="badge bg-success rounded-pill ms-1">${totalItems}</span>
                    `);
                }
            } else {
                // Remove badge when cart is empty
                const badge = cartLink.querySelector('.badge');
                if (badge) badge.remove();
            }
        });
    }

    static removeItem(cartId) {
        try {
            let cart = this.getCart();
            const initialLength = cart.length;
            
            cart = cart.filter(item => item.cartId !== cartId);
            
            if (cart.length < initialLength) {
                this.saveCart(cart);
                this.updateCartDisplay();
                NotificationManager.show('Item removed from cart', 'info');
                return true;
            } else {
                NotificationManager.show('Item not found in cart', 'warning');
                return false;
            }
        } catch (error) {
            console.error('Cart remove error:', error);
            NotificationManager.show('Failed to remove item from cart', 'error');
            return false;
        }
    }

    static updateQuantity(cartId, newQuantity) {
        try {
            if (newQuantity <= 0) {
                return this.removeItem(cartId);
            }

            let cart = this.getCart();
            const item = cart.find(item => item.cartId === cartId);
            
            if (!item) {
                NotificationManager.show('Item not found in cart', 'warning');
                return false;
            }

            item.quantity = newQuantity;
            this.saveCart(cart);
            this.updateCartDisplay();
            return true;
        } catch (error) {
            console.error('Cart update error:', error);
            NotificationManager.show('Failed to update quantity', 'error');
            return false;
        }
    }

    static clearCart() {
        try {
            Storage.remove('cart');
            this.updateCartDisplay();
            NotificationManager.show('Cart cleared successfully', 'info');
            return true;
        } catch (error) {
            console.error('Cart clear error:', error);
            NotificationManager.show('Failed to clear cart', 'error');
            return false;
        }
    }

    static getCartStats() {
        const cart = this.getCart();
        return {
            itemCount: cart.length,
            totalQuantity: cart.reduce((sum, item) => sum + item.quantity, 0),
            totalValue: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        };
    }
}

// Form validation utilities
class FormValidator {
    static validateEmail(email) {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    }
    
    static validatePassword(password) {
        return password && password.length >= 6;
    }

    static validateName(name) {
        const nameRegex = /^[a-zA-Z\s'-]{2,50}$/;
        return typeof name === 'string' && nameRegex.test(name.trim());
    }

    static validatePhone(phone) {
        if (typeof phone !== 'string') return false;
        const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
        return /^\d{10,15}$/.test(cleaned);
    }
    
    static showErrors(errors, formElement) {
        const existingAlert = formElement.querySelector('.alert-danger');
        if (existingAlert) existingAlert.remove();
        
        if (errors.length > 0) {
            const alertHTML = `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <i class="fas fa-exclamation-circle me-2"></i>
                    <ul class="mb-0">${errors.map(error => `<li>${error}</li>`).join('')}</ul>
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `;
            formElement.insertAdjacentHTML('afterbegin', alertHTML);
        }
    }

    static showSuccess(message, formElement) {
        const existingAlert = formElement.querySelector('.alert');
        if (existingAlert) existingAlert.remove();
        
        const alertHTML = `
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <i class="fas fa-check-circle me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        formElement.insertAdjacentHTML('afterbegin', alertHTML);
    }
}

// Initialize utilities
document.addEventListener('DOMContentLoaded', () => {
    CartManager.updateCartDisplay();
});








