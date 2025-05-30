import Filters from "@/components/filters";
import LearnWord from "@/components/learn-word";
import AllLanguages from "@/components/all-languages";
import ReverseLearn from "@/components/reverse-learn";
import Link from "next/link";
import RemoveChosenDeck from "@/components/remove-chosen-deck";
import { Languages } from "@/db/kysely";
import { PageProps } from "@/lib/routes";
import { DEFAULT_LANGUAGE } from "@/words/const";
import { getUser } from "@/users/auth";
import { queryWords } from "@/words/queries";

export default async function Learn({ searchParams }: PageProps) {
  const user = await getUser();

  const params = await searchParams;
  const language = (params.language ?? DEFAULT_LANGUAGE) as Languages;
  // TODO: change to ignore language
  const skipLanguage = params["skip-language"] ?? "false";
  const reverse = (params.reverse ?? "false") as string;
  const deckId = params["deck-id"] as string | undefined;

  return (
    <main className="flex flex-col gap-8">
      <nav className="flex gap-4 flex-wrap">
        <Filters />
        <AllLanguages />
        <ReverseLearn />
      </nav>
      {user ? (
        <LearnWord
          user={user}
          words={
            // TODO: fetch on demand
            await queryWords({
              offset: 0,
              userId: user.id,
              language:
                skipLanguage === "true" ? "NO_LANGUAGE_FILTER" : language,
              search: "",
              knowledge: "NO_KNOWLEDGE_FILTER",
              saved: true,
              sort: "default",
              deckId: deckId ? Number(deckId) : undefined,
            })
          }
          reverse={reverse}
        />
      ) : (
        <p>must be logged in</p>
      )}
      <div className="flex gap-4">
        <Link href="/decks" className="text-yellow-500 w-fit">
          {deckId ? "change the" : "choose a"} deck
        </Link>
        {/* TODO: improve wording */}
        {deckId && <RemoveChosenDeck />}
      </div>
    </main>
  );
}
