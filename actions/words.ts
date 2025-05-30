import { sql } from "kysely";
import { Knowledge, kysely, Languages } from "../configs/kysely";
import cacheDb from "../lib/cache-db";
import { queryWithCustomError } from "../lib/query-throw-error";
import { ITEMS_PER_PAGE } from "../lib/pages";

interface GetGroupedWords extends GetGroupedWordsBase {
  // TODO: move to external file
  search: string;
  sort: ReturnType<typeof getWordsSort>;
  offset: number;
}

export const getGroupedWords = cacheDb(
  async ({
    userId,
    language,
    offset,
    sort,
    knowledge,
    saved,
    search,
  }: GetGroupedWords) =>
    await queryWithCustomError("Couldn't get words", () =>
      getGroupedWordsBaseQuery({
        userId,
        language,
        knowledge,
        saved,
        search,
      })
        .select(({ fn }) => [
          "word.id",
          "value",
          fn.sum<number>("occurrences").as("occurrences"),
          sql<number>`sum("occurrences")::float * 100 / sum(sum("occurrences")) over()`.as(
            "percentage"
          ),
          fn.coalesce("translations", sql.lit("{}")).as("translations"),
          fn.coalesce("definitions", sql.lit("{}")).as("definitions"),
          fn.coalesce("examples", sql.lit("{}")).as("examples"),
          "knowledge",
        ])
        .orderBy(sort[0], sort[1])
        .limit(ITEMS_PER_PAGE)
        .offset(offset)
        .execute()
    ),
  ["words"]
);

export const getWordsCount = cacheDb(
  async ({ userId, language, knowledge, saved, search }: GetGroupedWordsBase) =>
    await queryWithCustomError("Couldn't get words count", () =>
      getGroupedWordsBaseQuery({
        userId,
        language,
        knowledge,
        saved,
        search,
      })
        .select(sql<number>`count(*) over()`.as("count"))
        .limit(1)
        .execute()
    )
);

// TODO: move to external file
interface GetGroupedWordsBase {
  userId: number | null;
  language: Languages | "NO_LANGUAGE_FILTER";
  knowledge: Knowledge[] | false;
  saved: boolean;
  search: string;
}

function getGroupedWordsBaseQuery({
  userId,
  language,
  knowledge,
  saved,
  search,
}: GetGroupedWordsBase) {
  let query = kysely
    .selectFrom("word")
    .innerJoin("occurred_word", "occurred_word.word_id", "word.id")
    .fullJoin("user_word", (join) =>
      join
        .onRef("user_word.word_id", "=", "word.id")
        .on("user_word.user_id", "=", userId)
    )
    .select((eb) =>
      eb(
        "word.id",
        "in",
        eb
          .selectFrom("saved_word")
          .where("saved_word.user_id", "=", userId)
          .select("saved_word.word_id")
      ).as("saved")
    )
    // TODO: SQL, wtf?
    .groupBy([
      "word.id",
      "translations",
      "definitions",
      "examples",
      "knowledge",
      "occurrences",
    ]);
  if (language !== "NO_LANGUAGE_FILTER") {
    query = query.where("language", "=", language);
  }
  if (knowledge !== false) {
    query = query.where("knowledge", "in", knowledge);
  }
  if (saved === true) {
    query = query.where((eb) =>
      eb(
        "word.id",
        "in",
        eb
          .selectFrom("saved_word")
          .where("saved_word.user_id", "=", userId)
          .select("saved_word.word_id")
      )
    );
  }
  if (search) {
    // TODO: fuzzy search
    query = query.where("word.value", "like", `%${search}%`);
  }
  return query;
}

export function getWordsSort(sort: string) {
  switch (sort) {
    case "descending":
      return ["occurred_word.occurrences", "desc"] as const;
    case "ascending":
      return ["occurred_word.occurrences"] as const;
    case "alphabetical":
      return ["word.value"] as const;
    default:
      return ["occurred_word.occurrences", "desc"] as const;
  }
}

export function getWordsKnowledge(
  knowledge: Record<Knowledge, boolean>
): Knowledge[] | false {
  if (Object.values(knowledge).every((bool) => bool === false)) {
    return false;
  } else {
    return (
      Object.entries(knowledge)
        .filter(([, bool]) => bool === true)
        // ? typescript, wtf?
        .map(([value]) => value as Knowledge)
    );
  }
}
