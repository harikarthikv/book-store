// Book data configuration
const BOOKS_DATA = [
  {
    id: 1,
    name: "Harry Potter and the Philosopher's Stone",
    img: "./img/book-1.png",
    price: 125,
    series: "Harry Potter",
    author: "J.K. Rowling"
  },
  {
    id: 2,
    name: "Harry Potter and the Chamber of Secrets",
    img: "./img/book-2.png",
    price: 225,
    series: "Harry Potter",
    author: "J.K. Rowling"
  },
  {
    id: 3,
    name: "Harry Potter and the Prisoner of Azkaban",
    img: "./img/book-3.png",
    price: 325,
    series: "Harry Potter",
    author: "J.K. Rowling"
  },
  {
    id: 4,
    name: "Harry Potter and the Goblet of Fire",
    img: "./img/book-4.png",
    price: 425,
    series: "Harry Potter",
    author: "J.K. Rowling"
  },
  {
    id: 5,
    name: "Harry Potter and the Order of the Phoenix",
    img: "./img/book-5.png",
    price: 525,
    series: "Harry Potter",
    author: "J.K. Rowling"
  },
  {
    id: 6,
    name: "Harry Potter and the Half-Blood Prince",
    img: "./img/book-6.png",
    price: 625,
    series: "Harry Potter",
    author: "J.K. Rowling"
  },
  {
    id: 7,
    name: "Harry Potter and the Deathly Hallows",
    img: "./img/book-7.png",
    price: 725,
    series: "Harry Potter",
    author: "J.K. Rowling"
  },
  {
    id: 8,
    name: "The Fellowship of the Ring",
    img: "./img/book-8.png",
    price: 125,
    series: "Lord of the Rings",
    author: "J.R.R. Tolkien"
  },
  {
    id: 9,
    name: "The Two Towers",
    img: "./img/book-9.png",
    price: 225,
    series: "Lord of the Rings",
    author: "J.R.R. Tolkien"
  },
  {
    id: 10,
    name: "The Return of the King",
    img: "./img/book-10.png",
    price: 325,
    series: "Lord of the Rings",
    author: "J.R.R. Tolkien"
  }
];

// Utility functions for book data
const BookUtils = {
  // Get book by ID
  getById(id) {
    return BOOKS_DATA.find(book => book.id === parseInt(id));
  },

  // Get books by series
  getBySeries(seriesName) {
    return BOOKS_DATA.filter(book => 
      book.series.toLowerCase() === seriesName.toLowerCase()
    );
  },

  // Get books by price range
  getByPriceRange(min, max) {
    return BOOKS_DATA.filter(book => 
      book.price >= min && book.price <= max
    );
  },

  // Search books by name or author
  search(query) {
    const searchTerm = query.toLowerCase();
    return BOOKS_DATA.filter(book =>
      book.name.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm) ||
      book.series.toLowerCase().includes(searchTerm)
    );
  }
};
