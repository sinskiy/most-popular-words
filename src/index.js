import "./loadTheme.js";
import books from "./books.json";

const nav = document.querySelector("header nav");
nav.addEventListener("change", () => {
  const checked = nav.querySelector("input:checked");
  switch (checked.id) {
    case "by-book":
      displayBooks();
      break;

    default:
      displayHome();
  }
});

import "./reset.css";
import "./style.css";

import "./toggleTheme.js";

const main = document.querySelector("main");

function displayBooks() {
  const container = document.createElement("section");
  container.classList.add("books");
  for (const book of books) {
    const bookContainer = document.createElement("button");
    bookContainer.classList.add("book");

    const title = document.createElement("h2");
    title.textContent = book.name;

    const author = document.createElement("p");
    author.textContent = book.author;

    bookContainer.append(title, author);

    container.appendChild(bookContainer);
  }
  main.innerHTML = "";
  main.appendChild(container);
}

function displayHome() {}
