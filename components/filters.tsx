"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Dropdown from "./dropdown";
import Form from "./form";
import InputField from "./input-field";
import { setParams } from "../lib/helpers";

interface FiltersProps {
  saved?: boolean;
}

export default function Filters({ saved = false }: FiltersProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  async function handleFilters(formData: FormData) {
    const params = new URLSearchParams(searchParams);
    const newParams = setParams(params, formData, ["source", "saved"]);
    replace(`${pathname}?${newParams.toString()}`);
  }

  return (
    <Dropdown id="filters">
      <Form pending={false} action={handleFilters}>
        <InputField
          type="text"
          id="source"
          autoComplete=""
          small
          defaultValue={searchParams.get("source") ?? ""}
        />
        {saved && (
          <div className="flex gap-2">
            <input
              type="checkbox"
              name="saved"
              id="saved"
              value="true"
              defaultChecked={
                searchParams.get("saved") === "true" ? true : false
              }
            />
            <label htmlFor="saved">saved</label>
          </div>
        )}
      </Form>
    </Dropdown>
  );
}
