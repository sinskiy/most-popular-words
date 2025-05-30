"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function RemoveChosenDeck() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  function removeDeck() {
    const params = new URLSearchParams(searchParams);
    params.delete("deck");
    router.replace(`${pathname}?${params}`);
  }
  return (
    <button className="w-fit" onClick={removeDeck}>
      remove chosen deck
    </button>
  );
}
