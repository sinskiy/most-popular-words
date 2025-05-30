"use client";

import { QueriedUser } from "@/users/queries";
import { saveWordAction } from "@/words/actions";
import { QueriedWord } from "@/words/queries";
import { useActionState } from "react";

interface SaveProps {
  // TODO: update user type
  user: false | QueriedUser;
  word: QueriedWord;
  cn?: string;
}

export default function Save({ user, word, cn }: SaveProps) {
  const [, action, pending] = useActionState(
    user
      ? saveWordAction.bind(null, {
          userId: user.id,
          saved: Boolean(word.saved),
          wordId: word.id!,
        })
      : () => {},
    undefined
  );

  return (
    <form action={action} className={`min-w-5 grid place-items-center ${cn}`}>
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
