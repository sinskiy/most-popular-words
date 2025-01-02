import { PropsWithChildren } from "react";

export default function Tip({ children }: PropsWithChildren) {
  return (
    <div className="neutral px-12 max-md:px-6 py-4 font-medium">
      tip: {children}
    </div>
  );
}
