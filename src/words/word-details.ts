"use server";

import { upsertUserWord } from "@/words/queries";
import { revalidateTag } from "next/cache";
import { Knowledge } from "~/generated/prisma";

export async function setWordDetails(
  // TODO: standardize usage of userId + word as string and user + word as object
  { userId, wordId }: { userId: number | false; wordId: number },
  state: unknown,
  formData: FormData
) {
  if (!userId) return { message: "Must be logged in" };

  const { translations, definitions, examples } = packDetials(formData);

  try {
    await upsertUserWord({
      userId,
      wordId,
      translations,
      definitions,
      examples,
    });
    revalidateTag("words");
    return { success: true };
  } catch (e) {
    console.log(e);
    return { message: "Couldn't update" };
  }
}

export async function setWordDetailsWithSeparator(
  { userId, wordId }: { userId: number | undefined; wordId: number },
  state: unknown,
  formData: FormData
) {
  if (!userId) return { message: "Must be logged in" };

  const translations = (formData.get("translations") as string).split(", ");
  const definitions = (formData.get("definitions") as string).split(", ");
  const examples = (formData.get("examples") as string).split(", ");

  try {
    await upsertUserWord({
      userId,
      wordId,
      translations,
      definitions,
      examples,
    });
    revalidateTag("words");
    return { success: true };
  } catch (e) {
    console.log(e);
    return { message: "Couldn't update" };
  }
}

export async function setWordDetailsWithKnowledge(
  {
    userId,
    wordId,
  }: {
    userId: number;
    wordId: number;
  },
  state: unknown,
  formData: FormData
) {
  if (!userId) return { message: "Must be logged in" };

  const { translations, definitions, examples } = packDetials(formData);
  // TODO: check if it's lowercase or uppercase, make according adjustments
  const knowledge = (
    formData.get("knowledge") as string
  ).toUpperCase() as Knowledge;

  try {
    await upsertUserWord({
      userId,
      wordId,
      translations,
      definitions,
      examples,
      knowledge,
    });
    revalidateTag("words");
    return { success: true };
  } catch (e) {
    console.log(e);
    return { message: "Couldn't update" };
  }
}

function packDetials(details: FormData) {
  const translations: string[] = [],
    definitions: string[] = [],
    examples: string[] = [];
  for (const [key, value] of details) {
    if (!value) {
      continue;
    }

    if (key.includes("translations-")) {
      translations.push(value as string);
    } else if (key.includes("definitions-")) {
      definitions.push(value as string);
    } else if (key.includes("examples-")) {
      examples.push(value as string);
    }
  }
  return { translations, definitions, examples };
}
