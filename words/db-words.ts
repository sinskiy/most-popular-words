import db from "../configs/pg.ts";
import { type CountedWords } from "./count-words.ts";

export async function addWords(
  countedWords: CountedWords,
  sourceValue: string
) {
  for (const [word, occurrences] of countedWords) {
    await db.query(
      "INSERT INTO words (value, occurrences, source) VALUES ($1, $2, $3)",
      [word, occurrences, sourceValue]
    );
  }
}
