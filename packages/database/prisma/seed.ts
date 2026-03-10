import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 테스트 사용자 생성
  const testUser = await prisma.user.upsert({
    where: { id: 'temp-user-id' },
    update: {},
    create: {
      id: 'temp-user-id',
      email: 'test@hosspie.com',
    },
  });

  console.log('Test user created:', testUser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
