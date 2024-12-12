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
        <ul className="grid gap-2">
          {list.map((word, i) => (
            <Word user={user} key={word.value} word={word} rank={i + 1} />
          ))}
        </ul>
      ) : (
        <p>nothing</p>
      )}
    </>
  );
}
