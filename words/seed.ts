import { readdir } from "fs/promises";
import { countWordsInDirectory } from "./count-words.ts";
import { addWords } from "./db-words.ts";
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

      const fullPath = `${path}/${filePath}`;
      const countedWords = await countWordsInDirectory(fullPath);
      await addWords(countedWords, sourceValue);
    }
  }

  db.end();
}

async function createDb() {
  await db.query(`CREATE TABLE users (
      username VARCHAR(255) PRIMARY KEY,
      password VARCHAR(255) NOT NULL,
      streak INT NOT NULL DEFAULT 0,
      last_streak TIMESTAMP NOT NULL DEFAULT '1970-01-01 00:00:01'::timestamp
    )`);

  await db.query(`CREATE TYPE languages AS ENUM ('english', 'russian')`);
  await db.query(`CREATE TABLE words (
      value VARCHAR(255),
      language languages NOT NULL DEFAULT 'english',
      source VARCHAR(255) NOT NULL,
      occurrences INT NOT NULL,
      type VARCHAR(30) NOT NULL DEFAULT 'books' CHECK(type in ('books', 'docs', 'articles')),
      PRIMARY KEY (value, source)
    )`);

  await db.query(`CREATE TABLE saved (
      username VARCHAR(255) NOT NULL REFERENCES users(username),
      word VARCHAR(255) NOT NULL,
      UNIQUE (username, word)
    )`);

  await db.query(`CREATE TABLE user_words (
      username VARCHAR(255) NOT NULL REFERENCES users(username),
      word VARCHAR(255) NOT NULL,
      translation VARCHAR(255),
      definition VARCHAR(255),
      example VARCHAR(255),
      knowledge VARCHAR(30) DEFAULT 'again' CHECK(knowledge in ('again', 'hard', 'good', 'easy')),
      UNIQUE (username, word)
    )`);

  await db.query(
    `CREATE VIEW user_words_with_percentage AS SELECT value, occurrences, source, type, translation, definition, example, knowledge, username, language, occurrences::REAL / (SELECT SUM(occurrences) FROM words) AS percentage FROM words FULL OUTER JOIN user_words ON words.value = user_words.word`
  );

  await addWordsFromAllDirectories(false);
}

function isDirectory(filePath: string) {
  return filePath.split(".").length === 1;
}
