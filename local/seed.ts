import { readdir } from "node:fs/promises";
import { countWordsInDirectory } from "./count-words.ts";
import insertWords from "./insert-words.ts";

addWordsFromAllDirectories();

async function addWordsFromAllDirectories(path = "./local/input") {
  const files = await readdir(path);

  for (const filePath of files) {
    // only 1 level deep because naming word source in nested directory is controversial
    if (isDirectory(filePath)) {
      const fullPath = `${path}/${filePath}`;
      const countedWords = await countWordsInDirectory(fullPath);
      await insertWords({
        countedWords,
        language: "english",
        source: filePath,
        sourceType: "docs",
        doDeleteAllWords: false,
      });
    }
  }
}

function isDirectory(filePath: string) {
  return filePath.split(".").length === 1;
}
