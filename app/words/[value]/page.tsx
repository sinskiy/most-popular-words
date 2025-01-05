import { Suspense } from "react";
import { getUser } from "../../../actions/auth";
import cacheDb from "../../../lib/cache-db";
import queryThrowError from "../../../lib/query-throw-error";
import { SavedWord } from "../../../types/word";
import Save from "../../../components/save";
import { WordDetailsWithKnowledge } from "../../../components/word-details";

const getWord = cacheDb(
  async (value: string, username: string | false) =>
    await queryThrowError<SavedWord>(
      "Couldn't get words",
      `SELECT value, occurrences, percentage, saved, source, type, translation, definition, example, knowledge
           FROM user_words_with_percentage($1)
        WHERE value = $2`,
      [username || null, value]
    ),
  ["words"]
);

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
  const wordQuery = await getWord(value, user && user.username);
  const [word] = wordQuery.rows;

  return (
    <>
      <Save user={user} word={word} cn="w-fit !inline ml-4" />
      <p className="mt-4">
        <span className="font-semibold">{word.occurrences} </span>
        occurrence
        {word.occurrences !== 1 && "s"}
      </p>
      <p>
        <span className="font-semibold">
          {(word.percentage * 100).toFixed(2)}
        </span>
        %
      </p>
      {user && (
        <section className="w-fit mt-6">
          <WordDetailsWithKnowledge user={user} word={word} />
        </section>
      )}
    </>
  );
}
