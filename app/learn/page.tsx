import { getUser } from "../../actions/auth";
import { getSaved } from "../../actions/saved";
import Filters from "../../components/filters";
import LearnWord from "../../components/learn-word";
import { PageProps } from "../../types/page";

export default async function Learn({ searchParams }: PageProps) {
  const user = await getUser();
  if (!user) throw new Error("Must be logged in");

  const saved = await getSaved(0, user.username, 100);

  const params = await searchParams;
  const source = (params.source ?? "") as string;
  const type = (params.type ?? "") as string;

  return (
    <main className="flex flex-col gap-8">
      <nav>
        <Filters saved={false} />
      </nav>
      <LearnWord
        user={user}
        words={saved.rows.filter(
          (word) => word.source.includes(source) && word.type.includes(type)
        )}
      />
    </main>
  );
}
