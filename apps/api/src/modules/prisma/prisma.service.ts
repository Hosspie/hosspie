import { PrismaClient } from '@hosspie/database';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

// 📚 참고: https://docs.nestjs.com/recipes/prisma#use-prisma-client-in-your-nestjs-services

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
