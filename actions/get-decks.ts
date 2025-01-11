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
