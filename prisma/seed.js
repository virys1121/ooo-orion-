const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@orion.ru" },
    update: {},
    create: {
      email: "admin@orion.ru",
      name: "Администратор",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  console.log({ admin });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
