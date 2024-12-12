import { PropsWithChildren } from "react";
import { PAGE_CLASSES } from "./pagination";
import Link from "next/link";

export function ManageCurrPage({
  page,
  children,
}: PropsWithChildren & { page: number }) {
  return (
    <Link href={`?page=${page}`} className={`${PAGE_CLASSES} neutral`}>
      {children}
    </Link>
  );
}
