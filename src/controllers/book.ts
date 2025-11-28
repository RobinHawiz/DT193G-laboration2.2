import { diContainer } from "@fastify/awilix";
import { FastifyReply, FastifyRequest } from "fastify";
import { BookPayload } from "@models/book.js";
import { BookService } from "@services/book.js";

export interface BookController {
  getAllBooks(reply: FastifyReply): void;
  getOneBook(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): void;
  insertBook(
    request: FastifyRequest<{ Body: BookPayload }>,
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
      if (err instanceof Error) {
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
      const id = this.service.insertBook(request.body);
      reply.code(201).header("Location", `/api/books/${id}`).send();
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error inserting book data:", err.message);
        reply.code(400).send({ message: err.message });
      } else {
        console.error("Error inserting book data:", err);
        reply.code(500).send({ ok: false });
      }
    }
  }
}
