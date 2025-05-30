"use server";

import prisma from "@/db/prisma";
import { queryWithCustomError } from "@/lib/utils";

export async function queryDecksByUserId(userId: number) {
  return await queryWithCustomError("Couldn't get decks", () =>
    prisma.deck.findMany({
      where: { userId },
      select: { id: true, name: true },
    })
  );
}

export async function createDeck(name: string, userId: number) {
  return await prisma.deck.create({
    data: { name, userId },
    select: { id: true },
  });
}

// TODO: use userId in addition to id everywhere
export async function updateDeck(id: number, userId: number, newName: string) {
  await prisma.deck.update({
    where: { id, userId },
    data: { name: newName },
  });
}

export async function deleteDeck(id: number, userId: number) {
  await prisma.deck.delete({ where: { id, userId } });
}

export async function queryDeckWordsByDeckId(deckId: number) {
  return await queryWithCustomError("Couldn't get deck words", () =>
    prisma.deckWord.findMany({
      where: { deckId },
      select: { word: { select: { id: true } } },
    })
  );
}

export async function createDeckWords(
  deckWords: { deckId: number; wordId: number }[]
) {
  await prisma.deckWord.createMany({ data: deckWords });
}
