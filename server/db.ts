import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

let db: any;

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL not configured - database functionality will be disabled");
  // Export a mock database object
  db = null;
} else {
  const client = postgres(process.env.DATABASE_URL);
  db = drizzle(client);
}

export { db };