const data = [
  { id: 1, name: "HP-1", img: "./img/book-1.png", amt: 125, seller: "JK" },
  { id: 2, name: "HP-2", img: "./img/book-2.png", amt: 225, seller: "JK" },
  { id: 3, name: "HP-3", img: "./img/book-3.png", amt: 325, seller: "JK" },
  { id: 4, name: "HP-4", img: "./img/book-4.png", amt: 425, seller: "JK" },
  { id: 5, name: "HP-5", img: "./img/book-5.png", amt: 525, seller: "JK" },
  { id: 6, name: "HP-6", img: "./img/book-6.png", amt: 625, seller: "JK" },
  { id: 7, name: "HP-7", img: "./img/book-7.png", amt: 735, seller: "JK" },
  { id: 8, name: "LOR-1", img: "./img/book-8.png", amt: 125, seller: "JK" },
  { id: 9, name: "LOR-2", img: "./img/book-9.png", amt: 225, seller: "JK" },
  { id: 10, name: "LOR-3", img: "./img/book-10.png", amt: 325, seller: "JK" },
];

const productsContainer = document.querySelector(".products");

function displayProducts(products) {
  if (products.length > 0) {
    const productDetails = products
      .map(
        (product) => `
      <div class="book-box">
        <img src="${product.img}" alt="${product.name}" class="book-image" />
        <h3 class="book-title">${product.name}</h3>
        <p class="book-price">Rs.${product.amt} 
        <p class="book-seller">${product.seller}</p>
        <button class="btn">Add to Cart</button>
      </div>`
      )
      .join("");
    productsContainer.innerHTML = `<div class="book-grid">${productDetails}</div>`;
  } else {
    productsContainer.innerHTML = "<h3>No Products Available</h3>";
  }
}

const txtSearch = document.querySelector("#txtSearch");
txtSearch.addEventListener("keyup", (e) => {
  const value = e.target.value.toLowerCase().trim();
  if (value) {
    displayProducts(data.filter((product) => product.name.toLowerCase().includes(value)));
  } else {
    displayProducts(data);
  }
});

displayProducts(data);