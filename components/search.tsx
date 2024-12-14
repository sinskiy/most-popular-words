"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import setParams from "../lib/set-params";

export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSearch(search: string) {
    const params = new URLSearchParams(searchParams);
    const newParams = setParams(params, search, ["search"]);
    replace(`${pathname}?${newParams.toString()}`);
  }

  return (
    <div className="primary min-w-0 w-48 flex px-2 gap-2 py-1 outline-yellow-500 focus-within:outline">
      <label htmlFor="search" className="sr-only">
        search
      </label>
      <img src="/search.svg" alt="" />
      <input
        type="text"
        id="search"
        name="search"
        onChange={(e) => handleSearch(e.target.value)}
        className="bg-transparent outline-none"
        placeholder="search"
        defaultValue={searchParams.get("search") ?? ""}
      />
    </div>
  );
}
