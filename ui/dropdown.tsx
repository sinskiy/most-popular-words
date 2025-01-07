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
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const checkbox = e.currentTarget;
    setTimeout(() => {
      if (checkbox.checked) {
        window.addEventListener("click", handleClick, { once: true });
      }
    }, 0);
  }

  function handleClick(e: Event) {
    const el = e.target as HTMLElement;
    if (el.id !== `${id}-checkbox` && inputRef.current !== null) {
      inputRef.current.checked = false;
    }
  }

  return (
    <div className="relative">
      <input
        type="checkbox"
        name={`${id}-checkbox`}
        id={`${id}-checkbox`}
        className="absolute inset-0 opacity-0 peer"
        onChange={handleChange}
        ref={inputRef}
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
