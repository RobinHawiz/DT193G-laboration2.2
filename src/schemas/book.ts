import { JSONSchemaType } from "ajv";
import { BookPayload } from "@models/book.js";

export const bookIdParamSchema = {
  schema: {
    params: {
      properties: {
        id: { type: "integer", minimum: 1 },
      },
    },
  },
};

export const bookPayloadSchema: JSONSchemaType<BookPayload> = {
  type: "object",
  properties: {
    title: { type: "string", maxLength: 50, minLength: 1 },
    publishedYear: {
      type: "integer",
      maximum: new Date().getFullYear(),
      minimum: 1,
    },
    isRead: { type: "integer", maximum: 1, minimum: 0 },
  },
  required: ["title", "publishedYear", "isRead"],
  additionalProperties: false,
};
