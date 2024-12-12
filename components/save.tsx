"use client";

import { Word } from "../types/word";
import { User } from "../types/user";

interface SaveProps {
  user: false | User;
  word: Word;
  saveAction: (formData: FormData) => void;
}

export default function Save({ saveAction, user, word }: SaveProps) {
  return (
    <form action={saveAction}>
      {user !== false && (
        <button type="submit" aria-label="save" title="save">
          <img src={word.saved ? "/like-filled.svg" : "/like.svg"} alt="" />
        </button>
      )}
    </form>
  );
}
