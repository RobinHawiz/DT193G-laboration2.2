import { diContainer } from "@fastify/awilix";
import { FastifyReply } from "fastify";
import { BookService } from "@services/book.js";

export interface BookController {
  getAllBooks(reply: FastifyReply): void;
}

export class DefaultBookController implements BookController {
  private readonly service: BookService;

  constructor() {
    this.service = diContainer.resolve("bookService");
  }

  getAllBooks(reply: FastifyReply) {
    try {
      const books = this.service.getAllBooks();
      reply
        .code(200)
        .header("Content-Type", "application/json; charset=utf-8")
        .send(books);
    } catch (err) {
      console.error("Error retrieving book data:", err);
      reply.code(500).send({ ok: false });
    }
  }
}
