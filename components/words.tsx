import { cn } from "../lib/helpers";
import { User } from "../types/user";
import { type Word as IWord } from "../types/word";
import Table from "../ui/table";
import Save from "./save";
import WordDetails from "./word-details";

interface WordsProps {
  list: IWord[];
  user: false | User;
}

export default function Words({ list, user }: WordsProps) {
  return (
    <>
      {list.length > 0 ? (
        <Table
          headerColumns={[
            "Index",
            "Word",
            "Occurrences",
            "Percentage",
            "Save",
            "Details",
          ]}
          classes={[
            "pl-4 md:pl-12 !rounded-l-md !border-r-0",
            "w-full text-left text-2xl whitespace-wrap !border-x-0",
            "text-center whitespace-nowrap !border-x-0",
            user === false ? "!rounded-r-md !border-l-0" : "!border-x-0",
            cn([
              "text-end l max-md:pr-4 !border-x-0",
              user === false && "hidden",
            ]),
            cn([
              "text-end pr-12 !rounded-r-md !border-l-0",
              user === false && "hidden",
            ]),
          ]}
          rows={list.map((word, i) => ({
            key: word.value,
            bodyRowClasses:
              i === 0
                ? "primary"
                : i === 1
                ? "secondary"
                : i == 2
                ? "tertiary"
                : "neutral",
            header: `${i + 1}.`,
            columns: [
              word.value,
              <>
                <span className="font-semibold">{word.occurrences} </span>
                <span className="max-md:hidden">
                  occurrence
                  {word.occurrences !== 1 && "s"}
                </span>
              </>,
              <>
                <span className="font-semibold">
                  {(word.percentage * 100).toFixed(2)}
                </span>
                %
              </>,
              <Save user={user} word={word} />,
              <WordDetails user={user} word={word} />,
            ],
          }))}
        />
      ) : (
        <p>
          <i>nothing</i>
        </p>
      )}
    </>
  );
}
