require("dotenv").config();
const Fastify = require("fastify");

const fastify = Fastify({ logger: true });

// Import user routes
fastify.register(require("./routes/userRoutes"));

fastify.get("/", async (request, reply) => {
  return { message: "Hello, Fastify!" };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
    console.log(`🚀 Server running at http://localhost:3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
