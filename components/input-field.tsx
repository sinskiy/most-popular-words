import {
  HTMLInputAutoCompleteAttribute,
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
} from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  labelText?: string;
  type: HTMLInputTypeAttribute;
  autoComplete: HTMLInputAutoCompleteAttribute;
  error?: string | string[];
  errorAsArray?: boolean;
}

export default function InputField({
  id,
  name = id,
  labelText = id,
  type,
  autoComplete,
  error,
  errorAsArray = false,
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
          className="outline-none neutral text-3xl p-2 focus:primary"
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
