import { readdir } from "fs/promises";
import { countWordsInDirectory } from "./count-words.ts";
import { addSource, addWords } from "./db-words.ts";
import db from "../configs/pg.ts";

addWordsFromAllDirectories(true);

async function addWordsFromAllDirectories(
  deleteWords = false,
  path = "./words/input"
) {
  if (deleteWords === true) {
    await db.query("DELETE FROM words");
  }

  const files = await readdir(path);

  for (const filePath of files) {
    // only 1 level deep because naming word source in nested directory is controversial
    if (isDirectory(filePath)) {
      const sourceValue = filePath;
      await addSource(sourceValue);

      const fullPath = `${path}/${filePath}`;
      const countedWords = await countWordsInDirectory(fullPath);
      await addWords(countedWords, sourceValue);
    }
  }

  db.end();
}

function isDirectory(filePath: string) {
  return filePath.split(".").length === 1;
}
