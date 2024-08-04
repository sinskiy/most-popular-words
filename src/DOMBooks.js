import { main } from "./index.js";
import books from "./books.json";

export default function displayBooks() {
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
