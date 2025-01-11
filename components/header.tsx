import Link from "next/link";
import { Suspense } from "react";
import LanguagePicker from "./language-picker";
import Menu from "./menu";

export default async function Header() {
  return (
    <header className="flex justify-between">
      <div className="text-xl font-medium text-nowrap flex gap-2 items-center">
        <Link href="/">
          <span className="max-md:hidden">most popular </span>
          words in
        </Link>
        <Suspense>
          <LanguagePicker />
        </Suspense>
      </div>
      <Suspense>
        <Menu />
      </Suspense>
    </header>
  );
}
