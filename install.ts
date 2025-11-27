// Load environment variables
import "./src/config/env.js";

import DatabaseConstructor, { Database } from "better-sqlite3";

let db: Database | undefined;

try {
  // Connect to db
  const dbPath = process.env.DATABASE;
  if (!dbPath) {
    throw new Error("Failed to create db: Missing DATABASE in .env");
  }
  db = new DatabaseConstructor(dbPath);

  // Create table book
  db.exec("drop table if exists book;");

  db.exec(`CREATE TABLE book(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        published_year INTEGER NOT NULL,
        is_read BOOLEAN NOT NULL
        );`);

  console.log("DB initialized at:", dbPath);
} catch (e) {
  console.error("---ERROR---");
  console.error(e instanceof Error ? e.message : e);
} finally {
  if (db) db.close();
}
