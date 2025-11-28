import { diContainer } from "@fastify/awilix";
import { Database } from "better-sqlite3";
import { BookEntity } from "@models/book.js";

export interface BookRepository {
  findAllBooks(): Array<BookEntity>;
}

export class SQLiteBookRepository implements BookRepository {
  private readonly db: Database;

  constructor() {
    this.db = diContainer.resolve("db");
  }

  findAllBooks(): Array<BookEntity> {
    const rows = this.db
      .prepare(
        `select id, title, published_year as publishedYear, is_read as isRead from book 
         order by id ASC`
      )
      .all() as Array<BookEntity>;
    return rows;
  }
}
