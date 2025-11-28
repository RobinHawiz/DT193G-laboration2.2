import { diContainer } from "@fastify/awilix";
import { FastifyInstance, FastifyRequest } from "fastify";
import { bookIdParamSchema } from "@schemas/book.js";
import { BookController } from "@controllers/book.js";

export interface BookRoutes {
  initRoutes(app: FastifyInstance): void;
}

export class DefaultBookRoutes implements BookRoutes {
  private readonly controller: BookController;

  constructor() {
    this.controller = diContainer.resolve("bookController");
  }

  initRoutes(app: FastifyInstance) {
    app.get("/api/books", (_, reply) => {
      this.controller.getAllBooks(reply);
    });

    app.get(
      "/api/books/:id",
      bookIdParamSchema,
      (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
        this.controller.getOneBook(request, reply);
      }
    );
  }
}
