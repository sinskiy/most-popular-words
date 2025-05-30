import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";
import "./env.ts";
import type { DB } from "../generated/kysely/types.ts";

export * from "../generated/kysely/types.ts";

pg.types.setTypeParser(pg.types.builtins.INT8, (val) => Number(val));
export const kysely = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new pg.Pool({ connectionString: process.env.DATABASE_URL }),
  }),
});
