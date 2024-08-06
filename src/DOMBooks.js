import { displayNewSection } from "./DOMHelpers.js";
import getClosestBooks from "./searchBooks.js";
import books from "./books.json";

export default function createBooksSection() {
  const container = document.createElement("section");

  const bookSearch = createBooksSearch();
  container.appendChild(bookSearch);

  const booksContainer = document.createElement("div");
  booksContainer.classList.add("books");
  appendBooksTo(booksContainer);

  container.appendChild(booksContainer);

  displayNewSection(container);
}

function appendBooksTo(booksContainer, booksList = books) {
  booksContainer.innerHTML = "";
  for (const book of booksList) {
    const bookContainer = createBook(book);

    booksContainer.appendChild(bookContainer);
  }
}

function createBook(book) {
  const bookContainer = document.createElement("button");
  bookContainer.classList.add("book");

  const title = document.createElement("h2");
  title.textContent = book.name;

  const author = document.createElement("p");
  author.textContent = book.author;

  bookContainer.append(title, author);
  return bookContainer;
}

function createBooksSearch() {
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Atlas Shrugged by Ayn Rand";
  input.addEventListener("input", displayBooksBySearch);
  return input;
}

function displayBooksBySearch(event) {
  const searchQuery = event.target.value;
  if (!searchQuery) return createBooksSection();

  const closestBooks = getClosestBooks(searchQuery);
  appendBooksTo(document.querySelector(".books"), closestBooks);
}
