import pkg from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prisma: any;
};

export const prisma =
  globalForPrisma.prisma ?? new pkg.PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;