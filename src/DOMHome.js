import words from "./total.json";
import { displayNewSection } from "./DOMHelpers.js";

export default async function displayHome() {
  const container = document.createElement("section");
  container.classList.add("words");

  appendWordsTo(container);

  displayNewSection(container);
}

export function appendWordsTo(wordsContainer, wordsList = words) {
  for (const wordCount of wordsList) {
    const wordContainer = document.createElement("article");
    wordContainer.classList.add("word-container");
    wordContainer.append(...createWord(wordCount));

    wordsContainer.appendChild(wordContainer);
  }
}

function createWord(wordCount) {
  const [word, count] = wordCount;

  const wordElement = document.createElement("p");
  wordElement.textContent = word;
  wordElement.classList.add("word");

  const countElement = document.createElement("p");
  countElement.textContent = count;
  countElement.classList.add("count");

  return [wordElement, countElement];
}
