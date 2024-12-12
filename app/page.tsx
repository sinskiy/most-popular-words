import Pagination from "../components/pagination";
import Words from "../components/words";
import { Word } from "../types/word";
import { PageProps } from "../types/page";
import queryThrowError from "../lib/query-throw-error";
import cacheDb from "../lib/cache-db";

const getWords = cacheDb(
  async (offset) =>
    await queryThrowError<Word>(
      "500",
      "Couldn't get words",
      "SELECT value, occurrences FROM words ORDER BY occurrences DESC LIMIT $1 OFFSET $2",
      [ITEMS_PER_PAGE, offset]
    )
);

const getWordsCount = cacheDb(
  async () =>
    await queryThrowError(
      "500",
      "Couldn't get words count",
      "SELECT COUNT(*) FROM words"
    )
);

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);

  const offset = (page - 1) * ITEMS_PER_PAGE;

  const words = await getWords(offset);

  const wordsCount = await getWordsCount();
  const totalPages = Math.ceil(wordsCount.rows[0].count / ITEMS_PER_PAGE);

  return (
    <main className="flex flex-col gap-4">
      <Words list={words.rows} />
      <Pagination curr={page} end={totalPages} />
    </main>
  );
}

const ITEMS_PER_PAGE = 10;
