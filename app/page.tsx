import Pagination from "../components/pagination";
import Words from "../components/words";
import { Word } from "../types/word";
import { PageProps } from "../types/page";
import queryThrowError from "../lib/query-throw-error";
import cacheDb from "../lib/cache-db";
import { getUser } from "../actions/auth";
import { ITEMS_PER_PAGE } from "../lib/db";

const getWords = cacheDb(
  async (offset: number, search: string, username?: string) =>
    await queryThrowError<Word>(
      "Couldn't get words",
      "SELECT value, occurrences, percentage, value in (SELECT word FROM saved WHERE username = $1) AS saved FROM words_with_percentage WHERE value LIKE $2 ORDER BY occurrences DESC LIMIT $3 OFFSET $4",
      [username, `%${search}%`, ITEMS_PER_PAGE, offset]
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

  const offset = (page - 1) * ITEMS_PER_PAGE;

  const user = await getUser();

  const words = await getWords(
    offset,
    search,
    typeof user !== "boolean" ? user.username : undefined
  );

  const wordsCount = await getWordsCount(search);
  const totalPages = Math.ceil(wordsCount.rows[0].count / ITEMS_PER_PAGE);

  return (
    <main className="flex flex-col gap-4">
      <Words list={words.rows} user={user} />
      <Pagination curr={page} end={totalPages} />
    </main>
  );
}
