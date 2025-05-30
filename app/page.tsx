import Pagination from "../ui/pagination";
import Words from "../components/words";
import { DEFAULT_LANGUAGE, DEFAULT_SORT } from "../types/word";
import { PageProps } from "../types/page";
import { getUser } from "../actions/auth";
import Sort from "../components/sort";
import Filters from "../components/filters";
import { Suspense } from "react";
import Tip from "../components/tip";
import {
  getGroupedWords,
  getWordsCount,
  getWordsKnowledge,
  getWordsSort,
} from "../actions/words";
import { getOffset, getTotalPages } from "../lib/pages";
import { Languages } from "../configs/kysely";

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  // TODO: restructure in a separate module getting knowledge, offset, etc.
  const page = Number(params.page || 1);
  const search = (params.search ?? "") as string;
  const sort = (params.sort ?? DEFAULT_SORT) as string;
  const language = (params.language ?? DEFAULT_LANGUAGE) as Languages;
  const easy = Boolean(params.easy);
  const good = Boolean(params.good);
  const hard = Boolean(params.hard);
  const again = Boolean(params.again);
  const saved = Boolean(params.saved);

  const offset = getOffset(page);

  const user = await getUser();

  const getWordsBaseParams = {
    search,
    language,
    saved,
    knowledge: getWordsKnowledge({ easy, good, hard, again }),
    userId: user ? user.id : null,
  };
  const words = await getGroupedWords({
    ...getWordsBaseParams,
    offset,
    sort: getWordsSort(sort),
  });
  const wordsCount = await getWordsCount(getWordsBaseParams);

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
