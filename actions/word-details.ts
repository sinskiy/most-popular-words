"use server";

import { revalidateTag } from "next/cache";
import prisma from "../configs/prisma";
import { Knowledge } from "../generated/prisma";

export async function setWordDetails(
  // TODO: standardize usage of userId + word as string and user + word as object
  { userId, wordId }: { userId: number | false; wordId: number },
  state: unknown,
  formData: FormData
) {
  if (!userId) return { message: "Must be logged in" };

  try {
    const { translations, definitions, examples } = packDetials(formData);
    await prisma.userWord.upsert({
      where: { userId_wordId: { userId, wordId } },
      update: { translations, definitions, examples },
      create: { userId, wordId, translations, definitions, examples },
    });

    revalidateTag("words");

    return { success: true };
  } catch (e) {
    console.log(e);
    return { message: "Couldn't update" };
  }
}

export async function setWordDetailsWithSeparator(
  { userId, wordId }: { userId: number | false; wordId: number },
  state: unknown,
  formData: FormData
) {
  if (!userId) return { message: "Must be logged in" };

  try {
    const translations = (formData.get("translations") as string).split(", ");
    const definitions = (formData.get("definitions") as string).split(", ");
    const examples = (formData.get("examples") as string).split(", ");

    await prisma.userWord.upsert({
      where: { userId_wordId: { userId, wordId } },
      update: { translations, examples, definitions },
      create: { userId, wordId, translations, definitions, examples },
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

  try {
    const { translations, definitions, examples } = packDetials(formData);
    const knowledge = formData.get("knowledge") as Knowledge;

    await prisma.userWord.upsert({
      where: { userId_wordId: { userId, wordId } },
      update: { translations, definitions, examples, knowledge },
      create: {
        userId,
        wordId,
        translations,
        definitions,
        examples,
        knowledge,
      },
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
