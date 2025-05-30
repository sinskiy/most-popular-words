"use client";

import ErrorPage from "@/components/error-page";
import { ErrorPageProps } from "@/lib/routes";

export default function InternalServerError({ error }: ErrorPageProps) {
  return <ErrorPage title={error.name}>{error.message}</ErrorPage>;
}
