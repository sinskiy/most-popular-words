import { FormHTMLAttributes, PropsWithChildren } from "react";
import { useFormStatus } from "react-dom";

interface FormProps
  extends FormHTMLAttributes<HTMLFormElement>,
    PropsWithChildren {}

export default function Form({ children, ...props }: FormProps) {
  const { pending } = useFormStatus();

  return (
    <form {...props} className="flex flex-col gap-4">
      {children}
      <button disabled={pending} type="submit" className="w-fit p-2 primary">
        submit
      </button>
    </form>
  );
}
