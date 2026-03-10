# 데이터베이스 레퍼런스 (Prisma + Supabase)

## Prisma 스키마 컨벤션

### 구조 순서

```
Generator → Datasource → Enums → Models
```

### 컬럼 네이밍

```prisma
// 필드: camelCase, DB 컬럼: snake_case (@map)
dinnerPartyType        DinnerPartyType @map("dinner_party_type")
dinnerPartyDescription String?         @map("dinner_party_description") @db.VarChar(500)

// 테이블: PascalCase 모델, snake_case 테이블명 (@@map)
model Guesthouse {
  // ...
  @@map("guesthouses")
}
```

### DB 타입 지정

```prisma
name     String  @db.VarChar(50)    // 길이 제한 문자열
capacity Int     @db.SmallInt       // 작은 정수
website  String? @db.VarChar(200)   // nullable
```

### Cascade Delete

```prisma
// 부모 삭제 시 자식 자동 삭제
user User @relation(fields: [userId], references: [id], onDelete: Cascade)
```

### Timestamp 패턴

```prisma
createdAt DateTime @default(now()) @map("created_at")
updatedAt DateTime @updatedAt @map("updated_at")
```

### 현재 스키마

```
User (1:1) → Guesthouse (1:n) → Room
```

- 위치: `packages/database/prisma/schema.prisma`
- Enum: `Gender`, `DinnerPartyType`, `OnboardingStatus`
- 관계: User-Guesthouse (`@unique` FK), Guesthouse-Room (1:n)

## PrismaClient 싱글톤

```typescript
// packages/database/src/client.ts
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
```

```typescript
// packages/database/src/index.ts
export * from '@prisma/client';
export { prisma } from './client';
```

### 패키지 Export

| Import 경로 | 내용 |
|-------------|------|
| `@hosspie/database` | Prisma Client + 모든 타입/Enum |
| `@hosspie/database/client` | 싱글톤 PrismaClient 인스턴스 |

## Seed 데이터

```typescript
// packages/database/prisma/seed.ts
// upsert 패턴 사용 - 중복 실행 안전
const testUser = await prisma.user.upsert({
  where: { id: 'temp-user-id' },
  update: {},
  create: {
    id: 'temp-user-id',
    email: 'test@hosspie.com',
  },
});
```

실행: `pnpm db:seed`

## 개발 워크플로우

### 초기 설정

**Supabase 로컬 포트**:

| 서비스 | 포트 |
|--------|------|
| PostgreSQL | 54322 |
| API (비활성화) | 54321 |
| Studio | 54323 |
| Shadow DB | 54320 |

**환경 변수** (`apps/api/.env.development.local`):

```env
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"
DIRECT_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"
```

**설정 순서**:

```bash
pnpm supabase:start    # 1. Supabase 로컬 시작
pnpm db:push           # 2. 스키마 DB 반영
pnpm db:generate       # 3. Prisma Client 생성
pnpm db:seed           # 4. 시드 데이터 삽입
```

### 스키마 변경 시

```bash
# 1. packages/database/prisma/schema.prisma 수정
pnpm db:push           # 2. DB 반영 (개발)
pnpm db:generate       # 3. Prisma Client 재생성
```

### 마이그레이션

| 명령어 | 용도 | 환경 |
|--------|------|------|
| `pnpm db:push` | 스키마 직접 반영 (마이그레이션 파일 없음) | 개발 |
| `pnpm db:migrate:dev` | 마이그레이션 파일 생성 + 적용 | 개발 |
| `pnpm db:migrate:deploy` | 마이그레이션 적용 (파일 생성 없음) | 프로덕션 |

- `db:push`: 빠른 프로토타이핑, 마이그레이션 이력 불필요 시
- `db:migrate:dev`: 마이그레이션 이력 관리 필요 시, 프로덕션 배포 준비 시

### DB 관리

```bash
pnpm db:studio         # Prisma Studio GUI (port 5555)
```

**DB 리셋**:

```bash
pnpm supabase:stop     # Supabase 중지
pnpm supabase:start    # Supabase 재시작 (깨끗한 DB)
pnpm db:push           # 스키마 재적용
pnpm db:seed           # 시드 데이터 재삽입
```

## Turborepo 태스크 의존성

```json
// turbo.json
{
  "@hosspie/api#dev": {
    "dependsOn": ["@hosspie/database#db:generate", "@hosspie/database#build"]
  },
  "db:generate": { "cache": false },
  "db:push": { "cache": false },
  "db:migrate:dev": { "cache": false },
  "db:migrate:deploy": { "cache": false }
}
```

- `pnpm dev:api` 실행 시: Supabase 자동 시작 -> Prisma Client 생성 -> API 서버 시작
- `db:*` 태스크는 캐시 비활성화 (DB 상태는 항상 최신 반영)
- `db:push`는 수동 실행 필요 (Turborepo 자동 실행 아님)

## 트러블슈팅

### 1. DATABASE_URL not found

```
Error: Environment variable not found: DATABASE_URL
```

- `apps/api/.env.development.local` 파일 확인
- `cp apps/api/.env.example apps/api/.env.development.local`

### 2. Can't reach database server

```
Error: Can't reach database server at 127.0.0.1:54322
```

- Supabase 실행 확인: `pnpm supabase:start`
- 포트 충돌 확인: `lsof -i :54322`

### 3. Prisma Client not generated

```
Error: @prisma/client did not initialize yet
```

- `pnpm db:generate` 실행
- `node_modules/.prisma/client` 디렉토리 확인

### 4. Migration conflicts

```
Error: Migration has already been applied
```

- `prisma migrate resolve --applied {migration_name}` 으로 해결
- 또는 DB 리셋 후 재적용

### 5. Type has no exported member

```
Error: Module '@hosspie/database' has no exported member 'NewEnum'
```

- `pnpm db:generate` 실행 (Prisma Client 재생성)
- `pnpm build --filter=@hosspie/database` (패키지 빌드)

## 빌드 설정

```typescript
// packages/database/tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/client.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
});
```

## CLI 명령어 요약표

| 명령어 (루트) | 설명 |
|--------------|------|
| `pnpm supabase:start` | Supabase 로컬 시작 |
| `pnpm supabase:stop` | Supabase 로컬 중지 |
| `pnpm db:generate` | Prisma Client 생성 |
| `pnpm db:push` | 스키마 DB 반영 (개발) |
| `pnpm db:migrate:dev` | 마이그레이션 생성 + 적용 |
| `pnpm db:studio` | Prisma Studio GUI |
| `pnpm db:seed` | 시드 데이터 삽입 |
| `pnpm dev:api` | API 서버 시작 (Supabase + DB 자동) |
| `pnpm dev:all` | API + Admin 서버 시작 |
