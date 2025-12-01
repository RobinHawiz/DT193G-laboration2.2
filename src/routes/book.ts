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
    // Fetches all available books
    app.get("/api/books", (_, reply) => {
      this.controller.getAllBooks(reply);
    });

    // Fetches one book by a given id after validating the query parameter
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

    // Inserts a book after validating the request body
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

    // Updates an existing book after validating the query parameter and request body
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

    // Deletes an existing book
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
