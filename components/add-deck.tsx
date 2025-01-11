"use client";
import { useActionState, useEffect, useRef } from "react";
import { SavedWord } from "../types/word";
import InputField from "../ui/input-field";
import { addDeck } from "../actions/deck";

export default function AddDeck({
  words,
  username,
  edit = false,
  id,
  name,
  selectedWords,
}: {
  words: SavedWord[];
  username: string;
  edit?: boolean;
  id?: number;
  name?: string;
  selectedWords?: string[];
}) {
  const [state, action, pending] = useActionState(
    addDeck.bind(null, { username, edit, id }),
    undefined
  );

  useEffect(() => {
    if (state?.success) {
      dialogRef.current?.close();
    }
  }, [state]);

  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <dialog
        ref={dialogRef}
        className="neutral px-10 py-8 open:flex flex-col gap-4"
      >
        <h2 className="text-2xl font-medium">{edit ? "edit" : "add"} deck</h2>
        <form className="flex flex-col gap-6" action={action}>
          <section className="flex flex-col gap-2">
            <InputField
              type="text"
              id="name"
              error={state?.errors?.name}
              defaultValue={name}
              small
            />
            <fieldset>
              <legend className="text-sm font-medium text-stone-300 mb-1">
                saved words
              </legend>
              <div className="flex gap-1">
                {words.length > 0 ? (
                  words.map((word) => (
                    <div key={word.value} className="relative">
                      <input
                        type="checkbox"
                        name={word.value}
                        id={word.value}
                        defaultChecked={
                          selectedWords && selectedWords.includes(word.value)
                        }
                        className="opacity-0 absolute inset-0 peer"
                      />
                      <label
                        htmlFor={word.value}
                        className="neutral peer-checked:primary block px-2"
                      >
                        {word.value}
                      </label>
                    </div>
                  ))
                ) : (
                  <p>
                    <i>no saved words</i>
                  </p>
                )}
              </div>
            </fieldset>
          </section>
          <section className="flex gap-2">
            <button className="button" disabled={pending}>
              submit
            </button>
            <button
              className="button error"
              type="button"
              onClick={() => dialogRef.current?.close()}
            >
              close
            </button>
          </section>
          {state?.message && <p>{state.message}</p>}
          {/* Dynamic errors without name error */}
          {state?.errors &&
            Object.values(state.errors).length -
              Number(state.errors?.name !== undefined) >
              0 &&
            JSON.stringify({ ...state.errors, name: undefined })}
        </form>
      </dialog>
      <button className="button" onClick={() => dialogRef.current?.showModal()}>
        {edit ? "edit" : "add"} deck
      </button>
    </>
  );
}
