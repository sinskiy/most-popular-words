import db from "../configs/pg.ts";
import { type CountedWords } from "./count-words.ts";

export async function addWords(countedWords: CountedWords, typeValue: string) {
  const typeQuery = await db.query(
    "SELECT value FROM word_types WHERE value = $1",
    [typeValue]
  );
  const type = typeQuery.rows[0];
  if (!type) {
    throw new Error(
      `No type with name ${typeValue} found. First run addType("${typeValue}")`
    );
  }

  for (const [word, occurrences] of countedWords) {
    await db.query(
      "INSERT INTO words (value, occurrences, type) VALUES ($1, $2, $3)",
      [word, occurrences, type.value]
    );
  }
}

export async function addType(typeValue: string) {
  await db.query(
    "INSERT INTO word_types (value) VALUES ($1) ON CONFLICT DO NOTHING",
    [typeValue]
  );
}
