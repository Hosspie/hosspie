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
├── utils/          # 공유 enum/타입 유틸리티
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
