"use server";

import { z } from "zod";
import { revalidateTag } from "next/cache";
import prisma from "../configs/prisma";

// TODO: separate into two actions (edit and add)
export async function addDeck(
  { userId, edit, id }: { userId: number; edit?: boolean; id?: number },
  state: unknown,
  formData: FormData
) {
  if (!userId) return { message: "Must be logged in" };

  const validatedFields = AddDeckSchema.safeParse(Object.fromEntries(formData));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, ...wordIds } = validatedFields.data;

  try {
    let deckId: number;
    if (edit) {
      const deck = await prisma.deck.update({ where: { id }, data: { name } });
      deckId = deck.id;
      // TODO: check why I'm doing this
      await prisma.deckWord.deleteMany({ where: { id } });
      // await db.query("DELETE FROM deck_words WHERE deck_id = $1", [id]);
    } else {
      const deck = await prisma.deck.create({
        data: { name, userId },
        select: { id: true },
      });
      deckId = deck.id;
    }

    const wordsToInsert = [];

    for (const id in wordIds) {
      if (!id.includes("$ACTION"))
        wordsToInsert.push({ deckId, wordId: Number(id) });
    }

    await prisma.deckWord.createMany({ data: wordsToInsert });

    revalidateTag("decks");

    return { success: true };
  } catch (e) {
    console.log(e);
    return { message: `Couldn't ${edit ? "edit" : "add"}` };
  }
}

export async function deleteDeck({
  userId,
  id,
}: {
  userId: number;
  id: number;
}) {
  if (!userId) return { message: "Must be logged in" };

  try {
    await prisma.deck.delete({ where: { id, userId } });

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ name, ...wordIds }) =>
      Object.keys(wordIds).filter((id) => !id.includes("$ACTION")).length > 0,
    { message: "Choose at least one word", path: [""] }
  );
