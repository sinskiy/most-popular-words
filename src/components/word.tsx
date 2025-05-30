import Link from "next/link";
import { cn } from "@/lib/utils";
import Save from "./save";
import WordDetails from "./word-details";
import { QueriedWord } from "@/words/queries";
import { QueriedUser } from "@/users/queries";

interface WordProps {
  user: false | QueriedUser;
  rank: number;
  word: QueriedWord;
}

export default async function Word({ user, rank, word }: WordProps) {
  return (
    <li
      className={cn([
        "w-full px-4 md:pl-12 md:pr-8 py-4 flex gap-4 items-center whitespace-break-spaces",
        rank === 1
          ? "primary"
          : rank === 2
          ? "secondary"
          : rank == 3
          ? "tertiary"
          : "neutral",
      ])}
    >
      <p className="mr-4">{rank}.</p>
      <p className="w-full text-2xl font-medium">
        <Link href={`/words/${word.value}`}>{word.value}</Link>
      </p>
      <p className="whitespace-nowrap">
        <span className="font-semibold">{word.occurrences} </span>
        <span className="max-md:hidden">
          occurrence
          {word.occurrences !== 1 && "s"}
        </span>
      </p>
      <p>
        <span className="font-semibold">{word.percentage.toFixed(2)}</span>%
      </p>
      {user && (
        <>
          <Save user={user} word={word} />
          <WordDetails user={user} word={word} />
        </>
      )}
    </li>
  );
}
