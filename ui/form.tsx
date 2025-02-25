import { FormHTMLAttributes, PropsWithChildren, ReactNode } from "react";
import { cn } from "../lib/helpers";

interface FormProps
  extends FormHTMLAttributes<HTMLFormElement>,
    PropsWithChildren {
  pending: boolean;
  heading?: string;
  message?: string;
  label?: string;
  showSubmit?: boolean;
  nav?: ReactNode;
}

export default function Form({
  pending,
  heading,
  children,
  message,
  label = "submit",
  showSubmit = true,
  nav,
  className,
  ...props
}: FormProps) {
  return (
    <form {...props} className={cn(["flex flex-col gap-4", className])}>
      {heading && <h2 className="text-2xl font-bold">{heading}</h2>}
      {message && <p>{message}</p>}
      <div className="flex flex-col gap-2">{children}</div>
      <nav className="flex gap-2">
        {showSubmit && (
          <button disabled={pending} type="submit" className="button">
            {label}
          </button>
        )}
        {nav}
      </nav>
    </form>
  );
}
