import Link from "next/link";
import { getUser, logOut } from "../actions/auth";
import Search from "./search";

export default async function Header() {
  const user = await getUser();
  return (
    <header className="flex justify-between">
      <Link href="/" className="text-2xl font-medium">
        most popular words in _______
      </Link>
      <Search />
      <nav className="flex gap-4 items-center">
        {user ? (
          <>
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
