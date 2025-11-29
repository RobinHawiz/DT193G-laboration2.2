import { JSONSchemaType } from "ajv";
import { BookPayload } from "@models/book.js";

export const bookIdParamSchema: JSONSchemaType<{ id: number }> = {
  type: "object",
  properties: {
    id: { type: "integer", minimum: 1 },
  },
  required: ["id"],
};

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
