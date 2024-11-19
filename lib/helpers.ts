export function getErrorMessage(e: unknown) {
  const errorMessage =
    e instanceof Error
      ? e.message
      : typeof e === "string"
      ? e
      : "Unexpected error";
  return { message: errorMessage };
}
