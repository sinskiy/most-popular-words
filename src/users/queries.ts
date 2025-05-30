"use server";

import prisma from "@/db/prisma";

export type QueriedUser = Awaited<ReturnType<typeof queryUser>>;

export async function queryUser(username: string) {
  return await prisma.user.findUnique({
    select: { id: true, username: true, streak: true, lastStreak: true },
    where: { username },
  });
}

export async function queryUserForAuth(username: string) {
  return await prisma.user.findUnique({
    where: { username },
    select: { password: true },
  });
}

export async function createUser(username: string, password: string) {
  await prisma.user.create({ data: { username, password } });
}

export async function resetUserStreak(userId: number) {
  await prisma.user.update({ data: { streak: 0 }, where: { id: userId } });
}

export async function increaseUserStreak(userId: number, streak: number) {
  await prisma.user.update({
    data: { streak: streak + 1, lastStreak: new Date() },
    where: { id: userId },
  });
}
