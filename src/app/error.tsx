"use client";

import CustomErrorPage from "@/components/error-page";
import { ErrorPageProps } from "@/lib/routes";

export default function InternalServerError({ error }: ErrorPageProps) {
  return <CustomErrorPage title={error.name}>{error.message}</CustomErrorPage>;
}
