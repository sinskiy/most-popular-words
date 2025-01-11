"use client";
import { useRef } from "react";
import { SavedWord } from "../types/word";
import InputField from "../ui/input-field";

export default function AddDeck({ words }: { words: SavedWord[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  return (
    <>
      <dialog
        ref={dialogRef}
        className="neutral px-10 py-8 open:flex flex-col gap-6"
      >
        <h2 className="text-2xl font-medium">add deck</h2>
        <form className="flex flex-col gap-4">
          <section className="flex flex-col gap-3">
            <InputField type="text" id="name" />
            <fieldset>
              <legend className="text-sm font-medium text-stone-300 mb-1">
                saved words
              </legend>
              <div className="flex gap-1">
                {words.map((word) => (
                  <div key={word.value} className="relative">
                    <input
                      type="checkbox"
                      name={word.value}
                      id={word.value}
                      className="opacity-0 absolute inset-0 peer"
                    />
                    <label
                      htmlFor={word.value}
                      className="neutral peer-checked:primary block px-2"
                    >
                      {word.value}
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>
          </section>
          <section className="flex gap-2">
            <button className="button">submit</button>
            <button className="button error" formMethod="dialog">
              close
            </button>
          </section>
        </form>
      </dialog>
      <button className="button" onClick={() => dialogRef.current?.showModal()}>
        add deck
      </button>
    </>
  );
}
