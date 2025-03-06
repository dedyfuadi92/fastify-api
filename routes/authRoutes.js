const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

module.exports = async function (fastify, options) {
  // Register User
  fastify.post("/register", async (request, reply) => {
    const { name, email, password } = request.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const newUser = await prisma.user.create({
        data: { name, email, password: hashedPassword },
      });
      return reply
        .code(201)
        .send({ success: true, message: "User registered" });
    } catch (error) {
      return reply
        .code(400)
        // .send({ success: false, message: error.message });
        .send({ success: false, message: "Email already exists" });
    }
  });

  // Login User
  fastify.post("/login", async (request, reply) => {
    const { email, password } = request.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return reply
        .code(401)
        .send({ success: false, message: "Invalid credentials" });
    }

    const token = fastify.jwt.sign({ id: user.id, email: user.email });
    return { success: true, token };
  });
};
