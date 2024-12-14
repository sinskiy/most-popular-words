import { HTMLAttributes, PropsWithChildren } from "react";

interface DropdownProps extends PropsWithChildren, HTMLAttributes<HTMLElement> {
  label: string;
}

export default function Dropdown({ label, children, ...props }: DropdownProps) {
  return (
    <div className="relative">
      <input
        type="checkbox"
        name={`${label}-checkbox`}
        id={`${label}-checkbox`}
        className="absolute inset-0 opacity-0 peer"
      />
      <label
        htmlFor={`${label}-checkbox`}
        className="primary pl-2 pr-4 py-1 flex w-fit gap-1"
      >
        <img src="/dropdown.svg" alt="" />
        {label}
      </label>
      <div
        className="absolute primary px-4 py-2 min-w-48 hidden peer-checked:block"
        {...props}
      >
        {children}
      </div>
    </div>
  );
}
