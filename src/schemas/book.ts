import { JSONSchemaType } from "ajv";
import { BookPayload } from "@models/book.js";

/**
 * Params validation schema for routes with `:id`.
 *
 * - `id`: positive number
 * - Path params are strings but Ajv by default coerces to number,
 * so handlers can safely use `id: number`.
 *
 */
export const bookIdParamSchema: JSONSchemaType<{ id: number }> = {
  type: "object",
  properties: {
    id: { type: "integer", minimum: 1 },
  },
  required: ["id"],
};

/**
 * Validation schema for book payload (create/update)
 *
 * Validates the request body to ensure required fields are present and formatted correctly:
 * - `title`: non-empty string, max 50 characters
 * - `publishedYear`: positive number
 * - `isRead`: is declared as an integer `0|1`, but the API also accepts
 *   boolean `true|false` because Ajv coerces booleans to `0|1`
 *
 */
export const bookPayloadSchema: JSONSchemaType<BookPayload> = {
  type: "object",
  properties: {
    title: { type: "string", maxLength: 50, minLength: 1 },
    publishedYear: {
      type: "integer",
      minimum: 1,
    },
    isRead: { type: "integer", maximum: 1, minimum: 0 },
  },
  required: ["title", "publishedYear", "isRead"],
  additionalProperties: false,
};
