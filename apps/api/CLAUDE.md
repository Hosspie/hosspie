# apps/api

Hosspie의 NestJS GraphQL API 서버.

## 스택

- **NestJS 11** + GraphQL Code-First (`@nestjs/graphql` + `@nestjs/apollo`)
- **Prisma** ORM (`@hosspie/database`)
- **Apollo Server**

## 모듈 구조

```
src/modules/
├── prisma/        # 데이터베이스 서비스 (싱글톤 Prisma 클라이언트)
├── guesthouse/    # 비즈니스 로직
│   ├── *.resolver.ts    # GraphQL 리졸버
│   ├── *.service.ts     # 비즈니스 로직
│   ├── models/          # GraphQL @ObjectType
│   └── inputs/          # GraphQL @InputType DTO
└── health/        # 헬스 체크 엔드포인트
```

## 전역 설정 (`src/main.ts`)

- `class-validator` 기반 ValidationPipe (`whitelist: true`, `forbidNonWhitelisted: true`)
- CORS 활성화 (`CORS_ORIGIN` 환경 변수)
- API 접두사: `/api`
- 개발 환경에서 GraphQL Playground 자동 활성화 (`/api/graphql`)

## 인증 상태

**현재 인증 플로우 미구현.** `apps/api/src/modules/guesthouse/guesthouse.resolver.ts`에서 임시 사용자 ID(`'temp-user-id'`) 사용 중. 추후 세션 컨텍스트 기반 인증 구현 예정.

## 타입 시스템 플로우

```
Prisma Schema (packages/database)              # SoT
  ↓
NestJS @ObjectType / @InputType 데코레이터    # apps/api
  ↓
schema.gql 자동 생성 (NestJS 서버 watch 모드)
  ↓
GraphQL Code Generator                         # @hosspie/types codegen
  ↓
TypeScript 타입 / hooks                        # apps/admin import
```

- API 측: enum/모델은 `@hosspie/database`에서 import. 수동 enum 정의·문자열 리터럴 비교 금지.
- 클라이언트 측: 모든 타입은 `@hosspie/types` (codegen 산출물).

스키마 변경 → `schema.gql` 자동 업데이트(watch) → `pnpm codegen` 재실행 필요.

## 명령어

| 명령 | 용도 |
|---|---|
| `pnpm dev:api` | API 개발 서버 (Supabase·Prisma generate 자동) |
| `pnpm codegen` | GraphQL → TS 타입 1회 생성 |
| `pnpm codegen:watch` | watch 모드 (권장) |

## DB 연결

로컬 Supabase + Prisma. 자세한 마이그·시드 흐름은 `packages/database/CLAUDE.md` 참조.
