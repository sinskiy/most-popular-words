"use client";

import { Fragment, useActionState, useEffect, useState } from "react";
import { knowledge, SavedWord } from "../types/word";
import { cn, getRandomIndex } from "../lib/helpers";
import InputField from "./input-field";
import { updateKnowledge } from "../actions/update-knowledge";
import Form from "./form";
import { User } from "../types/user";

interface LearnWordProps {
  words: SavedWord[];
  user: User;
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

export default function LearnWord({ user, words }: LearnWordProps) {
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

  const [state, action, pending] = useActionState(
    updateKnowledge.bind(null, { words: localWords, username: user.username }),
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
            <>
              <h1 className="text-4xl font-bold">
                {filteredWords[randomWordIndex].value}
              </h1>
              <div
                className={cn([
                  "grid gap-4 w-fit items-center",
                  showAnswers && "grid-cols-2",
                ])}
              >
                {(["translation", "definition", "example"] as const).map(
                  (value) => (
                    <Fragment key={value}>
                      <InputField
                        type="text"
                        id={value}
                        autoComplete=""
                        small
                      />
                      {showAnswers && (
                        <p>
                          {filteredWords[randomWordIndex][value] ?? (
                            <i>no {value}</i>
                          )}
                        </p>
                      )}
                    </Fragment>
                  )
                )}
              </div>
            </>
          )}
        </>
      ) : (
        <p>
          <i>nothing. save words first</i>
        </p>
      )}
      <nav>
        <button
          className="primary w-fit px-2 py-1"
          onClick={() => setShowAnswers(true)}
        >
          show answers
        </button>
        <div className="flex gap-1 mt-2">
          {knowledge.map((value) => (
            <button
              key={value}
              className="primary w-fit px-2 py-1"
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
        label="submit and exit"
      ></Form>
    </main>
  );
}
