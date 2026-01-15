// lib/turso.js
import { createClient } from "@libsql/client";

let client = null;

export function getDb() {
  if (client) return client;

  // Use Turso in production, local SQLite in development
  if (process.env.TURSO_DATABASE_URL) {
    client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  } else {
    // Fallback to local file for development without Turso
    client = createClient({
      url: "file:./database.db",
    });
  }

  return client;
}

// Helper to run queries (Turso is async, unlike better-sqlite3)
export async function query(sql, params = []) {
  const db = getDb();
  const result = await db.execute({ sql, args: params });
  return result;
}

// Get single row
export async function queryOne(sql, params = []) {
  const result = await query(sql, params);
  return result.rows[0] || null;
}

// Get all rows
export async function queryAll(sql, params = []) {
  const result = await query(sql, params);
  return result.rows;
}

// Run insert/update/delete
export async function execute(sql, params = []) {
  const db = getDb();
  const result = await db.execute({ sql, args: params });
  return {
    lastInsertRowid: result.lastInsertRowid,
    changes: result.rowsAffected,
  };
}

// Run multiple statements (for migrations)
export async function executeMultiple(sql) {
  const db = getDb();
  await db.executeMultiple(sql);
}
