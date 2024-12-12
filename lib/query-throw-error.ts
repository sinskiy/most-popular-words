import { QueryResultRow } from "pg";
import db from "../configs/pg";

export default async function queryThrowError<T extends QueryResultRow = any>(
  message: string,
  queryText: string,
  values?: any[]
) {
  try {
    return await db.query<T>(queryText, values);
  } catch (e) {
    const error = new Error(message);
    throw error;
  }
}
