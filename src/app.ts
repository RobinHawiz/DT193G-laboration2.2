import "@config/env.js"; // Load environment variables
import { diContainer } from "@fastify/awilix"; // DI
import * as awilix from "awilix"; // DI
import Fastify from "fastify";
import cors from "@fastify/cors";
import connectToSQLiteDb from "@config/db.js";
import { DefaultBookRoutes } from "@routes/book.js";
import { DefaultBookController } from "@controllers/book.js";
import { DefaultBookService } from "@services/book.js";
import { SQLiteBookRepository } from "@repositories/book.js";

// Bootstraps Fastify, registers DI, mounts routes.
export default async function build() {
  // Instantiate and configure the framework
  const app = Fastify({
    logger: true,
  });

  // Configure CORS origin
  app.register(cors, {
    origin: process.env.CORS_ORIGINS ?? "*",
    exposedHeaders: ["Location"],
  });

  // DI setup
  diContainer.register({
    db: awilix
      .asFunction(connectToSQLiteDb)
      .singleton()
      .disposer((db) => db.close()),
    bookController: awilix.asClass(DefaultBookController).singleton(),
    bookService: awilix.asClass(DefaultBookService).singleton(),
    bookRepo: awilix.asClass(SQLiteBookRepository).singleton(),
  });

  // Mount routes
  const routes = new DefaultBookRoutes();
  routes.initRoutes(app);

  return app;
}
