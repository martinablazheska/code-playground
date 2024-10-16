import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import * as schema from "./schema";

import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function main() {
  console.log("Migrating database...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migration complete");

  await pool.end();
}

main().catch(err => {
  console.error("Migration failed", err);
  process.exit(1);
});
