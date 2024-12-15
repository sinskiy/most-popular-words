import Link from "next/link";
import { getUser, logOut } from "../actions/auth";
import Search from "./search";
import { cn } from "../lib/helpers";
import { Suspense } from "react";
import HeaderLink from "./header-link";

export default async function Header() {
  const user = await getUser();
  return (
    <header className="flex justify-between">
      <Link href="/" className="text-2xl font-medium">
        most popular words in _______
      </Link>
      <Suspense>
        <Search />
      </Suspense>
      <nav className="flex gap-4 items-center">
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
    </header>
  );
}
