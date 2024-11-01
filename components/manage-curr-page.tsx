import { PropsWithChildren } from "react";
import { PAGE_CLASSES } from "./pagination";

export function ManageCurrPage({ children }: PropsWithChildren) {
  return (
    <button className={`${PAGE_CLASSES} bg-slate-950 border-slate-300`}>
      {children}
    </button>
  );
}
