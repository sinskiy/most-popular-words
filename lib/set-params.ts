export default function setParams(
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
