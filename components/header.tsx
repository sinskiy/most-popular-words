import Link from "next/link";
import { getUser, logOut } from "../actions/auth";
import Search from "./search";
import { cn } from "../lib/helpers";
import { Suspense } from "react";
import HeaderLink from "../ui/header-link";
import LanguagePicker from "./language-picker";

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
        <Search />
      </Suspense>
      <Menu />
    </header>
  );
}

async function Menu() {
  const user = await getUser();

  return (
    <>
      <div className="peer relative z-20 grid place-content-center md:hidden">
        <input
          type="checkbox"
          name="menu"
          id="menu"
          className="peer absolute z-30 size-full opacity-0"
        />
        <label
          htmlFor="menu"
          aria-label="menu"
          className="block outline-white peer-focus-visible:outline peer-focus-visible:outline-1"
        >
          <img src="/menu.svg" alt="" />
        </label>
      </div>
      <nav className="flex gap-4 items-center max-md:fixed max-md:right-0 max-md:z-10 max-md:top-12 max-md:px-8 max-md:py-9 max-md:translate-x-full max-md:flex-col max-md:primary max-md:peer-has-[:checked]:-translate-x-2 max-md:peer-has-[:checked]:shadow-2xl">
        {user ? (
          <>
            <div
              className={cn([
                "flex gap-1",
                new Date(user.last_streak).toDateString() !==
                  new Date().toDateString() &&
                  "opacity-80 [filter:grayscale(1)]",
              ])}
            >
              <img src="/streak.svg" alt="" />
              <p className="text-yellow-500">{user.streak}</p>
            </div>
            <HeaderLink href="/learn">learn</HeaderLink>
            <HeaderLink href="/saved">saved</HeaderLink>
            <button onClick={logOut} className="button">
              log out
            </button>
          </>
        ) : (
          <>
            <HeaderLink href="/log-in">log in</HeaderLink>
            <Link href="/sign-up" className="primary button">
              sign up
            </Link>
          </>
        )}
      </nav>
    </>
  );
}
