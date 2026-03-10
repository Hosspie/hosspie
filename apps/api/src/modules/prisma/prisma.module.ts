import { Global, Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';

// 📚 참고: https://docs.nestjs.com/recipes/prisma

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
