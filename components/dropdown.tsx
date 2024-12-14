import { HTMLAttributes, PropsWithChildren, ReactNode } from "react";
import cn from "../lib/cn";

interface DropdownProps extends PropsWithChildren, HTMLAttributes<HTMLElement> {
  id: string;
  label?: ReactNode;
  checkboxClassName?: string;
}

export default function Dropdown({
  id,
  label = id,
  children,
  checkboxClassName,
  className,
  ...props
}: DropdownProps) {
  return (
    <div className="relative">
      <input
        type="checkbox"
        name={`${id}-checkbox`}
        id={`${id}-checkbox`}
        className="absolute inset-0 opacity-0 peer"
      />
      {typeof label === "string" ? (
        <label
          htmlFor={`${id}-checkbox`}
          className="primary pl-2 pr-4 py-1 flex w-fit gap-1"
        >
          <img src="/dropdown.svg" alt="" />
          {label}
        </label>
      ) : (
        label
      )}
      <div
        className={cn([
          "absolute primary px-4 py-2 min-w-48 hidden peer-checked:block z-10",
          className,
        ])}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}
