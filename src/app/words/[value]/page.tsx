import { Suspense } from "react";
import Save from "../../../components/save";
import { WordDetailsWithKnowledge } from "../../../components/word-details";
import { getUser } from "@/users/auth";
import { queryWord } from "@/words/queries";
import ErrorPage from "@/components/error-page";

export default async function Word({
  params,
}: {
  params: Promise<{ value: string }>;
}) {
  const { value } = await params;

  return (
    <main>
      <h1 className="text-4xl font-bold inline">{value}</h1>
      <Suspense>
        <QueriedWordDetails value={value} />
      </Suspense>
    </main>
  );
}

async function QueriedWordDetails({ value }: { value: string }) {
  const user = await getUser();
  const word = await queryWord(value, user ? user.id : null);

  if (!word) {
    return <ErrorPage title={404}>word not found</ErrorPage>;
  }

  return (
    <>
      <Save user={user} word={word} cn="w-fit !inline ml-4" />
      {/* MAYBE: show list of sources and types that include this word? */}
      {/* source and type are only for partial entries */}
      {/* <p>
        type: <span className="font-semibold">{word.type}</span>, source:{" "}
        <span className="font-semibold">{word.source}</span>
      </p> */}
      <p className="mt-4">
        <span className="font-semibold">{word.occurrences} </span>
        occurrence
        {word.occurrences !== 1 && "s"},{" "}
        <span className="font-semibold">{word.percentage.toFixed(2)}</span>%
      </p>
      {user && (
        <section className="w-fit mt-6">
          <WordDetailsWithKnowledge user={user} word={word} />
        </section>
      )}
    </>
  );
}
