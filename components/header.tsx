import Link from "next/link";
import { getUser, logOut } from "../actions/auth";
import Search from "./search";
import { cn } from "../lib/helpers";
import { Suspense } from "react";

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
            <Link href="/learn">learn</Link>
            <Link href="/saved">saved</Link>
            <button onClick={logOut}>log out</button>
          </>
        ) : (
          <>
            <Link href="/log-in">log in</Link>
            <Link href="/sign-up" className="primary p-1">
              sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
