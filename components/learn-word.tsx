"use client";

import { Fragment, useActionState, useEffect, useState } from "react";
import { knowledge, SavedWord } from "../types/word";
import { cn, getRandomIndex } from "../lib/helpers";
import InputField from "../ui/input-field";
import { updateKnowledge } from "../actions/update-knowledge";
import Form from "../ui/form";
import { User } from "../types/user";
import Tip from "./tip";
import { setWordDetails } from "../actions/word-details";

interface LearnWordProps {
  words: SavedWord[];
  user: User;
  reverse: string;
}

function getFilteredWords(words: SavedWord[], prevWord: string | false) {
  if (words.length === 0) return [];
  else if (words.length === 1) return [words[0]];

  let filteredWords: SavedWord[] = [];
  for (let i = 0; filteredWords.length === 0 && i < knowledge.length; i++) {
    filteredWords = words.filter(
      (word) =>
        (!word.knowledge || word.knowledge === knowledge[i]) &&
        word.value !== prevWord
    );
  }

  return filteredWords;
}

export default function LearnWord({ user, words, reverse }: LearnWordProps) {
  const [localWords, setLocalWords] = useState(words);

  useEffect(() => {
    setLocalWords(words);
  }, [words]);

  const [prevWord, setPrevWord] = useState<string | false>(false);

  const filteredWords = getFilteredWords(localWords, prevWord);

  const [randomWordIndex, setRandomWordIndex] = useState<number | false>(false);
  useEffect(() => {
    setRandomWordIndex(getRandomIndex(filteredWords.length));
  }, []);

  function handleNext(knowledgeValue: (typeof knowledge)[number]) {
    if (randomWordIndex === false) return;

    setShowAnswers(false);

    const newPrevWord = filteredWords[randomWordIndex].value;
    setPrevWord(newPrevWord);

    const newLocalWords = localWords.map((word) =>
      word.value === newPrevWord
        ? { ...word, knowledge: knowledgeValue, changed: true }
        : word
    );
    setLocalWords(newLocalWords);

    const newFilteredWords = getFilteredWords(newLocalWords, newPrevWord);

    setRandomWordIndex(getRandomIndex(newFilteredWords.length));
  }

  const [showAnswers, setShowAnswers] = useState(false);

  const [isSuccessOld, setIsSuccessOld] = useState(false);

  const [state, action, pending] = useActionState(
    updateKnowledge.bind(null, { words: localWords, user: user }),
    undefined
  );

  return (
    <main className="flex flex-col gap-4">
      {filteredWords.length > 0 ? (
        <>
          {randomWordIndex === false ? (
            <p>
              <i>loading...</i>
            </p>
          ) : (
            <LearnWordLoaded
              word={filteredWords[randomWordIndex]}
              reverse={reverse}
              showAnswers={showAnswers}
              username={user.username}
              isSuccessOld={isSuccessOld}
              setIsSuccessOld={setIsSuccessOld}
            />
          )}
        </>
      ) : (
        <p>
          <i>nothing. save words first</i>
        </p>
      )}
      <nav>
        <button
          className="button"
          onClick={() => setShowAnswers(true)}
          disabled={showAnswers}
        >
          show answers
        </button>
        <div className="flex gap-1 mt-2" onClick={() => setIsSuccessOld(true)}>
          {knowledge.map((value, i) => (
            <button
              key={value}
              className={cn(["button", knowledgeClasses[i]])}
              onClick={() => handleNext(value)}
              disabled={randomWordIndex === false || localWords.length === 0}
            >
              {value}
            </button>
          ))}
        </div>
      </nav>
      <Form
        action={action}
        pending={pending}
        message={state?.message}
        label="save and exit"
      ></Form>
    </main>
  );
}

function LearnWordLoaded({
  reverse,
  word,
  showAnswers,
  username,
  isSuccessOld,
  setIsSuccessOld,
}: {
  reverse: string;
  word: SavedWord;
  showAnswers: boolean;
  username: string;
  isSuccessOld: boolean;
  setIsSuccessOld: (value: boolean) => void;
}) {
  const [state, action, pending] = useActionState(
    setWordDetails.bind(null, {
      username,
      word: word.value,
    }),
    undefined
  );

  return (
    <>
      {reverse === "true" &&
        (!word.translation || !word.definition || !word.example) && (
          <Tip>
            toggle off <i>reverse learn mode</i> to add translation, definition
            or example
          </Tip>
        )}
      {reverse === "true" ? (
        <ul>
          {(["translation", "definition", "example"] as const).map((value) => (
            <li key={value} className="grid">
              <span className="text-sm font-medium text-stone-300">
                {value}
              </span>
              <span className="text-lg">
                {word[value] ?? <i>no {value}</i>}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <h1 className="text-4xl font-bold">{word.value}</h1>
      )}
      <Form
        pending={(state?.success === true && isSuccessOld === false) || pending}
        action={action}
        message={state?.message}
        className={cn([
          "grid gap-4 w-fit items-center",
          showAnswers && "grid-cols-2",
        ])}
        label="update details"
        showSubmit={reverse !== "true"}
        onSubmit={() => setIsSuccessOld(false)}
      >
        {(reverse === "true"
          ? (["value"] as const)
          : (["translation", "definition", "example"] as const)
        ).map((value) => (
          <Fragment key={value}>
            <InputField type="text" id={value} />
            {showAnswers && <p>{word[value] ?? <i>no {value}</i>}</p>}
          </Fragment>
        ))}
      </Form>
      {state?.success === true && isSuccessOld === false && (
        <p>successfully updated details</p>
      )}
    </>
  );
}

const knowledgeClasses = ["error", "tertiary", "primary", "success"];
