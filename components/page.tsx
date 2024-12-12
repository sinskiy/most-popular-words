"use client";

import Link from "next/link";
import { PAGE_CLASSES } from "./pagination";
import useModifiedSearchParams from "../hooks/useModifiedSearchParams";

interface PageProps {
  page: string | number;
  curr: number;
}

export default function Page({ page, curr }: PageProps) {
  const searchParams = useModifiedSearchParams("page", String(page));

  return (
    <Link
      href={`?${searchParams.toString()}`}
      className={`${PAGE_CLASSES} relative ${
        page === curr ? "primary" : "neutral"
      }`}
    >
      {page}
    </Link>
  );
}
