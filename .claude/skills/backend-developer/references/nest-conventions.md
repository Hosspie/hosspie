# NestJS 코드 컨벤션

## Feature 기반 모듈 구조

```
modules/{feature}/
├── {feature}.module.ts       # 모듈 정의
├── {feature}.resolver.ts     # GraphQL 엔드포인트 (Controller 역할)
├── {feature}.service.ts      # 비즈니스 로직 + Prisma 쿼리
├── models/                   # GraphQL 출력 타입 (@ObjectType)
└── inputs/                   # GraphQL 입력 타입 (@InputType)
```

## 책임 분리

| 계층 | 역할 | 금지 사항 |
|------|------|----------|
| **Resolver** | GraphQL 엔드포인트 정의, 요청 처리 | 비즈니스 로직, Prisma 쿼리 |
| **Service** | 비즈니스 로직, Prisma 쿼리 | GraphQL 데코레이터 |
| **Model** | GraphQL 출력 타입 정의 | 로직, 유효성 검사 |
| **Input** | GraphQL 입력 타입 + Validation | 로직 |

**핵심**: Resolver는 최대한 얇게, 모든 로직은 Service로 위임.

## 네이밍 컨벤션

| 대상 | 규칙 | 예시 |
|------|------|------|
| 모듈 | `{feature}.module.ts` | `guesthouse.module.ts` |
| 서비스 | `{feature}.service.ts` | `guesthouse.service.ts` |
| 리졸버 | `{feature}.resolver.ts` | `guesthouse.resolver.ts` |
| 모델 | `{model}.model.ts` | `guesthouse.model.ts` |
| Input DTO | `{action}-{model}.input.ts` | `create-guesthouse.input.ts` |

## ObjectType (출력 타입)

```typescript
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Gender } from '@hosspie/database';

// Enum은 반드시 등록
registerEnumType(Gender, {
  name: 'Gender',
  description: 'Gender restriction for room',
});

@ObjectType()
export class Room {
  @Field(() => ID)              // ID 타입 명시
  id: string;

  @Field()
  name: string;

  @Field(() => Gender)          // Enum 타입은 () => Enum
  gender: Gender;

  @Field(() => [Room])          // 배열은 () => [Type]
  rooms: Room[];

  @Field({ nullable: true })   // nullable 명시
  website?: string;
}
```

**필수 규칙**:
- `@Field(() => ID)`: ID 타입 명시
- `@Field(() => EnumType)`: Enum 타입 명시
- `@Field(() => [Type])`: 배열 타입 명시
- `{ nullable: true }`: nullable 필드 명시
- Enum은 `registerEnumType`으로 등록

## InputType (입력 타입)

```typescript
import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsEnum, MinLength, MaxLength, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Gender } from '@hosspie/database';

@InputType()
export class CreateRoomInput {
  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @Field(() => Gender)
  @IsEnum(Gender)
  gender: Gender;

  @Field(() => [CreateRoomInput])   // 중첩 객체 배열
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRoomInput)
  rooms: CreateRoomInput[];
}
```

**필수 규칙**:
- `@InputType()` + `@Field()` 조합
- 모든 필드에 validation 데코레이터 추가
- Enum 필드는 `@IsEnum(EnumType)` 사용
- 중첩 객체는 `@ValidateNested()` + `@Type()` 조합

## Update DTO

Create DTO를 `PartialType`으로 확장:

```typescript
import { PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateGuesthouseInput extends PartialType(CreateGuesthouseInput) {}
```

## Resolver 규칙

```typescript
@Resolver(() => Guesthouse)
export class GuesthouseResolver {
  constructor(private readonly guesthouseService: GuesthouseService) {}

  @Query(() => Guesthouse, { name: 'guesthouse' })
  async findById(@Args('id', { type: () => ID }) id: string) {
    return this.guesthouseService.findById(id);  // Service로 위임
  }

  @Mutation(() => Guesthouse, { name: 'createGuesthouse' })
  async create(@Args('input') input: CreateGuesthouseInput) {
    return this.guesthouseService.create(input);  // Service로 위임
  }
}
```

**필수 규칙**:
- `@Resolver(() => Type)`: 반환 타입 지정
- `{ name: 'customName' }`: GraphQL 이름 명시
- `@Args('id', { type: () => ID })`: ID 타입 명시
- 모든 로직은 Service로 위임

## Service 규칙

```typescript
@Injectable()
export class GuesthouseService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const guesthouse = await this.prisma.guesthouse.findUnique({
      where: { id },
      include: { rooms: true },
    });

    if (!guesthouse) {
      throw new NotFoundException('게스트하우스를 찾을 수 없습니다.');
    }

    return guesthouse;
  }
}
```

**필수 규칙**:
- `@Injectable()` 데코레이터 필수
- Prisma 쿼리는 Service에서만 실행
- 한국어 에러 메시지 사용
- NestJS 내장 Exception 사용 (`NotFoundException`, `BadRequestException` 등)

## 에러 처리

```typescript
import { NotFoundException, BadRequestException } from '@nestjs/common';

// 자주 사용하는 Exception
throw new NotFoundException('게스트하우스를 찾을 수 없습니다.');  // 404
throw new BadRequestException('잘못된 요청입니다.');             // 400
throw new UnauthorizedException('인증이 필요합니다.');           // 401
throw new ForbiddenException('권한이 없습니다.');               // 403
```

**원칙**: 한국어 메시지, 프론트엔드에서 사용자에게 직접 표시 가능한 메시지.

## 트랜잭션

```typescript
async update(id: string, dto: UpdateGuesthouseInput) {
  await this.findById(id);  // 트랜잭션 전 존재 확인

  return this.prisma.$transaction(async (tx) => {
    await tx.room.deleteMany({ where: { guesthouseId: id } });
    return tx.guesthouse.update({ where: { id }, data: dto });
  });
}
```

**규칙**:
- 원자성이 필요한 작업은 `prisma.$transaction()` 사용
- 트랜잭션 전에 존재 확인
- 트랜잭션 내에서는 `tx` 파라미터 사용

## Module 구성

```typescript
// Feature 모듈
@Module({
  providers: [GuesthouseService, GuesthouseResolver],
  exports: [GuesthouseService],  // 다른 모듈에서 사용할 경우
})
export class GuesthouseModule {}

// Global 모듈 (PrismaModule 같은 공통 모듈)
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

**규칙**:
- Feature별 독립 모듈
- Global 모듈은 `@Global()` 데코레이터
- 다른 모듈에서 사용할 서비스는 `exports`에 명시

## Import 순서

```typescript
// 1. NestJS 코어
import { Injectable, NotFoundException } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

// 2. 외부 라이브러리
import { IsString, IsEmail } from 'class-validator';

// 3. Workspace 패키지
import { Gender, DinnerPartyType } from '@hosspie/database';

// 4. 프로젝트 모듈 (상대 경로)
import { PrismaService } from '../prisma/prisma.service';
import { Guesthouse } from './models';
```

## API 폴더 구조

```
apps/api/src/
├── main.ts              # 진입점
├── app.module.ts        # 루트 모듈
├── schema.gql           # GraphQL 스키마 (자동 생성)
├── common/              # 공통 유틸리티 (guards, decorators, filters, interceptors, pipes)
└── modules/             # Feature 모듈
    ├── prisma/          # Global - DB 서비스
    ├── health/          # 헬스 체크
    └── guesthouse/      # 비즈니스 로직
```

## Global 설정 (main.ts)

```typescript
// ValidationPipe - 자동 유효성 검사
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,           // DTO에 없는 필드 제거
  forbidNonWhitelisted: true, // 허용되지 않은 필드 에러
  transform: true,            // 타입 자동 변환
}));

// CORS
app.enableCors({ origin: process.env.CORS_ORIGIN || '*', credentials: true });

// API Prefix - 모든 엔드포인트 /api prefix
app.setGlobalPrefix('api');
```

## 엔드포인트

| 엔드포인트 | 설명 |
|-----------|------|
| `GET /api/health` | 헬스 체크 |
| `POST /api/graphql` | GraphQL API |
| `GET /api/graphql` | GraphQL Playground (개발 환경) |
