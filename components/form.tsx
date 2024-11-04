import { FormHTMLAttributes, PropsWithChildren } from "react";

interface FormProps
  extends FormHTMLAttributes<HTMLFormElement>,
    PropsWithChildren {
  pending: boolean;
}

export default function Form({ pending, children, ...props }: FormProps) {
  return (
    <form {...props} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">{children}</div>
      <button disabled={pending} type="submit" className="w-fit p-2 primary">
        submit
      </button>
    </form>
  );
}
