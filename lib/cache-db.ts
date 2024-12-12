import { unstable_cache } from "next/cache";

const DB_REVALIDATE_S = 60 * 60 * 24;

export default function cacheDb<T extends (...args: any[]) => Promise<any>>(
  cb: T,
  keyParts?: string[]
) {
  return unstable_cache(cb, keyParts, { revalidate: DB_REVALIDATE_S });
}
