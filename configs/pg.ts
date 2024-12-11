import pg from "pg";
import "./env.ts";

const connectionString = process.env.DB_CONNECTION_STRING;

const db = new pg.Client({
  connectionString: connectionString,
});
await db.connect();
export default db;
