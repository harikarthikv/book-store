// Initialize the homepage
document.addEventListener("DOMContentLoaded", function () {
  // Display popular books on page load
  displayPopularBooks();

  // Update cart count on page load
  updateCartCount();

  function displayPopularBooks() {
    const popularBooksContainer = document.querySelector("#popular-books");
    if (!popularBooksContainer) return;

    // Get first 6 books for popular books section
    const popularBooks = BOOKS_DATA.slice(0, 6);

    popularBooksContainer.innerHTML = popularBooks
      .map((book) => createBookCard(book))
      .join("");

    // Add event listeners to all add to cart buttons
    document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const bookId = parseInt(this.dataset.bookId);
        const book = BookUtils.getById(bookId);

        if (book) {
          CartManager.addItem(book);
          updateCartCount();
          NotificationManager.show(
            `${book.name} has been added to your cart!`,
            'success'
          );
        }
      });
    });
  }

  function createBookCard(book) {
    return `
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="card book-card h-100">
          <div class="card-img-container">
            <img src="${book.img}" class="card-img-top book-img" alt="${book.name}">
          </div>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${book.name}</h5>
            <p class="card-text book-author">by ${book.author}</p>
            <p class="card-text book-series">${book.series} Series</p>
            <div class="mt-auto d-flex justify-content-between align-items-center">
              <span class="book-price">₹${book.price}</span>
              <button class="btn btn-success add-to-cart-btn" data-book-id="${book.id}">
                <i class="fas fa-cart-plus"></i> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function updateCartCount() {
    const cart = CartManager.getCart();
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll(".cart-count");
    
    cartCountElements.forEach(element => {
      element.textContent = cartCount;
      element.style.display = cartCount > 0 ? "inline" : "none";
    });
    
    // Also update cart display using the existing method
    CartManager.updateCartDisplay();
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // Back to top button
  const backToTopBtn = document.querySelector('#backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 300) {
        backToTopBtn.style.display = 'block';
      } else {
        backToTopBtn.style.display = 'none';
      }
    });

    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
