"use server";

import { revalidateTag } from "next/cache";
import { createSavedWord, deleteSavedWord } from "@/words/queries";
import { redirect } from "next/navigation";
import prisma from "@/db/prisma";
import { increaseUserStreak, QueriedUser } from "@/users/queries";
import { QueriedWord } from "@/words/queries";
import { buildUserWords } from "./query-helpers";
import { moreThanDayBefore } from "@/lib/utils";
import { getActionError } from "@/lib/actions";

export async function saveWordAction({
  userId,
  wordId,
  saved,
}: {
  userId: number;
  wordId: number;
  saved: boolean;
}) {
  try {
    if (saved) {
      await deleteSavedWord(userId, wordId);
    } else {
      await createSavedWord(userId, wordId);
    }
  } catch (e) {
    console.log(e);
    return getActionError("Couldn't save");
  }
  revalidateTag("words");
}

export async function updateKnowledge({
  user,
  words,
}: {
  user: QueriedUser;
  words: (QueriedWord & { changed?: true })[];
}) {
  if (!user) return getActionError("Must be logged in");

  try {
    if (moreThanDayBefore(new Date(user.lastStreak))) {
      await increaseUserStreak(user.id, user.streak);
      revalidateTag("user");
    }
    const userWords = buildUserWords(user.id, words);
    await prisma.$transaction(
      userWords.map(({ userId, wordId, knowledge }) =>
        // TypeError occurs when I use upsertUserWord, I don't know why
        prisma.userWord.upsert({
          create: { userId, wordId, knowledge },
          update: { knowledge },
          where: { userId_wordId: { userId, wordId } },
        })
      )
    );
  } catch (e) {
    console.log(e);
    return getActionError("Couldn't update");
  }
  redirect("/");
}
