import { Pool } from "pg";

const connectionString = "postgresql://admin:Wuwpax-6cezwo@localhost:5432/volleypro";
if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
}

export const db = new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
});