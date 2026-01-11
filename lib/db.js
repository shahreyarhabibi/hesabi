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
  // Create users table with avatar field
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create trigger to update updated_at timestamp
  database.exec(`
    CREATE TRIGGER IF NOT EXISTS update_user_timestamp 
    AFTER UPDATE ON users
    BEGIN
      UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;
  `);
}

// User queries
export function getUserByEmail(email) {
  const db = getDb();
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email);
}

export function getUserById(id) {
  const db = getDb();
  return db
    .prepare(
      "SELECT id, email, name, avatar, created_at FROM users WHERE id = ?"
    )
    .get(id);
}

export function updateUserAvatar(userId, avatarUrl) {
  const db = getDb();
  return db
    .prepare("UPDATE users SET avatar = ? WHERE id = ?")
    .run(avatarUrl, userId);
}

export function updateUserProfile(userId, name, email) {
  const db = getDb();
  return db
    .prepare("UPDATE users SET name = ?, email = ? WHERE id = ?")
    .run(name, email, userId);
}
