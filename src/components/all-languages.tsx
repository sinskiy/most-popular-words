"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function AllLanguages() {
  const params = useSearchParams();
  const allLanguages = params.get("all-languages") ?? "false";
  const pathname = usePathname();
  const { replace } = useRouter();

  function setAllLanguages() {
    const searchParams = new URLSearchParams(params);
    if (allLanguages === "true") {
      searchParams.delete("all-languages");
    } else {
      searchParams.set("all-languages", "true");
    }
    replace(`${pathname}?${searchParams}`);
  }

  return (
    <div className="flex gap-2 items-center">
      <input
        type="checkbox"
        name="all-languages"
        id="all-languages"
        defaultChecked={allLanguages === "true"}
        onChange={setAllLanguages}
      />
      <label htmlFor="all-languages">all languages</label>
    </div>
  );
}
