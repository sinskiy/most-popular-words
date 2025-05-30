import ErrorPage from "@/components/error-page";
import AddDeck from "@/components/add-deck";
import Link from "next/link";
import DeleteDeck from "@/components/delete-deck";
import { Suspense } from "react";
import { getUser } from "@/users/auth";
import { QueriedWord, queryWords } from "@/words/queries";
import { queryDecksByUserId, queryDeckWordsByDeckId } from "@/decks/queries";

export default async function Page() {
  const user = await getUser();
  if (!user) {
    return <ErrorPage title={401}>Unauthorized</ErrorPage>;
  }

  // TODO: make search non-required
  const savedWords = await queryWords({
    offset: 0,
    knowledge: "NO_KNOWLEDGE_FILTER",
    language: "NO_LANGUAGE_FILTER",
    saved: true,
    search: "",
    sort: "default",
    userId: user.id,
  });
  const decks = await queryDecksByUserId(user.id);

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
                href={`/learn?deck-id=${deck.id}`}
                className="text-yellow-500"
              >
                learn
              </Link>
              <DeleteDeck id={deck.id} userId={user.id} />
              <Suspense>
                <WithSelectedWords
                  userId={user.id}
                  words={savedWords}
                  deckId={deck.id}
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
  deckId,
  name,
}: {
  userId: number;
  words: QueriedWord[];
  deckId: number;
  name: string;
}) {
  const selectedWords = await queryDeckWordsByDeckId(deckId);
  return (
    <AddDeck
      userId={userId}
      words={words}
      edit
      id={deckId}
      name={name}
      selectedWords={selectedWords.map(({ word }) => word.id)}
    />
  );
}
