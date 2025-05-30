"use server";

import { revalidateTag } from "next/cache";
import { User } from "../types/user";
import prisma from "../configs/prisma";

// TODO: fix any
export async function save({ user, word }: { user: User | false; word: any }) {
  if (user === false) return;

  if (word.saved) {
    await prisma.savedWord.deleteMany({
      where: { wordId: word.id, userId: user.id },
    });
  } else {
    await prisma.savedWord.create({
      data: {
        word: { connect: { id: word.id } },
        user: { connect: { id: user.id } },
      },
    });
  }
  revalidateTag("words");
}
