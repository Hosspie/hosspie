# CLAUDE.md 분권화 + 레거시 정리 — 실행 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 비대해진 루트 `.claude/CLAUDE.md`(361줄)를 도메인별 sub-CLAUDE.md 4개로 분리하고 stale 정보·중복 컨벤션을 제거한다.

**Architecture:** Claude Code의 nested CLAUDE.md 자동 발견(작업 디렉토리 진입 시 추가 로드)을 활용해 `apps/admin`, `apps/api`, `packages/design-system`, `packages/database`에 도메인 종속 가이드를 분권한다. 루트는 cross-cut(개요·앱 시작·에이전트/스킬 가이드·워크플로우 placeholder)만 유지. agents·rules·skills 디렉토리는 그대로(rules는 paths frontmatter로 이미 path-scoped, agents는 docs상 nested 불가).

**Tech Stack:** Markdown, YAML frontmatter, git.

**참조 spec:** `docs/superpowers/specs/2026-04-27-claude-md-decentralization-design.md`

---

## File Structure

| 파일 | 작업 | 책임 |
|---|---|---|
| `packages/database/CLAUDE.md` | 신규 | Prisma schema·명령·Supabase·export |
| `packages/design-system/CLAUDE.md` | 신규 | atom/organism/screens/tokens·핵심 규칙·Storybook |
| `apps/api/CLAUDE.md` | 신규 | NestJS 모듈·전역 설정·인증 상태·**타입 시스템 플로우**·명령 |
| `apps/admin/CLAUDE.md` | 신규 | RN 버전·라우팅·Provider·스타일링·**공통 서비스 정책**·상태 관리·명령 |
| `.claude/CLAUDE.md` | 슬림화 | 모노레포 개요·앱 시작·에이전트/스킬 가이드·Turborepo·워크플로우(placeholder) |
| `.claude/rules/front/code-style.md` | paths 확장 | `packages/services/**` 추가 |

각 sub-CLAUDE.md는 독립적으로 작성 가능 — 의존성 없음. 단 루트 슬림화는 sub 4개가 모두 작성된 후 진행 (참조 anchor 안전).

---

## Task 1: packages/database/CLAUDE.md 작성

**Files:**
- Create: `packages/database/CLAUDE.md`

- [ ] **Step 1: 파일 생성**

`packages/database/CLAUDE.md` 작성:

````markdown
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
````

- [ ] **Step 2: 라인 수 검증**

Run: `wc -l packages/database/CLAUDE.md`
Expected: 50~70줄 사이.

- [ ] **Step 3: 커밋**

```bash
git add packages/database/CLAUDE.md
git commit -m "packages/database/CLAUDE.md 신규 — Prisma·Supabase 가이드"
```

---

## Task 2: packages/design-system/CLAUDE.md 작성

**Files:**
- Create: `packages/design-system/CLAUDE.md`

- [ ] **Step 1: 파일 생성**

`packages/design-system/CLAUDE.md` 작성:

````markdown
# packages/design-system

Hosspie의 React Native UI 컴포넌트 + 디자인 토큰 패키지.

## 디렉토리 책임

| 디렉토리 | 책임 |
|---|---|
| `src/components/` | Atom 컴포넌트 (Button, Input, Text, Card) — 단일 UI 단위 |
| `src/organisms/` | Atom 조합 컴포넌트 (FormField, ButtonGroup, TextBlock) |
| `src/screens/` | 페이지 스토리 (Storybook용 스크린 설계도) |
| `src/tokens/` | 디자인 토큰 (colors, spacing, typography, radius, sizing, shadows) |
| `src/hooks/`, `src/providers/` | 디자인 시스템 전용 hook/provider |

## 핵심 규칙

- **외부 style 주입 금지**: atom은 `style` prop을 받지 않는다. 레이아웃 배치는 사용처(organism/screen)의 책임.
- **다크 모드 전용**: 컬러 토큰은 다크 모드 시맨틱 컬러만.
- **스크린 컴포지션**: 앱 스크린은 organisms만 import — atoms 직접 import 금지.

구체 작성 컨벤션(Atom·Organism·story 위치 등)은 `.claude/rules/publishing/`이 path 매칭으로 자동 로드.

## Storybook

- 실행: `pnpm --filter @hosspie/design-system storybook` (루트에서) — `:6006`
- 스토리 위치: `src/screens/<feature>/<ScreenName>.stories.tsx`
- MobileFrame 데코레이터 필수 (iPhone 프레임 시뮬레이션)

## 패키지 export

| import 경로 | 내용 |
|---|---|
| `@hosspie/design-system/components/<name>` | atom (디자인 시스템 내부 + 테스트용) |
| `@hosspie/design-system/organisms/<name>` | organism (앱 스크린에서 import) |
| `@hosspie/design-system/tokens/<name>` | 디자인 토큰 (`colors`, `spacing` 등) |
````

- [ ] **Step 2: 라인 수 검증**

Run: `wc -l packages/design-system/CLAUDE.md`
Expected: 60~80줄 사이.

- [ ] **Step 3: 커밋**

```bash
git add packages/design-system/CLAUDE.md
git commit -m "packages/design-system/CLAUDE.md 신규 — atom/organism/토큰 가이드"
```

---

## Task 3: apps/api/CLAUDE.md 작성

**Files:**
- Create: `apps/api/CLAUDE.md`

- [ ] **Step 1: 파일 생성**

`apps/api/CLAUDE.md` 작성:

````markdown
# apps/api

Hosspie의 NestJS GraphQL API 서버.

## 스택

- **NestJS 11** + GraphQL Code-First (`@nestjs/graphql` + `@nestjs/apollo`)
- **Prisma** ORM (`@hosspie/database`)
- **Apollo Server**

## 모듈 구조

```
src/modules/
├── auth/          # 인증 모듈 (구현 예정 — 현재 빈 디렉토리)
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
````

- [ ] **Step 2: 라인 수 검증**

Run: `wc -l apps/api/CLAUDE.md`
Expected: 70~90줄 사이.

- [ ] **Step 3: 임시 사용자 ID 흔적 일치 검증**

Run: `grep "temp-user-id" apps/api/src/modules/guesthouse/guesthouse.resolver.ts | wc -l`
Expected: 1 이상 (CLAUDE.md 본문이 실제 코드와 일치하는지 확인 — 0이면 코드가 변경되어 본문 수정 필요).

- [ ] **Step 4: 커밋**

```bash
git add apps/api/CLAUDE.md
git commit -m "apps/api/CLAUDE.md 신규 — NestJS·타입 시스템 플로우·인증 상태"
```

---

## Task 4: apps/admin/CLAUDE.md 작성

**Files:**
- Create: `apps/admin/CLAUDE.md`

- [ ] **Step 1: 파일 생성**

`apps/admin/CLAUDE.md` 작성:

````markdown
# apps/admin

Hosspie의 Expo / React Native 모바일 앱 (게스트하우스 관리자용).

## 스택

- **Expo SDK 55** + **React Native 0.83** + **React 19.2**
- **expo-router 55** (파일 기반 라우팅)
- **Apollo Client** (서버 상태)
- **react-hook-form** (복잡한 멀티 스텝 폼)

## 라우팅

expo-router 기반.

- 보호된 라우트는 세션 가드와 함께 `Stack.Protected` 사용
- 멀티 스텝 플로우는 컨텍스트 공유를 위해 공유 레이아웃 사용 (예: `app/onboarding/_layout.tsx`)

## Provider 계층 (`app/_layout.tsx`)

```
ApolloProvider → SessionProvider → Stack
```

## 스타일링

- React Native StyleSheet + 디자인 토큰
- `packages/design-system/src/tokens/` 토큰 기반
- 다크 모드 전용 시맨틱 컬러

**스크린 컴포지션 규칙**: `@hosspie/design-system/organisms/*`만 import. atom 직접 import 금지.

```ts
// ✅
import { ButtonGroup } from '@hosspie/design-system/organisms/button-group';

// ❌
import { Button } from '@hosspie/design-system/components/button';
```

## 공통 서비스 정책

클라이언트 측 공통 로직(폼 유틸 등)은 `packages/services`에 두고 `@hosspie/services/...`로 import해서 사용. 새 utility 추가 시 admin에 직접 두지 말고 services로 추출 — 미래 client 앱에서도 재사용.

현재 services에 있는 것: 폼 유틸 (`<Field>` 컴포넌트, react-hook-form Controller 래퍼).

```ts
// 사용 예
import { Field } from '@hosspie/services/form';

<Field<FormData, 'fieldName'>
  name="fieldName"
  rules={{ required: '에러 메시지' }}
  render={({ field, fieldState }) => <TextInput {...field} />}
/>
```

## 상태 관리

| 종류 | 도구 |
|---|---|
| 서버 상태 | Apollo Client |
| 복잡한 멀티 스텝 폼 | react-hook-form (`FormProvider`로 레이아웃 감싸기) |
| 인증/세션 | React Context (`SessionProvider`) |

## GraphQL Operation 추가

```
1. apps/admin/lib/graphql/operations/{name}.graphql 작성
2. pnpm codegen 또는 codegen:watch
3. 생성된 hook ({name}.generated.ts) import 후 사용
```

## 경로 별칭

- `@/*` → 앱 루트
- 모노레포 패키지는 직접 import (`@hosspie/database`, `@hosspie/types`, `@hosspie/design-system/...`, `@hosspie/services/...`)

## 명령어

- `pnpm dev:admin` (Metro)
- `pnpm test` / `pnpm test:watch`
````

- [ ] **Step 2: 라인 수 검증**

Run: `wc -l apps/admin/CLAUDE.md`
Expected: 80~100줄 사이.

- [ ] **Step 3: 버전 정확성 검증**

Run: `grep -E '"(expo|react|react-native)"' apps/admin/package.json`
Expected: `expo`가 `~55.x`, `react-native`가 `0.83.x`, `react`가 `19.2.x`. CLAUDE.md 본문 버전 numbers와 일치하는지 확인 — 다르면 본문 수정.

- [ ] **Step 4: 커밋**

```bash
git add apps/admin/CLAUDE.md
git commit -m "apps/admin/CLAUDE.md 신규 — Expo/RN·공통 서비스 정책·상태 관리"
```

---

## Task 5: 루트 .claude/CLAUDE.md 슬림화

**Files:**
- Modify: `.claude/CLAUDE.md` (현재 361줄 → 약 90줄로 재작성)

- [ ] **Step 1: 기존 파일 백업 보관 안 함 (git이 이력 보존)**

확인만: `git log --oneline -1 .claude/CLAUDE.md`로 최근 변경 이력 확인.

- [ ] **Step 2: 파일 전면 재작성**

`.claude/CLAUDE.md` 내용을 다음으로 **전체 교체**:

````markdown
# CLAUDE.md

이 파일은 Claude Code가 hosspie 모노레포에서 작업할 때 참고하는 루트 가이드입니다.

## 프로젝트 개요

Hosspie는 게스트하우스 관리 시스템을 위한 pnpm 워크스페이스 모노레포입니다.

- **Admin**: Expo / React Native 관리자 앱 (`apps/admin`)
- **API**: NestJS GraphQL API (`apps/api`)
- **DB**: Prisma + Supabase (`packages/database`)
- **디자인 시스템**: RN 컴포넌트 + 토큰 (`packages/design-system`)
- **공통 서비스**: 클라이언트 공통 로직 (`packages/services`)

각 패키지의 상세는 해당 디렉토리의 `CLAUDE.md` 참조.

## 앱 시작하기

도메인별 tmux 패널 분리 실행 권장.

**최초 1회**:

```bash
nvm use && pnpm install
pnpm supabase:start && pnpm db:push
```

**상시 실행 (각각 별도 패널)**:

| 패널 | 명령 | 비고 |
|---|---|---|
| 앱 | `pnpm dev:admin` | Expo Metro |
| 백엔드 | `pnpm dev:api` | NestJS — Supabase·Prisma generate 자동 트리거 |
| 코드젠 | `pnpm codegen:watch` | GraphQL 타입 자동 재생성 |
| DB | `pnpm db:studio` | Prisma Studio (선택) |

**디자인 작업 시**: `pnpm --filter @hosspie/design-system storybook`

도메인별 명령어·옵션은 각 sub-CLAUDE.md 참조.

## 모노레포 구조

```
apps/
├── admin/          # Expo/RN — apps/admin/CLAUDE.md
└── api/            # NestJS GraphQL — apps/api/CLAUDE.md

packages/
├── database/       # Prisma + Supabase — packages/database/CLAUDE.md
├── design-system/  # RN UI + 토큰 — packages/design-system/CLAUDE.md
├── types/          # GraphQL codegen 산출물
├── services/       # 클라이언트 공통 로직 (현재 폼 유틸)
└── configs/        # ESLint, TypeScript 공유 설정
```

## 에이전트 가이드

도메인별 작업은 **senior(opus) → junior(sonnet) 2-tier**로 운영. senior는 계획·리뷰만, junior는 구현만 담당. 메인 대화가 dispatch.

| 도메인 | Senior | Junior | 담당 영역 |
|---|---|---|---|
| Frontend | `frontend-senior` | `frontend-junior` | apps/admin |
| Backend | `backend-senior` | `backend-junior` | apps/api + DB |
| Design System | `publisher-senior` | `publisher-junior` | packages/design-system |

### 위임 사이클 (필수)

1. **계획**: 메인 → `{도메인}-senior` → 상세 구현 계획
2. **구현**: 메인 → `{도메인}-junior`에 senior 계획 + 작업 지시 → 구현 결과
3. **리뷰**: 메인 → `{도메인}-senior`에 구현 결과 첨부 → 리뷰·피드백
4. **반복**: 리뷰 결과 수정 필요 시 2번부터

이 사이클 건너뛰기 금지. 사이클은 작업 크기 무관.

## 스킬 가이드

| 스킬 | 담당 영역 |
|---|---|
| `update-milestones` | 마일스톤 생성·업데이트, 비전·로드맵 정합성 점검 |
| `code-review` | 로컬 diff 코드 리뷰 (영역별 가이드 라우팅) |

## Turborepo

`turbo.json`이 자동으로 의존 태스크 처리 (`db:generate` → `dev:api`, `^build` → `build`). 단, 초기 `db:push`는 수동 실행 필요.

## 워크플로우

(후속 작업으로 정리 예정)
````

- [ ] **Step 3: 라인 수 검증**

Run: `wc -l .claude/CLAUDE.md`
Expected: 80~100줄 사이 (200줄 가이드 만족).

- [ ] **Step 4: 레거시 흔적 제거 검증**

Run:
```bash
grep -E "backend-developer|frontend-developer|publisher 스킬" .claude/CLAUDE.md
```
Expected: **출력 없음** (stale 스킬 참조 4건 모두 제거됨).

Run:
```bash
grep -E "Expo SDK 53|React Native 0.79" .claude/CLAUDE.md
```
Expected: **출력 없음** (stale 버전 문구 제거됨).

Run:
```bash
grep -cE "^## (코드 주석|TypeScript|에러 메시지|문서 작성 규칙|중요한 컨벤션)" .claude/CLAUDE.md
```
Expected: `0` (rules와 중복되는 컨벤션 섹션 모두 제거).

- [ ] **Step 5: 커밋**

```bash
git add .claude/CLAUDE.md
git commit -m "루트 .claude/CLAUDE.md 슬림화 — 도메인 분권 + 레거시 정리

361줄 → ~90줄. 도메인 종속 콘텐츠는 sub-CLAUDE.md로 이전, stale 스킬 참조·버전 문구·rules 중복 컨벤션 제거. 워크플로우 섹션은 후속 작업 placeholder."
```

---

## Task 6: rules/front/code-style.md paths 확장

**Files:**
- Modify: `.claude/rules/front/code-style.md` (paths frontmatter)

- [ ] **Step 1: 현재 frontmatter 확인**

Run: `head -5 .claude/rules/front/code-style.md`
Expected:
```
---
paths:
  - "apps/admin/**/*.{ts,tsx}"
---
```

- [ ] **Step 2: paths에 services 추가**

`.claude/rules/front/code-style.md`의 frontmatter를 다음으로 변경:

```yaml
---
paths:
  - "apps/admin/**/*.{ts,tsx}"
  - "packages/services/**/*.{ts,tsx}"
---
```

(다른 본문은 건드리지 않음.)

- [ ] **Step 3: 변경 검증**

Run: `head -6 .claude/rules/front/code-style.md`
Expected: paths 두 항목 모두 표시.

- [ ] **Step 4: 커밋**

```bash
git add .claude/rules/front/code-style.md
git commit -m "rules/front/code-style.md paths에 packages/services 추가

services는 admin과 같은 클라이언트 측 코드라 동일한 코드 스타일 적용."
```

---

## Task 7: 통합 검증

**Files:** (검증만 — 변경 없음)

- [ ] **Step 1: 모든 sub-CLAUDE.md 존재 확인**

Run:
```bash
ls apps/admin/CLAUDE.md apps/api/CLAUDE.md packages/design-system/CLAUDE.md packages/database/CLAUDE.md
```
Expected: 4개 파일 모두 출력 (no such file 에러 없음).

- [ ] **Step 2: 라인 수 일괄 확인**

Run:
```bash
wc -l .claude/CLAUDE.md apps/admin/CLAUDE.md apps/api/CLAUDE.md packages/design-system/CLAUDE.md packages/database/CLAUDE.md
```
Expected:
- 루트 100줄 이하
- apps/admin 100줄 이하
- apps/api 90줄 이하
- packages/design-system 80줄 이하
- packages/database 70줄 이하

- [ ] **Step 3: services CLAUDE.md 미존재 확인 (lazy graduation)**

Run: `ls packages/services/CLAUDE.md 2>&1`
Expected: `No such file or directory` 에러 (의도적으로 두지 않음).

- [ ] **Step 4: 도메인 콘텐츠 누수 검증 (루트 → 적정 위치 이동)**

루트에 도메인 종속 키워드가 남아있지 않은지:
```bash
grep -E "expo-router|@nestjs|Prisma 스키마|Atom 컴포넌트|FormProvider|temp-user-id" .claude/CLAUDE.md
```
Expected: **출력 없음** (모두 sub-CLAUDE.md로 이동).

타입 시스템 플로우는 apps/api에만:
```bash
grep -l "Prisma Schema.*SoT\|@ObjectType.*schema.gql" .claude/CLAUDE.md apps/api/CLAUDE.md
```
Expected: `apps/api/CLAUDE.md`만 출력.

- [ ] **Step 5: rules paths 매칭 sanity check**

Run:
```bash
grep -A3 "^paths:" .claude/rules/front/code-style.md
```
Expected: `apps/admin/**` + `packages/services/**` 두 항목 출력.

- [ ] **Step 6: git 상태 깨끗한지 확인**

Run: `git status`
Expected: working tree clean (모든 변경 커밋됨).

- [ ] **Step 7: 최종 커밋 로그 확인**

Run: `git log --oneline -7`
Expected: 6개 task 커밋 (database → design-system → api → admin → 루트 슬림화 → rules paths) 모두 보임.

---

## Self-Review (계획 작성자 — 이미 완료)

- **Spec coverage**: 모든 spec 요구사항이 task에 매핑됨 (5개 신규/수정 + paths 확장 + 검증).
- **Placeholder**: 없음. 모든 markdown 콘텐츠가 완전한 형태로 plan 안에 포함됨.
- **타입 일관성**: 파일명·import 경로·명령어 모두 spec 및 실제 코드와 일치 검증 완료.
- **YAGNI**: services CLAUDE.md는 lazy graduation으로 제외, types/configs CLAUDE.md도 out-of-scope.
