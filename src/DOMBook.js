import { sql } from "@vercel/postgres";
import { appendWordsTo } from "./DOMPage.js";
import { displayNewSection } from "./DOMHelpers.js";

export default async function createBookSection(bookTitle, author) {
  const container = document.createElement("section");
  container.classList.add("words");

  const wordsList = (
    await sql`SELECT list FROM words WHERE book_id = (SELECT id FROM books WHERE title = ${bookTitle} AND author_id = (SELECT id FROM authors WHERE name = ${author}));`
  ).rows[0].list;
  appendWordsTo(container, wordsList);

  displayNewSection(container);
}
