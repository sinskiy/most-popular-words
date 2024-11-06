import { Client } from "pg";
const db = new Client({ connectionString: process.env.DB_CONNECTION_STRING });
await db.connect();
export default db;
