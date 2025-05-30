"use client";

import { PropsWithChildren } from "react";
import Link from "next/link";
import useModifiedSearchParams from "@/hooks/useModifiedSearchParams";
import { PAGE_CLASSES } from "./pagination";

export function ManageCurrPage({
  page,
  children,
}: PropsWithChildren & { page: number }) {
  const searchParams = useModifiedSearchParams("page", String(page));

  return (
    <Link
      href={`?${searchParams.toString()}`}
      className={`${PAGE_CLASSES} neutral`}
    >
      {children}
    </Link>
  );
}
