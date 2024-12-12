import Link from "next/link";
import Back from "../components/back";
import { PropsWithChildren } from "react";

interface ErrorPageProps extends PropsWithChildren {
  title: string | number;
}

export default function ErrorPage({ title, children }: ErrorPageProps) {
  return (
    <main className="absolute inset-0 text-center flex flex-col justify-center items-center -z-10">
      <h1 className="font-bold text-6xl">{title}</h1>
      <p className="text-stone-300">{children}</p>
      <nav className="mt-6 flex gap-16">
        <Link href="/" className="flex gap-2">
          <img src="/home.svg" alt="" width={24} height={24} />
          home
        </Link>
        <Back className="flex gap-2">
          <img src="/undo.svg" alt="" width={24} height={24} />
          go back
        </Back>
      </nav>
    </main>
  );
}
