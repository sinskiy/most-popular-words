"use server";

import { revalidateTag } from "next/cache";
import { getUser } from "./auth";
import prisma from "../configs/prisma";

export async function updateStreak() {
  const user = await getUser();
  if (!user) {
    return { message: "Not logged in" };
  }

  try {
    if (
      Date.now() - new Date(user.lastStreak).getTime() >
      1000 * 60 * 60 * 24 * 2
    ) {
      await prisma.user.update({ data: { streak: 0 }, where: { id: user.id } });
    }
    revalidateTag("user");
  } catch {
    return { message: "Couldn't update streak" };
  }

  return user.lastStreak;
}
