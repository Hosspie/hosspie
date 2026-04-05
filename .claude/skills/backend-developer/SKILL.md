---
name: backend-developer
description: NestJS GraphQL API, Prisma 스키마, 데이터베이스 관리 가이드. Postgres 성능 최적화 및 Supabase 모범 사례도 포함. API 엔드포인트 구현, 데이터베이스 스키마 변경, 마이그레이션, Prisma 쿼리 작성, NestJS 모듈/서비스/리졸버 작성, GraphQL 타입 정의, 타입 시스템 관리, SQL 쿼리 최적화, 인덱스, 커넥션 풀링, RLS 작업 시 사용. 트리거: API, GraphQL, 리졸버, 서비스, Prisma, 데이터베이스, 스키마, 마이그레이션, 모듈, DTO, Input, ObjectType, codegen, 타입 시스템, Postgres, SQL, 인덱스, RLS, 커넥션 풀링, 쿼리 최적화.
---

# Backend Developer 가이드

NestJS GraphQL API + Prisma ORM + Supabase PostgreSQL 백엔드 개발 가이드.

## 현재 상태

- **모듈**: prisma (싱글톤), guesthouse (비즈니스 로직), health
- **Enum**: Gender, DinnerPartyType, OnboardingStatus
- **모델**: User (1:1) -> Guesthouse (1:n) -> Room
- **인증**: 임시 사용자 ID (TODO)

## API 개발 워크플로우

새로운 API 엔드포인트 추가 시:

```
1. 스키마 확인 → packages/database/prisma/schema.prisma
2. Model 정의 → modules/{feature}/models/{model}.model.ts
3. Input 정의 → modules/{feature}/inputs/{action}-{model}.input.ts
4. Service 구현 → modules/{feature}/{feature}.service.ts
5. Resolver 작성 → modules/{feature}/{feature}.resolver.ts
6. Module 등록 → modules/{feature}/{feature}.module.ts
7. codegen 실행 → pnpm codegen
```

## DB 변경 워크플로우

```bash
# 1. 스키마 수정
# packages/database/prisma/schema.prisma 편집

# 2. DB 반영 + 클라이언트 생성
pnpm db:push
pnpm db:generate

# 3. API 모델에 Enum 등록 (새 Enum 추가 시)
# registerEnumType(NewEnum, { name: 'NewEnum' })

# 4. 타입 재생성
pnpm codegen
```

## 타입 시스템 핵심 규칙

**Prisma Schema = 단일 진실의 소스 (SSOT)**

```
Prisma Schema → NestJS 데코레이터 → schema.gql → codegen → @hosspie/types
```

| 환경 | Enum/Model Import | GraphQL Input/Output |
|------|-------------------|---------------------|
| API | `@hosspie/database` | 직접 정의 (@ObjectType, @InputType) |
| Client | `@hosspie/types` | `@hosspie/types` |

```typescript
// API에서
import { Gender, DinnerPartyType } from '@hosspie/database';

// Client에서
import { Gender, CreateGuesthouseInput } from '@hosspie/types';

// !! 절대 금지 !!
enum Gender { MALE = 'MALE' }       // 수동 enum 정의
if (room.gender === 'MALE') { ... } // 문자열 리터럴 비교
```

## 에러 처리

NestJS 내장 Exception + 한국어 메시지:

```typescript
throw new NotFoundException('게스트하우스를 찾을 수 없습니다.');
throw new BadRequestException('잘못된 요청입니다.');
throw new UnauthorizedException('인증이 필요합니다.');
throw new ForbiddenException('권한이 없습니다.');
```

## Supabase MCP 도구

DB 작업 시 Supabase MCP 도구 활용 가능:
- `list_tables` - 테이블 목록 조회
- `execute_sql` - SQL 실행 (읽기/DML)
- `apply_migration` - DDL 마이그레이션 적용
- `get_logs` - 서비스별 로그 조회
- `get_advisors` - 보안/성능 권고사항 확인

## 주요 명령어

```bash
pnpm dev:api          # API 서버 시작 (Supabase 자동 시작)
pnpm db:generate      # Prisma Client 생성
pnpm db:push          # 스키마 DB 반영 (개발)
pnpm db:migrate:dev   # 마이그레이션 생성 및 적용
pnpm db:studio        # Prisma Studio GUI
pnpm codegen          # GraphQL 타입 전체 생성
pnpm codegen:watch    # Watch 모드 (권장)
```

## 상세 참조

- [NestJS 코드 컨벤션](./references/nest-conventions.md) - 모듈 구조, 타입 정의, Resolver/Service 규칙
- [타입 시스템 + GraphQL Codegen](./references/type-system.md) - 타입 플로우, Import 규칙, Codegen 워크플로우
- [데이터베이스](./references/database.md) - Prisma 스키마 컨벤션, Supabase 설정, 마이그레이션 워크플로우, 트러블슈팅
- [Postgres 모범 사례](./references/postgres-best-practices.md) - 쿼리 성능, 인덱스, 커넥션 관리, RLS, 스키마 설계, 동시성 (개별 규칙: `references/postgres-rules/`)
