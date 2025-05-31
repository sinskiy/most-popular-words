"use client";

import { QueriedUser } from "@/users/queries";
import { saveWordAction } from "@/words/actions";
import { QueriedWord } from "@/words/queries";
import { useActionState } from "react";

interface SaveProps {
  user: false | QueriedUser;
  word: QueriedWord;
  cn?: string;
}

export default function Save({ user, word, cn }: SaveProps) {
  return (
    <div className={`min-w-5 grid place-items-center ${cn}`}>
      {user && <SaveWithUser user={user} word={word} />}
    </div>
  );
}

interface SaveWithUserProps {
  user: NonNullable<QueriedUser>;
  word: QueriedWord;
}

function SaveWithUser({ user, word }: SaveWithUserProps) {
  const [state, action, pending] = useActionState(
    saveWordAction.bind(null, {
      userId: user.id,
      saved: Boolean(word.saved),
      wordId: word.id!,
    }),
    undefined
  );
  return (
    <form action={action}>
      <button type="submit" aria-label="save" title="save" disabled={pending}>
        <img
          width={20}
          height={20}
          src={word.saved ? "/like-filled.svg" : "/like.svg"}
          alt=""
        />
      </button>
      {state && <p>{state.message}</p>}
    </form>
  );
}
