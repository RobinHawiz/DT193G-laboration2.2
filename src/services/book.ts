import { diContainer } from "@fastify/awilix";
import { BookEntity } from "@models/book.js";
import { BookRepository } from "@repositories/book.js";

export interface BookService {
  getAllBooks(): Array<BookEntity>;
}

export class DefaultBookService implements BookService {
  private readonly repo: BookRepository;

  constructor() {
    this.repo = diContainer.resolve("bookRepo");
  }

  getAllBooks() {
    return this.repo.findAllBooks();
  }
}
