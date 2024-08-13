import { sql } from "@vercel/postgres";
import { displayNewSection } from "./DOMHelpers.js";
import getClosestBooks from "./searchBooks.js";

export const books = (
  await sql`SELECT books.title, authors.name as author FROM books JOIN authors ON authors.id = books.author_id;`
).rows;

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
  title.textContent = book.title;

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

const SEARCH_OFFSET = 300;
let searchInterval;
function displayBooksBySearch(event) {
  const searchQuery = event.target.value;
  if (!searchQuery) return createBooksSection();

  clearInterval(searchInterval);
  searchInterval = setInterval(() => {
    const closestBooks = getClosestBooks(searchQuery);
    appendBooksTo(document.querySelector(".books"), closestBooks);
  }, SEARCH_OFFSET);
}
