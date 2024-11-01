import Link from "next/link";

export default function Header() {
  return (
    <header className="flex justify-between">
      <Link href="/" className="text-2xl font-medium">
        most popular words in _______
      </Link>
      <nav className="flex gap-4 items-center">
        <Link href="/log-in">log in</Link>
        <Link
          href="/sign-up"
          className="bg-yellow-950 border-2 border-opacity-30 border-yellow-500 p-1"
        >
          sign up
        </Link>
      </nav>
    </header>
  );
}
