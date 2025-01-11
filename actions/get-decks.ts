import cacheDb from "../lib/cache-db";
import queryThrowError from "../lib/query-throw-error";
import { Deck } from "../types/deck";

export const getDecks = cacheDb(
  async (username: string) =>
    await queryThrowError<Deck>(
      "Couldn't get decks",
      "SELECT id, name FROM decks WHERE username = $1",
      [username]
    ),
  ["decks"]
);

export const getDeckWords = cacheDb(
  async (id: number) =>
    await queryThrowError(
      "Couldn't get deck words",
      {
        text: "SELECT word FROM deck_words WHERE deck_id = $1",
        rowMode: "array",
      },
      [id]
    ),
  ["decks"]
);
