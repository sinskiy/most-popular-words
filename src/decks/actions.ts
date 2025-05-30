"use server";

import { revalidateTag } from "next/cache";
import { AddDeckSchema } from "./schema";
import { createDeck, createDeckWords, deleteDeck, updateDeck } from "./queries";

// TODO: separate into two actions (edit and add)
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

  try {
    const deck = await createDeck(name, userId);
    const deckWords = buildDeckWords(deck.id, wordIds);
    // TODO: make it a single query
    await createDeckWords(deckWords);

    revalidateTag("decks");

    return { success: true };
  } catch (e) {
    console.log(e);
    return { message: "Couldn't add deck" };
  }
}

export async function editDeckAction(
  { userId, id }: { userId: number; id: number },
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

  try {
    await updateDeck(id, userId, name);
    const deckWords = buildDeckWords(id, wordIds);
    // TODO: make it a single query
    await createDeckWords(deckWords);

    revalidateTag("decks");

    return { success: true };
  } catch (e) {
    console.log(e);
    return { message: "Couldn't edit deck" };
  }
}

function buildDeckWords(deckId: number, wordIds: { [id: string]: unknown }) {
  const deckWords = [];
  for (const id in wordIds) {
    if (!id.includes("$ACTION")) {
      deckWords.push({ deckId, wordId: Number(id) });
    }
  }
  return deckWords;
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
