"use server";

import { z } from "zod";
import db from "../configs/pg";
import { Deck } from "../types/deck";
import { revalidateTag } from "next/cache";

export async function addDeck(
  { username }: { username: string },
  state: unknown,
  formData: FormData
) {
  if (!username) return { message: "Must be logged in" };

  const validatedFields = AddDeckSchema.safeParse(Object.fromEntries(formData));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, ...words } = validatedFields.data;

  try {
    const deckQuery = await db.query<Deck>(
      "INSERT INTO decks (name, username) VALUES ($1, $2) RETURNING *",
      [name, username]
    );
    const [deck] = deckQuery.rows;

    for (const word in words) {
      console.log(word, deck);

      if (word.includes("$ACTION")) continue;

      await db.query("INSERT INTO deck_words (deck_id, word) VALUES ($1, $2)", [
        deck.id,
        word,
      ]);
    }

    revalidateTag("decks");

    return { success: true };
  } catch (e) {
    console.log(e);
    return { message: "Couldn't add" };
  }
}

const AddDeckSchema = z
  .object({
    name: z.string().nonempty().max(255),
  })
  .passthrough();
