import { getUser } from "../../actions/auth";
import ErrorPage from "../../components/error-page";
import AddDeck from "../../components/add-deck";
import { getDecks, getDeckWords } from "../../actions/get-decks";
import Link from "next/link";
import DeleteDeck from "../../components/delete-deck";
import { Suspense } from "react";
import { getGroupedWords } from "../../actions/words";

export default async function Page() {
  const user = await getUser();
  if (!user) {
    return <ErrorPage title={401}>Unauthorized</ErrorPage>;
  }

  // TODO: make search non-required
  // TODO: fix any
  const savedWords: any[] = await getGroupedWords({
    offset: 0,
    knowledge: false,
    language: "NO_LANGUAGE_FILTER",
    saved: true,
    search: "",
    sort: ["occurred_word.occurrences"],
    userId: user.id,
  });
  const decks: any[] = await getDecks(user.id);

  return (
    <>
      <AddDeck userId={user.id} words={savedWords} />
      <ul role="list" className="flex gap-2 flex-wrap">
        {decks.length > 0 ? (
          decks.map((deck) => (
            <li
              key={deck.id}
              className="neutral px-8 py-4 flex flex-col gap-2 flex-grow max-w-64 truncate"
            >
              <p className="text-xl font-medium">{deck.name}</p>
              <Link
                href={`/learn?deck=${deck.name}`}
                className="text-yellow-500"
              >
                learn
              </Link>
              <DeleteDeck id={deck.id} userId={user.id} />
              <Suspense>
                <WithSelectedWords
                  userId={user.id}
                  words={savedWords}
                  id={deck.id}
                  name={deck.name}
                />
              </Suspense>
            </li>
          ))
        ) : (
          <p>
            <i>no decks</i>
          </p>
        )}
      </ul>
    </>
  );
}

async function WithSelectedWords({
  userId,
  words,
  id,
  name,
}: {
  userId: number;
  words: any[];
  id: number;
  name: string;
}) {
  const selectedWords: any[] = await getDeckWords(id);
  return (
    <AddDeck
      userId={userId}
      words={words}
      edit
      id={id}
      name={name}
      selectedWords={selectedWords.map(({ word }) => word.id)}
    />
  );
}
