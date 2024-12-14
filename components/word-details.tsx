"use client";

import { useActionState } from "react";
import { setWordDetails } from "../actions/word-details";
import { User } from "../types/user";
import { Word } from "../types/word";
import Dropdown from "./dropdown";
import Form from "./form";
import InputField from "./input-field";

interface WordDetails {
  user: User | false;
  word: Word;
}

export default function WordDetails({ user, word }: WordDetails) {
  if (user === false) return;

  const [state, action, pending] = useActionState(
    setWordDetails.bind(null, { username: user.username, word: word.value }),
    undefined
  );

  return (
    <Dropdown
      id="word-details"
      label={
        <label>
          <img src="/details.svg" alt="" />
        </label>
      }
      className="!p-4"
    >
      <Form
        pending={pending}
        heading="Details"
        action={action}
        message={state?.message}
      >
        <InputField
          type="text"
          id="translation"
          autoComplete=""
          small
          defaultValue={word.translation ?? ""}
        />
        <InputField
          type="text"
          id="definition"
          autoComplete=""
          small
          defaultValue={word.definition ?? ""}
        />
        <InputField
          type="text"
          id="example"
          autoComplete=""
          small
          defaultValue={word.example ?? ""}
        />
      </Form>
    </Dropdown>
  );
}
