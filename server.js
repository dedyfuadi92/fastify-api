require("dotenv").config();
const Fastify = require("fastify");

const fastify = Fastify({ logger: true });
// rate limiter
fastify.register(require("@fastify/rate-limit"), {
  max: 10, // Maksimal 10 request
  timeWindow: "1 minute", // Dalam 1 menit
});

fastify.get("/protected", async (request, reply) => {
  return { message: "This is a protected route!" };
});
// Register JWT Plugin
fastify.register(require("@fastify/jwt"), {
  secret: process.env.JWT_SECRET || "supersecretkey",
});
// Middleware untuk proteksi endpoint
fastify.decorate("authenticate", async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ success: false, message: "Unauthorized" });
  }
});
// halaman utama
fastify.get("/", async (request, reply) => {
  return { message: "Hello, Fastify!" };
});
// Import auth routes
fastify.register(require("./routes/authRoutes"));
// Import user routes
fastify.register(require("./routes/userRoutes"));

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
