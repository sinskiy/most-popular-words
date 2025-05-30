"use client";

import { deleteDeckAction } from "@/decks/actions";
import { useActionState } from "react";

export default function DeleteDeck({
  id,
  userId,
}: {
  id: number;
  userId: number;
}) {
  const [state, action, pending] = useActionState(
    deleteDeckAction.bind(null, { id, userId }),
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
