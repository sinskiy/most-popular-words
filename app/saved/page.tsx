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

  const offset = (page - 1) * ITEMS_PER_PAGE;

  return (
    <main className="flex flex-col gap-2">
      {user ? (
        <>
          <Words
            user={user}
            list={(await getSaved(offset, user.username)).rows}
          />
          <Pagination
            curr={page}
            end={getTotalPages(await getSavedCount(user.username))}
          />
        </>
      ) : (
        <p>Must be logged in</p>
      )}
    </main>
  );
}
