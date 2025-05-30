"use client";

import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

interface HeaderLinkProps extends LinkProps, PropsWithChildren {}

export default function HeaderLink({
  href,
  children,
  ...props
}: HeaderLinkProps) {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      className={pathname === href ? "text-yellow-500" : ""}
      {...props}
    >
      {children}
    </Link>
  );
}
