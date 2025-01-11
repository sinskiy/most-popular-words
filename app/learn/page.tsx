import { getUser } from "../../actions/auth";
import { getSaved, getSavedWithLanguage } from "../../actions/saved";
import Filters from "../../components/filters";
import LearnWord from "../../components/learn-word";
import { PageProps } from "../../types/page";
import AllLanguages from "../../components/all-languages";
import ReverseLearn from "../../components/reverse-learn";
import { DEFAULT_LANGUAGE } from "../../types/word";
import Link from "next/link";
import RemoveChosenDeck from "../../components/remove-chosen-deck";

export default async function Learn({ searchParams }: PageProps) {
  const user = await getUser();

  const params = await searchParams;
  const language = (params.language ?? DEFAULT_LANGUAGE) as string;
  const skipLanguage = params["skip-language"] ?? "false";
  const reverse = (params.reverse ?? "false") as string;
  const source = (params.source ?? "") as string;
  const type = (params.type ?? "") as string;
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
          words={(skipLanguage === "true"
            ? await getSaved(0, user.username, 100, deck)
            : await getSavedWithLanguage(0, user.username, language, 100, deck)
          ).rows.filter(
            (word) => word.source.includes(source) && word.type.includes(type)
          )}
          reverse={reverse}
        />
      ) : (
        <p>must be logged in</p>
      )}
      <div className="flex gap-4">
        <Link href="/decks" className="text-yellow-500 w-fit">
          {deck ? "change the" : "choose a"} deck
        </Link>
        {deck && <RemoveChosenDeck />}
      </div>
    </main>
  );
}
