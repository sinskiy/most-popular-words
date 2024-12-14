import db from "../configs/pg.ts";
import { type CountedWords } from "./count-words.ts";

export async function addWords(
  countedWords: CountedWords,
  sourceValue: string
) {
  const sourceQuery = await db.query(
    "SELECT value FROM word_types WHERE value = $1",
    [sourceValue]
  );
  const source = sourceQuery.rows[0];
  if (!source) {
    throw new Error(
      `No type with name ${sourceValue} found. First run addType("${sourceValue}")`
    );
  }

  for (const [word, occurrences] of countedWords) {
    await db.query(
      "INSERT INTO words (value, occurrences, source) VALUES ($1, $2, $3)",
      [word, occurrences, source.value]
    );
  }
}

export async function addSource(sourceValue: string) {
  await db.query(
    "INSERT INTO word_sources (value) VALUES ($1) ON CONFLICT DO NOTHING",
    [sourceValue]
  );
}
