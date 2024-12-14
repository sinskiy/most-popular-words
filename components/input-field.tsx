import {
  HTMLInputAutoCompleteAttribute,
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
} from "react";
import { cn } from "../lib/helpers";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  labelText?: string;
  type: HTMLInputTypeAttribute;
  autoComplete: HTMLInputAutoCompleteAttribute;
  error?: string | string[];
  errorAsArray?: boolean;
  small?: boolean;
}

export default function InputField({
  id,
  name = id,
  labelText = id,
  type,
  autoComplete,
  error,
  errorAsArray = false,
  small = false,
  className,
  ...props
}: InputFieldProps) {
  return (
    <>
      <div className="flex flex-col gap-1">
        <label htmlFor={id} className="text-sm font-medium text-stone-300">
          {labelText}
        </label>
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          {...props}
          className={cn([
            "outline-none neutral p-2 focus:primary",
            small ? "px-2 py-1" : "text-3xl",
          ])}
        />
      </div>
      {error &&
        (Array.isArray(error) && errorAsArray ? (
          <div className="text-sm">
            <p className="text-stone-400">{labelText} must:</p>
            <ul className="text-red-200">
              {error.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-red-200">{error}</p>
        ))}
    </>
  );
}
