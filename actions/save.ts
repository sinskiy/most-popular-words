"use server";

import { revalidateTag } from "next/cache";
import db from "../configs/pg";
import { User } from "../types/user";
import { Word } from "../types/word";

export async function save(
  { user, word }: { user: User | false; word: Word },
  state: unknown,
  formData: FormData
) {
  if (user === false) return;

  if (word.saved) {
    await db.query("DELETE FROM saved WHERE word = $1 AND username = $2", [
      word.value,
      user.username,
    ]);
  } else {
    await db.query("INSERT INTO saved (word, username) VALUES ($1, $2)", [
      word.value,
      user.username,
    ]);
  }
  revalidateTag("words");
}
