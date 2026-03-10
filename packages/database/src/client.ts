import { PrismaClient } from '@prisma/client';

// 📚 참고: https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/instantiate-prisma-client#the-number-of-prismaclient-instances-matters

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
