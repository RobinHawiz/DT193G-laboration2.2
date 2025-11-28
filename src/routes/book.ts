import { diContainer } from "@fastify/awilix";
import { FastifyInstance } from "fastify";
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
    app.route({
      method: "GET",
      url: "/api/books",
      handler: (_, reply) => {
        this.controller.getAllBooks(reply);
      },
    });
  }
}
