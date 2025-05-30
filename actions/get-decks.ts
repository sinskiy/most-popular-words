import prisma from "../configs/prisma";
import cacheDb from "../lib/cache-db";
import { queryWithCustomError } from "../lib/query-throw-error";

export const getDecks = cacheDb(
  async (userId: number) =>
    //   await queryThrowError<Deck>(
    //     "Couldn't get decks",
    //     "SELECT id, name FROM decks WHERE username = $1",
    //     [username]
    //   ),
    await queryWithCustomError("Couldn't get decks", () =>
      prisma.deck.findMany({
        where: { userId },
        select: { id: true, name: true },
      })
    ),
  ["decks"]
);

export const getDeckWords = cacheDb(
  async (id: number) =>
    await queryWithCustomError("Couldn't get deck words", () =>
      prisma.deckWord.findMany({
        where: { deckId: id },
        select: { word: { select: { id: true } } },
      })
    ),
  ["decks"]
  // await queryThrowError(
  //   "Couldn't get deck words",
  //   {
  //     text: "SELECT word FROM deck_words WHERE deck_id = $1",
  //     rowMode: "array",
  //   },
  //   [id]
  // ),
);
