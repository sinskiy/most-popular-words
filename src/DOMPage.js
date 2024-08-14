import { sql } from "@vercel/postgres";
import { displayNewSection } from "./DOMHelpers.js";

const WORDS_PER_PAGE = 10;
export default async function displayPage(pageNumber = 1) {
  console.log(pageNumber);

  const container = document.createElement("section");
  container.classList.add("words");

  const wordsList = (
    await sql`SELECT word, occurences FROM total  ORDER BY occurences DESC LIMIT ${WORDS_PER_PAGE} OFFSET ${(pageNumber - 1) * WORDS_PER_PAGE};`
  ).rows;
  appendWordsTo(container, wordsList);
  appendPagesTo(container, pageNumber);

  displayNewSection(container);
}

export async function appendWordsTo(wordsContainer, wordsList) {
  for (const wordCount of wordsList) {
    const wordContainer = document.createElement("article");
    wordContainer.classList.add("word-container");
    wordContainer.append(...createWord(wordCount));

    wordsContainer.appendChild(wordContainer);
  }
}

const WORDS_COUNT = 10000;
const pages = WORDS_COUNT / WORDS_PER_PAGE;
function appendPagesTo(wordsContainer, selectedPage) {
  const pagination = document.createElement("nav");

  const paginationList = document.createElement("ul");
  paginationList.classList.add("pagination-list");

  const offset = 2;
  const start = selectedPage - offset - 1;
  const end = selectedPage + offset;
  for (let i = start; i < end; i++) {
    if (i > pages || i < 0) continue;

    const currentPage = i + 1;
    console.log(currentPage);

    const page = document.createElement("li");
    page.classList.add("page");
    if (currentPage === selectedPage) {
      page.classList.add("selected");
    }

    const pageButton = document.createElement("button");
    pageButton.textContent = currentPage;
    pageButton.addEventListener("click", () =>
      displayPage(Number(pageButton.textContent)),
    );
    page.appendChild(pageButton);

    paginationList.appendChild(page);
  }
  pagination.appendChild(paginationList);

  wordsContainer.appendChild(pagination);
}

function createWord({ word, occurences }) {
  const wordElement = document.createElement("p");
  wordElement.textContent = word;
  wordElement.classList.add("word");

  const countElement = document.createElement("p");
  countElement.textContent = occurences;
  countElement.classList.add("count");

  return [wordElement, countElement];
}
