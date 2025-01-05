"use client";

import { PropsWithChildren, useActionState } from "react";
import {
  setWordDetails,
  setWordDetailsWithKnowledge,
} from "../actions/word-details";
import { User } from "../types/user";
import { knowledge, SavedWord, Word } from "../types/word";
import Dropdown from "../ui/dropdown";
import Form from "../ui/form";
import InputField from "../ui/input-field";
import { UseActionState } from "../types/action";

interface WordDetailsProps {
  user: User | false;
  word: Word;
}

export default function WordDetails({ user, word }: WordDetailsProps) {
  if (user === false) return;

  const actionState = useActionState(
    setWordDetails.bind(null, {
      username: user && user.username,
      word: word.value,
    }),
    undefined
  );

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
  user: User;
  word: SavedWord;
}) {
  const actionState = useActionState(
    setWordDetailsWithKnowledge.bind(null, {
      username: user && user.username,
      word: word.value,
    }),
    undefined
  );

  return (
    <WordDetailsBase word={word} actionState={actionState}>
      <h3 className="text-xl font-medium mt-4">knowledge</h3>
      {knowledge.map((value) => (
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

export function WordDetailsBase({
  word,
  actionState,
  children,
}: {
  word: Word;
  actionState: UseActionState;
} & PropsWithChildren) {
  const [state, action, pending] = actionState;
  console.log(word);
  return (
    <Form
      pending={pending}
      heading="Details"
      action={action}
      message={state?.message}
    >
      {(["translations", "definitions", "examples"] as const).map((value) =>
        (word[value] || [""]).map((detail, i) => (
          <InputField
            key={detail}
            type="text"
            id={`${value}-${i}`}
            labelText={`${value} ${i + 1}`}
            small
            defaultValue={detail ?? ""}
          />
        ))
      )}
      <div>{children}</div>
    </Form>
  );
}
