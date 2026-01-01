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

  // Insert a default user if none exists (for testing)
  const userCount = database
    .prepare("SELECT COUNT(*) as count FROM users")
    .get().count;
  if (userCount === 0) {
    const hashedPassword = "$2b$10$YourHashedPasswordHere"; // Hash of 'password123'
    // You'll need to generate this hash (see step 4 for password hashing)
    database
      .prepare("INSERT INTO users (email, password, name) VALUES (?, ?, ?)")
      .run("user@example.com", hashedPassword, "Test User");
  }
}
