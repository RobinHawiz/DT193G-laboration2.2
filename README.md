# DT193G-laboration2.2 Backend API

REST API (CRUD) for managing a personal book list.

## Tech Stack

- **Node.js** + **Fastify**
- **TypeScript**
- **AJV** (validation)
- **Awilix** + **@fastify/awilix** (DI)
- **SQLite** (better-sqlite3)

## Project Structure

This project uses a layered structure with domain-oriented filenames. The term domain refers to the specific subject area or problem that software system aims to address [^1].
Example: routes/book.ts, controllers/book.ts, services/book.ts, repositories/book.ts all belong to the **book** domain (book management). When adding a new domain (e.g., user for managing user accounts), user.ts would be added with its own routes, service, repo, etc, in the same folders.

[^1]: GeeksforGeeks, "Domain-Driven Design (DDD)". Retrieved 2025-12-01. Link: [https://www.geeksforgeeks.org/system-design/domain-driven-design-ddd/](https://www.geeksforgeeks.org/system-design/domain-driven-design-ddd/).

```plaintext
src/
├── app.ts                 # Fastify app configuration
├── server.ts              # Server entrypoint
├── config/                # Env, DB setup
├── errors/                # Domain errors
├── models/                # Domain entity types
├── schemas/               # AJV schemas
├── routes/                # Route registration
├── controllers/           # Maps HTTP requests to the service layer and maps results/errors to HTTP responses
├── services/              # Business logic
└── repositories/          # DB access
```

## Data Structures

SQLite handles persistence, while validation and data constraints are enforced at the application layer using AJV schemas.

### Book

| Field             | SQLite Type           | Description             | AJV Validation                 |
|-------------------|-----------------------|-------------------------|--------------------------------|
| `id`              | INTEGER AUTOINCREMENT | Primary key             | integer, min 1                 |
| `title`           | TEXT                  | Book title              | string, min 1, max 50          |
| `publishedYear`   | INTEGER               | Year of publication     | integer, min 1                 |
| `isRead`          | BOOLEAN               | Read status             | integer, 0 (false) or 1 (true) |

> Note: API accepts true/false and 0/1 for isRead. AJV coercion maps booleans to 0/1.

## API Endpoints

### Book

| Method | Route                              | Description                                | Body / Params                                                               | Response                                                      |
|--------|------------------------------------|--------------------------------------------|-----------------------------------------------------------------------------|---------------------------------------------------------------|
| GET    | `/api/books`                       | Get all books                              | None                                                                        | `200 OK` + array of books                                     |
| GET    | `/api/books/:id`                   | Get a book                                 | `:id` (book ID)                                                             | `200 OK` + book • `404 Not Found`                             |
| POST   | `/api/books`                       | Insert a new book                          | `{ "title": string, "publishedYear": number, "isRead": 0 \| 1 \| boolean }` | `201 Created` + Location: /api/books/:id • `400 Bad Request`  |
| PUT    | `/api/books/:id`                   | Update a book                              | `:id` (book ID) + same body as POST                                         | `204 No Content` • `400 Bad Request`                          |
| DELETE | `/api/books/:id`                   | Delete a book                              | `:id` (book ID)                                                             | `204 No Content` • `400 Bad Request` • `404 Not Found`        |

