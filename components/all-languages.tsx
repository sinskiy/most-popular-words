"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent } from "react";

export default function AllLanguages() {
  const params = useSearchParams();
  const skipLanguage = params.get("skip-language") ?? "false";
  const pathname = usePathname();
  const { replace } = useRouter();

  function setSkipLanguage(e: ChangeEvent<HTMLInputElement>) {
    const searchParams = new URLSearchParams(params);
    if (skipLanguage === "true") {
      searchParams.delete("skip-language");
    } else {
      searchParams.set("skip-language", "true");
    }
    replace(`${pathname}?${searchParams}`);
  }

  return (
    <div className="flex gap-2 items-center">
      <input
        type="checkbox"
        name="all-languages"
        id="all-languages"
        defaultChecked={skipLanguage === "true"}
        onChange={setSkipLanguage}
      />
      <label htmlFor="all-languages">all languages</label>
    </div>
  );
}
