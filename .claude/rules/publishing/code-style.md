---
paths:
  - "packages/design-system/**/*.{ts,tsx}"
---

# 코드 스타일 — design-system

## TS 위생

- `type` 우선. `any` 금지 → `unknown` + 타입 가드.
- `as` 최소화 — 불가피하면 주석으로 이유 명시. `as any` 절대 금지.
- value + type 혼합 import → inline `type` 수식어: `import { tokens, type TokenKey } from './tokens'`
- 타입만 import: `import type { X } from '...'`
- 미사용 import/변수 즉시 삭제. 미사용 파라미터는 `_` 접두사.
- `let` 지양 — `const` 기본. 재할당 필요 시 ternary·early-return 으로 우회.
- `eslint-disable` 금지 — ESLint 경고는 구조 리팩터로 해결.
- `void` 연산자 금지 — 타입 표기(`Promise<void>`)에만 사용.

## import 순서

```ts
// 1. React
// 2. React Native
// 3. 외부 라이브러리
// 4. @hosspie/* (모노레포 패키지)
// 5. @/* (design-system src 내부 — tsconfig: @/* → ./src/*)
// 6. 상대 경로
```

그룹 사이 빈 줄 1줄. `@/*` 내부는 첫 세그먼트별로 그룹핑.

## Props 명명

- 타입명: `<ComponentName>Props`
- boolean prop prefix: `is` / `has` / `can` / `should`

## 함수 스타일

- 함수 본문 무조건 중괄호: `const fn = () => { ... }`
- hook/util 인자 객체화 — 인자 1개여도 `({ value }: Params)` 형태

## 조건문

- 중첩 삼항 금지 → `resolveX` 함수 + early-return if 체인
- switch 지양 → 값 매핑은 `Record`, 액션 분기는 early-return if 체인
- 조건 변수(`const isX = ...`)는 사용하는 `if` 바로 위 한 줄 선언

## 에러 처리

design-system 컴포넌트는 외부 API 호출이 거의 없으므로 적용 영역 작음. 외부 라이브러리 boundary 에서만 `.catch()` 체이닝 허용. wrap-and-rethrow 금지. 자세한 정책은 `rules/docs/error-handling.md` (Result-as-data + `ErrorCode` enum 패턴).

## JSDoc

export + 다회 재사용 심볼(atoms/organisms/hooks/providers 등)은 한글 JSDoc + `@example` 필수.

```ts
/**
 * 게스트하우스 상태를 나타내는 배지 컴포넌트
 * @example
 * React.createElement(Badge, { status: 'available', label: '예약 가능' })
 */
```

단일 사용 helper, 스토리 내 로컬 코드는 제외.

## TODO 주석

```ts
// TODO(소유자, YYYY-MM-DD): 설명 — 제거 조건 / 이슈 링크
```
