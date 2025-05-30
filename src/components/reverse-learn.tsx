"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ReverseLearn() {
  const params = useSearchParams();
  const reverse = params.get("reverse") ?? "false";
  const pathname = usePathname();
  const { replace } = useRouter();

  function setReverse() {
    const searchParams = new URLSearchParams(params);
    if (reverse === "true") {
      searchParams.delete("reverse");
    } else {
      searchParams.set("reverse", "true");
    }
    replace(`${pathname}?${searchParams}`);
  }

  return (
    <div className="flex gap-2 items-center">
      <input
        type="checkbox"
        name="reverse"
        id="reverse"
        defaultChecked={reverse === "true"}
        onChange={setReverse}
      />
      <label htmlFor="reverse">reverse learn mode</label>
    </div>
  );
}
