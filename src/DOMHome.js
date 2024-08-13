import { sql } from "@vercel/postgres";
import { displayNewSection } from "./DOMHelpers.js";

const totalWords = (
  await sql`SELECT word, occurences FROM total ORDER BY occurences DESC;`
).rows;

export default async function displayHome() {
  const container = document.createElement("section");
  container.classList.add("words");

  appendWordsTo(container);

  displayNewSection(container);
}

export function appendWordsTo(wordsContainer, wordsList = totalWords) {
  for (const wordCount of wordsList) {
    const wordContainer = document.createElement("article");
    wordContainer.classList.add("word-container");
    wordContainer.append(...createWord(wordCount));

    wordsContainer.appendChild(wordContainer);
  }
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
