"use server";

import { SavedWord } from "../types/word";
import db from "../configs/pg";
import { redirect } from "next/navigation";

export async function updateKnowledge({
  username,
  words,
}: {
  username: string;
  words: SavedWord[];
}) {
  try {
    for (const word of words) {
      if ("changed" in word) {
        await db.query(
          "INSERT INTO user_words (username, word, knowledge) VALUES ($1, $2, $3) ON CONFLICT (username, word) DO UPDATE SET knowledge = EXCLUDED.knowledge",
          [username, word.value, word.knowledge]
        );
      }
    }
  } catch (e) {
    console.log(e);
    return { message: "Couldn't update" };
  }
  redirect("/");
}
