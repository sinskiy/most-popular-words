import { User } from "../types/user";
import { type Word as IWord } from "../types/word";
import Word from "./word";

interface WordsProps {
  list: IWord[];
  user: false | User;
}

export default function Words({ list, user }: WordsProps) {
  return (
    <>
      {list.length > 0 ? (
        <table>
          <thead>
            <tr className="flex gap-4 px-4">
              {/* hardcoded width */}
              <th scope="col" className="w-16 max-md:hidden">
                Index
              </th>
              <th scope="col" className="flex-1 text-left">
                Word
              </th>
              <th scope="col"></th>
              <th scope="col"></th>
              <th scope="col">Occurrences</th>
              <th scope="col">Percentage</th>
            </tr>
          </thead>
          <tbody className="grid gap-1">
            {list.map((word, i) => (
              <Word user={user} key={word.value} word={word} rank={i + 1} />
            ))}
          </tbody>
        </table>
      ) : (
        <p>nothing</p>
      )}
    </>
  );
}
