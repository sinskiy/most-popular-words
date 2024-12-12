"use client";

import ErrorPage from "../components/error-page";
import { ErrorPageProps } from "../types/page";

export default function InternalServerError({ error }: ErrorPageProps) {
  return <ErrorPage title={error.name}>{error.message}</ErrorPage>;
}
