import { books } from "./DOMBooks.js";
import { getAlphabeticString, lowerIncludes } from "./helpers.js";

export default function getClosestBooks(searchQuery) {
  const normalizedSearchQuery = getAlphabeticString(searchQuery).toLowerCase();
  const searchResults = new Map();
  for (const book of books) {
    let scoreToAdd = 0;

    if (lowerIncludes(book.title, normalizedSearchQuery)) {
      scoreToAdd += 50;
    }

    if (lowerIncludes(book.author, normalizedSearchQuery)) {
      scoreToAdd += 40;
    }
    for (const namePart of book.title.split(" ")) {
      if (isNamePartIncludes(namePart)) {
        scoreToAdd += 5;
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

    scoreToAdd -= book.title.length / 3;

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
