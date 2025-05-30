"use server";

import { redirect } from "next/navigation";
import { User } from "../types/user";
import { revalidateTag } from "next/cache";
import prisma from "../configs/prisma";
import { SavedWord } from "../generated/prisma";

export async function updateKnowledge({
  user,
  words,
}: {
  user: User;
  words: (SavedWord & { changed?: true })[];
}) {
  try {
    if (
      Date.now() - new Date(user.lastStreak).getTime() >
      1000 * 60 * 60 * 24
    ) {
      await prisma.user.update({
        data: { streak: user.streak + 1, lastStreak: new Date() },
        where: { id: user.id },
      });
      revalidateTag("user");
    }
    const wordsToInsert = [];
    for (const word of words) {
      if (word.changed === true)
        wordsToInsert.push({
          userId: user.id,
          wordId: word.id,
          knowledge: word.knowledge,
        });
    }
    await prisma.$transaction(
      wordsToInsert.map(({ userId, wordId, knowledge }) =>
        prisma.userWord.upsert({
          create: { userId, wordId, knowledge },
          update: { knowledge },
          // TODO: write a blog post about this
          where: { userId_wordId: { userId, wordId } },
        })
      )
    );
  } catch (e) {
    console.log(e);
    return { message: "Couldn't update" };
  }
  redirect("/");
}
