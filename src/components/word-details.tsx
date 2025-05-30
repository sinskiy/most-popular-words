"use client";

import { Fragment, PropsWithChildren, useActionState, useState } from "react";
import {
  setWordDetails,
  setWordDetailsWithKnowledge,
} from "@/words/word-details";
import Dropdown from "@/ui/dropdown";
import Form from "@/ui/form";
import InputField from "@/ui/input-field";
import { QueriedWord } from "@/words/queries";
import { QueriedUser } from "@/users/queries";
import { knowledgeArray } from "@/words/const";
import { UseActionState } from "@/lib/actions";

interface WordDetailsProps {
  user: QueriedUser | false;
  word: QueriedWord;
}

export default function WordDetails({ user, word }: WordDetailsProps) {
  const actionState = useActionState(
    setWordDetails.bind(null, {
      userId: user ? user.id : false,
      // TODO: check why it says it can be null
      wordId: word.id!,
    }),
    undefined
  );

  if (user === false) return;

  return (
    <Dropdown
      id={`${word.value}-details`}
      label={
        <label
          htmlFor={`${word.value}-details-checkbox`}
          className="min-w-5 flex justify-center outline-slate-300 peer-focus-visible:outline peer-focus-visible:outline-1"
        >
          <img width={20} height={20} src="/details.svg" alt="" />
        </label>
      }
      className="!p-4 right-0"
    >
      <WordDetailsBase word={word} actionState={actionState} />
    </Dropdown>
  );
}

export function WordDetailsWithKnowledge({
  user,
  word,
}: {
  user: NonNullable<QueriedUser>;
  word: QueriedWord;
}) {
  const actionState = useActionState(
    setWordDetailsWithKnowledge.bind(null, {
      userId: user.id,
      // TODO: check why it says it can be null
      wordId: word.id!,
    }),
    undefined
  );

  return (
    <WordDetailsBase word={word} actionState={actionState}>
      <h3 className="text-xl font-medium mt-4">knowledge</h3>
      {knowledgeArray.map((value) => (
        <div key={value} className="flex gap-3">
          <input
            type="radio"
            id={value}
            name="knowledge"
            value={value}
            defaultChecked={word.knowledge === value}
          />
          <label htmlFor={value}>{value}</label>
        </div>
      ))}
    </WordDetailsBase>
  );
}

const initialAdded = {
  translations: [],
  definitions: [],
  examples: [],
};

export function WordDetailsBase({
  word,
  actionState,
  children,
}: {
  word: QueriedWord;
  actionState: UseActionState;
} & PropsWithChildren) {
  const [state, action, pending] = actionState;
  const [added, setAdded] = useState<Record<string, string[]>>(initialAdded);
  function add(key: string) {
    setAdded({ ...added, [key]: [...added[key], ""] });
  }
  return (
    <Form
      pending={pending}
      heading="Details"
      action={action}
      message={state?.message}
      onSubmit={() => setAdded(initialAdded)}
    >
      {(["translations", "definitions", "examples"] as const).map((value) => (
        <Fragment key={value}>
          {(word[value] && word[value].length >= 1
            ? [...word[value], ...added[value]]
            : ["", ...added[value]]
          ).map(
            (detail, i) =>
              typeof detail === "string" && (
                <div key={`${value}-${i}`} className="flex">
                  <InputField
                    type="text"
                    id={`${value}-${i}`}
                    labelText={`${value.slice(0, -1)} ${i + 1}`}
                    small
                    defaultValue={detail ?? ""}
                  />
                  <button
                    className="button h-fit self-end ml-2"
                    onClick={() =>
                      ((
                        document.querySelector(
                          `#${value}-${i}`
                        ) as HTMLInputElement
                      ).value = "")
                    }
                  >
                    {/* TODO: don't submit on delete click */}
                    delete
                  </button>
                </div>
              )
          )}
          <button className="button" type="button" onClick={() => add(value)}>
            add {value.slice(0, -1)}
          </button>
        </Fragment>
      ))}
      <div>{children}</div>
    </Form>
  );
}
