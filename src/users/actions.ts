"use server";

import { getUser, logIn, signUp } from "./auth";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { UserFormSchema } from "./schema";
import { resetUserStreak } from "./queries";
import { getActionError, getValidationErrors } from "@/lib/actions";
import { moreThanDayBefore } from "@/lib/utils";

export async function signUpAction(state: unknown, formData: FormData) {
  const validatedFields = UserFormSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!validatedFields.success) {
    return getValidationErrors(validatedFields);
  }

  const { username, password } = validatedFields.data;

  try {
    await signUp(username, password);
  } catch (e) {
    console.log(e);
    return getActionError(e as string);
  }

  redirect("/log-in");
}

export async function logInAction(state: unknown, formData: FormData) {
  const validatedFields = UserFormSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!validatedFields.success) {
    return getValidationErrors(validatedFields);
  }

  const { username, password } = validatedFields.data;

  try {
    await logIn(username, password);
  } catch (e) {
    return getActionError(e as string);
  }

  revalidateTag("user");

  redirect("/");
}

export async function getLastStreakWithSideEffects() {
  const user = await getUser();
  if (!user) {
    return getActionError("Not logged in");
  }

  try {
    if (moreThanDayBefore(new Date(user.lastStreak))) {
      await resetUserStreak(user.id);
    }
    revalidateTag("user");
  } catch (e) {
    console.log(e);
    return getActionError("Couldn't update streak");
  }

  return user.lastStreak;
}
