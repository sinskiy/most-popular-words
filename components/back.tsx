"use client";
import { useRouter } from "next/navigation";
import { ButtonHTMLAttributes, PropsWithChildren } from "react";

interface BackProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    PropsWithChildren {}

export default function Back({ children, ...props }: BackProps) {
  const router = useRouter();
  return (
    <button onClick={() => router.back()} {...props}>
      {children}
    </button>
  );
}
