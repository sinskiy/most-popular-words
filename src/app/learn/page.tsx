import Filters from "@/components/filters";
import LearnWord from "@/components/learn-word";
import AllLanguages from "@/components/all-languages";
import ReverseLearn from "@/components/reverse-learn";
import Link from "next/link";
import { Languages } from "@/db/kysely";
import { PageProps } from "@/lib/routes";
import { DEFAULT_LANGUAGE } from "@/words/const";
import { getUser } from "@/users/auth";
import { queryWords } from "@/words/queries";
import LearnAllWords from "@/components/learn-all-words-button";

export default async function Learn({ searchParams }: PageProps) {
  const user = await getUser();

  if (!user) {
    return <p>must be logged in</p>;
  }

  const params = await searchParams;
  const language = (params.language ?? DEFAULT_LANGUAGE) as Languages;
  const allLanguages = params["all-languages"] ?? "false";
  const reverse = (params.reverse ?? "false") as string;
  const deckId = params["deck-id"] as string | undefined;

  // TODO: fetch on demand
  const words = await queryWords({
    offset: 0,
    userId: user.id,
    language: allLanguages === "true" ? "NO_LANGUAGE_FILTER" : language,
    search: "",
    knowledge: "NO_KNOWLEDGE_FILTER",
    saved: true,
    sort: "default",
    deckId: deckId ? Number(deckId) : undefined,
  });

  return (
    <main className="flex flex-col gap-8">
      <nav className="flex gap-4 flex-wrap">
        <Filters />
        <AllLanguages />
        <ReverseLearn />
      </nav>
      <LearnWord user={user} words={words} reverse={reverse} />
      <div className="flex gap-4">
        <Link href="/decks" className="text-yellow-500 w-fit">
          {deckId ? "change the" : "choose a"} deck
        </Link>
        {deckId && <LearnAllWords />}
      </div>
    </main>
  );
}
