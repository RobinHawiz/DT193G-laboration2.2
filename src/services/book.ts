import { diContainer } from "@fastify/awilix";
import { BookEntity, BookPayload } from "@models/book.js";
import { DomainError } from "@errors/domainError.js";
import { BookRepository } from "@repositories/book.js";

export interface BookService {
  getAllBooks(): Array<BookEntity>;
  getOneBook(id: string): BookEntity;
  insertBook(bookPayload: BookPayload): number | bigint;
  updateBook(id: string, payload: BookPayload): void;
  deleteBook(id: string): void;
}

export class DefaultBookService implements BookService {
  private readonly repo: BookRepository;

  constructor() {
    this.repo = diContainer.resolve("bookRepo");
  }

  getAllBooks() {
    return this.repo.findAllBooks();
  }

  getOneBook(id: string) {
    const book = this.repo.findOneBook(id);
    if (!book) {
      throw new DomainError(`Book not found`);
    }
    return book;
  }

  insertBook(payload: BookPayload) {
    if (payload.publishedYear > new Date().getFullYear()) {
      throw new DomainError(`publishedYear must be ≤ the current year`);
    }
    return this.repo.insertBook(payload);
  }

  updateBook(id: string, payload: BookPayload) {
    if (payload.publishedYear > new Date().getFullYear()) {
      throw new DomainError(`publishedYear must be ≤ the current year`);
    }
    const changes = this.repo.updateBook(id, payload);
    if (changes === 0) {
      throw new DomainError(`Book not found`);
    }
  }

  deleteBook(id: string) {
    const changes = this.repo.deleteBook(id);
    if (changes === 0) {
      throw new DomainError(`Book not found`);
    }
  }
}
