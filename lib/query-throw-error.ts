import { QueryArrayConfig, QueryResultRow } from "pg";
import db from "../configs/pg";

export default async function queryThrowError<T extends QueryResultRow = any>(
  message: string,
  queryTextOrConfig: QueryArrayConfig | string,
  values?: any[]
) {
  try {
    return await db.query<T>(queryTextOrConfig, values);
  } catch (e) {
    console.log(e);
    const error = new Error(message);
    throw error;
  }
}
