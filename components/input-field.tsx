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
}

export default function InputField({
  id,
  name = id,
  labelText = id,
  type,
  autoComplete,
  error,
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
      {error && Array.isArray(error) ? (
        <div>
          <p>{labelText} must:</p>
          <ul>
            {error.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>{error}</p>
      )}
    </>
  );
}
