import { getUser } from "../../actions/auth";
import Pagination from "../../components/pagination";
import Words from "../../components/words";
import cacheDb from "../../lib/cache-db";
import { getTotalPages, ITEMS_PER_PAGE } from "../../lib/db";
import queryThrowError from "../../lib/query-throw-error";
import { PageProps } from "../../types/page";
import { Word } from "../../types/word";

const getSaved = cacheDb(
  async (offset: number, username: string) =>
    await queryThrowError<Word>(
      "Couldn't get saved words",
      "SELECT value, occurrences, true as saved FROM words WHERE value in (SELECT word FROM saved WHERE username = $1) LIMIT $2 OFFSET $3",
      [username, ITEMS_PER_PAGE, offset]
    ),
  ["words"]
);

const getSavedCount = cacheDb(
  async (username: string) =>
    await queryThrowError<{ count: number }>(
      "Couldn't get saved count",
      "SELECT COUNT(*) FROM saved WHERE username = $1",
      [username]
    ),
  ["words"]
);

export default async function Saved({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page || 1);

  const user = await getUser();

  if (!user) {
    throw new Error("You must be logged in");
  }

  const offset = (page - 1) * ITEMS_PER_PAGE;

  const saved = await getSaved(offset, user.username);

  const savedCount = await getSavedCount(user.username);
  const totalPages = getTotalPages(savedCount);

  return (
    <main className="flex flex-col gap-4">
      <Words user={user} list={saved.rows} />
      <Pagination curr={page} end={totalPages} />
    </main>
  );
}
