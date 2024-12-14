"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
    <div className="relative">
      <input
        type="checkbox"
        name="sort-checkbox"
        id="sort-checkbox"
        className="absolute inset-0 opacity-0 peer"
      />
      <label
        htmlFor="sort-checkbox"
        className="primary pl-2 pr-4 py-1 flex w-fit gap-1"
      >
        <img src="/dropdown.svg" alt="" />
        sort
      </label>

      <div
        className="absolute primary px-4 py-2 min-w-48 hidden peer-checked:block"
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
      </div>
    </div>
  );
}
