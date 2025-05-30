import Pagination from "@/ui/pagination";
import Words from "@/components/words";
import { getOffset, getTotalPages } from "@/lib/pagination";
import { PageProps } from "@/lib/routes";
import { queryWords, queryWordsCount } from "@/words/queries";
import { getUser } from "@/users/auth";

export default async function Saved({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = (params.search ?? "") as string;
  const page = Number(params.page || 1);

  const user = await getUser();

  const offset = getOffset(page);

  const getWordsBaseParams = {
    userId: user ? user.id : null,
    language: "NO_LANGUAGE_FILTER",
    knowledge: "NO_KNOWLEDGE_FILTER",
    search,
    saved: true,
  } as const;
  const words = await queryWords({
    ...getWordsBaseParams,
    sort: "default",
    offset,
  });
  const wordsCount = await queryWordsCount(getWordsBaseParams);

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
