"use server";

import { revalidateTag } from "next/cache";
import { AddDeckSchema } from "./schema";
import { createDeck, deleteDeck, updateDeck } from "./queries";

export async function addDeckAction(
  { userId }: { userId: number },
  state: unknown,
  formData: FormData
) {
  if (!userId) return { message: "Must be logged in" };

  const validatedFields = AddDeckSchema.safeParse(Object.fromEntries(formData));

  if (!validatedFields.success) {
    return {
      // TODO: create util
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, ...wordIds } = validatedFields.data;

  const { wordIdsToAdd } = buildDeckWordsPartOfDeck([], wordIds);

  try {
    await createDeck(name, userId, wordIdsToAdd);

    revalidateTag("decks");

    return { success: true };
  } catch (e) {
    console.log(e);
    return { message: "Couldn't add deck" };
  }
}

export async function editDeckAction(
  {
    userId,
    id,
    prevWordIds,
  }: { userId: number; id: number; prevWordIds: number[] },
  state: unknown,
  formData: FormData
) {
  if (!userId) return { message: "Must be logged in" };

  const validatedFields = AddDeckSchema.safeParse(Object.fromEntries(formData));

  if (!validatedFields.success) {
    return {
      // TODO: create util
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, ...wordIds } = validatedFields.data;

  const { wordIdsToAdd, wordIdsToRemove } = buildDeckWordsPartOfDeck(
    prevWordIds,
    wordIds
  );

  try {
    await updateDeck(id, userId, name, wordIdsToAdd, wordIdsToRemove);

    revalidateTag("decks");

    return { success: true };
  } catch (e) {
    console.log(e);
    return { message: "Couldn't edit deck" };
  }
}

const makePartOfDeck = (id: number) => ({ wordId: id });

function buildDeckWordsPartOfDeck(
  prevWordIds: number[],
  wordIds: { [id: string]: unknown }
) {
  const wordIdsArray = Object.keys(wordIds).map((id) => Number(id));
  const wordIdsToAdd = wordIdsArray
    .filter((id) => id && !prevWordIds.includes(id))
    .map(makePartOfDeck);
  const wordIdsToRemove = prevWordIds
    .filter((id) => !wordIdsArray.includes(id))
    .map(makePartOfDeck);
  return { wordIdsToAdd, wordIdsToRemove };
}

// TODO: check why this is action instead of just a function
export async function deleteDeckAction({
  userId,
  id,
}: {
  userId: number;
  id: number;
}) {
  if (!userId) return { message: "Must be logged in" };

  try {
    await deleteDeck(id, userId);

    revalidateTag("decks");

    // TODO: be consistent in returning { success: true } (remove it everywhere or add it everywhere)
    return { success: true };
  } catch (e) {
    // TODO: make other error handling similar
    console.log(e);
    return { message: "Couldn't delete" };
  }
}
