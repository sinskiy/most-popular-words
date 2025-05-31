import Pagination from "@/ui/pagination";
import Words from "@/components/words";
import Sort from "@/components/sort";
import Filters from "@/components/filters";
import { Suspense } from "react";
import Tip from "@/components/tip";
import { getOffset, getTotalPages } from "@/lib/pagination";
import { Languages } from "@/db/kysely";
import { PageProps } from "@/lib/routes";
import { DEFAULT_LANGUAGE, DEFAULT_SORT } from "@/words/const";
import { getUser } from "@/users/auth";
import { queryWords, queryWordsCount } from "@/words/queries";

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const { page, search, language, saved, sort, knowledge } =
    getHomeParams(params);
  const offset = getOffset(page);

  const user = await getUser();

  const getWordsBaseParams = {
    search,
    language,
    saved,
    knowledge,
    userId: user ? user.id : null,
  };
  const words = await queryWords({
    ...getWordsBaseParams,
    offset,
    sort,
  });
  const wordsCount = await queryWordsCount(getWordsBaseParams);

  return (
    <main className="flex flex-col gap-6">
      <header className="flex gap-2">
        <Suspense>
          <Sort />
          <Filters user={user} />
        </Suspense>
      </header>
      {user === false && <Tip>sign up or log in to save and learn words</Tip>}
      <Words list={words} user={user} />
      <Pagination curr={page} end={getTotalPages(wordsCount[0]?.count ?? 0)} />
    </main>
  );
}

function getHomeParams(params: {
  [key: string]: string | string[] | undefined;
}) {
  const easy = Boolean(params.easy);
  const good = Boolean(params.good);
  const hard = Boolean(params.hard);
  const again = Boolean(params.again);
  return {
    page: Number(params.page || 1),
    knowledge: { easy, good, hard, again },
    saved: Boolean(params.saved),
    search: (params.search ?? "") as string,
    sort: (params.sort ?? DEFAULT_SORT) as string,
    language: (params.language ?? DEFAULT_LANGUAGE) as Languages,
  };
}
