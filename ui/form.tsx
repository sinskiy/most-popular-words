import { FormHTMLAttributes, PropsWithChildren } from "react";

interface FormProps
  extends FormHTMLAttributes<HTMLFormElement>,
    PropsWithChildren {
  pending: boolean;
  heading?: string;
  message?: string;
  label?: string;
}

export default function Form({
  pending,
  heading,
  children,
  message,
  label = "submit",
  ...props
}: FormProps) {
  return (
    <form {...props} className="flex flex-col gap-4">
      {heading && <h2 className="text-2xl font-bold">{heading}</h2>}
      {message && <p>{message}</p>}
      <div className="flex flex-col gap-2">{children}</div>
      <button disabled={pending} type="submit" className="button">
        {label}
      </button>
    </form>
  );
}
