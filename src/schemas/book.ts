export const bookIdParamSchema = {
  schema: {
    params: {
      properties: {
        id: { type: "integer", minimum: 1 },
      },
    },
  },
};
