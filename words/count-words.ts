import { readdir, readFile } from "fs/promises";

export type CountedWords = Map<string, number>;

export function sortWords(countedWords: CountedWords) {
  return [...countedWords.entries()].sort((a, b) => b[1] - a[1]);
}

export async function countWordsInDirectory(path: string) {
  const files = await readdir(path);

  const counts: CountedWords[] = [];
  for (const filePath of files) {
    counts.push(await countWordsInFile(`${path}/${filePath}`));
  }

  const countedWords = counts.reduce((fullCountedWords, countedWords) => {
    for (const [word, occurrences] of countedWords) {
      fullCountedWords.set(
        word,
        (fullCountedWords.get(word) ?? 0) + occurrences
      );
    }
    return fullCountedWords;
  }, new Map() as CountedWords);
  return countedWords;
}

export async function countWordsInFile(path: string) {
  const text = await getFileText(path);
  return countWords(text);
}

async function getFileText(path: string) {
  const text = await readFile(path, { encoding: "utf-8" });
  return text;
}

export function countWords(text: string) {
  const words = formatText(text)
    .split(" ")
    .filter((word) => word);

  const countedWords: CountedWords = new Map();
  for (const word of words) {
    countedWords.set(word, (countedWords.get(word) ?? 0) + 1);
  }
  return countedWords;
}

function formatText(text: string) {
  const formatted = text
    .toLowerCase()
    .replace(/[^a-z\s\'-]|_/g, " ")
    .replace(/(-+|\'+)\s+|\s+(-+|\')/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return formatted;
}
