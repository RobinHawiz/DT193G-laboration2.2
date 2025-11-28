import DatabaseConstructor, { Database } from "better-sqlite3";

/**
 * Connects to a SQLite database.
 *
 * @returns A SQLite database connection
 * @throws If the database connection failed
 */
export default function connectToSQLiteDb(): Database {
  try {
    const dbConnection = new DatabaseConstructor(process.env.DATABASE, {
      verbose: console.log,
    });
    return dbConnection;
  } catch (err) {
    console.error("Database connection failed:", err);
    throw err;
  }
}
