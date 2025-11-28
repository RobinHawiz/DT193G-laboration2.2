import build from "./app.js";

const server = await build();

try {
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  await server.listen({
    port: port,
  });
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
