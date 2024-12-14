"use server";

import { revalidateTag } from "next/cache";
import db from "../configs/pg";
import { getUser } from "./auth";

export async function updateStreak(state: unknown, formData: FormData) {
  const user = await getUser();
  if (!user) {
    return { message: "Not logged in" };
  }

  try {
    if (
      Date.now() - new Date(user.last_streak).getTime() >
      1000 * 60 * 60 * 24 * 2
    ) {
      await db.query("UPDATE users SET streak = 0 WHERE username = $1", [
        user.username,
      ]);
    }
    revalidateTag("user");
  } catch (e) {
    return { message: "Couldn't update streak" };
  }

  return user.last_streak;
}
