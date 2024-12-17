import { cn } from "../lib/helpers";
import { User } from "../types/user";
import { type Word } from "../types/word";
import Save from "./save";
import WordDetails from "./word-details";

interface WordProps {
  user: false | User;
  rank: number;
  word: Word;
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
      <p className="w-full text-2xl font-medium">{word.value}</p>
      <p className="whitespace-nowrap">
        <span className="font-semibold">{word.occurrences} </span>
        <span className="max-md:hidden">
          occurrence
          {word.occurrences !== 1 && "s"}
        </span>
      </p>
      <p>
        <span className="font-semibold">
          {(word.percentage * 100).toFixed(2)}
        </span>
        %
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
