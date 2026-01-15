import "dotenv/config"; // loads your .env
import { createClient } from "@libsql/client";
import fs from "fs";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function importDb() {
  const sql = fs.readFileSync("./local.sql", "utf8");
  const statements = sql.split(";").filter(Boolean);

  for (const stmt of statements) {
    await client.execute(stmt);
  }

  console.log("Database imported successfully!");
}

importDb();
