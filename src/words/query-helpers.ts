import { Knowledge } from "~/generated/kysely/types";
import { Knowledge as PrismaKnowledge } from "~/generated/prisma";
import { QueriedWord } from "./queries";

export function buildQuerySort(sort: string) {
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

export function buildQueryKnowledge(
  knowledge: Record<Knowledge, boolean> | "NO_KNOWLEDGE_FILTER"
): Knowledge[] | "NO_KNOWLEDGE_FILTER" {
  // TODO: think about a better way
  if (
    knowledge === "NO_KNOWLEDGE_FILTER" ||
    Object.values(knowledge).every((bool) => bool === false)
  ) {
    return "NO_KNOWLEDGE_FILTER";
  } else {
    return (
      Object.entries(knowledge)
        .filter(([, bool]) => bool === true)
        // TODO: typescript, wtf?
        .map(([value]) => value as Knowledge)
    );
  }
}

export function buildUserWords(
  userId: number,
  newWords: (QueriedWord & { changed?: true })[]
) {
  const userWords = [];
  for (const word of newWords) {
    if (word.changed === true) {
      const knowledge = (
        word.knowledge !== null ? word.knowledge.toUpperCase() : null
      ) as PrismaKnowledge | null;
      userWords.push({
        userId,
        wordId: word.id!,
        knowledge,
      });
    }
  }
  return userWords;
}
