"use client";

import { useActionState } from "react";
import { deleteDeck } from "../actions/deck";

export default function DeleteDeck({
  id,
  username,
}: {
  id: string;
  username: string;
}) {
  const [state, action, pending] = useActionState(
    deleteDeck.bind(null, { id, username }),
    undefined
  );
  return (
    <form action={action}>
      <button className="button" type="submit" disabled={pending}>
        delete
      </button>
      {state?.message && <p>{state.message}</p>}
    </form>
  );
}
