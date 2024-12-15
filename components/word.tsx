import { revalidateTag } from "next/cache";
import db from "../configs/pg";
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
    <tr
      className={`w-full px-12 max-md:px-6 py-4 flex gap-4 items-center ${
        rank === 1
          ? "primary"
          : rank === 2
          ? "secondary"
          : rank == 3
          ? "tertiary"
          : "neutral"
      }`}
    >
      <th className="w-8 text-start max-md:hidden" scope="row">
        {rank}.
      </th>
      <td className="text-4xl font-medium flex-1 max-w-xl">{word.value}</td>
      <td>
        <Save user={user} word={word} saveAction={handleSave} />
      </td>
      <td>
        <WordDetails user={user} word={word} />
      </td>
      <td>
        <span className="font-bold">{word.occurrences} </span>
        <span className="max-md:hidden">
          occurrence
          {word.occurrences !== 1 && "s"}
        </span>
      </td>
      <td>
        <span className="font-bold">{(word.percentage * 100).toFixed(2)}</span>%
      </td>
    </tr>
  );
}
