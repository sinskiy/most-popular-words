import Link from "next/link";
import { PAGE_CLASSES } from "./pagination";

interface PageProps {
  page: string | number;
  curr: number;
}

export default function Page({ page, curr }: PageProps) {
  return (
    <Link
      href={`?page=${page}`}
      className={`${PAGE_CLASSES} relative ${
        page === curr ? "primary" : "neutral"
      }`}
    >
      {page}
    </Link>
  );
}
