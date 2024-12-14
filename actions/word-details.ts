"use server";

import { revalidateTag } from "next/cache";
import db from "../configs/pg";

export async function setWordDetails(
  { username, word }: { username: string | false; word: string },
  state: unknown,
  formData: FormData
) {
  if (!username) return { message: "Must be logged in" };

  try {
    await db.query(
      `INSERT INTO user_words (username, word, translation, definition, example)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (username, word) DO UPDATE SET
          translation = EXCLUDED.translation,
          definition = EXCLUDED.definition,
          example = EXCLUDED.example`,
      [
        username,
        word,
        formData.get("translation"),
        formData.get("definition"),
        formData.get("example"),
      ]
    );
    revalidateTag("words");
  } catch (e) {
    return { message: "Couldn't update" };
  }
}
