"use client";

import { Word } from "../types/word";
import { User } from "../types/user";

interface LikeProps {
  user: false | User;
  word: Word;
  likeAction: (formData: FormData) => void;
}

export default function Like({ likeAction, user, word }: LikeProps) {
  return (
    <form action={likeAction}>
      {user !== false && (
        <button type="submit" aria-label="save" title="save">
          <img src={word.liked ? "/like-filled.svg" : "/like.svg"} alt="" />
        </button>
      )}
    </form>
  );
}
