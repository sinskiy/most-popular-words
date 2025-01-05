"use server";

import { revalidateTag } from "next/cache";
import db from "../configs/pg";

export async function setWordDetails(
  { username, word }: { username: string | false; word: string },
  state: unknown,
  formData: FormData
) {
  if (!username) return { message: "Must be logged in" };

  try {
    const { translations, definitions, examples } = packageDetails(formData);
    await db.query(
      `INSERT INTO user_words (username, word, translations, definitions, examples)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (username, word) DO UPDATE SET
            translations = EXCLUDED.translations,
            definitions = EXCLUDED.definitions,
            examples = EXCLUDED.examples`,
      [username, word, translations, definitions, examples]
    );

    revalidateTag("words");

    return { success: true };
  } catch (e) {
    console.log(e);
    return { message: "Couldn't update" };
  }
}

export async function setWordDetailsWithSeparator(
  { username, word }: { username: string | false; word: string },
  state: unknown,
  formData: FormData
) {
  if (!username) return { message: "Must be logged in" };

  try {
    const translations = (formData.get("translations") as string).split(", ");
    const definitions = (formData.get("definitions") as string).split(", ");
    const examples = (formData.get("examples") as string).split(", ");

    await db.query(
      `INSERT INTO user_words (username, word, translations, definitions, examples)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (username, word) DO UPDATE SET
            translations = EXCLUDED.translations,
            definitions = EXCLUDED.definitions,
            examples = EXCLUDED.examples`,
      [username, word, translations, definitions, examples]
    );

    revalidateTag("words");

    return { success: true };
  } catch (e) {
    console.log(e);
    return { message: "Couldn't update" };
  }
}

export async function setWordDetailsWithKnowledge(
  {
    username,
    word,
  }: {
    username: string;
    word: string;
  },
  state: unknown,
  formData: FormData
) {
  if (!username) return { message: "Must be logged in" };

  try {
    const { translations, definitions, examples } = packageDetails(formData);

    await db.query(
      `INSERT INTO user_words (username, word, translations, definitions, examples, knowledge)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (username, word) DO UPDATE SET
            translations = EXCLUDED.translations,
            definitions = EXCLUDED.definitions,
            examples = EXCLUDED.examples,
            knowledge = EXCLUDED.knowledge`,
      [
        username,
        word,
        translations,
        definitions,
        examples,
        formData.get("knowledge"),
      ]
    );

    revalidateTag("words");

    return { success: true };
  } catch (e) {
    console.log(e);
    return { message: "Couldn't update" };
  }
}

function packageDetails(details: FormData) {
  const translations: string[] = [],
    definitions: string[] = [],
    examples: string[] = [];
  for (const [key, value] of details) {
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
