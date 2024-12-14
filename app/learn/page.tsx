import { getUser } from "../../actions/auth";
import { getSaved } from "../../actions/saved";
import Filters from "../../components/filters";
import LearnWord from "../../components/learn-word";
import { PageProps } from "../../types/page";

export default async function Learn({ searchParams }: PageProps) {
  const user = await getUser();

  const params = await searchParams;
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
          words={(await getSaved(0, user?.username, 100)).rows.filter(
            (word) => word.source.includes(source) && word.type.includes(type)
          )}
        />
      ) : (
        <p>must be logged in</p>
      )}
    </main>
  );
}
