"use server";

import { z } from "zod";
import db from "../configs/pg";
import { Deck } from "../types/deck";
import { revalidateTag } from "next/cache";

export async function addDeck(
  { username, edit, id }: { username: string; edit?: boolean; id?: number },
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
    let deckId: number;
    if (edit) {
      const deckQuery = await db.query<Deck>(
        "UPDATE decks SET name = $1 WHERE id = $2 RETURNING id",
        [name, id]
      );
      await db.query("DELETE FROM deck_words WHERE deck_id = $1", [id]);
      deckId = deckQuery.rows[0].id;
    } else {
      const deckQuery = await db.query<Deck>(
        "INSERT INTO decks (name, username) VALUES ($1, $2) RETURNING id",
        [name, username]
      );
      deckId = deckQuery.rows[0].id;
    }

    for (const word in words) {
      if (word.includes("$ACTION")) continue;

      await db.query("INSERT INTO deck_words (deck_id, word) VALUES ($1, $2)", [
        deckId,
        word,
      ]);
    }

    revalidateTag("decks");

    return { success: true };
  } catch (e) {
    console.log(e);
    return { message: `Couldn't ${edit ? "edit" : "add"}` };
  }
}

export async function deleteDeck(
  { username, id }: { username: string; id: number },
  state: unknown,
  formData: FormData
) {
  if (!username) return { message: "Must be logged in" };

  try {
    const deleted = await db.query(
      "DELETE FROM decks WHERE id = $1 AND username = $2 RETURNING *",
      [id, username]
    );
    if (!deleted.rowCount) {
      throw new Error();
    }

    revalidateTag("decks");

    return { success: true };
  } catch (e) {
    console.log(e);
    return { message: "Couldn't delete" };
  }
}

const AddDeckSchema = z
  .object({
    name: z.string().nonempty().max(255),
  })
  .passthrough()
  .refine(
    ({ name, ...words }) =>
      Object.keys(words).filter((word) => !word.includes("$ACTION")).length > 0,
    { message: "Choose at least one word", path: [""] }
  );
