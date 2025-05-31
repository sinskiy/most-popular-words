"use client";

import { moreThanDayBefore } from "@/lib/utils";
import { getLastStreakWithSideEffects } from "@/users/actions";
import { useActionState, useEffect, useRef } from "react";

export default function Streak() {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const lastCheckedString = localStorage.getItem("last-checked-streak");
    if (
      !lastCheckedString ||
      moreThanDayBefore(new Date(Number(lastCheckedString)))
    ) {
      formRef.current?.requestSubmit();
    }
  }, []);

  const [state, action] = useActionState(
    getLastStreakWithSideEffects,
    undefined
  );

  if (state instanceof Date) {
    localStorage.setItem("last-checked-streak", String(Date.now()));
  }

  return (
    <form className="hidden" ref={formRef} action={action}>
      <button type="submit"></button>
    </form>
  );
}
