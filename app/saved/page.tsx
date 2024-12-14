import { getUser } from "../../actions/auth";
import { getSaved, getSavedCount } from "../../actions/saved";
import Pagination from "../../components/pagination";
import Words from "../../components/words";
import { getTotalPages, ITEMS_PER_PAGE } from "../../lib/db";
import { PageProps } from "../../types/page";

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
