"use client";

import { getLastStreakWithSideEffects } from "@/users/actions";
import { useActionState, useEffect, useRef } from "react";

export default function Streak() {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const lastCheckedString = localStorage.getItem("last-checked-streak");
    if (
      !lastCheckedString ||
      Date.now() - new Date(Number(lastCheckedString)).getTime() >
        1000 * 60 * 60 * 24
    ) {
      formRef.current?.requestSubmit();
    }
  }, []);

  const [state, action] = useActionState(
    getLastStreakWithSideEffects,
    undefined
  );

  if (typeof state === "string") {
    localStorage.setItem("last-checked-streak", String(Date.now()));
  }

  return (
    <form className="hidden" ref={formRef} action={action}>
      <button type="submit"></button>
    </form>
  );
}
