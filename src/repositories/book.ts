import { diContainer } from "@fastify/awilix";
import { Database } from "better-sqlite3";
import { BookEntity, BookPayload } from "@models/book.js";

export interface BookRepository {
  findAllBooks(): Array<BookEntity>;
  findOneBook(id: string): BookEntity;
  insertBook(payload: BookPayload): number | bigint;
  updateBook(id: string, payload: BookPayload): number;
  deleteBook(id: string): number;
}

export class SQLiteBookRepository implements BookRepository {
  private readonly db: Database;

  constructor() {
    this.db = diContainer.resolve("db");
  }

  findAllBooks(): Array<BookEntity> {
    try {
      return this.db
        .prepare(
          `select id, title, published_year as publishedYear, is_read as isRead from book 
         order by id ASC`
        )
        .all() as Array<BookEntity>;
    } catch (error) {
      console.error("Database lookup error:", error);
      throw error;
    }
  }

  findOneBook(id: string) {
    try {
      return this.db
        .prepare(
          `select id, title, published_year as publishedYear, is_read as isRead from book where id = @id`
        )
        .get({ id }) as BookEntity;
    } catch (error) {
      console.error("Database lookup error:", error);
      throw error;
    }
  }

  insertBook(payload: BookPayload) {
    try {
      return this.db
        .prepare(
          `insert into book (title, published_year, is_read)
                      values(@title, @publishedYear, @isRead)`
        )
        .run(payload).lastInsertRowid;
    } catch (error) {
      console.error("Database insert error:", error);
      throw error;
    }
  }

  updateBook(id: string, payload: BookPayload): number {
    try {
      return this.db
        .prepare(
          `update book
           set title = @title, published_year = @publishedYear, is_read = @isRead
           where id = @id`
        )
        .run({ id, ...payload }).changes;
    } catch (error) {
      console.error("Database update error:", error);
      throw error;
    }
  }

  deleteBook(id: string): number {
    try {
      return this.db.prepare(`delete from book where id = @id`).run({ id })
        .changes;
    } catch (error) {
      console.error("Database deletion error:", error);
      throw error;
    }
  }
}
