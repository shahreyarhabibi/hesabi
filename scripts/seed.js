// scripts/seed.js
import bcrypt from "bcrypt";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "../database.db");
const db = new Database(dbPath);

// Drop and recreate tables
db.exec("DROP TABLE IF EXISTS users");

db.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create test users
async function createTestUsers() {
  const testUsers = [
    {
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    },
    {
      email: "admin@example.com",
      password: "admin123",
      name: "Admin User",
    },
  ];

  for (const user of testUsers) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    db.prepare(
      "INSERT INTO users (email, password, name) VALUES (?, ?, ?)"
    ).run(user.email, hashedPassword, user.name);
    console.log(`Created user: ${user.email}`);
  }
}

createTestUsers()
  .then(() => {
    console.log("Database seeded successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  });
