import { getUser } from "../../actions/auth";
import Filters from "../../components/filters";
import LearnWord from "../../components/learn-word";
import { PageProps } from "../../types/page";
import AllLanguages from "../../components/all-languages";
import ReverseLearn from "../../components/reverse-learn";
import { DEFAULT_LANGUAGE } from "../../types/word";
import Link from "next/link";
import RemoveChosenDeck from "../../components/remove-chosen-deck";
import { getGroupedWords } from "../../actions/words";
import { Languages } from "../../configs/kysely";

export default async function Learn({ searchParams }: PageProps) {
  const user = await getUser();

  const params = await searchParams;
  const language = (params.language ?? DEFAULT_LANGUAGE) as Languages;
  // TODO: change to ignore language
  const skipLanguage = params["skip-language"] ?? "false";
  const reverse = (params.reverse ?? "false") as string;
  const deck = params.deck as string | undefined;

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
            (await getGroupedWords({
              offset: 0,
              userId: user.id,
              language:
                skipLanguage === "true" ? "NO_LANGUAGE_FILTER" : language,
              search: "",
              knowledge: false,
              saved: true,
              sort: ["occurred_word.occurrences"],
            })) as any[]
          }
          reverse={reverse}
        />
      ) : (
        <p>must be logged in</p>
      )}
      <div className="flex gap-4">
        <Link href="/decks" className="text-yellow-500 w-fit">
          {deck ? "change the" : "choose a"} deck
        </Link>
        {/* TODO: improve wording */}
        {deck && <RemoveChosenDeck />}
      </div>
    </main>
  );
}
