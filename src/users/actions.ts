"use server";

import { getUser, logIn, signUp } from "./auth";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { UserFormSchema } from "./schema";
import { resetUserStreak } from "./queries";

export async function signUpAction(state: unknown, formData: FormData) {
  const validatedFields = UserFormSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { username, password } = validatedFields.data;

  const error = await signUp(username, password);
  if (error) {
    return error;
  }

  redirect("/log-in");
}

export async function logInAction(state: unknown, formData: FormData) {
  const validatedFields = UserFormSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { username, password } = validatedFields.data;

  const error = await logIn(username, password);
  if (error) {
    return error;
  }

  revalidateTag("user");

  redirect("/");
}

export async function getLastStreakWithSideEffects() {
  const user = await getUser();
  if (!user) {
    return { message: "Not logged in" };
  }

  try {
    if (
      Date.now() - new Date(user.lastStreak).getTime() >
      1000 * 60 * 60 * 24 * 2
    ) {
      await resetUserStreak(user.id);
    }
    revalidateTag("user");
  } catch {
    return { message: "Couldn't update streak" };
  }

  return user.lastStreak;
}
