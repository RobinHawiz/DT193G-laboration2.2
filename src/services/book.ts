import { diContainer } from "@fastify/awilix";
import { BookEntity, BookPayload } from "@models/book.js";
import { DomainError } from "@errors/domainError.js";
import { BookRepository } from "@repositories/book.js";

export interface BookService {
  // Returns all books
  getAllBooks(): Array<BookEntity>;
  // Returns one book or throws DomainError("Book not found")
  getOneBook(id: string): BookEntity;
  // Inserts and returns a new id. Throws DomainError on invalid payload
  insertBook(bookPayload: BookPayload): number | bigint;
  // Updates if exists. Otherwise throws DomainError on not found or invalid payload.
  updateBook(id: string, payload: BookPayload): void;
  // Deletes if exists. Otherwise throws DomainError("Book not found")
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
