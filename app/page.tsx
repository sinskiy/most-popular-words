import Pagination from "../components/pagination";
import Words from "../components/words";
import { Word } from "../types/word";
import { PageProps } from "../types/page";
import queryThrowError from "../lib/query-throw-error";

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  return (
    <main className="flex flex-col gap-4">
      <WordsServer page={page} />
      <Pagination curr={1} end={1200} />
    </main>
  );
}

const ITEMS_PER_PAGE = 10;

async function WordsServer({ page }: { page: number }) {
  const offset = (page - 1) * ITEMS_PER_PAGE;

  const words = await queryThrowError<Word>(
    "500",
    "Couldn't get words",
    "SELECT value, occurrences FROM words LIMIT $1 OFFSET $2",
    [ITEMS_PER_PAGE, offset]
  );

  return <Words list={words.rows} />;
}
