import { FormHTMLAttributes, PropsWithChildren } from "react";

interface FormProps
  extends FormHTMLAttributes<HTMLFormElement>,
    PropsWithChildren {}

export default function Form({ children, ...props }: FormProps) {
  return (
    <form {...props} className="flex flex-col gap-4">
      {children}
      <button type="submit" className="w-fit p-2 primary">
        submit
      </button>
    </form>
  );
}
