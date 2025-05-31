"use server";

import { getActionError, getSuccess } from "@/lib/actions";
import { upsertUserWord } from "@/words/queries";
import { revalidateTag } from "next/cache";
import { Knowledge } from "~/generated/prisma";

export async function setWordDetails(
  { userId, wordId }: { userId: number | false; wordId: number },
  state: unknown,
  formData: FormData
) {
  if (!userId) return getActionError("Must be logged in");

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
  } catch (e) {
    console.log(e);
    return getActionError("Couldn't update");
  }
}

export async function setWordDetailsWithSeparator(
  { userId, wordId }: { userId: number | undefined; wordId: number },
  state: unknown,
  formData: FormData
) {
  if (!userId) return getActionError("Must be logged in");

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
    return getSuccess();
  } catch (e) {
    console.log(e);
    return getActionError("Couldn't update");
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
  if (!userId) return getActionError("Must be logged in");

  const { translations, definitions, examples } = packDetials(formData);
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
  } catch (e) {
    console.log(e);
    return getActionError("Couldn't update");
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
