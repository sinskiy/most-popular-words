import { displayNewSection } from "./index.js";
import books from "./books.json";
import { getAlphabeticString, lowerIncludes } from "./helpers.js";

export default function createBooksSection() {
  console.log("creating");
  const container = document.createElement("section");

  const bookSearch = createBooksSearch();
  container.appendChild(bookSearch);

  const booksContainer = document.createElement("div");
  booksContainer.classList.add("books");
  appendBooksTo(booksContainer, books);

  container.appendChild(booksContainer);

  displayNewSection(container);
}

function appendBooksTo(booksContainer, booksList) {
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

function getClosestBooks(searchQuery) {
  const normalizedSearchQuery = getAlphabeticString(searchQuery).toLowerCase();
  const searchResults = new Map();
  for (const book of books) {
    let scoreToAdd = 0;

    if (lowerIncludes(book.name, normalizedSearchQuery)) {
      scoreToAdd += 50;
    }

    if (lowerIncludes(book.author, normalizedSearchQuery)) {
      scoreToAdd += 40;
    }
    for (const namePart of book.author.split(" ")) {
      if (isNamePartIncludes(namePart)) {
        scoreToAdd += 5;
      } else {
        scoreToAdd++;
      }
    }

    for (const property in book) {
      for (const charOriginalLocation in book[property]) {
        const char = book[property][charOriginalLocation];
        const charQueryLocation = normalizedSearchQuery.indexOf(char);
        if (charQueryLocation !== -1) {
          if (charQueryLocation === charOriginalLocation) {
            scoreToAdd += 5;
          } else {
            scoreToAdd += 1;
          }
        }
      }
    }

    scoreToAdd -= book.name.length / 3;

    if (searchResults.has(book)) {
      const prev = searchResults.get(book);
      searchResults.set(book, prev + scoreToAdd);
    } else {
      searchResults.set(book, scoreToAdd);
    }
  }
  const searchResultsEntries = [...searchResults.entries()];
  const sortedResults = searchResultsEntries
    .sort((a, b) => {
      return b[1] - a[1];
    })
    .map((entry) => entry[0]);
  return sortedResults;

  function isNamePartIncludes(namePart) {
    const normalizedNamePart = getAlphabeticString(namePart).toLowerCase();
    return normalizedNamePart.includes(normalizedSearchQuery);
  }
}
