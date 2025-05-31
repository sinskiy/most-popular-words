export async function queryWithCustomError<Query extends () => Promise<any>>(
  errorMessage: string,
  query: Query
): Promise<ReturnType<Query>> {
  try {
    return await query();
  } catch (err) {
    console.log(err);
    const error = new Error(errorMessage);
    throw error;
  }
}

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

export function moreThanDayBefore(date: Date) {
  return Date.now() - date.getTime() > 1000 * 60 * 60 * 24;
}
