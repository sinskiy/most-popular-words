import { RefObject } from "react";

export default function useUncheckOnClickOutside(
  wrapperRef: RefObject<HTMLDivElement>,
  inputRef: RefObject<HTMLInputElement>
) {
  function handleChange() {
    function handleClickOutside(eClick: Event) {
      if (
        wrapperRef.current &&
        inputRef.current &&
        !wrapperRef.current.contains(eClick.target as Node)
      ) {
        inputRef.current.checked = false;
        document.removeEventListener("click", handleClickOutside);
      }
    }
    if (inputRef.current && inputRef.current.checked) {
      document.addEventListener("click", handleClickOutside);
    }
  }

  return handleChange;
}
