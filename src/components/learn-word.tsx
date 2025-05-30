"use client";

import { Fragment, useActionState, useEffect, useState } from "react";
import { cn, getRandomIndex } from "@/lib/utils";
import InputField from "@/ui/input-field";
import Form from "@/ui/form";
import Tip from "./tip";
import { setWordDetailsWithSeparator } from "@/words/word-details";
import Save from "./save";
import { QueriedWord } from "@/words/queries";
import { QueriedUser } from "@/users/queries";
import { updateKnowledge } from "@/words/actions";
import { knowledgeArray } from "@/words/const";

interface LearnWordProps {
  words: QueriedWord[];
  user: QueriedUser;
  reverse: string;
}

function getFilteredWords(words: QueriedWord[], prevWord: string | false) {
  if (words.length === 0) return [];
  else if (words.length === 1) return [words[0]];

  let filteredWords: QueriedWord[] = [];
  for (
    let i = 0;
    filteredWords.length === 0 && i < knowledgeArray.length;
    i++
  ) {
    filteredWords = words.filter(
      (word) =>
        (!word.knowledge || word.knowledge === knowledgeArray[i]) &&
        word.value !== prevWord
    );
  }

  return filteredWords;
}

// TODO: where's knowledge?
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

  function handleNext(knowledgeValue: (typeof knowledgeArray)[number]) {
    if (randomWordIndex === false) return;

    setShowAnswers(false);

    const newPrevWord = filteredWords[randomWordIndex].value ?? false;
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
              user={user}
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
          {knowledgeArray.map((value, i) => (
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
  user,
  isSuccessOld,
  setIsSuccessOld,
}: {
  reverse: string;
  word: QueriedWord;
  showAnswers: boolean;
  user: QueriedUser;
  isSuccessOld: boolean;
  setIsSuccessOld: (value: boolean) => void;
}) {
  const [state, action, pending] = useActionState(
    setWordDetailsWithSeparator.bind(null, {
      userId: user?.id,
      // TODO: check why null
      wordId: word.id!,
    }),
    undefined
  );

  return (
    <>
      {reverse === "true" ? (
        (!word.translations?.length ||
          !word.definitions?.length ||
          !word.examples?.length) && (
          <Tip>
            toggle off <i>reverse learn mode</i> to add translations,
            definitions and examples
          </Tip>
        )
      ) : (
        <Tip>
          separate with &quot;, &quot; to save multiple translations,
          definitions and examples
        </Tip>
      )}
      {reverse === "true" ? (
        <>
          <Save user={user} word={word} cn="w-fit" />
          <ul>
            {(["translations", "definitions", "examples"] as const).map(
              (value) => (
                <li key={value} className="grid">
                  <span className="text-sm font-medium text-stone-300">
                    {value}
                  </span>
                  <span className="text-lg">
                    <StringOrArrayOrEmpty value={word[value]} type={value} />
                  </span>
                </li>
              )
            )}
          </ul>
        </>
      ) : (
        <div className="flex gap-2">
          <h1 className="text-4xl font-bold">
            <a href={`/words/${word.value}`}>{word.value}</a>
          </h1>
          <Save user={user} word={word} cn="w-fit" />
        </div>
      )}
      <Form
        pending={pending}
        action={action}
        message={state?.message}
        className={cn(["grid gap-4 w-fit items-center"])}
        label="update details"
        showSubmit={reverse !== "true"}
        onSubmit={() => setIsSuccessOld(false)}
      >
        {reverse === "true" ? (
          <>
            <InputField type="text" id="value" />
            {showAnswers && <p>{word.value}</p>}
          </>
        ) : (
          (["translations", "definitions", "examples"] as const).map(
            (value) => (
              <Fragment key={value}>
                <InputField type="text" id={value} />
                {showAnswers && (
                  <p>
                    <StringOrArrayOrEmpty value={word[value]} type={value} />
                  </p>
                )}
              </Fragment>
            )
          )
        )}
      </Form>
      {state?.success === true && isSuccessOld === false && (
        <p>successfully updated details</p>
      )}
    </>
  );
}

function StringOrArrayOrEmpty({
  value,
  type,
}: {
  value: string | string[];
  type: string;
}) {
  return (
    <>
      {" "}
      {typeof value === "string" ? (
        value
      ) : value.length > 0 ? (
        value.join(", ")
      ) : (
        <i>no {type}</i>
      )}
    </>
  );
}

const knowledgeClasses = ["error", "tertiary", "primary", "success"];
