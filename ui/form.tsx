import { FormHTMLAttributes, PropsWithChildren, ReactNode } from "react";

interface FormProps
  extends FormHTMLAttributes<HTMLFormElement>,
    PropsWithChildren {
  pending: boolean;
  heading?: string;
  message?: string;
  label?: string;
  nav?: ReactNode;
}

export default function Form({
  pending,
  heading,
  children,
  message,
  label = "submit",
  nav,
  ...props
}: FormProps) {
  return (
    <form {...props} className="flex flex-col gap-4">
      {heading && <h2 className="text-2xl font-bold">{heading}</h2>}
      {message && <p>{message}</p>}
      <div className="flex flex-col gap-2">{children}</div>
      <nav className="flex gap-2">
        <button disabled={pending} type="submit" className="button">
          {label}
        </button>
        {nav}
      </nav>
    </form>
  );
}
