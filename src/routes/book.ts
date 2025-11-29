import { diContainer } from "@fastify/awilix";
import { FastifyInstance } from "fastify";
import { bookIdParamSchema, bookPayloadSchema } from "@schemas/book.js";
import { BookPayload } from "@models/book.js";
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

    app.get<{ Params: { id: string } }>(
      "/api/books/:id",
      {
        schema: {
          params: bookIdParamSchema,
        },
      },
      (request, reply) => {
        this.controller.getOneBook(request, reply);
      }
    );

    app.post<{ Body: BookPayload }>(
      "/api/books",
      {
        schema: {
          body: bookPayloadSchema,
        },
      },
      (request, reply) => {
        this.controller.insertBook(request, reply);
      }
    );

    app.put<{ Params: { id: string }; Body: BookPayload }>(
      "/api/books/:id",
      {
        schema: {
          params: bookIdParamSchema,
          body: bookPayloadSchema,
        },
      },
      (request, reply) => {
        this.controller.updateBook(request, reply);
      }
    );

    app.delete<{ Params: { id: string } }>(
      "/api/books/:id",
      {
        schema: {
          params: bookIdParamSchema,
        },
      },
      (request, reply) => {
        this.controller.deleteBook(request, reply);
      }
    );
  }
}
