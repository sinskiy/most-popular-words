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

const getWords = cacheDb(
  async (
    offset: number,
    search: string,
    source: string,
    type: string,
    language: string,
    sort: string,
    saved: boolean,
    username?: string
  ) =>
    await queryThrowError<Word>(
      "Couldn't get words",
      `SELECT value, occurrences, percentage, value in (SELECT word FROM saved WHERE username = $1) AS saved, translation, definition, example
           FROM user_words_with_percentage
           WHERE value LIKE $2 AND source LIKE $3 AND type LIKE $4 AND language = $5 AND (value in (SELECT word FROM saved WHERE username = $1) = $6 OR value in (SELECT word FROM saved WHERE username = $1) = true) AND (username = $1 OR username IS NULL)
       ORDER BY ` +
        getWordsSort(sort) +
        " LIMIT $7 OFFSET $8",
      [
        username,
        `%${search}%`,
        `%${source}%`,
        type,
        language,
        saved,
        ITEMS_PER_PAGE,
        offset,
      ]
    ),
  ["words"]
);

const getWordsCount = cacheDb(
  async (
    search: string,
    source: String,
    type: string,
    language: string,
    saved: boolean,
    username?: string
  ) =>
    await queryThrowError<{ count: number }>(
      "Couldn't get words count",
      "SELECT COUNT(*) FROM words WHERE value LIKE $1 AND source LIKE $2 AND type LIKE $3 AND language = $4 AND (value in (SELECT word FROM saved WHERE username = $5) = $6 OR value in (SELECT word FROM saved WHERE username = $5) = true)",
      [`%${search}%`, `%${source}%`, type, language, username, saved]
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
  const saved = Boolean(params.saved ?? false);

  const offset = (page - 1) * ITEMS_PER_PAGE;

  const user = await getUser();

  const words = await getWords(
    offset,
    search,
    source,
    type,
    language,
    sort,
    saved,
    typeof user !== "boolean" ? user.username : undefined
  );
  const wordsCount = await getWordsCount(
    search,
    source,
    type,
    language,
    saved,
    typeof user !== "boolean" ? user.username : undefined
  );
  const totalPages = Math.ceil(wordsCount.rows[0].count / ITEMS_PER_PAGE);

  return (
    <main className="flex flex-col gap-6">
      <header className="flex gap-2">
        <Suspense>
          <Sort />
          <Filters />
        </Suspense>
      </header>
      {user === false && (
        <div className="neutral px-12 max-md:px-6 py-4 font-medium">
          tip: sign up or log in to save and learn words
        </div>
      )}
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
