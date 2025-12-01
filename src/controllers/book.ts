import { diContainer } from "@fastify/awilix";
import { FastifyReply, FastifyRequest } from "fastify";
import { BookPayload } from "@models/book.js";
import { DomainError } from "@errors/domainError.js";
import { BookService } from "@services/book.js";

export interface BookController {
  /** GET /api/books → 200: returns all books */
  getAllBooks(reply: FastifyReply): void;
  /** GET /api/books/:id → 200, 404 on missing */
  getOneBook(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): void;
  /** POST /api/books → 201, 400 on domain rule violation */
  insertBook(
    request: FastifyRequest<{ Body: BookPayload }>,
    reply: FastifyReply
  ): void;
  /** PUT /api/books/:id → 204, 400 on domain rule violation */
  updateBook(
    request: FastifyRequest<{ Params: { id: string }; Body: BookPayload }>,
    reply: FastifyReply
  ): void;
  /** DELETE /api/books/:id → 204, 404 on missing */
  deleteBook(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): void;
}

export class DefaultBookController implements BookController {
  private readonly service: BookService;

  constructor() {
    this.service = diContainer.resolve("bookService");
  }

  getAllBooks(reply: FastifyReply) {
    try {
      const books = this.service.getAllBooks();
      reply.send(books);
    } catch (err) {
      console.error("Error retrieving book data:", err);
      reply.code(500).send({ ok: false });
    }
  }

  getOneBook(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const book = this.service.getOneBook(id);
      reply.code(200).send(book);
    } catch (err) {
      if (err instanceof DomainError) {
        console.error("Error retrieving book data:", err.message);
        reply.code(404).send({ message: err.message });
      } else {
        console.error("Error retrieving book data:", err);
        reply.code(500).send({ ok: false });
      }
    }
  }

  insertBook(
    request: FastifyRequest<{ Body: BookPayload }>,
    reply: FastifyReply
  ) {
    try {
      console.log("wedwefdwefwfe: " + request.body.isRead);
      const id = this.service.insertBook(request.body);
      reply.code(201).header("Location", `/api/books/${id}`).send();
    } catch (err) {
      if (err instanceof DomainError) {
        console.error("Error inserting book data:", err.message);
        reply.code(400).send({ message: err.message });
      } else {
        console.error("Error inserting book data:", err);
        reply.code(500).send({ ok: false });
      }
    }
  }

  updateBook(
    request: FastifyRequest<{ Params: { id: string }; Body: BookPayload }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const payload = request.body;
      this.service.updateBook(id, payload);
      reply.code(204).send();
    } catch (err) {
      if (err instanceof DomainError) {
        console.error("Error updating book data:", err.message);
        reply.code(400).send({ message: err.message });
      } else {
        console.error("Error updating book data:", err);
        reply.code(500).send({ ok: false });
      }
    }
  }

  deleteBook(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      this.service.deleteBook(id);
      reply.code(204).send();
    } catch (err) {
      if (err instanceof DomainError) {
        console.error("Error deleting book data:", err.message);
        reply.code(404).send({ message: err.message });
      } else {
        console.error("Error deleting book data:", err);
        reply.code(500).send({ ok: false });
      }
    }
  }
}
