"use server";

import { SavedWord } from "../types/word";
import db from "../configs/pg";
import { redirect } from "next/navigation";
import { User } from "../types/user";
import { revalidateTag } from "next/cache";

export async function updateKnowledge({
  user,
  words,
}: {
  user: User;
  words: SavedWord[];
}) {
  try {
    if (
      Date.now() - new Date(user.last_streak).getTime() >
      1000 * 60 * 60 * 24
    ) {
      await db.query(
        "UPDATE users SET streak = $1, last_streak = $2 WHERE username = $3",
        [user.streak + 1, new Date().toISOString(), user.username]
      );
      revalidateTag("user");
    }
    for (const word of words) {
      if ("changed" in word) {
        await db.query(
          "INSERT INTO user_words (username, word, knowledge) VALUES ($1, $2, $3) ON CONFLICT (username, word) DO UPDATE SET knowledge = EXCLUDED.knowledge",
          [user.username, word.value, word.knowledge]
        );
      }
    }
  } catch (e) {
    console.log(e);
    return { message: "Couldn't update" };
  }
  redirect("/");
}
