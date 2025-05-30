"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Dropdown from "@/ui/dropdown";
import Form from "@/ui/form";
import InputField from "@/ui/input-field";
import { setParams } from "@/lib/utils";
import { QueriedUser } from "@/users/queries";
import { knowledgeArray, sourceTypeArray } from "@/words/const";

interface FiltersProps {
  user?: QueriedUser | false;
}

export default function Filters({ user }: FiltersProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  async function handleFilters(formData: FormData) {
    const params = new URLSearchParams(searchParams);
    const newParams = setParams(params, formData, [
      "source",
      "type",
      "saved",
      ...knowledgeArray,
    ]);
    replace(`${pathname}?${newParams.toString()}`);
  }

  return (
    <Dropdown id="filters">
      <Form
        pending={false}
        action={handleFilters}
        heading="Filters"
        nav={
          <button
            className="button"
            type="button"
            onClick={() => handleFilters(new FormData())}
          >
            reset
          </button>
        }
      >
        <InputField
          type="text"
          id="source"
          small
          defaultValue={searchParams.get("source") ?? ""}
        />
        <fieldset>
          <legend className="text-lg font-semibold mb-0.5">type</legend>
          <div>
            {sourceTypeArray.map((type) => (
              <div key={type} className="flex gap-3">
                <input
                  type="radio"
                  id={type}
                  name="type"
                  value={type}
                  defaultChecked={searchParams.get("type") === type}
                />
                <label htmlFor={type}>{type}</label>
              </div>
            ))}
          </div>
        </fieldset>
        {user && (
          <fieldset>
            <legend className="text-lg font-semibold mb-0.5">knowledge</legend>
            {knowledgeArray.map((knowledgeType) => (
              <div key={knowledgeType} className="flex gap-3">
                <input
                  type="checkbox"
                  id={knowledgeType}
                  name={knowledgeType}
                  value="true"
                  defaultChecked={searchParams.get(knowledgeType) === "true"}
                />
                <label htmlFor={knowledgeType}>{knowledgeType}</label>
              </div>
            ))}
          </fieldset>
        )}
        {user && (
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
