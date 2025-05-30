"use server";

import { ITEMS_PER_PAGE } from "@/lib/pagination";
import kysely from "@/db/kysely";
import { sql } from "kysely";
import { Knowledge, Languages } from "~/generated/kysely/types";
import { buildQueryKnowledge, buildQuerySort } from "./query-helpers";
import { Knowledge as PrismaKnowledge } from "~/generated/prisma";
import { queryWithCustomError } from "@/lib/utils";
import prisma from "@/db/prisma";

interface WordsQuery extends WordsQueryBase {
  search: string;
  sort: string;
  offset: number;
}

export type QueriedWord = Awaited<ReturnType<typeof queryWords>>[number];

export async function queryWords({
  userId,
  language,
  offset,
  sort,
  knowledge,
  saved,
  search,
}: WordsQuery) {
  const querySort = buildQuerySort(sort);
  return await queryWithCustomError("Couldn't get words", () =>
    wordsQueryBase({
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
      .orderBy(querySort[0], querySort[1])
      .limit(ITEMS_PER_PAGE)
      .offset(offset)
      .execute()
  );
}

export async function queryWordsCount({
  userId,
  language,
  knowledge,
  saved,
  search,
}: WordsQueryBase) {
  return await queryWithCustomError("Couldn't get words count", () =>
    wordsQueryBase({
      userId,
      language,
      knowledge,
      saved,
      search,
    })
      .select(sql<number>`count(*) over()`.as("count"))
      .limit(1)
      .execute()
  );
}

interface WordsQueryBase {
  userId: number | null;
  language: Languages | "NO_LANGUAGE_FILTER";
  knowledge: Record<Knowledge, boolean> | "NO_KNOWLEDGE_FILTER";
  saved: boolean;
  search: string;
}

function wordsQueryBase({
  userId,
  language,
  knowledge,
  saved,
  search,
}: WordsQueryBase) {
  const queryKnowledge = buildQueryKnowledge(knowledge);
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
  if (queryKnowledge !== "NO_KNOWLEDGE_FILTER") {
    query = query.where("knowledge", "in", queryKnowledge);
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

export async function deleteSavedWord(userId: number, wordId: number) {
  await prisma.savedWord.delete({
    where: { userId_wordId: { userId, wordId } },
  });
}

export async function createSavedWord(userId: number, wordId: number) {
  await prisma.savedWord.create({
    data: {
      word: { connect: { id: wordId } },
      user: { connect: { id: userId } },
    },
  });
}

export async function upsertUserWord({
  userId,
  wordId,
  translations,
  definitions,
  examples,
  knowledge,
}: {
  userId: number;
  wordId: number;
  translations?: string[];
  definitions?: string[];
  examples?: string[];
  knowledge?: PrismaKnowledge;
}) {
  await prisma.userWord.upsert({
    // TODO: write a blog post about this
    where: { userId_wordId: { userId, wordId } },
    update: { translations, definitions, examples },
    create: { userId, wordId, translations, definitions, examples, knowledge },
  });
}
