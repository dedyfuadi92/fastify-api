const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const redis = require("../redis");

module.exports = async function (fastify, options) {
  // Get all users
  // fastify.get("/users", async (request, reply) => {
  //   const users = await prisma.user.findMany();
  //   return { success: true, data: users };
  // });
  // menggunakan jwt auth
  fastify.get(
    "/users",
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      // Cek apakah data sudah ada di Redis
      const cachedUsers = await redis.get("users");
      if (cachedUsers) {
        // Jika ada di Redis, parse kembali ke objek & kirim ke response
        return { success: true, data: JSON.parse(cachedUsers) };
      }
      const users = await prisma.user.findMany();
      // Hapus password dari setiap user dalam array
      const usersWithoutPassword = users.map(({ password, createdAt, ...rest }) => rest);
      // Simpan hasilnya ke Redis dengan kadaluarsa 1 menit (60 detik)
      await redis.set("users", JSON.stringify(usersWithoutPassword), "EX", 60);
      return { success: true, data: usersWithoutPassword };
    }
  );

  // Get user by ID
  fastify.get(
    "/users/:id",
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      const { id } = request.params;
      // Cek apakah data sudah ada di cache
      const cachedUser = await redis.get(`user:${id}`);
      if (cachedUser) {
        const userWithoutPassword = JSON.parse(cachedUser);
        delete userWithoutPassword.password; // Hapus password sebelum dikirim
        return { success: true, data: userWithoutPassword };
      }
      // Jika tidak ada di cache, ambil dari database
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      });
      if (!user)
        return reply
          .code(404)
          .send({ success: false, message: "User not found" });
      // Hapus password sebelum menyimpan ke Redis dan mengembalikan respons
      const { password, ...userWithoutPassword } = user;

      // Simpan ke Redis dengan waktu kadaluarsa 1 menit (60 detik)
      await redis.set(`user:${id}`, JSON.stringify(userWithoutPassword), "EX", 60);
      return { success: true, data: userWithoutPassword };
    }
  );

  // Create user
  fastify.post(
    "/users",
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      const { name, email } = request.body;
      try {
        const newUser = await prisma.user.create({ data: { name, email } });
        return reply.code(201).send({ success: true, data: newUser });
      } catch (error) {
        return reply
          .code(400)
          .send({ success: false, message: "Email already exists" });
      }
    }
  );

  // Update user
  fastify.put(
    "/users/:id",
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      const { id } = request.params;
      const { name, email } = request.body;
      try {
        const updatedUser = await prisma.user.update({
          where: { id: parseInt(id) },
          data: { name, email },
        });
        return { success: true, data: updatedUser };
      } catch (error) {
        return reply
          .code(404)
          .send({ success: false, message: "User not found" });
      }
    }
  );

  // Delete user
  fastify.delete(
    "/users/:id",
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      const { id } = request.params;
      try {
        await prisma.user.delete({ where: { id: parseInt(id) } });
        return { success: true, message: "User deleted" };
      } catch (error) {
        return reply
          .code(404)
          .send({ success: false, message: "User not found" });
      }
    }
  );
};
