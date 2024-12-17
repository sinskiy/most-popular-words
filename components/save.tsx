"use client";

import { Word } from "../types/word";
import { User } from "../types/user";
import { useActionState } from "react";
import { save } from "../actions/save";

interface SaveProps {
  user: false | User;
  word: Word;
}

export default function Save({ user, word }: SaveProps) {
  const [state, action, pending] = useActionState(
    save.bind(null, { user: user, word: word }),
    undefined
  );

  return (
    <form action={action}>
      {user !== false && (
        <button type="submit" aria-label="save" title="save" disabled={pending}>
          <img
            width={20}
            height={20}
            src={word.saved ? "/like-filled.svg" : "/like.svg"}
            alt=""
          />
        </button>
      )}
    </form>
  );
}
