"use server";

import { revalidateTag } from "next/cache";
import { User } from "../types/user";
import prisma from "../configs/prisma";
import { Word } from "./words";

// TODO: update user type
export async function save({ user, word }: { user: User | false; word: Word }) {
  if (user === false) return;

  if (word.saved) {
    await prisma.savedWord.deleteMany({
      // TODO: check why it says it can be null
      where: { wordId: word.id!, userId: user.id },
    });
  } else {
    await prisma.savedWord.create({
      data: {
        // TODO: same
        word: { connect: { id: word.id! } },
        user: { connect: { id: user.id } },
      },
    });
  }
  revalidateTag("words");
}
