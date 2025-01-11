import { getSaved } from "../../actions/saved";
import { getUser } from "../../actions/auth";
import ErrorPage from "../../components/error-page";
import AddDeck from "../../components/add-deck";
import { getDecks } from "../../actions/get-decks";
import Link from "next/link";

export default async function Page() {
  const user = await getUser();
  if (!user) {
    return <ErrorPage title={401}>Unauthorized</ErrorPage>;
  }

  const savedWordsQuery = await getSaved(0, user?.username);
  const decksQuery = await getDecks(user.username);

  return (
    <>
      <AddDeck username={user.username} words={savedWordsQuery.rows} />
      <ul role="list" className="flex gap-2 flex-wrap">
        {decksQuery.rows.map((deck) => (
          <li key={deck.id} className="neutral px-8 py-4 flex flex-col gap-2">
            <p className="text-xl font-medium">{deck.name}</p>
            <Link href={`/learn?deck=${deck.name}`} className="text-yellow-500">
              learn deck
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
