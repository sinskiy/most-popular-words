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
        <>
          <div>
            <div className="md:hidden flex gap-2 font-semibold">
              <p className="flex-1">word</p>
              <p>occurrences</p>
              <p>percentage</p>
            </div>
            <ul className="grid gap-2  max-w-full">
              {list.map((word, i) => (
                <Word user={user} key={word.value} word={word} rank={i + 1} />
              ))}
            </ul>
          </div>
        </>
      ) : (
        <p>
          <i>nothing</i>
        </p>
      )}
    </>
  );
}
