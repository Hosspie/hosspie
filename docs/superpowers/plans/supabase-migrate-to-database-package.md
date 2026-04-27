# Supabase 설정 디렉토리를 packages/database로 이주

> 다음 세션에서 단독으로 실행할 작업. 한 번에 끝내고 커밋.

## 배경

현재 Supabase CLI 로컬 설정(`supabase/config.toml` 외)이 monorepo 루트에 있음. 2026-04-27 의 CLAUDE.md 분권화 작업으로 DB 인프라 ownership 을 `packages/database` 에 모았는데, supabase 디렉토리만 root 에 남아 있어 정합성이 깨짐.

이주하면:

- DB 관련 설정·스크립트가 모두 `packages/database` 에 집중
- root `package.json` 은 forward 스크립트만
- `packages/database/CLAUDE.md` 의 "(루트)" 표기 제거 가능

## 현재 상태

- 위치: `/Users/kmjnnhyk/DEV/hosspie/supabase/`
- 추적 파일:
  - `supabase/config.toml` — 80줄 로컬 Postgres / Studio 설정 (PostgREST 비활성화 등 정책 인코딩됨)
  - `supabase/.branches/_current_branch`
  - `supabase/.temp/cli-latest`
- 사용처:
  - `package.json` 루트 스크립트: `supabase:start`, `supabase:stop`
  - `pnpm dev:api` 가 turbo 의존성으로 `supabase:start` 자동 트리거
  - `packages/database/CLAUDE.md` 가 `supabase/config.toml (루트)` 로 참조

## 목표 상태

- 새 위치: `packages/database/supabase/`
- `packages/database/package.json` 에 자체 supabase 스크립트
- root 스크립트는 `pnpm --filter @hosspie/database` 로 forward
- `packages/database/CLAUDE.md` 갱신 — "(루트)" 표기 제거, 새 경로 반영
- `pnpm dev:api` 워크플로우 그대로 동작 (Supabase 자동 시작 유지)

## 실행 순서

### 1. 사전 — Supabase 중지

```bash
cd /Users/kmjnnhyk/DEV/hosspie
pnpm supabase:stop
```

이주 중 데몬이 떠 있으면 충돌 가능. 멈춘 뒤 진행.

### 2. 디렉토리 이동 (git history 보존)

```bash
git mv supabase packages/database/supabase
git status   # rename 으로 인식되는지 확인
```

`.branches/`, `.temp/` 같은 hidden 디렉토리도 따라가야 함. 누락 시 `git mv` 추가 호출.

### 3. `packages/database/package.json` 스크립트 추가

현재 파일 확인 후 `scripts` 섹션에 추가:

```json
"scripts": {
  ...,
  "supabase:start": "supabase start",
  "supabase:stop": "supabase stop"
}
```

### 4. root `package.json` 스크립트 forward 로 교체

```json
"supabase:start": "pnpm --filter @hosspie/database supabase:start",
"supabase:stop": "pnpm --filter @hosspie/database supabase:stop"
```

(기존 `"supabase start"` / `"supabase stop"` 직접 호출을 forward 로 변경)

### 5. `turbo.json` 점검

`apps/api#dev` 가 의존하는 supabase 태스크가 있는지 확인. 만약 root 스크립트 이름 기반 의존이면 forward 만으로 동작하니 OK. 별도 task 정의가 있으면 새 위치 반영.

```bash
grep -n "supabase" /Users/kmjnnhyk/DEV/hosspie/turbo.json
```

### 6. `packages/database/CLAUDE.md` 갱신

현재:

```markdown
## Supabase 로컬 개발

- 시작: `pnpm supabase:start` (루트에서)
- 설정: `supabase/config.toml` (루트)
- PostgREST 비활성화 — API는 NestJS GraphQL 사용
```

새 내용:

```markdown
## Supabase 로컬 개발

- 시작: `pnpm supabase:start` (루트 또는 이 패키지에서)
- 설정: `supabase/config.toml` (이 패키지 내부)
- PostgREST 비활성화 — API는 NestJS GraphQL 사용
```

### 7. 동작 검증

```bash
cd /Users/kmjnnhyk/DEV/hosspie

# 루트에서 forward 동작 확인
pnpm supabase:start

# 컨테이너 살아 있는지
docker ps | grep supabase

# Postgres 연결 (54322 — config.toml 의 db.port)
psql postgresql://postgres:postgres@localhost:54322/postgres -c '\dt'

# API 통합 동작 — Prisma 가 새 위치 supabase 의 DB 에 연결되는지
pnpm dev:api
# 다른 터미널에서: curl http://localhost:3000/api/graphql
```

기대:

- `pnpm supabase:start` 가 forward 되어 정상 기동
- Postgres 포트 54322 연결 OK
- `pnpm dev:api` 가 schema.gql 생성, GraphQL Playground 응답
- 에러 없음

문제 발생 시 자주 보는 원인:

- Supabase CLI 가 cwd 기준으로 `supabase/` 를 찾으므로, root 에서 실행 시 forward 가 `pnpm --filter` 로 cwd 를 packages/database 로 옮겨야 함. `pnpm --filter` 동작 확인.
- `.branches/` / `.temp/` 누락 — `git mv` 시 hidden 까지 옮겨졌는지 재확인.
- `turbo.json` 캐시 — `pnpm turbo run dev:api --force` 로 강제 재실행.

### 8. 커밋

```bash
git add -A
git commit -m "supabase 설정을 packages/database로 이주

DB 인프라 ownership 일치 — root 에 남아있던 supabase/ 를 packages/database/supabase/ 로 이동. root package.json 은 forward 스크립트만, packages/database/package.json 이 supabase CLI 직접 호출. CLAUDE.md 도 (루트) 표기 제거."
```

## 성공 기준

- `git ls-files | grep supabase/` 출력 모두 `packages/database/supabase/` 접두사
- `pnpm supabase:start` 정상 기동 (루트에서)
- `pnpm dev:api` 정상 (Supabase 자동 트리거 + GraphQL 응답)
- `packages/database/CLAUDE.md` 본문에 "루트" 표기 0건
- root `package.json` 의 `supabase:*` 스크립트가 `pnpm --filter @hosspie/database ...` 형태

## Out of Scope

- Supabase CLI 버전 업그레이드
- DB 스키마 변경
- migrations 디렉토리 생성 (현재 사용 안 함)
- 다른 개발자 환경 마이그레이션 가이드 (1 인 개발자라 불필요)

## 롤백

문제 발생 시:

```bash
git revert <commit-sha>
pnpm install
pnpm supabase:start   # 원래 root 위치에서 재기동
```
