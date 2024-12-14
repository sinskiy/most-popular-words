export function setParams(
  params: URLSearchParams,
  values: FormData | string,
  set: string[]
) {
  for (const key of set) {
    const value = typeof values === "string" ? values : values.get(key);
    if (typeof value === "string" && value.length > 0) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
  }
  return params;
}

export function getErrorMessage(e: unknown) {
  const errorMessage =
    e instanceof Error
      ? e.message
      : typeof e === "string"
      ? e
      : "Unexpected error";
  return { message: errorMessage };
}

export function getRandomIndex(length: number) {
  return Math.floor(Math.random() * length);
}

export function cn(classes: unknown | unknown[]) {
  if (!Array.isArray(classes)) {
    if (classes && typeof classes === "string") {
      return classes;
    } else {
      return "";
    }
  }

  return classes.filter((cssClass) => typeof cssClass === "string").join(" ");
}
