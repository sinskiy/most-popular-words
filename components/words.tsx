import { type Word as IWord } from "../types/word";
import Word from "./word";

interface WordsProps {
  list: IWord[];
}

export default function Words({ list }: WordsProps) {
  return (
    <ul className="grid gap-2">
      {list.map((word, i) => (
        <Word key={word.label} {...word} rank={i + 1} />
      ))}
    </ul>
  );
}
