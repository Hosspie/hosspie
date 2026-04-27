# CLAUDE.md 분권화 + 레거시 정리 설계

> 비대해진 루트 `.claude/CLAUDE.md`를 모노레포 도메인별로 분리하고 stale 정보를 동시에 제거한다.

## 배경

### 현재 상태

- 루트 `.claude/CLAUDE.md` 한 파일에 모든 도메인(Admin/API/DB/디자인 시스템)의 아키텍처가 집중되어 있음
- 분량이 공식 가이드 권장(200줄)을 초과
- 레거시 콘텐츠 다수 포함:
  - 버전 정보 stale (Expo SDK 53 / RN 0.79 — 실제 55 / 0.83 / React 19.2)
  - 사라진 스킬 참조 4건 (`backend-developer`, `frontend-developer`, `publisher`) — 5e72150 커밋에서 senior/junior agent로 마이그됐으나 참조가 남음
  - `.claude/rules/`와 중복되는 컨벤션 섹션 (코드 주석·TS·에러 메시지·문서 작성)

### 동기

1. **토큰·컨텍스트 절약** — 도메인별 컨텍스트만 매칭 시점에 자동 로드
2. **관심사 분리** — 패키지가 자기 가이드를 ownership하도록

## Claude Code docs 검증 사실

설계 결정의 근거가 된 공식 docs 내용 (https://code.claude.com/docs/en):

| 항목 | docs 결론 | 출처 |
|---|---|---|
| 하위 CLAUDE.md 자동 로드 | "subdirectories load as you work in them" — 작업 디렉토리 진입 시 추가 로드 (additive) | [features-overview](https://code.claude.com/docs/en/features-overview#understand-how-features-layer) |
| 하위 `.claude/skills/` 자동 발견 | "automatically discovers skills from nested `.claude/skills/` directories" + monorepo 예시 명시 | [skills](https://code.claude.com/docs/en/skills#automatic-discovery-from-nested-directories) |
| 하위 `.claude/agents/` | "not loaded from additional directories" — **루트 고정** | features-overview |
| `.claude/rules/` paths frontmatter | 매칭 시점에만 로드 | memory |
| CLAUDE.md 200줄 권장 | "Keep CLAUDE.md under 200 lines" | features-overview |

핵심 통찰: **agents는 루트 고정 / CLAUDE.md·skills는 분권 가능**.

## 결정 사항

### 분권 범위

- 분권 대상: **CLAUDE.md만** (skills 분권은 차후 트리거 발생 시)
- agents·rules·skills 디렉토리 위치는 그대로 유지
  - rules는 paths frontmatter로 이미 path-scoped (재배치 불필요)
  - skills는 현재 모두 cross-cutting (`code-review`, `update-milestones`)
  - agents는 docs상 분권 불가

### 분권 철학 — "cross-cut만 루트"

루트에는 진짜 cross-cutting (모노레포 개요·앱 시작·에이전트 가이드·워크플로우) 만. 도메인 종속(Admin·API·DB·디자인 시스템)은 sub-CLAUDE.md.

### 검토 후 제외한 대안

| 대안 | 제외 사유 |
|---|---|
| `.claude/rules/` 물리 이동 (apps/admin/.claude/rules/ 등) | paths frontmatter가 이미 path-scoped 로딩 보장 — 물리 이동의 functional 이득 없음. 단순 ownership 표현은 ROI 낮음 |
| `.claude/agents/` 분권 | docs상 nested 위치 자동 로드 안 됨 |
| `packages/services/CLAUDE.md` 즉시 신설 | 파일 1개·86줄 단일 모듈 — sub-CLAUDE.md 필요 임계점 미만. lazy graduation 정책 적용 |
| 루트 CLAUDE.md 백지 재작성 | 일부 섹션(에이전트/스킬 가이드)은 최근 정리되어 그대로 유효 — 부분 cleanup으로 충분 |

## 설계

### 디렉토리 구조

```
hosspie/
├── .claude/
│   ├── CLAUDE.md                     # 슬림 (~80-100줄)
│   ├── agents/                       # 그대로 (루트 고정)
│   ├── rules/                        # 그대로 (paths 매칭 자동 로드)
│   │   └── front/code-style.md       # paths에 packages/services/** 추가
│   └── skills/                       # 그대로 (code-review, update-milestones)
│
├── apps/
│   ├── admin/CLAUDE.md               # 신규
│   └── api/CLAUDE.md                 # 신규
│
└── packages/
    ├── design-system/CLAUDE.md       # 신규
    ├── database/CLAUDE.md            # 신규
    └── services/                     # CLAUDE.md 안 둠 (lazy graduation)
```

### 각 CLAUDE.md 콘텐츠 책임

#### 루트 `.claude/CLAUDE.md` (~80-100줄)

- 프로젝트 개요 (1~2문단)
- **앱 시작하기** — 최소 5~10줄 명령 시퀀스 (`nvm use` → `pnpm install` → 최초 1회 `supabase:start && db:push` → `pnpm dev:all` + 별도 터미널 `codegen:watch`). 상세는 sub-CLAUDE.md로 위임 한 줄
- 모노레포 디렉토리 한 장
- 에이전트 가이드 (senior/junior 위임 사이클)
- 스킬 가이드 (`update-milestones`, `code-review`)
- Turborepo 태스크 의존성 한 줄 요약
- **워크플로우 섹션 (placeholder — 후속 작업으로 채움)**

제거 대상:
- 도메인별 아키텍처 상세 (Admin/API/DB/디자인 시스템)
- 타입 시스템 플로우 — `apps/api/CLAUDE.md`로 이전
- rules와 중복되는 컨벤션 섹션 (코드 주석·TS·에러 메시지·문서 작성 규칙)
- stale 스킬 참조 4건 (`backend-developer`·`frontend-developer`·`publisher`)
- 버전 정보 stale 문구
- 일반 개발 시작·권장 터미널·DB/codegen/build·테스트 분리 명령어 (sub로 이전 또는 한 줄로 압축)

#### `apps/admin/CLAUDE.md` (~80-100줄)

- Expo SDK / RN / React 버전 (정확한 현재값)
- expo-router 라우팅 패턴 (`Stack.Protected`, 멀티 스텝 공유 레이아웃)
- Provider 계층 구조 (`ApolloProvider → SessionProvider → Stack`)
- 스타일링: organism only import 룰 + 디자인 토큰
- **공통 서비스 정책**: 클라이언트 측 공통 로직은 `packages/services`에 두고 `@hosspie/services/...`로 import해서 사용 (현재 폼 유틸 한 종류 — Field 컴포넌트)
- 상태 관리 (Apollo / RHF / Context)
- 경로 별칭 (`@/*` + 모노레포 패키지 직접 import)
- admin 전용 명령어 (`pnpm dev:admin`)

#### `apps/api/CLAUDE.md` (~80-100줄)

- NestJS 11 / GraphQL Code-First
- 모듈 구조 (resolver / service / models / inputs)
- 전역 설정 (validation pipe, CORS, `/api` 접두사, GraphQL Playground)
- **인증 상태**: 현재 인증 플로우 미구현. 임시 사용자 ID(`'temp-user-id'`) 사용 중. 추후 세션 컨텍스트 기반 인증 구현 예정
- DB 연결 흐름 (Supabase 로컬 — Prisma)
- **타입 시스템 플로우 섹션 (루트에서 이전)**: Prisma SoT → `@ObjectType` 데코레이터 → `schema.gql` 자동 생성 → `packages/types` codegen → `apps/admin` import
- api 전용 명령어 (`pnpm dev:api`, `pnpm codegen`)

#### `packages/design-system/CLAUDE.md` (~60-80줄)

- 디렉토리 책임 (`components/` atom · `organisms/` 조합 · `pages/` 스토리 · `tokens/` 토큰)
- 디자인 토큰 위치 + 다크 모드 전용 시맨틱 컬러 정책
- 외부 style 주입 금지 원칙 (구체 룰은 `rules/publishing/atom.md` 참조 한 줄)
- Storybook MobileFrame 데코레이터 위치
- 패키지 export 한 줄 요약

#### `packages/database/CLAUDE.md` (~50-70줄)

- Prisma schema 위치 (`packages/database/prisma/schema.prisma`)
- 데이터 모델 (User → Guesthouse → Room)
- 마이그/시드/스튜디오 명령 (`db:push`, `db:migrate:dev`, `db:seed`, `db:studio`)
- Supabase 로컬 개발 흐름 (`supabase:start`, `supabase/config.toml`)
- 패키지 export 차이 (`@hosspie/database` vs `@hosspie/database/client`)
- PostgREST 비활성화 메모

### 부수 작업

1. `.claude/rules/front/code-style.md` paths 확장:
   ```yaml
   paths:
     - "apps/admin/**/*.{ts,tsx}"
     - "packages/services/**/*.{ts,tsx}"
   ```
2. 루트 CLAUDE.md에서 stale 스킬 참조 4건 제거 (📚 줄)
3. 버전 stale 정보 제거 (sub-CLAUDE.md에 정확한 값으로 재기재)

## 마이그레이션 순서

1. **사전 — 정확한 버전 정보 확인** (`apps/admin/package.json` 등에서 Expo/RN/React 버전 추출)
2. `packages/database/CLAUDE.md` 작성 (의존도 가장 낮음)
3. `packages/design-system/CLAUDE.md` 작성
4. `apps/api/CLAUDE.md` 작성 (타입 시스템 플로우 포함)
5. `apps/admin/CLAUDE.md` 작성
6. 루트 `.claude/CLAUDE.md` 슬림화 (cleanup + 위임 anchor 추가)
7. `.claude/rules/front/code-style.md` paths 확장
8. 검증: 각 sub-CLAUDE.md의 콘텐츠가 루트와 중복되지 않는지, rules와 중복되지 않는지 확인
9. 커밋 (한 번 또는 도메인별로 분할)

## 성공 기준

- 루트 `.claude/CLAUDE.md` 100줄 이하
- 각 sub-CLAUDE.md 100줄 이하
- 루트에 도메인 종속 콘텐츠 0
- stale 스킬 참조 0
- 버전 stale 문구 0
- rules와 중복되는 컨벤션 섹션 0
- `apps/admin/`에서 작업 시 `apps/api/` 컨텍스트가 자동 로드되지 않음 (Claude Code가 nested CLAUDE.md를 디렉토리 단위로 추가 로드한다는 docs 명세상)

## Out of Scope

- `.claude/rules/` 물리 재배치 (paths frontmatter로 이미 해결)
- `.claude/agents/` 재구조화 (docs상 nested 불가 + 현재 senior/junior 구조 유효)
- `packages/services/CLAUDE.md` 신설 (lazy graduation 정책)
- 새 skill 신설 (현재 cross-cutting 두 개로 충분)
- 워크플로우 섹션 본문 작성 (자리만 잡고 후속 작업)
- packages/types, packages/configs 의 sub-CLAUDE.md (생성 산출물·설정 파일 — 가이드 불필요)
