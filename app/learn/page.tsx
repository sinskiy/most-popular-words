import { getUser } from "../../actions/auth";
import { getSavedWithLanguage } from "../../actions/saved";
import Filters from "../../components/filters";
import LearnWord from "../../components/learn-word";
import { PageProps } from "../../types/page";

export default async function Learn({ searchParams }: PageProps) {
  const user = await getUser();

  const params = await searchParams;
  const language = (params.language ?? "english") as string;
  const source = (params.source ?? "") as string;
  const type = (params.type ?? "") as string;

  return (
    <main className="flex flex-col gap-8">
      <nav>
        <Filters saved={false} />
      </nav>
      {user ? (
        <LearnWord
          user={user}
          words={(
            await getSavedWithLanguage(0, user?.username, language, 100)
          ).rows.filter(
            (word) => word.source.includes(source) && word.type.includes(type)
          )}
        />
      ) : (
        <p>must be logged in</p>
      )}
    </main>
  );
}
