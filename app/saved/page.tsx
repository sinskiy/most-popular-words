import { getUser } from "../../actions/auth";
import Pagination from "../../ui/pagination";
import Words from "../../components/words";
import { PageProps } from "../../types/page";
import { getOffset, getTotalPages } from "../../lib/pages";
import { getGroupedWords, getWordsCount } from "../../actions/words";

export default async function Saved({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = (params.search ?? "") as string;
  const page = Number(params.page || 1);

  const user = await getUser();

  const offset = getOffset(page);

  const getWordsBaseParams = {
    search,
    language: "NO_LANGUAGE_FILTER",
    saved: true,
    knowledge: false,
    userId: user ? user.id : null,
  } as const;
  const words = await getGroupedWords({
    ...getWordsBaseParams,
    sort: ["occurred_word.occurrences"],
    offset,
  });
  const wordsCount = await getWordsCount(getWordsBaseParams);

  return (
    <main className="flex flex-col gap-2">
      {user ? (
        <>
          <Words user={user} list={words} />
          <Pagination
            curr={page}
            end={getTotalPages(wordsCount[0]?.count ?? 0)}
          />
        </>
      ) : (
        <p>Must be logged in</p>
      )}
    </main>
  );
}
