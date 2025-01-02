import { ChangeEvent } from "react";
import { getUser } from "../../actions/auth";
import { getSaved, getSavedWithLanguage } from "../../actions/saved";
import Filters from "../../components/filters";
import LearnWord from "../../components/learn-word";
import { PageProps } from "../../types/page";
import AllLanguages from "../../components/all-languages";
import ReverseLearn from "../../components/reverse-learn";

export default async function Learn({ searchParams }: PageProps) {
  const user = await getUser();

  const params = await searchParams;
  const language = (params.language ?? "english") as string;
  const skipLanguage = params["skip-language"] ?? "false";
  const reverse = (params.reverse ?? "false") as string;
  const source = (params.source ?? "") as string;
  const type = (params.type ?? "") as string;

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
            ? await getSaved(0, user?.username, 100)
            : await getSavedWithLanguage(0, user?.username, language, 100)
          ).rows.filter(
            (word) => word.source.includes(source) && word.type.includes(type)
          )}
          reverse={reverse}
        />
      ) : (
        <p>must be logged in</p>
      )}
    </main>
  );
}
