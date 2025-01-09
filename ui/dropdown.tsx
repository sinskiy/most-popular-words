import {
  ChangeEvent,
  HTMLAttributes,
  PropsWithChildren,
  ReactNode,
  useRef,
} from "react";
import { cn } from "../lib/helpers";

interface DropdownProps extends PropsWithChildren, HTMLAttributes<HTMLElement> {
  id: string;
  label?: ReactNode;
  labelClassName?: string;
}

export default function Dropdown({
  id,
  label = id,
  children,
  className,
  labelClassName,
  ...props
}: DropdownProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const checkbox = e.currentTarget;

    function handleClickOutside(eClick: Event) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(eClick.target as Node)
      ) {
        checkbox.checked = false;
        document.removeEventListener("click", handleClickOutside);
      }
    }
    if (e.currentTarget.checked) {
      document.addEventListener("click", handleClickOutside);
    }
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        type="checkbox"
        name={`${id}-checkbox`}
        id={`${id}-checkbox`}
        onChange={handleChange}
        className="absolute inset-0 opacity-0 peer"
      />
      {typeof label === "string" ? (
        <label
          htmlFor={`${id}-checkbox`}
          className={cn([
            "neutral pl-2 pr-4 py-1 flex w-fit gap-1 outline-slate-300 peer-focus-visible:outline peer-focus-visible:outline-1",
            labelClassName,
          ])}
        >
          <img src="/dropdown.svg" alt="" />
          {label}
        </label>
      ) : (
        label
      )}
      <div
        className={cn([
          "absolute neutral px-4 py-2 mt-1 min-w-48 hidden peer-checked:block z-10",
          className,
        ])}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}
