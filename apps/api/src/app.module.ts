import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

import { GuesthouseModule } from './modules/guesthouse/guesthouse.module';
import { HealthModule } from './modules/health/health.module';
import { PrismaModule } from './modules/prisma/prisma.module';

// 📚 참고: https://docs.nestjs.com/modules

@Module({
  imports: [
    // 환경 변수 설정
    // 📚 참고: https://docs.nestjs.com/techniques/configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}.local`, '.env'],
    }),
    // GraphQL 설정
    // 📚 참고: https://docs.nestjs.com/graphql/quick-start
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      path: '/api/graphql',
      playground: process.env.NODE_ENV === 'development',
      context: ({ req }: { req: Request }) => ({ req }),
    }),
    PrismaModule,
    HealthModule,
    GuesthouseModule,
  ],
})
export class AppModule {}
