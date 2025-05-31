import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";
import "../configs/env.ts";
import type { DB } from "../../generated/kysely/types.ts";

export * from "../../generated/kysely/types.ts";

pg.types.setTypeParser(pg.types.builtins.INT8, (val) => Number(val));
const kysely = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new pg.Pool({ connectionString: process.env.DATABASE_URL }),
  }),
});
export default kysely;
