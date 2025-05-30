import { kysely, Languages, SourceType } from "../configs/kysely.ts";

interface InsertWords {
  source: string;
  sourceType: SourceType;
  language: Languages;
  countedWords: Map<string, number>;
  doDeleteAllWords: boolean;
}

export default async function insertWords({
  source,
  sourceType,
  language,
  countedWords,
  doDeleteAllWords,
}: InsertWords) {
  if (doDeleteAllWords) {
    await kysely.deleteFrom("word").execute();
    console.log("deleted all words");
  }

  const wordValues = countedWords.keys().toArray();

  const wordsToInsert = wordValues.map((value) => ({ value, language }));
  const insertedWords = await kysely
    .insertInto("word")
    .values(wordsToInsert)
    .onConflict((oc) => oc.columns(["value", "language"]).doNothing())
    .returning(["id", "value"])
    .execute();
  const wordsInsertedBefore = await kysely
    .selectFrom("word")
    .select(["id", "value"])
    .where((eb) =>
      eb.and([
        eb("value", "in", wordValues),
        eb("id", "not in", getIds(insertedWords)),
      ])
    )
    .execute();
  const allWordsWithIds = insertedWords.concat(wordsInsertedBefore);

  const allOccurredWords = allWordsWithIds.map((wordWithId) => ({
    word_id: wordWithId.id,
    occurrences: countedWords.get(wordWithId.value)!,
    source,
    source_type: sourceType,
  }));
  await kysely.insertInto("occurred_word").values(allOccurredWords).execute();
}

function getIds(arr: { id: number }[]) {
  return arr.map((item) => item.id);
}
