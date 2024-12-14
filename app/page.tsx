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

const getWords = cacheDb(
  async (
    offset: number,
    search: string,
    source: string,
    sort: string,
    saved: boolean,
    username?: string
  ) =>
    await queryThrowError<Word>(
      "Couldn't get words",
      "SELECT value, occurrences, percentage, value in (SELECT word FROM saved WHERE username = $1) AS saved FROM words_with_percentage WHERE value LIKE $2 AND source LIKE $3 AND (value in (SELECT word FROM saved WHERE username = $1) = $4 OR value in (SELECT word FROM saved WHERE username = $1) = true) ORDER BY " +
        getWordsSort(sort) +
        " LIMIT $5 OFFSET $6",
      [username, `%${search}%`, `%${source}%`, saved, ITEMS_PER_PAGE, offset]
    ),
  ["words"]
  // true -> saved = true AND saved = true
  // false -> saved = false AND saved = true
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
  const saved = Boolean(params.saved ?? false);

  const offset = (page - 1) * ITEMS_PER_PAGE;

  const user = await getUser();

  const words = await getWords(
    offset,
    search,
    source,
    sort,
    saved,
    typeof user !== "boolean" ? user.username : undefined
  );
  const wordsCount = await getWordsCount(search);
  const totalPages = Math.ceil(wordsCount.rows[0].count / ITEMS_PER_PAGE);

  return (
    <main className="flex flex-col gap-4">
      <header className="flex gap-2">
        <Sort />
        <Filters />
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
