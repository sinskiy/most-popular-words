import { revalidateTag } from "next/cache";
import db from "../configs/pg";
import { User } from "../types/user";
import { type Word } from "../types/word";
import Save from "./save";

interface WordProps {
  user: false | User;
  rank: number;
  word: Word;
}

export default async function Word({ user, rank, word }: WordProps) {
  async function handleSave() {
    "use server";
    if (user === false) return;

    if (word.saved) {
      await db.query("DELETE FROM saved WHERE word = $1 AND username = $2", [
        word.value,
        user.username,
      ]);
    } else {
      await db.query("INSERT INTO saved (word, username) VALUES ($1, $2)", [
        word.value,
        user.username,
      ]);
    }
    revalidateTag("words");
  }
  return (
    <li
      className={`w-full px-12 py-4 flex items-center ${
        rank === 1
          ? "primary"
          : rank === 2
          ? "secondary"
          : rank == 3
          ? "tertiary"
          : "neutral"
      }`}
    >
      <p className="flex-1 flex gap-8 items-center">
        {rank}. <span className="text-4xl font-medium">{word.value}</span>
      </p>
      <div className="flex gap-8">
        <Save user={user} word={word} saveAction={handleSave} />
        <p className="flex gap-2">
          <span className="font-bold">{word.occurrences}</span> occurrence
          {word.occurrences !== 1 && "s"}
        </p>
        <p className="flex gap-2">
          <span className="font-bold">
            {(word.percentage * 100).toFixed(2)}
          </span>
          %
        </p>
      </div>
    </li>
  );
}
