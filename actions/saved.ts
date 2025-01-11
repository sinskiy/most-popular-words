import cacheDb from "../lib/cache-db";
import { ITEMS_PER_PAGE } from "../lib/db";
import queryThrowError from "../lib/query-throw-error";
import { SavedWord } from "../types/word";

export const getSaved = cacheDb(
  async (offset: number, username: string, limit?: number, deck?: string) =>
    await queryThrowError<SavedWord>(
      "Couldn't get saved words",
      "SELECT value, occurrences, percentage, source, type, knowledge, translations, definitions, examples, saved FROM user_words_with_percentage($1) WHERE saved = true" +
        (deck
          ? " AND value IN (SELECT word FROM deck_words WHERE deck_id = (SELECT id FROM decks WHERE name = $2))"
          : " AND COALESCE($2) IS NULL") +
        " LIMIT $3 OFFSET $4",
      [username, deck ?? null, limit ?? ITEMS_PER_PAGE, offset]
    ),
  ["words"]
);

export const getSavedWithLanguage = cacheDb(
  async (
    offset: number,
    username: string,
    language: string,
    limit?: number,
    deck?: string
  ) =>
    await queryThrowError<SavedWord>(
      "Couldn't get saved words",
      "SELECT value, occurrences, percentage, source, type, knowledge, translations, definitions, examples, saved FROM user_words_with_percentage($2) WHERE LANGUAGE = $1 AND saved = true" +
        (deck
          ? " AND value IN (SELECT word FROM deck_words WHERE deck_id = (SELECT id FROM decks WHERE name = $3))"
          : " AND COALESCE($3) IS NULL") +
        " LIMIT $4 OFFSET $5",
      [language, username, deck ?? null, limit ?? ITEMS_PER_PAGE, offset]
    ),
  ["words"]
);

export const getSavedCount = cacheDb(
  async (username: string) =>
    await queryThrowError<{ count: number }>(
      "Couldn't get saved count",
      "SELECT COUNT(*) FROM saved WHERE username = $1",
      [username]
    ),
  ["words"]
);
