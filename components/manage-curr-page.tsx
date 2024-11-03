import { PropsWithChildren } from "react";
import { PAGE_CLASSES } from "./pagination";

export function ManageCurrPage({ children }: PropsWithChildren) {
  return <button className={`${PAGE_CLASSES} neutral`}>{children}</button>;
}
