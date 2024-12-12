import Pagination from "../components/pagination";
import Words from "../components/words";
import { Word } from "../types/word";
import { PageProps } from "../types/page";
import queryThrowError from "../lib/query-throw-error";
import cacheDb from "../lib/cache-db";

const getWords = cacheDb(
  async (offset: number, search: string) =>
    await queryThrowError<Word>(
      "Couldn't get words",
      "SELECT value, occurrences FROM words WHERE value LIKE $1 ORDER BY occurrences DESC LIMIT $2 OFFSET $3",
      [`%${search}%`, ITEMS_PER_PAGE, offset]
    )
);

const getWordsCount = cacheDb(
  async (search: string) =>
    await queryThrowError(
      "Couldn't get words count",
      "SELECT COUNT(*) FROM words WHERE value LIKE $1",
      [`%${search}%`]
    )
);

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page || 1);
  const search = typeof params.search === "string" ? params.search ?? "" : "";

  const offset = (page - 1) * ITEMS_PER_PAGE;

  const words = await getWords(offset, search);

  const wordsCount = await getWordsCount(search);
  const totalPages = Math.ceil(wordsCount.rows[0].count / ITEMS_PER_PAGE);

  return (
    <main className="flex flex-col gap-4">
      <Words list={words.rows} />
      <Pagination curr={page} end={totalPages} />
    </main>
  );
}

const ITEMS_PER_PAGE = 10;
