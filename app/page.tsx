import Pagination from "../components/pagination";
import Words from "../components/words";
import { Word } from "../types/word";
import { PageProps } from "../types/page";
import queryThrowError from "../lib/query-throw-error";
import cacheDb from "../lib/cache-db";
import { getUser } from "../actions/auth";
import { ITEMS_PER_PAGE } from "../lib/db";
import Sort from "../components/sort";
import Filters from "../components/filters";
import { Suspense } from "react";

const getWords = cacheDb(
  async (
    offset: number,
    search: string,
    source: string,
    type: string,
    sort: string,
    saved: boolean,
    username?: string
  ) =>
    await queryThrowError<Word>(
      "Couldn't get words",
      `SELECT value, occurrences, percentage, value in (SELECT word FROM saved WHERE username = $1) AS saved, translation, definition, example
           FROM user_words_with_percentage
           WHERE value LIKE $2 AND source LIKE $3 AND type LIKE $4 AND (value in (SELECT word FROM saved WHERE username = $1) = $5 OR value in (SELECT word FROM saved WHERE username = $1) = true) AND (username = $1 OR username IS NULL)
       ORDER BY ` +
        getWordsSort(sort) +
        " LIMIT $6 OFFSET $7",
      [
        username,
        `%${search}%`,
        `%${source}%`,
        type,
        saved,
        ITEMS_PER_PAGE,
        offset,
      ]
    ),
  ["words"]
);

const getWordsCount = cacheDb(
  async (search: string) =>
    await queryThrowError<{ count: number }>(
      "Couldn't get words count",
      "SELECT COUNT(*) FROM words WHERE value LIKE $1",
      [`%${search}%`]
    )
);

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page || 1);
  const search = (params.search ?? "") as string;
  const sort = (params.sort ?? "descending") as string;
  const source = (params.source ?? "") as string;
  const type = (params.type ?? "%%") as string;
  const saved = Boolean(params.saved ?? false);

  const offset = (page - 1) * ITEMS_PER_PAGE;

  const user = await getUser();

  const words = await getWords(
    offset,
    search,
    source,
    type,
    sort,
    saved,
    typeof user !== "boolean" ? user.username : undefined
  );
  const wordsCount = await getWordsCount(search);
  const totalPages = Math.ceil(wordsCount.rows[0].count / ITEMS_PER_PAGE);

  return (
    <main className="flex flex-col gap-2">
      <header className="flex gap-2">
        <Suspense>
          <Sort />
          <Filters />
        </Suspense>
      </header>
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
