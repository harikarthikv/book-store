const btnCart = document.querySelector('#cart-icon');
const cart = document.querySelector('.cart');
const btnClose = document.querySelector('#cart-close');

btnCart.addEventListener('click', () => {
  cart.classList.add('cart-active');
});

btnClose.addEventListener('click', () => {
  cart.classList.remove('cart-active');
});

document.addEventListener('DOMContentLoaded', loadBooks);

function loadBooks() {
  loadContent();
}

function loadContent() {
  // Remove Book Items From Cart
  let btnRemove = document.querySelectorAll('.cart-remove');
  btnRemove.forEach((btn) => {
    btn.addEventListener('click', removeItem);
  });

  // Product Item Change Event
  let qtyElements = document.querySelectorAll('.cart-quantity');
  qtyElements.forEach((input) => {
    input.addEventListener('change', changeQty);
  });

  // Add to Cart Buttons
  let cartBtns = document.querySelectorAll('.add-cart');
  cartBtns.forEach((btn) => {
    btn.addEventListener('click', addCart);
  });

  updateTotal();
}

// Remove Item
function removeItem() {
  if (confirm('Are you sure you want to remove this item?')) {
    let title = this.parentElement.querySelector('.cart-book-title').innerHTML;
    itemList = itemList.filter(el => el.title != title);
    this.parentElement.remove();
    loadContent();
  }
}

// Change Quantity
function changeQty() {
  if (isNaN(this.value) || this.value < 1) {
    this.value = 1;
  }
  loadContent();
}

let itemList = [];

// Add to Cart
function addCart() {
  let book = this.parentElement;
  let title = book.querySelector('.book-title').innerHTML;
  let price = book.querySelector('.book-price').innerHTML;
  let imgSrc = book.querySelector('.book-img').src;

  let newProduct = { title, price, imgSrc };

  // Check if Product Already Exists in Cart
  if (itemList.find((el) => el.title == newProduct.title)) {
    alert("Product already added to cart");
    return;
  } else {
    itemList.push(newProduct);
  }

  let newProductElement = createCartProduct(title, price, imgSrc);
  let element = document.createElement('div');
  element.innerHTML = newProductElement;
  let cartBasket = document.querySelector('.cart-content');
  cartBasket.append(element);
  loadContent();
}

function createCartProduct(title, price, imgSrc) {
  return `
  <div class="cart-box">
    <img src="${imgSrc}" class="cart-img">
    <div class="detail-box">
      <div class="cart-book-title">${title}</div>
      <div class="price-box">
        <div class="cart-price">${price}</div>
        <div class="cart-amt">${price}</div>
      </div>
      <input type="number" value="1" class="cart-quantity">
    </div>
    <ion-icon name="trash" class="cart-remove"></ion-icon>
  </div>
  `;
}

function updateTotal() {
  const cartItems = document.querySelectorAll('.cart-box');
  const totalValue = document.querySelector('.total-price');

  let total = 0;

  cartItems.forEach(product => {
    let priceElement = product.querySelector('.cart-price');
    let price = parseFloat(priceElement.innerHTML.replace("Rs.", ""));
    let qty = product.querySelector('.cart-quantity').value;
    total += (price * qty);
    product.querySelector('.cart-amt').innerText = "Rs." + (price * qty);
  });

  totalValue.innerHTML = 'Rs.' + total;

  // Update Cart Count
  const cartCount = document.querySelector('.cart-count');
  let count = itemList.length;
  cartCount.innerHTML = count;

  if (count == 0) {
    cartCount.style.display = 'none';
  } else {
    cartCount.style.display = 'block';
  }
}
