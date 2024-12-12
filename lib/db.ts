import { QueryResult } from "pg";

export const ITEMS_PER_PAGE = 10;

export function getTotalPages(count: QueryResult<{ count: number }>) {
  return Math.ceil(count.rows[0].count / ITEMS_PER_PAGE);
}
