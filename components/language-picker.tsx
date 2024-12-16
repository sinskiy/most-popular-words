"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Dropdown from "./dropdown";
import { DEFAULT_LANGUAGE, languages } from "../types/word";
import { cn } from "../lib/helpers";

export default function LanguagePicker() {
  const searchParams = useSearchParams();
  const language = searchParams.get("language") ?? DEFAULT_LANGUAGE;
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleLanguageSelect(language: string) {
    const params = new URLSearchParams(searchParams);
    params.set("language", language);
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <Dropdown
      id="language"
      label={language}
      labelClassName="text-base font-medium"
    >
      <div
        onChange={(e) =>
          handleLanguageSelect((e.target as HTMLInputElement).value)
        }
      >
        {languages.map((value) => (
          <div key={value} className="flex gap-2">
            <input
              type="radio"
              name="languages"
              id={value}
              value={value}
              defaultChecked={language === value}
            />
            <label className="text-base" htmlFor={value}>
              {value}
            </label>
          </div>
        ))}
      </div>
    </Dropdown>
  );
}
