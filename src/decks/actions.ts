"use server";

import { revalidateTag } from "next/cache";
import { AddDeckSchema } from "./schema";
import { createDeck, deleteDeck, updateDeck } from "./queries";
import { getActionError, getValidationErrors } from "@/lib/actions";

export async function addDeckAction(
  { userId }: { userId: number },
  state: unknown,
  formData: FormData
) {
  if (!userId) return getActionError("Must be logged in");

  const validatedFields = AddDeckSchema.safeParse(Object.fromEntries(formData));

  if (!validatedFields.success) {
    return getValidationErrors(validatedFields);
  }

  const { name, ...wordIds } = validatedFields.data;

  const { wordIdsToAdd } = buildDeckWordsPartOfDeck([], wordIds);

  try {
    await createDeck(name, userId, wordIdsToAdd);

    revalidateTag("decks");
  } catch (e) {
    console.log(e);
    return getActionError("Couldn't add deck");
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
  if (!userId) return getActionError("Must be logged in");

  const validatedFields = AddDeckSchema.safeParse(Object.fromEntries(formData));

  if (!validatedFields.success) {
    return getValidationErrors(validatedFields);
  }

  const { name, ...wordIds } = validatedFields.data;

  const { wordIdsToAdd, wordIdsToRemove } = buildDeckWordsPartOfDeck(
    prevWordIds,
    wordIds
  );

  try {
    await updateDeck(id, userId, name, wordIdsToAdd, wordIdsToRemove);
  } catch (e) {
    console.log(e);
    return getActionError("Couldn't edit deck");
  }
  revalidateTag("decks");
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

export async function deleteDeckAction({
  userId,
  id,
}: {
  userId: number;
  id: number;
}) {
  if (!userId) return getActionError("Must be logged in");

  try {
    await deleteDeck(id, userId);
  } catch (e) {
    console.log(e);
    return getActionError("Couldn't delete deck");
  }
  revalidateTag("decks");
}
