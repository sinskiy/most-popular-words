import Pagination from "../ui/pagination";
import Words from "../components/words";
import { DEFAULT_LANGUAGE, DEFAULT_SORT, Word } from "../types/word";
import { PageProps } from "../types/page";
import queryThrowError from "../lib/query-throw-error";
import cacheDb from "../lib/cache-db";
import { getUser } from "../actions/auth";
import { ITEMS_PER_PAGE } from "../lib/db";
import Sort from "../components/sort";
import Filters from "../components/filters";
import { Suspense } from "react";
import Tip from "../components/tip";

const getWords = cacheDb(
  async ({
    offset,
    search,
    source,
    type,
    language,
    easy,
    good,
    hard,
    again,
    sort,
    saved,
    username,
  }: {
    offset: number;
    search: string;
    source: string;
    type: string;
    language: string;
    easy: string | false;
    good: string | false;
    hard: string | false;
    again: string | false;
    sort: string;
    saved: boolean;
    username?: string;
  }) =>
    await queryThrowError<Word>(
      "Couldn't get words",
      `SELECT value, occurrences, percentage, saved, translations, definitions, examples
           FROM user_words_with_percentage($1)
        WHERE value LIKE $2 AND source LIKE $3 AND type LIKE $4 AND language = $5 AND (knowledge = $9 OR knowledge = $10 OR knowledge = $11 OR knowledge = $12 OR COALESCE(knowledge, '') LIKE $13) AND (saved = $6 OR saved = true)
           ORDER BY ` +
        getWordsSort(sort) +
        " LIMIT $7 OFFSET $8",
      [
        username ?? null,
        `%${search}%`,
        `%${source}%`,
        type,
        language,
        saved,
        ITEMS_PER_PAGE,
        offset,
        easy,
        good,
        hard,
        again,
        !easy && !good && !hard && !again ? "%%" : false,
      ]
    ),
  ["words"]
);

const getWordsCount = cacheDb(
  async ({
    search,
    source,
    type,
    language,
    saved,
    easy,
    good,
    hard,
    again,
    username,
  }: {
    search: string;
    source: string;
    type: string;
    language: string;
    saved: boolean;
    easy: string | false;
    good: string | false;
    hard: string | false;
    again: string | false;
    username?: string;
  }) =>
    await queryThrowError<{ count: number }>(
      "Couldn't get words count",
      "SELECT COUNT(*) FROM user_words_with_percentage($1) WHERE value LIKE $2 AND source LIKE $3 AND type LIKE $4 AND language = $5 AND (saved = $6 OR saved = true) AND (knowledge = $7 OR knowledge = $8 OR knowledge = $9 OR knowledge = $10 OR COALESCE(knowledge, '') LIKE $11)",
      [
        username,
        `%${search}%`,
        `%${source}%`,
        type,
        language,
        saved,
        easy,
        good,
        hard,
        again,
        !easy && !good && !hard && !again ? "%%" : false,
      ]
    )
);

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page || 1);
  const search = (params.search ?? "") as string;
  const sort = (params.sort ?? DEFAULT_SORT) as string;
  const language = (params.language ?? DEFAULT_LANGUAGE) as string;
  const source = (params.source ?? "") as string;
  const type = (params.type ?? "%%") as string;
  const easy = params.easy ? "easy" : false;
  const good = params.good ? "good" : false;
  const hard = params.hard ? "hard" : false;
  const again = params.again ? "again" : false;
  const saved = Boolean(params.saved ?? false);

  const offset = (page - 1) * ITEMS_PER_PAGE;

  const user = await getUser();

  const words = await getWords({
    offset,
    search,
    source,
    type,
    language,
    easy,
    good,
    hard,
    again,
    sort,
    saved,
    username: typeof user !== "boolean" ? user.username : undefined,
  });
  const wordsCount = await getWordsCount({
    search,
    source,
    type,
    language,
    saved,
    easy,
    good,
    hard,
    again,
    username: typeof user !== "boolean" ? user.username : undefined,
  });
  const totalPages = Math.ceil(wordsCount.rows[0].count / ITEMS_PER_PAGE);

  return (
    <main className="flex flex-col gap-6">
      <header className="flex gap-2">
        <Suspense>
          <Sort />
          <Filters user={user} />
        </Suspense>
      </header>
      {user === false && <Tip>sign up or log in to save and learn words</Tip>}
      <Words list={words.rows} user={user} />
      <Pagination curr={page} end={totalPages} />
    </main>
  );
}

function getWordsSort(sort: string) {
  switch (sort) {
    case "descending":
      return "occurrences DESC";
    case "ascending":
      return "occurrences";
    case "alphabetical":
      return "value";
    default:
      return "occurrences DESC";
  }
}
