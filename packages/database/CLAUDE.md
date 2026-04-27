# packages/database

Hosspie의 Prisma + Supabase 데이터베이스 패키지. 모든 도메인 모델의 SoT (Single Source of Truth).

## 스키마

위치: `prisma/schema.prisma`

### 데이터 모델

```
User (1:1) → Guesthouse (1:n) → Room
```

### Enum

- `Gender`
- `DinnerPartyType`
- `OnboardingStatus`

## 명령어

| 명령 | 용도 |
|---|---|
| `pnpm db:push` | 스키마를 로컬 DB에 푸시 (개발용 — 마이그레이션 없이) |
| `pnpm db:migrate:dev` | 마이그레이션 생성 + 적용 |
| `pnpm db:generate` | Prisma Client 재생성 |
| `pnpm db:seed` | 시드 데이터 삽입 |
| `pnpm db:studio` | Prisma Studio GUI |

## Supabase 로컬 개발

- 시작: `pnpm supabase:start` (루트에서)
- 설정: `supabase/config.toml` (루트)
- PostgREST 비활성화 — API는 NestJS GraphQL 사용

## 패키지 export

| import 경로 | 내용 |
|---|---|
| `@hosspie/database` | Prisma Client 클래스 + 생성된 enum/모델 타입 |
| `@hosspie/database/client` | 싱글톤 Prisma Client 인스턴스 |

API에서는 `@hosspie/database`로 enum/모델 타입을, `@hosspie/database/client`로 단일 Prisma 인스턴스를 import.

## 스키마 변경 시

```bash
pnpm db:push          # 스키마 DB 반영
pnpm db:generate      # Prisma Client 재생성
```

마이그레이션 이력이 필요하면 `db:push` 대신 `db:migrate:dev`.
