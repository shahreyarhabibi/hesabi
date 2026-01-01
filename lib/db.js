// lib/db.js
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a singleton database connection
let db;

export function getDb() {
  if (!db) {
    // Use different paths for dev/production
    const dbPath =
      process.env.NODE_ENV === "production"
        ? "/tmp/database.db" // Vercel uses /tmp for writable storage
        : path.join(__dirname, "../database.db");

    db = new Database(dbPath);

    // Initialize tables
    initializeDb(db);
  }
  return db;
}

function initializeDb(database) {
  // Create users table
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}
