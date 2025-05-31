import Pagination from "@/ui/pagination";
import Words from "@/components/words";
import { getOffset, getTotalPages } from "@/lib/pagination";
import { PageProps } from "@/lib/routes";
import { queryWords, queryWordsCount } from "@/words/queries";
import { getUser } from "@/users/auth";
import CustomErrorPage from "@/components/error-page";

export default async function Saved({ searchParams }: PageProps) {
  const [user, params] = await Promise.all([getUser(), searchParams]);
  if (!user) {
    return <CustomErrorPage title={401}>Unauthorized</CustomErrorPage>;
  }

  const search = (params.search ?? "") as string;
  const page = Number(params.page || 1);

  const offset = getOffset(page);

  const getWordsBaseParams = {
    userId: user ? user.id : null,
    language: "NO_LANGUAGE_FILTER",
    knowledge: "NO_KNOWLEDGE_FILTER",
    search,
    saved: true,
  } as const;
  const wordsQuery = await queryWords({
    ...getWordsBaseParams,
    sort: "default",
    offset,
  });
  const wordsCountQuery = queryWordsCount(getWordsBaseParams);
  const [words, wordsCount] = await Promise.all([wordsQuery, wordsCountQuery]);

  return (
    <main className="flex flex-col gap-2">
      <Words user={user} list={words} />
      <Pagination curr={page} end={getTotalPages(wordsCount[0]?.count ?? 0)} />
    </main>
  );
}
