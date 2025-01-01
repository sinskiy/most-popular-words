import cacheDb from "../lib/cache-db";
import { ITEMS_PER_PAGE } from "../lib/db";
import queryThrowError from "../lib/query-throw-error";
import { SavedWord } from "../types/word";

export const getSaved = cacheDb(
  async (offset: number, username: string, limit?: number) =>
    await queryThrowError<SavedWord>(
      "Couldn't get saved words",
      "SELECT value, occurrences, percentage, source, type, knowledge, translation, definition, example, saved FROM user_words_with_percentage($1) WHERE saved = true LIMIT $2 OFFSET $3",
      [username, limit ?? ITEMS_PER_PAGE, offset]
    ),
  ["words"]
);

export const getSavedWithLanguage = cacheDb(
  async (offset: number, username: string, language: string, limit?: number) =>
    await queryThrowError<SavedWord>(
      "Couldn't get saved words",
      "SELECT value, occurrences, percentage, source, type, knowledge, translation, definition, example, saved FROM user_words_with_percentage($2) WHERE LANGUAGE = $1 AND saved = true LIMIT $3 OFFSET $4",
      [language, username, limit ?? ITEMS_PER_PAGE, offset]
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
