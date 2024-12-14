"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Dropdown from "./dropdown";

const OPTIONS = ["descending", "ascending", "alphabetical"];

export default function Sort() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  function handleSort(type: string) {
    const params = new URLSearchParams(searchParams);
    params.set("sort", type);
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <Dropdown
      label="sort"
      onChange={(e) => handleSort((e.target as HTMLInputElement).id)}
    >
      {OPTIONS.map((option, i) => (
        <div key={option} className="flex gap-3 py-1">
          <input
            type="radio"
            name="sort"
            id={option}
            defaultChecked={i === 0}
          />
          <label htmlFor={option}>{option}</label>
        </div>
      ))}
    </Dropdown>
  );
}
